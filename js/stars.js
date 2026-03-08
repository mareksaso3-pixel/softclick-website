/**
 * Deep Space Aurora Background
 * - Dense milky-way style starfield
 * - Aurora borealis vertical light curtains
 * - Nebula cloud bands
 * - Shooting stars
 * Respects prefers-reduced-motion.
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var stars = [];
  var shootingStars = [];
  var auroraCurtains = [];
  var width, height;
  var offscreen, offCtx; // offscreen canvas for static stars

  var starColors = [
    [220, 230, 255], [200, 210, 255], [180, 195, 255],
    [170, 170, 255], [150, 200, 240], [140, 230, 220],
    [200, 255, 230], [255, 255, 255], [255, 250, 240],
    [240, 220, 255],
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    createAurora();
    renderStaticStars();
  }

  // ===== DENSE STARFIELD =====
  function createStars() {
    var count = Math.min(Math.floor(width * height / 1800), 800);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.5 ? 0 : depth < 0.8 ? 1 : depth < 0.95 ? 2 : 3;
      var sizes = [0.3, 0.6, 1.1, 1.8];
      var opacities = [0.15, 0.3, 0.55, 0.8];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      // Cluster stars more toward center band (milky way effect)
      var y = Math.random() * height;
      var centerBand = 0.3 + Math.random() * 0.4; // 30-70% height
      if (Math.random() < 0.3) {
        y = height * centerBand + (Math.random() - 0.5) * height * 0.25;
      }

      stars.push({
        x: Math.random() * width,
        y: y,
        size: sizes[layer] + Math.random() * 0.3,
        baseOpacity: opacities[layer],
        twinkleSpeed: 0.0008 + Math.random() * 0.004,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleAmount: layer < 2 ? 0.08 : 0.2 + Math.random() * 0.15,
        color: color,
        hasGlow: layer === 3,
      });
    }
  }

  // Render non-twinkling base stars to offscreen canvas (performance)
  function renderStaticStars() {
    offscreen = document.createElement('canvas');
    offscreen.width = width;
    offscreen.height = height;
    offCtx = offscreen.getContext('2d');

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (s.twinkleAmount < 0.12) {
        // Static dim stars - render once
        offCtx.beginPath();
        offCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        offCtx.fillStyle = 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + s.baseOpacity + ')';
        offCtx.fill();
        s.isStatic = true;
      } else {
        s.isStatic = false;
      }
    }
  }

  // ===== AURORA CURTAINS =====
  function createAurora() {
    auroraCurtains = [];
    var curtainCount = 5;
    for (var i = 0; i < curtainCount; i++) {
      var points = [];
      var segments = 12 + Math.floor(Math.random() * 6);
      for (var j = 0; j <= segments; j++) {
        points.push({
          xBase: (j / segments) * width,
          yBase: height * (0.15 + Math.random() * 0.25),
          amplitude: 15 + Math.random() * 40,
          frequency: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Aurora colors: teal, cyan, blue, green, violet bands
      var colorSets = [
        { top: [20, 180, 160], bot: [10, 80, 100], alpha: 0.06 },   // teal
        { top: [40, 120, 220], bot: [20, 50, 140], alpha: 0.05 },   // blue
        { top: [80, 200, 170], bot: [30, 120, 100], alpha: 0.07 },  // green-teal
        { top: [120, 80, 220], bot: [60, 30, 140], alpha: 0.04 },   // violet
        { top: [30, 200, 200], bot: [15, 100, 130], alpha: 0.055 }, // cyan
      ];

      auroraCurtains.push({
        points: points,
        colorSet: colorSets[i % colorSets.length],
        curtainHeight: height * (0.25 + Math.random() * 0.2),
        speed: 0.0002 + Math.random() * 0.0003,
        drift: Math.random() * Math.PI * 2,
        driftSpeed: 0.00005 + Math.random() * 0.0001,
      });
    }
  }

  function drawAurora(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (var c = 0; c < auroraCurtains.length; c++) {
      var curtain = auroraCurtains[c];
      var pts = curtain.points;
      var cs = curtain.colorSet;
      var ch = curtain.curtainHeight;

      // Breathing intensity
      var breathe = reduced ? 0.8 : 0.5 + 0.5 * Math.sin(time * 0.0004 + c * 1.5);
      var alpha = cs.alpha * breathe;
      var drift = reduced ? 0 : Math.sin(time * curtain.driftSpeed + curtain.drift) * 30;

      // Draw vertical curtain strips between points
      for (var i = 0; i < pts.length - 1; i++) {
        var p1 = pts[i];
        var p2 = pts[i + 1];

        var wave1 = reduced ? 0 : Math.sin(time * curtain.speed + p1.phase + p1.frequency * i) * p1.amplitude;
        var wave2 = reduced ? 0 : Math.sin(time * curtain.speed + p2.phase + p2.frequency * (i + 1)) * p2.amplitude;

        var x1 = p1.xBase + drift;
        var y1 = p1.yBase + wave1;
        var x2 = p2.xBase + drift;
        var y2 = p2.yBase + wave2;

        // Vertical gradient strip
        var grad = ctx.createLinearGradient(0, y1, 0, y1 + ch);
        grad.addColorStop(0, 'rgba(' + cs.top[0] + ',' + cs.top[1] + ',' + cs.top[2] + ',0)');
        grad.addColorStop(0.1, 'rgba(' + cs.top[0] + ',' + cs.top[1] + ',' + cs.top[2] + ',' + (alpha * 0.6) + ')');
        grad.addColorStop(0.3, 'rgba(' + cs.top[0] + ',' + cs.top[1] + ',' + cs.top[2] + ',' + alpha + ')');
        grad.addColorStop(0.6, 'rgba(' + cs.bot[0] + ',' + cs.bot[1] + ',' + cs.bot[2] + ',' + (alpha * 0.5) + ')');
        grad.addColorStop(1, 'rgba(' + cs.bot[0] + ',' + cs.bot[1] + ',' + cs.bot[2] + ',0)');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y2 + ch);
        ctx.lineTo(x1, y1 + ch);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ===== NEBULA HAZE =====
  function drawNebula(time) {
    var patches = [
      { x: width * 0.2, y: height * 0.35, rx: width * 0.3, ry: height * 0.15, color: [40, 170, 160], alpha: 0.02, phase: 0 },
      { x: width * 0.65, y: height * 0.25, rx: width * 0.25, ry: height * 0.2, color: [100, 70, 200], alpha: 0.025, phase: 2 },
      { x: width * 0.45, y: height * 0.5, rx: width * 0.35, ry: height * 0.1, color: [30, 140, 180], alpha: 0.015, phase: 4 },
      { x: width * 0.8, y: height * 0.55, rx: width * 0.2, ry: height * 0.15, color: [60, 180, 150], alpha: 0.018, phase: 1 },
    ];

    for (var i = 0; i < patches.length; i++) {
      var p = patches[i];
      var breathe = reduced ? 1 : 0.6 + 0.4 * Math.sin(time * 0.00025 + p.phase);
      var a = p.alpha * breathe;
      var r = Math.max(p.rx, p.ry);

      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + a + ')');
      grad.addColorStop(0.4, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (a * 0.4) + ')');
      grad.addColorStop(1, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',0)');

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.scale(p.rx / r, p.ry / r);
      ctx.translate(-p.x, -p.y);
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      ctx.restore();
    }
  }

  // ===== DYNAMIC STARS (twinkling) =====
  function drawDynamicStars(time) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      if (s.isStatic) continue;

      var op;
      if (reduced) {
        op = s.baseOpacity;
      } else {
        op = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * s.twinkleAmount;
        if (op < 0.03) op = 0.03;
        if (op > 1) op = 1;
      }

      var r = s.color[0], g = s.color[1], b = s.color[2];

      // Glow for brightest stars
      if (s.hasGlow) {
        var gr = s.size * 6;
        var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.15) + ')');
        glow.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.04) + ')');
        glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(s.x - gr, s.y - gr, gr * 2, gr * 2);
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
      ctx.fill();
    }
  }

  // ===== SHOOTING STARS =====
  function spawnShootingStar() {
    if (shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * width * 0.7 + width * 0.1,
      y: Math.random() * height * 0.3,
      angle: Math.PI / 5 + Math.random() * Math.PI / 5,
      speed: 5 + Math.random() * 5,
      length: 80 + Math.random() * 100,
      life: 0,
      maxLife: 35 + Math.random() * 25,
      color: Math.random() > 0.5 ? [160, 240, 220] : [170, 180, 255],
    });
  }

  function drawShootingStars() {
    for (var i = shootingStars.length - 1; i >= 0; i--) {
      var s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life++;

      var progress = s.life / s.maxLife;
      var op = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
      if (op < 0) op = 0;

      if (s.life >= s.maxLife || s.x > width + 50 || s.y > height + 50) {
        shootingStars.splice(i, 1);
        continue;
      }

      var tx = s.x - Math.cos(s.angle) * s.length;
      var ty = s.y - Math.sin(s.angle) * s.length;

      var grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
      grad.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      grad.addColorStop(0.6, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + (op * 0.9) + ')');

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();
    }
  }

  // ===== MAIN DRAW LOOP =====
  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // Layer 1: Nebula haze
    drawNebula(time);

    // Layer 2: Aurora curtains
    drawAurora(time);

    // Layer 3: Static stars (from offscreen canvas)
    if (offscreen) {
      ctx.drawImage(offscreen, 0, 0);
    }

    // Layer 4: Dynamic twinkling stars + glow stars
    drawDynamicStars(time);

    // Layer 5: Shooting stars
    if (!reduced) {
      drawShootingStars();
      if (Math.random() < 0.004) {
        spawnShootingStar();
      }
      requestAnimationFrame(draw);
    }
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
