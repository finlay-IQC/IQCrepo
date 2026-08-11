/* =========================================================================
   The IQ Collective — Funnel JS
   Responsibilities:
     1. Capture UTM / click IDs on landing and persist to sessionStorage.
     2. Append persisted params to internal funnel links.
     3. Feed UTM values into the Typeform embed via data-tf-hidden (+ init embed).
     4. Sticky bottom CTA reveal after hero (index only).
     5. FAQ accordion.
     6. Smooth-scroll helpers to the form section.
   Lightweight, no dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var TRACKED = [
    "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
    "fbclid", "gclid", "ttclid", "msclkid"
  ];
  var STORE_KEY = "iqc_utms";

  /* ---------- storage helpers (fail-safe if storage is blocked) ---------- */
  function readStore() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function writeStore(obj) {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(obj)); }
    catch (e) { /* ignore */ }
  }

  /* ---------- 1. capture from current URL, merge with what we have ---------- */
  function captureParams() {
    var stored = readStore();
    var params = new URLSearchParams(window.location.search);
    var changed = false;
    TRACKED.forEach(function (key) {
      var val = params.get(key);
      if (val && !stored[key]) { stored[key] = val; changed = true; }
    });
    if (changed) writeStore(stored);
    return stored;
  }

  /* ---------- 2. append stored params to internal links ---------- */
  function decorateLinks(params) {
    var keys = Object.keys(params);
    if (!keys.length) return;
    var qs = keys
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); })
      .join("&");

    var links = document.querySelectorAll('a[data-carry-utm]');
    links.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!href || href.charAt(0) === "#") return;
      a.setAttribute("href", href + (href.indexOf("?") === -1 ? "?" : "&") + qs);
    });
  }

  /* ---------- 3. Typeform embed with hidden UTM fields ---------- */
  /* NOTE: For these values to be stored on the submission, the matching
     hidden fields (utm_source, utm_medium, utm_campaign, utm_content,
     utm_term) must ALSO be created inside the Typeform itself. */
  function initTypeform(params) {
    var el = document.querySelector("[data-tf-live]");
    if (!el) return;

    var hiddenKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    var pairs = hiddenKeys
      .filter(function (k) { return params[k]; })
      .map(function (k) { return k + "=" + encodeURIComponent(params[k]); });

    if (pairs.length) el.setAttribute("data-tf-hidden", pairs.join(","));

    // Load the Typeform embed script once, after hidden fields are set,
    // so the values are picked up on initialisation.
    if (!document.getElementById("tf-embed-script")) {
      var s = document.createElement("script");
      s.id = "tf-embed-script";
      s.src = "//embed.typeform.com/next/embed.js";
      s.async = true;
      document.body.appendChild(s);
    }
  }

  /* ---------- 4. sticky CTA reveal (index only) ---------- */
  function initStickyCta() {
    var sticky = document.querySelector(".sticky-cta");
    var hero = document.getElementById("hero");
    if (!sticky || !hero) return;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) sticky.classList.remove("show");
          else sticky.classList.add("show");
        });
      }, { rootMargin: "-40px 0px 0px 0px", threshold: 0 });
      io.observe(hero);
    } else {
      window.addEventListener("scroll", function () {
        if (window.scrollY > hero.offsetHeight) sticky.classList.add("show");
        else sticky.classList.remove("show");
      }, { passive: true });
    }
  }

  /* ---------- 5. FAQ accordion ---------- */
  function initFaq() {
    var items = document.querySelectorAll(".faq-item");
    items.forEach(function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", function () {
        var isOpen = item.classList.toggle("open");
        q.setAttribute("aria-expanded", isOpen ? "true" : "false");
        a.style.maxHeight = isOpen ? a.scrollHeight + "px" : null;
      });
    });
  }

  /* ---------- 6. smooth scroll to form for hash / data-scroll links ---------- */
  function initScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href").slice(1);
        var target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    var params = captureParams();
    decorateLinks(params);
    initTypeform(params);
    initStickyCta();
    initFaq();
    initScrollLinks();
  });
})();
