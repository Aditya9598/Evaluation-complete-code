use std::collections::HashMap;
use std::sync::Mutex;

use serde::{Deserialize, Serialize};

pub const CONTRACT_VERSION: &str = "1.0";

static NORMALIZE_CACHE: Mutex<Option<HashMap<String, String>>> = Mutex::new(None);

fn normalize_cache() -> std::sync::MutexGuard<'static, Option<HashMap<String, String>>> {
    let mut guard = NORMALIZE_CACHE.lock().unwrap();
    if guard.is_none() {
        *guard = Some(HashMap::with_capacity(4096));
    }
    guard
}

#[derive(Debug, Deserialize, PartialEq)]
pub struct ArticleInput {
    pub contract_version: String,
    pub job_id: String,
    pub title: String,
    pub body: String,
    pub source: String,
}

#[derive(Debug, Serialize, PartialEq)]
pub struct ScoreOutput {
    pub contract_version: String,
    pub job_id: String,
    pub relevance_score: u32,
    pub risk_score: u32,
    pub reasons: Vec<String>,
}

static MARKET_KEYWORDS: &[&str] = &[
    "nifty", "sensex", "market", "stock", "rally", "ipo", "fii", "dii", "crude",
];
static RISK_KEYWORDS: &[&str] = &[
    "fraud", "scam", "default", "bankruptcy", "hack", "breach", "war",
];

pub fn normalize_text(text: &str) -> String {
    let mut guard = normalize_cache();
    let cache = guard.as_mut().unwrap();
    if let Some(hit) = cache.get(text) {
        return hit.clone();
    }
    let lowered = text.to_lowercase();
    let mut cleaned = String::with_capacity(lowered.len());
    for ch in lowered.chars() {
        if ch.is_ascii_alphanumeric() || ch.is_ascii_whitespace() {
            cleaned.push(ch);
        } else {
            cleaned.push(' ');
        }
    }
    let normalized = cleaned.split_whitespace().collect::<Vec<_>>().join(" ");
    cache.insert(text.to_string(), normalized.clone());
    normalized
}

fn tokenize(text: &str) -> Vec<String> {
    normalize_text(text).split_whitespace().map(String::from).collect()
}

pub fn score_from_json(json: &str) -> Result<ScoreOutput, String> {
    let input: ArticleInput = serde_json::from_str(json).map_err(|e| e.to_string())?;
    score_article(&input)
}

pub fn score_article(input: &ArticleInput) -> Result<ScoreOutput, String> {
    if input.contract_version != CONTRACT_VERSION {
        return Err(format!(
            "unsupported contract_version: {}",
            input.contract_version
        ));
    }

    let combined = format!("{} {}", input.title, input.body);
    let tokens: Vec<String> = tokenize(&combined);

    let market_hits: Vec<String> = MARKET_KEYWORDS
        .iter()
        .filter(|kw| tokens.iter().any(|t| t == *kw))
        .map(|s| s.to_string())
        .collect();
    let risk_hits: Vec<String> = RISK_KEYWORDS
        .iter()
        .filter(|kw| tokens.iter().any(|t| t == *kw))
        .map(|s| s.to_string())
        .collect();

    let mut relevance = market_hits.len() as u32 * 15;
    if tokens.len() > 30 {
        relevance += 20;
    }
    if relevance > 100 {
        relevance = 100;
    }

    let mut risk = risk_hits.len() as u32 * 25;
    if risk > 100 {
        risk = 100;
    }

    let mut reasons: Vec<String> = Vec::new();
    if !market_hits.is_empty() {
        reasons.push("market_keywords".into());
    }
    if tokens.len() > 30 {
        reasons.push("substantial_content".into());
    }
    if !risk_hits.is_empty() {
        reasons.push("risk_keywords".into());
    }

    Ok(ScoreOutput {
        contract_version: CONTRACT_VERSION.to_string(),
        job_id: input.job_id.clone(),
        relevance_score: relevance,
        risk_score: risk,
        reasons,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    fn sample(title: &str, body: &str) -> ArticleInput {
        ArticleInput {
            contract_version: "1.0".to_string(),
            job_id: "job-1".to_string(),
            title: title.to_string(),
            body: body.to_string(),
            source: "economic_times".to_string(),
        }
    }

    #[test]
    fn scores_market_article() {
        let result = score_article(&sample(
            "Nifty rally today",
            "Stock market gained on strong FII buying sensex",
        ))
        .unwrap();
        assert!(result.relevance_score >= 30);
        assert!(result.reasons.contains(&"market_keywords".to_string()));
    }

    #[test]
    fn scores_low_relevance_short() {
        let result = score_article(&sample("Hello", "short")).unwrap();
        assert_eq!(result.relevance_score, 0);
    }

    #[test]
    fn rejects_wrong_contract() {
        let mut job = sample("Nifty", "market");
        job.contract_version = "2.0".to_string();
        assert!(score_article(&job).is_err());
    }

    #[test]
    fn normalize_cache_speedup() {
        let text = "Nifty 50 Rally!!! Market stock";
        normalize_text(text);
        let start = std::time::Instant::now();
        for _ in 0..10000 {
            normalize_text(text);
        }
        let cached = start.elapsed();
        let start = std::time::Instant::now();
        for i in 0..10000 {
            normalize_text(&format!("unique text number {i}"));
        }
        let uncached = start.elapsed();
        assert!(cached < uncached);
    }
}
