/* ============================================================
   Hero mouse trail effect
   Self contained, no dependency on script.js internals.
   Spawns fading monospace glyphs following the cursor inside
   the hero section, drawn on a canvas sitting behind the
   content (see .hero__trail in style.css).
   ============================================================ */

(function () {
  'use strict';

  var canvas = document.getElementById('heroTrail');
  if (!canvas || !canvas.getContext) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var hero = canvas.closest('.hero');
  if (!hero) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Colour is hardcoded to match --color-primary (#ccff00) from
  // style.css. Canvas fillStyle cannot read CSS custom properties
  // directly, so if the primary colour token changes, update it here too.
  var GLYPH_COLOR = '#ccff00';
  var GLYPHS = ['0', '1', '{', '}', '<', '>', '/', '#', '+', ';', '='];

  var LIFE_MS = 700;
  var SPAWN_INTERVAL_MS = 45;
  var MAX_PARTICLES = 60;

  var particles = [];
  var rafId = null;
  var lastSpawn = 0;

  function sizeCanvas() {
    var rect = hero.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  function spawn(x, y) {
    if (particles.length >= MAX_PARTICLES) {
      particles.shift();
    }
    particles.push({
      x: x,
      y: y,
      born: performance.now(),
      glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      size: 11 + Math.random() * 6,
      driftX: (Math.random() - 0.5) * 14,
      driftY: -10 - Math.random() * 16
    });
    if (rafId === null) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function tick(now) {
    var rect = hero.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles = particles.filter(function (p) {
      return now - p.born < LIFE_MS;
    });

    particles.forEach(function (p) {
      var age = now - p.born;
      var t = age / LIFE_MS;
      var alpha = Math.max(1 - t, 0) * 0.7;
      var x = p.x + p.driftX * t;
      var y = p.y + p.driftY * t;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = GLYPH_COLOR;
      ctx.font = '600 ' + p.size.toFixed(1) + 'px "JetBrains Mono", monospace';
      ctx.fillText(p.glyph, x, y);
    });

    ctx.globalAlpha = 1;

    rafId = particles.length > 0 ? requestAnimationFrame(tick) : null;
  }

  hero.addEventListener('mousemove', function (e) {
    var now = performance.now();
    if (now - lastSpawn < SPAWN_INTERVAL_MS) return;
    lastSpawn = now;
    var rect = hero.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top);
  });
})();
