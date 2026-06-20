(function () {
  const params = new URLSearchParams(window.location.search);

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

  detectMode().then((mode) => {
    const config = window.EVAL_HUB_CONFIG[mode];
    boot(config);
  });

  function boot(config) {
    const frame = document.getElementById("project-frame");
    const linksEl = document.getElementById("project-links");
    const healthEl = document.getElementById("health-list");
    const modeBadge = document.getElementById("mode-badge");
    const tabs = Array.from(document.querySelectorAll(".tab"));

    let activeTab = "ledger";
    modeBadge.textContent = config.mode;

    function setTab(tabId) {
      activeTab = tabId;
      const project = config.projects[tabId];
      tabs.forEach((tab) => {
        const selected = tab.dataset.tab === tabId;
        tab.classList.toggle("active", selected);
        tab.setAttribute("aria-selected", selected ? "true" : "false");
      });
      frame.removeAttribute("src");
      frame.src = project.iframe;
      linksEl.innerHTML = project.links
        .map(
          (link) =>
            `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
        )
        .join("");
      refreshHealth();
    }

    async function probe(check) {
      try {
        const res = await fetch(check.url, { mode: "no-cors", cache: "no-store" });
        return res.type === "opaque" || res.ok;
      } catch {
        return false;
      }
    }

    async function refreshHealth() {
      const project = config.projects[activeTab];
      healthEl.innerHTML = project.checks
        .map(
          (check) =>
            `<li data-check="${check.label}"><span class="dot"></span>${check.label}: …</li>`
        )
        .join("");

      await Promise.all(
        project.checks.map(async (check) => {
          const ok = await probe(check);
          const item = healthEl.querySelector(`[data-check="${check.label}"]`);
          if (!item) return;
          const dot = item.querySelector(".dot");
          dot.classList.add(ok ? "ok" : "bad");
          item.lastChild.textContent = `${check.label}: ${ok ? "up" : "down"}`;
        })
      );
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => setTab(tab.dataset.tab));
    });

    document.getElementById("refresh-health").addEventListener("click", refreshHealth);
    setTab("ledger");
  }
})();
