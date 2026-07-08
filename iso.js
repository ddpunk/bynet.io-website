/* ===================================================================
   iso.js — isometric block illustrations (pure SVG)
   Recreates the Bynet Protocol "order book" block renders.
   =================================================================== */
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";

  /* palettes ------------------------------------------------------- */
  var P = {
    blue:  { top: "#8fb4ff", left: "#3f79f2", right: "#245fd6" },
    blueL: { top: "#a9c6ff", left: "#5a8bf6", right: "#356fe0" },
    navy:  { top: "#2a3c62", left: "#182a4d", right: "#0e1c38" },
    black: { top: "#3a4560", left: "#20293f", right: "#131a2b" },
    darkBlue: { top: "#4f8bff", left: "#2f6bff", right: "#1c4fd0" }
  };

  /* one isometric cube at (cx,cy) — cy is the TOP-CENTER vertex ----- */
  function cube(cx, cy, a, pal, opts) {
    opts = opts || {};
    var h = opts.h != null ? opts.h : a;          // extrusion height
    var dx = a * 0.866, dy = a * 0.5;
    var T = [cx, cy], R = [cx + dx, cy + dy], B = [cx, cy + 2 * dy], L = [cx - dx, cy + dy];
    var Bd = [cx, cy + 2 * dy + h], Ld = [cx - dx, cy + dy + h], Rd = [cx + dx, cy + dy + h];
    function poly(pts, fill, extra) {
      return '<polygon points="' + pts.map(function (p) { return p.join(","); }).join(" ") +
        '" fill="' + fill + '"' + (extra || "") + "/>";
    }
    if (opts.wire) {
      var s = ' fill="none" stroke="' + (opts.stroke || "#9db8ef") +
        '" stroke-width="1.1" stroke-linejoin="round" opacity="' + (opts.opacity || .55) + '"';
      function wpoly(pts) {
        return '<polygon points="' + pts.map(function (p) { return p.join(","); }).join(" ") + '"' + s + "/>";
      }
      return wpoly([T, R, B, L]) + wpoly([L, B, Bd, Ld]) + wpoly([B, R, Rd, Bd]);
    }
    return poly([L, B, Bd, Ld], pal.left) +
           poly([B, R, Rd, Bd], pal.right) +
           poly([T, R, B, L], pal.top);
  }

  /* a diamond grid of cubes; returns svg fragment (back-to-front) --- */
  function grid(rows, cols, a, pal, ox, oy, opts) {
    opts = opts || {};
    var gap = opts.gap || 0;
    var dx = (a + gap) * 0.866, dy = (a + gap) * 0.5;
    var cells = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        cells.push({ k: r + c, x: ox + (c - r) * dx, y: oy + (c + r) * dy });
      }
    }
    cells.sort(function (m, n) { return m.k - n.k; });
    return cells.map(function (ce) { return cube(ce.x, ce.y, a, pal, opts); }).join("");
  }

  function wrap(vb, inner) {
    return '<svg viewBox="' + vb + '" xmlns="' + NS + '" fill="none">' + inner + "</svg>";
  }

  /* glow filter def ------------------------------------------------ */
  function glowDefs(id, color) {
    return '<defs><filter id="' + id + '" x="-60%" y="-60%" width="220%" height="220%">' +
      '<feGaussianBlur stdDeviation="6" result="b"/>' +
      '<feFlood flood-color="' + color + '" flood-opacity="0.9"/>' +
      '<feComposite in2="b" operator="in" result="g"/>' +
      '<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      "</filter></defs>";
  }

  /* connector "arch" tubes over a grid (matchmaking / cta) --------- */
  function arches(cx, cy, filter) {
    var g = "";
    var spans = [
      [-92, -30, 60], [-30, 40, 74], [10, 80, 58]
    ];
    spans.forEach(function (s) {
      var x0 = cx + s[0], x1 = cx + s[1], lift = s[2];
      var mid = (x0 + x1) / 2;
      g += '<path d="M' + x0 + ' ' + cy + ' C ' + x0 + ' ' + (cy - lift) + ' ' +
        x1 + ' ' + (cy - lift) + ' ' + x1 + ' ' + cy + '" ' +
        'stroke="#63a2ff" stroke-width="7" stroke-linecap="round" fill="none" ' +
        'filter="url(#' + filter + ')" opacity="0.95"/>';
      g += '<path d="M' + x0 + ' ' + cy + ' C ' + x0 + ' ' + (cy - lift) + ' ' +
        x1 + ' ' + (cy - lift) + ' ' + x1 + ' ' + cy + '" ' +
        'stroke="#bcd6ff" stroke-width="2.4" stroke-linecap="round" fill="none"/>';
    });
    return g;
  }

  /* -------------------- illustration builders -------------------- */
  var ART = {
    // solid 5x5 blue cube grid
    orderbook: function () {
      var inner = grid(5, 5, 34, P.blue, 250, 40, { gap: 2 });
      return wrap("0 0 500 400", inner);
    },

    // cube cluster with glowing matchmaking arches weaving over the top
    matchmaking: function () {
      var inner = glowDefs("gm", "#4f8bff");
      inner += grid(4, 4, 32, P.blueL, 250, 170, { gap: 2 });
      inner += arches(250, 210, "gm");
      return wrap("0 0 500 430", inner);
    },

    // blue grid with raised black + blue bars resting on top + glow
    problem: function () {
      var inner = glowDefs("gp", "#3f79f2");
      inner += grid(4, 5, 30, P.blue, 250, 214, { gap: 2 });
      inner += arches(250, 206, "gp");
      inner += longBar(250, 150, 140, P.black);
      inner += longBar(224, 166, 140, P.navy);
      inner += longBar(198, 182, 140, P.darkBlue);
      return wrap("0 0 520 470", inner);
    },

    // dark-mode version for the CTA section
    cta: function () {
      var inner = glowDefs("gc", "#4f8bff");
      inner += grid(4, 5, 30, P.blue, 250, 214, { gap: 2 });
      inner += arches(250, 206, "gc");
      inner += longBar(250, 150, 140, P.black);
      inner += longBar(224, 166, 140, P.navy);
      inner += longBar(198, 182, 140, P.darkBlue);
      return wrap("0 0 520 470", inner);
    }
  };

  /* an elongated bar (a box stretched along the down-right axis) --- */
  function longBar(cx, cy, len, pal) {
    var a = 30, dx = a * 0.866, dy = a * 0.5, h = 26;
    var n = len / a;                 // number of tiles long
    var lx = dx * n, ly = dy * n;    // length vector (down-right)
    function poly(pts, fill) {
      return '<polygon points="' + pts.map(function (p) { return p.join(","); }).join(" ") + '" fill="' + fill + '"/>';
    }
    // near corner (top-center) and far corner
    var T  = [cx, cy];
    var R  = [cx + dx, cy + dy];
    var Te = [cx + lx, cy + ly];
    var Re = [cx + dx + lx, cy + dy + ly];
    var top   = poly([T, Te, Re, R], pal.top);                                   // top face
    var right = poly([R, Re, [Re[0], Re[1] + h], [R[0], R[1] + h]], pal.right);  // front-right face
    var cap   = poly([Re, [Re[0], Re[1] + h], [Re[0] - dx, Re[1] + h - dy], [Re[0] - dx, Re[1] - dy]], pal.left);
    return top + right + cap;
  }

  /* -------------------------- mount ------------------------------ */
  function mount() {
    document.querySelectorAll("[data-art]").forEach(function (el) {
      var key = el.getAttribute("data-art");
      if (ART[key]) el.innerHTML = ART[key]();
    });
  }

  if (document.readyState !== "loading") mount();
  else document.addEventListener("DOMContentLoaded", mount);
})();
