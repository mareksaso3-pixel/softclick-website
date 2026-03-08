/**
 * Deep Space Nebula Background — Ultra Vivid
 * Inspired by galaxy/nebula reference photos.
 *
 * Architecture (for performance):
 *   1. Offscreen canvas: static nebula clouds (rendered once on resize)
 *   2. Main canvas each frame: nebula composite (with breathing), stars (drift + twinkle), shooting stars
 *
 * Colors: deep blue, purple, violet, magenta/pink, cyan, teal — NO red.
 * Respects prefers-reduced-motion.
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Offscreen canvases for static nebula layers
  var nebulaCanvas1 = document.createElement('canvas');
  var nebulaCtx1 = nebulaCanvas1.getContext('2d');
  var nebulaCanvas2 = document.createElement('canvas');
  var nebulaCtx2 = nebulaCanvas2.getContext('2d');

  var stars = [];
  var shootingStars = [];
  var W, H;

  // Star color palette (cool whites, blues, lavenders)
  var starColors = [
    [220, 230, 255], [200, 215, 255], [180, 200, 255],
    [170, 185, 255], [150, 200, 245], [140, 230, 225],
    [255, 255, 255], [240, 235, 255], [200, 180, 255],
    [160, 220, 255], [180, 255, 240], [255, 250, 250],
  ];

  // ───────────────────────────────────────────
  //  STATIC NEBULA RENDERING (offscreen)
  // ───────────────────────────────────────────

  function renderStaticNebula() {
    nebulaCanvas1.width = W;
    nebulaCanvas1.height = H;
    nebulaCanvas2.width = W;
    nebulaCanvas2.height = H;

    // === LAYER 1: Deep base nebula clouds ===
    var c1 = nebulaCtx1;
    c1.clearRect(0, 0, W, H);
    c1.globalCompositeOperation = 'screen';

    // These are the LARGE dominant clouds with HIGH opacity
    var baseClouds = [
      // Massive deep blue-purple (covers ~40% of canvas)
      { x: 0.22, y: 0.25, rx: 0.50, ry: 0.40, c: [25, 15, 100], a: 0.45 },
      // Large magenta-purple (upper right)
      { x: 0.75, y: 0.20, rx: 0.40, ry: 0.35, c: [120, 20, 150], a: 0.38 },
      // Blue-cyan band (center)
      { x: 0.50, y: 0.45, rx: 0.55, ry: 0.30, c: [15, 60, 160], a: 0.35 },
      // Deep violet (lower left)
      { x: 0.15, y: 0.65, rx: 0.40, ry: 0.35, c: [60, 15, 140], a: 0.32 },
      // Teal-blue wash (lower right)
      { x: 0.80, y: 0.60, rx: 0.35, ry: 0.30, c: [10, 70, 140], a: 0.28 },
      // Purple wash (top center)
      { x: 0.45, y: 0.08, rx: 0.45, ry: 0.25, c: [80, 20, 160], a: 0.30 },
    ];

    for (var i = 0; i < baseClouds.length; i++) {
      drawCloudOnCtx(c1, baseClouds[i]);
    }

    // === LAYER 2: Bright accent clouds and cores ===
    var c2 = nebulaCtx2;
    c2.clearRect(0, 0, W, H);
    c2.globalCompositeOperation = 'screen';

    var accentClouds = [
      // Bright magenta bloom (upper-right area)
      { x: 0.68, y: 0.22, rx: 0.20, ry: 0.18, c: [170, 40, 200], a: 0.40 },
      // Vivid purple core (left)
      { x: 0.25, y: 0.30, rx: 0.18, ry: 0.15, c: [130, 50, 220], a: 0.35 },
      // Cyan-teal accent (center-left)
      { x: 0.35, y: 0.50, rx: 0.22, ry: 0.16, c: [20, 140, 200], a: 0.30 },
      // Blue glow (lower center)
      { x: 0.55, y: 0.70, rx: 0.25, ry: 0.18, c: [30, 80, 200], a: 0.28 },
      // Pink-magenta wisp (far right)
      { x: 0.88, y: 0.35, rx: 0.15, ry: 0.20, c: [160, 30, 180], a: 0.25 },
      // Deep blue core (top-left)
      { x: 0.10, y: 0.15, rx: 0.18, ry: 0.15, c: [20, 40, 180], a: 0.30 },

      // Small bright nebula cores (these give the vivid "hot spots")
      { x: 0.30, y: 0.28, rx: 0.08, ry: 0.06, c: [150, 80, 255], a: 0.50 },
      { x: 0.65, y: 0.25, rx: 0.07, ry: 0.05, c: [200, 60, 220], a: 0.45 },
      { x: 0.45, y: 0.48, rx: 0.08, ry: 0.07, c: [40, 120, 230], a: 0.40 },
      { x: 0.80, y: 0.55, rx: 0.06, ry: 0.05, c: [30, 160, 200], a: 0.35 },
      { x: 0.18, y: 0.52, rx: 0.07, ry: 0.06, c: [100, 30, 200], a: 0.38 },
      { x: 0.55, y: 0.15, rx: 0.06, ry: 0.05, c: [180, 50, 200], a: 0.35 },
    ];

    for (var j = 0; j < accentClouds.length; j++) {
      drawCloudOnCtx(c2, accentClouds[j]);
    }
  }

  function drawCloudOnCtx(c, cloud) {
    var cx = W * cloud.x;
    var cy = H * cloud.y;
    var rx = W * cloud.rx;
    var ry = H * cloud.ry;
    var r = Math.max(rx, ry);

    c.save();
    c.translate(cx, cy);
    c.scale(rx / r, ry / r);
    c.translate(-cx, -cy);

    var grad = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    var col = cloud.c;
    var a = cloud.a;
    grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a + ')');
    grad.addColorStop(0.2, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.8) + ')');
    grad.addColorStop(0.45, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.45) + ')');
    grad.addColorStop(0.7, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.15) + ')');
    grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');

    c.fillStyle = grad;
    c.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4);
    c.restore();
  }

  // ───────────────────────────────────────────
  //  STARFIELD
  // ───────────────────────────────────────────

  function createStars() {
    var count = Math.min(Math.floor(W * H / 1400), 1000);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.5 ? 0 : depth < 0.8 ? 1 : depth < 0.95 ? 2 : 3;
      var sizes = [0.3, 0.7, 1.3, 2.2];
      var opacities = [0.2, 0.4, 0.65, 0.9];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      var y = Math.random() * H;
      // Milky-way clustering
      if (Math.random() < 0.3) {
        y = H * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * H * 0.2;
      }

      var angle = Math.random() * Math.PI * 2;
      var spd = 0.015 + Math.random() * 0.06;

      stars.push({
        x: Math.random() * W,
        y: y,
        baseX: 0, baseY: 0,
        size: sizes[layer] + Math.random() * 0.4,
        baseOpacity: opacities[layer],
        twinkleSpeed: 0.0008 + Math.random() * 0.004,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleAmt: layer < 2 ? 0.08 : 0.2 + Math.random() * 0.25,
        color: color,
        glow: layer >= 2,
        dx: Math.cos(angle) * spd,
        dy: Math.sin(angle) * spd,
        layer: layer
      });
    }
    for (var k = 0; k < stars.length; k++) {
      stars[k].baseX = stars[k].x;
      stars[k].baseY = stars[k].y;
    }
  }

  // ───────────────────────────────────────────
  //  SHOOTING STARS
  // ───────────────────────────────────────────

  function spawnShootingStar() {
    if (shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * W * 0.7 + W * 0.1,
      y: Math.random() * H * 0.35,
      angle: Math.PI / 5 + Math.random() * Math.PI / 5,
      speed: 5 + Math.random() * 6,
      length: 90 + Math.random() * 130,
      life: 0,
      maxLife: 30 + Math.random() * 30,
      color: Math.random() > 0.5 ? [160, 240, 220] : [200, 180, 255],
    });
  }

  function drawShootingStars() {
    for (var i = shootingStars.length - 1; i >= 0; i--) {
      var s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life++;

      var prog = s.life / s.maxLife;
      var op = prog < 0.12 ? prog / 0.12 : 1 - (prog - 0.12) / 0.88;
      if (op < 0) op = 0;

      if (s.life >= s.maxLife || s.x > W + 60 || s.y > H + 60) {
        shootingStars.splice(i, 1);
        continue;
      }

      var tx = s.x - Math.cos(s.angle) * s.length;
      var ty = s.y - Math.sin(s.angle) * s.length;

      // Tail gradient
      var grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
      grad.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      grad.addColorStop(0.5, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.25) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + (op * 0.9) + ')');

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();

      // Head glow
      var hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 12);
      hg.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.4) + ')');
      hg.addColorStop(1, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      ctx.fillStyle = hg;
      ctx.fillRect(s.x - 12, s.y - 12, 24, 24);
    }
  }

  // ───────────────────────────────────────────
  //  MAIN DRAW LOOP
  // ───────────────────────────────────────────

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // ── Draw nebula base layer (from offscreen, high opacity) ──
    var baseBreath = reduced ? 0.9 : 0.8 + 0.2 * Math.sin(time * 0.00015);
    ctx.globalAlpha = baseBreath;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(nebulaCanvas1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // ── Draw accent layer (breathing, slightly offset for depth) ──
    var accBreath = reduced ? 0.85 : 0.65 + 0.35 * Math.sin(time * 0.0002 + 1.5);
    var accOffX = reduced ? 0 : Math.sin(time * 0.00006) * 8;
    var accOffY = reduced ? 0 : Math.cos(time * 0.00005) * 6;
    ctx.globalAlpha = accBreath;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(nebulaCanvas2, accOffX, accOffY);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // ── Stars ──
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Slow drift
      if (!reduced) {
        s.x = s.baseX
              + Math.sin(time * 0.00004 + s.twinklePhase) * (2 + s.layer * 1.5)
              + (time * s.dx * 0.0008);
        s.y = s.baseY
              + Math.cos(time * 0.00003 + s.twinklePhase) * (1.5 + s.layer)
              + (time * s.dy * 0.0008);

        // Wrap edges
        if (s.x > W + 4) { s.x -= W + 8; s.baseX -= W + 8; }
        if (s.x < -4) { s.x += W + 8; s.baseX += W + 8; }
        if (s.y > H + 4) { s.y -= H + 8; s.baseY -= H + 8; }
        if (s.y < -4) { s.y += H + 8; s.baseY += H + 8; }
      }

      // Twinkle
      var op;
      if (reduced) {
        op = s.baseOpacity;
      } else {
        op = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * s.twinkleAmt;
        if (op < 0.05) op = 0.05;
        if (op > 1) op = 1;
      }

      var r = s.color[0], g = s.color[1], b = s.color[2];

      // Glow halo
      if (s.glow) {
        var gr = s.size * (s.layer === 3 ? 8 : 5);
        var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.25) + ')');
        glow.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.06) + ')');
        glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(s.x - gr, s.y - gr, gr * 2, gr * 2);
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
      ctx.fill();
    }

    // ── Shooting stars ──
    if (!reduced) {
      drawShootingStars();
      if (Math.random() < 0.006) spawnShootingStar();
      requestAnimationFrame(draw);
    }
  }

  // ───────────────────────────────────────────
  //  RESIZE & INIT
  // ───────────────────────────────────────────

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    renderStaticNebula();
    createStars();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 250);
  });

  resize();

  if (reduced) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
