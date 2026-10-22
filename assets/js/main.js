/* Yazici Lab — small, dependency-free scripts */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- Filters (publications, news) ---------- */
  document.querySelectorAll("[data-filter-root]").forEach(function (root) {
    var scope = root.parentElement;
    var list = scope.querySelector("[data-filter-items]");
    if (!list) return;
    var items = Array.prototype.slice.call(list.querySelectorAll("[data-type]"));
    var groups = list.querySelectorAll("[data-group]");
    var chips = root.querySelectorAll("[data-filter-type]");
    var search = root.querySelector("[data-filter-search]");
    var status = root.querySelector("[data-filter-status]");
    var empty = scope.querySelector("[data-filter-empty]");
    var type = "all";

    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (el) {
        var okType = type === "all" || el.dataset.type === type;
        var okText = !q || (el.dataset.search || el.textContent.toLowerCase()).indexOf(q) !== -1;
        el.hidden = !(okType && okText);
        if (!el.hidden) shown++;
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector("[data-type]:not([hidden])");
      });
      if (status) status.textContent = shown === items.length ? items.length + " items" : "Showing " + shown + " of " + items.length;
      if (empty) empty.hidden = shown !== 0;
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        type = chip.dataset.filterType;
        chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();
  });

  /* ---------- Hero: a fuzzy query over a sensor field ----------
     Each dot is a sensor. The query point (your pointer, or a slowly
     drifting point) asks "which sensors are near here?". Instead of a
     yes/no answer, every sensor gets a membership degree μ between 0 and 1,
     shown by its colour and size. */
  var canvas = document.querySelector(".hero-field");
  if (!canvas || !canvas.getContext) return;

  var hero = canvas.parentElement;
  var ctx = canvas.getContext("2d");
  var countEl = hero.querySelector("[data-readout-count]");
  var targetEl = hero.querySelector(".readout-target");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var LOW = [69, 181, 175];   // teal
  var HIGH = [240, 180, 86];  // amber
  var W = 0, H = 0, dpr = 1, sigma = 120, linkDist = 110;
  var nodes = [], edges = [];
  var q = { x: 0, y: 0 }, target = { x: 0, y: 0 };
  var pointerActive = false, running = false, visible = true, t0 = performance.now(), lastReadout = 0;

  // Small seeded random so the field looks the same on every visit.
  var seed = 7;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  function build() {
    var rect = hero.getBoundingClientRect();
    W = rect.width; H = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    seed = 7;
    nodes = [];
    var cell = W < 700 ? 58 : 74;
    for (var y = cell / 2; y < H; y += cell) {
      for (var x = cell / 2; x < W; x += cell) {
        if (rand() < 0.22) continue; // leave gaps, like a real deployment
        nodes.push({ x: x + (rand() - 0.5) * cell * 0.9, y: y + (rand() - 0.5) * cell * 0.9, mu: 0, phase: rand() * 6.28 });
      }
    }
    linkDist = cell * 1.45;
    edges = [];
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        if (dx * dx + dy * dy < linkDist * linkDist) edges.push([i, j]);
      }
    }
    sigma = Math.max(70, Math.min(W, H) * 0.17);
    if (!pointerActive) { drift(performance.now()); q.x = target.x; q.y = target.y; }
  }

  function drift(now) {
    var t = reduce ? 0 : (now - t0) / 1000;
    var cx = W < 700 ? W * 0.5 : W * 0.68;
    var narrow = W < 700;
    var cy = narrow ? H * 0.17 : H * 0.45;
    target.x = cx + Math.sin(t * 0.21) * W * (narrow ? 0.3 : 0.2);
    target.y = cy + Math.sin(t * 0.33 + 1.2) * H * (narrow ? 0.08 : 0.22);
  }

  function mix(a, b, k) {
    return "rgb(" + Math.round(a[0] + (b[0] - a[0]) * k) + "," + Math.round(a[1] + (b[1] - a[1]) * k) + "," + Math.round(a[2] + (b[2] - a[2]) * k) + ")";
  }

  function draw(now) {
    if (!pointerActive) drift(now);
    var ease = reduce ? 1 : 0.1;
    q.x += (target.x - q.x) * ease;
    q.y += (target.y - q.y) * ease;

    ctx.clearRect(0, 0, W, H);
    var s2 = 2 * sigma * sigma, count = 0;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i], dx = n.x - q.x, dy = n.y - q.y;
      n.mu = Math.exp(-(dx * dx + dy * dy) / s2);
      if (n.mu >= 0.5) count++;
    }

    // links between sensors that can hear each other
    ctx.lineWidth = 1;
    for (var e = 0; e < edges.length; e++) {
      var a = nodes[edges[e][0]], b = nodes[edges[e][1]], m = (a.mu + b.mu) / 2;
      ctx.strokeStyle = "rgba(169,182,198," + (0.07 + m * 0.35).toFixed(3) + ")";
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // the query: rings at μ = 0.5 and μ ≈ 0.14
    var r05 = sigma * Math.sqrt(2 * Math.LN2);
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = "rgba(240,180,86,0.45)";
    ctx.beginPath(); ctx.arc(q.x, q.y, r05, 0, 6.2832); ctx.stroke();
    ctx.strokeStyle = "rgba(240,180,86,0.18)";
    ctx.beginPath(); ctx.arc(q.x, q.y, sigma * 2, 0, 6.2832); ctx.stroke();
    ctx.setLineDash([]);

    // sensors
    var tt = reduce ? 0 : now / 1000;
    for (var k = 0; k < nodes.length; k++) {
      var p = nodes[k], mu = p.mu;
      if (mu > 0.25) {
        ctx.fillStyle = "rgba(240,180,86," + (mu * 0.16).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, 6 + mu * 16, 0, 6.2832); ctx.fill();
      }
      var pulse = 1 + Math.sin(tt * 1.4 + p.phase) * 0.12;
      ctx.fillStyle = mix(LOW, HIGH, mu);
      ctx.globalAlpha = 0.55 + mu * 0.45;
      ctx.beginPath(); ctx.arc(p.x, p.y, (1.7 + mu * 3.6) * pulse, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1;
    }

    // query cross-hair
    ctx.strokeStyle = "rgba(238,242,240,0.85)";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(q.x - 7, q.y); ctx.lineTo(q.x + 7, q.y);
    ctx.moveTo(q.x, q.y - 7); ctx.lineTo(q.x, q.y + 7);
    ctx.stroke();

    if (countEl && now - lastReadout > 180) {
      countEl.textContent = count;
      lastReadout = now;
    }
  }

  function loop(now) {
    if (!running) return;
    draw(now);
    requestAnimationFrame(loop);
  }
  function start() {
    if (reduce) { draw(performance.now()); return; }
    if (running || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(loop);
  }
  function stop() { running = false; }

  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var r = hero.getBoundingClientRect();
    target.x = e.clientX - r.left;
    target.y = e.clientY - r.top;
    if (!pointerActive && targetEl) targetEl.textContent = "the pointer";
    pointerActive = true;
    if (reduce) draw(performance.now());
  });
  // On touch screens, tapping the field moves the query there for a few seconds.
  var tapTimer;
  hero.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "touch" || e.target.closest("a")) return;
    var r = hero.getBoundingClientRect();
    target.x = e.clientX - r.left;
    target.y = e.clientY - r.top;
    pointerActive = true;
    if (targetEl) targetEl.textContent = "your tap";
    if (reduce) draw(performance.now());
    clearTimeout(tapTimer);
    tapTimer = setTimeout(function () { pointerActive = false; if (targetEl) targetEl.textContent = "a moving point"; }, 4000);
  });
  hero.addEventListener("pointerleave", function () {
    pointerActive = false;
    if (targetEl) targetEl.textContent = "a moving point";
    if (reduce) draw(performance.now());
  });
  if (targetEl) targetEl.textContent = "a moving point";

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? start() : stop();
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { build(); if (reduce) draw(performance.now()); }, 120);
  });

  build();
  start();
})();
