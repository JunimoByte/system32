(function () {
  "use strict";

  var toggleBtn = document.getElementById("sidebar-toggle");
  var sidebar = document.getElementById("sidebar");

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      var isOpen = sidebar.classList.contains("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      toggleBtn.textContent = isOpen ? "\u25B2 Menu" : "\u25BC Menu";
    });
  }

  document.querySelectorAll(".task-pane-header").forEach(function (hdr) {
    hdr.addEventListener("click", function () {
      var pane = hdr.closest(".task-pane");
      if (!pane) return;
      pane.classList.toggle("collapsed");
      hdr.setAttribute("aria-expanded", String(!pane.classList.contains("collapsed")));
    });
  });

  var clock = document.getElementById("tray-clock");
  function updateClock() {
    if (!clock) return;
    var now = new Date();
    clock.textContent = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
  }
  updateClock();
  setInterval(updateClock, 30000);

  var current = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".pane-nav-link[href]").forEach(function (link) {
    if (link.getAttribute("href").split("/").pop() === current) {
      link.classList.add("current");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll(".taskbar-tab[data-page]").forEach(function (tab) {
    if (tab.dataset.page === current) {
      tab.classList.add("active");
      tab.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll(".menu-item[href]").forEach(function (item) {
    if (item.getAttribute("href").split("/").pop() === current) {
      item.classList.add("active");
    }
  });

})();
