(function () {
  const params = new URLSearchParams(window.location.search);
  const meta = window.EVAL_HUB_META;
  const PROJECT_ORDER = ["ledger", "converter", "fraud", "scraper"];

  async function probeUrl(url) {
    try {
      const res = await fetch(url, { mode: "no-cors", cache: "no-store" });
      return res.type === "opaque" || res.ok;
    } catch {
      return false;
    }
  }

  async function detectMode() {
    const forced = params.get("mode");
    if (forced === "docker" || forced === "local" || forced === "railway") return forced;

    const host = window.location.hostname;
    if (host !== "127.0.0.1" && host !== "localhost") return "railway";

    if (await probeUrl("http://127.0.0.1:5173/")) return "local";
    if (await probeUrl("http://127.0.0.1:8000/")) return "docker";
    return "local";
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function chipList(items, className) {
    return items
      .map((item) => `<span class="chip ${className || ""}">${escapeHtml(item)}</span>`)
      .join("");
  }

  detectMode().then((mode) => {
    const config = window.EVAL_HUB_CONFIG[mode];
    boot(config);
  });

  function boot(config) {
    const overviewPanel = document.getElementById("panel-overview");
    const projectPanel = document.getElementById("panel-project");
    const overviewGrid = document.getElementById("overview-grid");
    const frame = document.getElementById("project-frame");
    const frameLoading = document.getElementById("frame-loading");
    const linksEl = document.getElementById("project-links");
    const healthEl = document.getElementById("health-list");
    const modeBadge = document.getElementById("mode-badge");
    const tabs = Array.from(document.querySelectorAll(".tab"));

    let activeTab = "overview";
    modeBadge.textContent = config.mode;

    function getProject(id) {
      return { ...meta[id], ...config.projects[id] };
    }

    function renderOverviewCard(id) {
      const project = getProject(id);
      return `
        <article class="project-card" data-open="${id}">
          <header class="project-card-head">
            <span class="project-card-icon" aria-hidden="true">${project.icon}</span>
            <div>
              <h3>${escapeHtml(project.label)}</h3>
              <span class="tier tier-${project.tierClass}">${escapeHtml(project.tier)}</span>
            </div>
          </header>
          <p class="project-card-summary">${escapeHtml(project.summary)}</p>
          <ul class="project-card-highlights">
            ${project.highlights.map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
          </ul>
          <div class="project-card-meta">
            <div class="chip-row">${chipList(project.stack)}</div>
            <div class="chip-row eval-row">${chipList(project.evalTasks, "chip-eval")}</div>
          </div>
          <footer class="project-card-foot">
            <code class="folder">${escapeHtml(project.folder)}</code>
            <button type="button" class="btn btn-primary btn-open" data-open="${id}">
              Open preview
            </button>
          </footer>
        </article>
      `;
    }

    function updateHash(tabId) {
      const next = tabId === "overview" ? "" : `#${tabId}`;
      if (window.location.hash !== next) {
        history.replaceState(null, "", next || window.location.pathname + window.location.search);
      }
    }

    function setTab(tabId) {
      activeTab = tabId;
      tabs.forEach((tab) => {
        const selected = tab.dataset.tab === tabId;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
      });

      const isOverview = tabId === "overview";
      overviewPanel.classList.toggle("hidden", !isOverview);
      projectPanel.classList.toggle("hidden", isOverview);
      updateHash(tabId);

      if (isOverview) {
        frame.src = "about:blank";
        return;
      }

      const project = getProject(tabId);
      linksEl.innerHTML = project.links
        .map(
          (link) =>
            `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
        )
        .join("");

      frameLoading.classList.remove("hidden");
      frame.removeAttribute("src");
      frame.src = project.iframe;
      refreshHealth();
    }

    async function probe(check, strict) {
      try {
        if (strict) {
          const res = await fetch(check.url, { cache: "no-store" });
          return res.ok;
        }
        const res = await fetch(check.url, { mode: "no-cors", cache: "no-store" });
        return res.type === "opaque" || res.ok;
      } catch {
        return false;
      }
    }

    async function refreshHealth() {
      if (activeTab === "overview") return;

      const project = getProject(activeTab);
      const strictProbe = config.mode === "railway";
      healthEl.innerHTML = project.checks
        .map(
          (check) =>
            `<li data-check="${escapeHtml(check.label)}"><span class="dot"></span>${escapeHtml(check.label)}: …</li>`
        )
        .join("");

      await Promise.all(
        project.checks.map(async (check) => {
          const ok = await probe(check, strictProbe);
          const item = healthEl.querySelector(`[data-check="${check.label}"]`);
          if (!item) return;
          const dot = item.querySelector(".dot");
          dot.classList.add(ok ? "ok" : "bad");
          item.lastChild.textContent = `${check.label}: ${ok ? "up" : "down"}`;
        })
      );
    }

    overviewGrid.innerHTML = PROJECT_ORDER.map(renderOverviewCard).join("");

    overviewGrid.addEventListener("click", (event) => {
      const target = event.target.closest("[data-open]");
      if (!target) return;
      setTab(target.dataset.open);
    });

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setTab(tab.dataset.tab));
    });

    document.getElementById("refresh-health").addEventListener("click", refreshHealth);

    frame.addEventListener("load", () => {
      frameLoading.classList.add("hidden");
    });

    const hashTab = window.location.hash.replace("#", "");
    const initialTab =
      hashTab && (hashTab === "overview" || config.projects[hashTab]) ? hashTab : "overview";
    setTab(initialTab);

    window.addEventListener("hashchange", () => {
      const next = window.location.hash.replace("#", "") || "overview";
      if (next !== activeTab && (next === "overview" || config.projects[next])) {
        setTab(next);
      }
    });
  }
})();
