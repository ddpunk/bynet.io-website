/* nav: mobile menu toggle + scrolled state */
(function () {
  "use strict";
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");
  var mobile = document.getElementById("navMobile");

  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!open));
      mobile.hidden = open;
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        mobile.hidden = true;
      });
    });
  }

  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();

/* protocol-layers scroll assembly: layers stack up as you scroll */
(function () {
  "use strict";
  var stage = document.getElementById("stage");
  if (!stage) return;
  var section = stage.closest(".layers");
  var layers = Array.prototype.slice.call(stage.querySelectorAll(".lyr"));
  var panels = Array.prototype.slice.call(section.querySelectorAll(".lpanel"));

  // resting gaps so the three layers stay separated (not merged like a sandwich)
  var SLAB_REST = -32;   // slab floats above the grid
  var BARS_REST = -64;   // bars float above the slab
  var desktop = window.matchMedia("(min-width: 981px)");

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function seg(p, s, e) { return clamp((p - s) / (e - s), 0, 1); }
  function setLayer(l, o, y) {
    if (!l) return;
    l.style.setProperty("--o", o.toFixed(3));
    l.style.setProperty("--y", y.toFixed(1) + "px");
  }

  function reset() {
    // static, separated stack (no scroll animation on tablet/mobile)
    setLayer(layers[0], 1, 0);
    setLayer(layers[1], 1, SLAB_REST * 0.55);
    setLayer(layers[2], 1, BARS_REST * 0.55);
    panels.forEach(function (p) { p.classList.remove("is-dim"); });
  }

  var ticking = false;
  function update() {
    ticking = false;
    if (!desktop.matches) { reset(); return; }

    var rect = section.getBoundingClientRect();
    var total = rect.height - window.innerHeight;
    var p = clamp(-rect.top / (total > 0 ? total : 1), 0, 1);

    var slab = seg(p, 0.18, 0.42);   // matchmaking layer drops in
    var bars = seg(p, 0.52, 0.78);   // problem-solving layer drops in

    setLayer(layers[0], 1, 0);
    setLayer(layers[1], slab, SLAB_REST + (1 - slab) * -70);
    setLayer(layers[2], bars, BARS_REST + (1 - bars) * -80);

    var active = p < 0.34 ? 0 : (p < 0.66 ? 1 : 2);
    panels.forEach(function (pl, i) { pl.classList.toggle("is-dim", i !== active); });
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
  if (desktop.addEventListener) desktop.addEventListener("change", update);
  update();
})();

/* scroll-reveal: fade/slide elements in as they enter the viewport */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  var groups = [
    ".hero__title", ".hero__sub", ".hero__actions", ".trust",
    ".section-head",
    ".card", ".step", ".rm", ".eco__item", ".faq__item",
    ".feature", ".point",
    ".cta__text", ".cta__art",
    ".community__inner", ".footer__grid"
  ];
  var els = [];
  groups.forEach(function (sel) {
    var list = document.querySelectorAll(sel);
    list.forEach(function (el, i) {
      el.classList.add("reveal");
      // stagger items that repeat (cards, points)
      if (list.length > 1) el.style.transitionDelay = Math.min(i * 90, 360) + "ms";
      els.push(el);
    });
  });
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  els.forEach(function (el) { io.observe(el); });
})();

/* back-to-top button */
(function () {
  "use strict";
  var btn = document.getElementById("toTop");
  if (!btn) return;
  function toggle() { btn.classList.toggle("is-shown", window.scrollY > window.innerHeight * 0.9); }
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
})();
