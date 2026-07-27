// Farhan Fathurrahman, portfolio
// Plain JavaScript, no dependencies, no build step

(function () {
  "use strict";

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hero word mask reveal, runs once on load
  window.requestAnimationFrame(function () {
    window.setTimeout(function () {
      document.body.classList.add("is-ready");
    }, 80);
  });

  // Scroll reveal for sections, cards and hero sub elements
  var revealTargets = document.querySelectorAll(
    ".reveal, .hero__meta, .hero__id-card, .cta"
  );

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback, no IntersectionObserver support
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");
  var navEl = navToggle ? navToggle.closest(".nav") : null;

  if (navToggle && navLinks && navEl) {
    navToggle.addEventListener("click", function () {
      var isOpen = navEl.classList.toggle("nav--open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navEl.classList.remove("nav--open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
})();
