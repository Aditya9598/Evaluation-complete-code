(function () {
  const tabs = Array.from(document.querySelectorAll(".docs-tab"));
  const panels = Array.from(document.querySelectorAll(".docs-panel"));
  const loadingEl = document.getElementById("docs-loading");
  const errorEl = document.getElementById("docs-error");
  const loaded = new Set();

  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  async function loadPanel(panel) {
    const src = panel.dataset.src;
    if (!src || loaded.has(src)) return;

    loadingEl.classList.remove("hidden");
    errorEl.classList.add("hidden");

    try {
      const res = await fetch(src, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${src} (${res.status})`);
      const md = await res.text();
      panel.innerHTML = marked.parse(md);
      loaded.add(src);
    } catch (err) {
      errorEl.textContent = err instanceof Error ? err.message : "Failed to load documentation.";
      errorEl.classList.remove("hidden");
    } finally {
      loadingEl.classList.add("hidden");
    }
  }

  async function setDocsTab(id) {
    tabs.forEach((tab) => {
      const active = tab.dataset.docsTab === id;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    let activePanel = null;
    panels.forEach((panel) => {
      const active = panel.id === `docs-panel-${id}`;
      panel.classList.toggle("hidden", !active);
      if (active) activePanel = panel;
    });

    history.replaceState(null, "", `#${id}`);

    if (activePanel) await loadPanel(activePanel);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setDocsTab(tab.dataset.docsTab));
  });

  const validTabs = ["eval-framework", "detailed-guide", "projects-overview"];
  const hash = window.location.hash.replace("#", "");
  const initial = validTabs.includes(hash) ? hash : "eval-framework";
  setDocsTab(initial);

  window.addEventListener("hashchange", () => {
    const next = window.location.hash.replace("#", "");
    if (validTabs.includes(next)) setDocsTab(next);
  });
})();
