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
  var desktop = window.matchMedia("(min-width: 981px)");

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function seg(p, s, e) { return clamp((p - s) / (e - s), 0, 1); }
  function setLayer(l, o, y) {
    if (!l) return;
    l.style.setProperty("--o", o.toFixed(3));
    l.style.setProperty("--y", y.toFixed(1) + "px");
  }

  function reset() {
    layers.forEach(function (l) { setLayer(l, 1, 0); });
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
    setLayer(layers[1], slab, (1 - slab) * -70);
    setLayer(layers[2], bars, (1 - bars) * -90);

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
