(function () {
  const tabs = Array.from(document.querySelectorAll(".docs-tab"));
  const panels = Array.from(document.querySelectorAll(".docs-panel"));

  function setDocsTab(id) {
    tabs.forEach((tab) => {
      const active = tab.dataset.docsTab === id;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach((panel) => {
      panel.classList.toggle("hidden", panel.id !== `docs-panel-${id}`);
    });
    history.replaceState(null, "", `#${id}`);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setDocsTab(tab.dataset.docsTab));
  });

  const hash = window.location.hash.replace("#", "");
  const initial = ["overview", "eval-tiers", "advanced"].includes(hash) ? hash : "overview";
  setDocsTab(initial);

  window.addEventListener("hashchange", () => {
    const next = window.location.hash.replace("#", "");
    if (["overview", "eval-tiers", "advanced"].includes(next)) {
      setDocsTab(next);
    }
  });
})();
