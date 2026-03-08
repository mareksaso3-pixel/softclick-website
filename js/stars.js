/**
 * Deep Space Nebula Background
 * - Dense starfield with slow drift
 * - Dramatic vivid nebula clouds (blue, purple, magenta, cyan, teal)
 * - Aurora light curtains
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
  var width, height;

  var starColors = [
    [220, 230, 255], [200, 215, 255], [180, 195, 255],
    [170, 180, 255], [150, 200, 240], [140, 230, 220],
    [200, 255, 230], [255, 255, 255], [255, 250, 240],
    [240, 220, 255], [200, 180, 255], [160, 220, 255],
  ];

  // ===== NEBULA CLOUD DEFINITIONS =====
  // Large dramatic nebula patches - vivid colors like galaxy photos
  var nebulaPatches = [];

  function createNebulaPatches() {
    nebulaPatches = [
      // === LARGE DOMINANT CLOUDS ===
      // Deep blue-purple main cloud (upper center-left)
      {
        x: width * 0.25, y: height * 0.2,
        rx: width * 0.45, ry: height * 0.35,
        color: [40, 20, 120], alpha: 0.12,
        phase: 0, breatheSpeed: 0.00018,
        rotation: 0.3
      },
      // Magenta/pink nebula (upper-right)
      {
        x: width * 0.72, y: height * 0.18,
        rx: width * 0.35, ry: height * 0.28,
        color: [140, 30, 160], alpha: 0.10,
        phase: 1.5, breatheSpeed: 0.00022,
        rotation: -0.2
      },
      // Cyan-teal cloud (center)
      {
        x: width * 0.5, y: height * 0.4,
        rx: width * 0.4, ry: height * 0.25,
        color: [20, 100, 180], alpha: 0.09,
        phase: 3, breatheSpeed: 0.00015,
        rotation: 0.1
      },
      // Deep violet swirl (lower-left)
      {
        x: width * 0.15, y: height * 0.65,
        rx: width * 0.35, ry: height * 0.3,
        color: [80, 20, 180], alpha: 0.08,
        phase: 2, breatheSpeed: 0.0002,
        rotation: 0.4
      },
      // Blue-cyan band (center-right)
      {
        x: width * 0.7, y: height * 0.5,
        rx: width * 0.3, ry: height * 0.35,
        color: [30, 80, 200], alpha: 0.09,
        phase: 4, breatheSpeed: 0.00017,
        rotation: -0.3
      },

      // === MEDIUM ACCENT CLOUDS ===
      // Hot magenta-pink accent (top)
      {
        x: width * 0.45, y: height * 0.1,
        rx: width * 0.25, ry: height * 0.18,
        color: [180, 40, 180], alpha: 0.07,
        phase: 1, breatheSpeed: 0.00025,
        rotation: 0
      },
      // Teal-emerald accent (bottom-center)
      {
        x: width * 0.55, y: height * 0.75,
        rx: width * 0.3, ry: height * 0.2,
        color: [20, 150, 160], alpha: 0.06,
        phase: 3.5, breatheSpeed: 0.0002,
        rotation: 0.15
      },
      // Purple-blue wisp (upper-left)
      {
        x: width * 0.1, y: height * 0.3,
        rx: width * 0.2, ry: height * 0.25,
        color: [100, 40, 200], alpha: 0.07,
        phase: 5, breatheSpeed: 0.00019,
        rotation: -0.1
      },
      // Deep blue haze (bottom-right)
      {
        x: width * 0.85, y: height * 0.7,
        rx: width * 0.25, ry: height * 0.2,
        color: [15, 50, 150], alpha: 0.08,
        phase: 2.5, breatheSpeed: 0.00023,
        rotation: 0.25
      },

      // === SMALL BRIGHT SPOTS (nebula cores) ===
      // Bright magenta core
      {
        x: width * 0.35, y: height * 0.25,
        rx: width * 0.12, ry: height * 0.1,
        color: [160, 50, 200], alpha: 0.14,
        phase: 0.5, breatheSpeed: 0.0003,
        rotation: 0
      },
      // Bright cyan core
      {
        x: width * 0.6, y: height * 0.35,
        rx: width * 0.1, ry: height * 0.08,
        color: [30, 160, 220], alpha: 0.12,
        phase: 2.8, breatheSpeed: 0.00028,
        rotation: 0
      },
      // Bright blue-violet core
      {
        x: width * 0.2, y: height * 0.5,
        rx: width * 0.1, ry: height * 0.12,
        color: [60, 30, 200], alpha: 0.10,
        phase: 4.2, breatheSpeed: 0.00032,
        rotation: 0
      },
    ];
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    createNebulaPatches();
  }

  // ===== DENSE STARFIELD WITH DRIFT =====
  function createStars() {
    var count = Math.min(Math.floor(width * height / 1600), 900);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.5 ? 0 : depth < 0.8 ? 1 : depth < 0.95 ? 2 : 3;
      var sizes = [0.3, 0.6, 1.2, 2.0];
      var opacities = [0.15, 0.35, 0.6, 0.85];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      // Cluster stars more toward center band (milky way effect)
      var y = Math.random() * height;
      var centerBand = 0.3 + Math.random() * 0.4;
      if (Math.random() < 0.35) {
        y = height * centerBand + (Math.random() - 0.5) * height * 0.25;
      }

      // Drift direction and speed (very slow)
      var driftAngle = Math.random() * Math.PI * 2;
      var driftSpeed = 0.02 + Math.random() * 0.08; // pixels per frame

      stars.push({
        x: Math.random() * width,
        y: y,
        baseX: 0,
        baseY: 0,
        size: sizes[layer] + Math.random() * 0.3,
        baseOpacity: opacities[layer],
        twinkleSpeed: 0.001 + Math.random() * 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleAmount: layer < 2 ? 0.1 : 0.25 + Math.random() * 0.2,
        color: color,
        hasGlow: layer === 3,
        driftDx: Math.cos(driftAngle) * driftSpeed,
        driftDy: Math.sin(driftAngle) * driftSpeed,
        layer: layer
      });
    }
    // Store initial positions
    for (var j = 0; j < stars.length; j++) {
      stars[j].baseX = stars[j].x;
      stars[j].baseY = stars[j].y;
    }
  }

  // ===== DRAMATIC NEBULA CLOUDS =====
  function drawNebula(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (var i = 0; i < nebulaPatches.length; i++) {
      var p = nebulaPatches[i];
      var breathe = reduced ? 0.85 : 0.55 + 0.45 * Math.sin(time * p.breatheSpeed + p.phase);
      var a = p.alpha * breathe;
      var r = Math.max(p.rx, p.ry);

      // Slow drift for nebula clouds
      var driftX = reduced ? 0 : Math.sin(time * 0.00008 + p.phase) * 15;
      var driftY = reduced ? 0 : Math.cos(time * 0.00006 + p.phase * 0.7) * 10;
      var cx = p.x + driftX;
      var cy = p.y + driftY;

      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      grad.addColorStop(0, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (a * 1.5) + ')');
      grad.addColorStop(0.15, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (a * 1.2) + ')');
      grad.addColorStop(0.35, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (a * 0.7) + ')');
      grad.addColorStop(0.6, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (a * 0.3) + ')');
      grad.addColorStop(1, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',0)');

      ctx.save();
      ctx.translate(cx, cy);
      if (p.rotation) {
        var rot = p.rotation + (reduced ? 0 : Math.sin(time * 0.00003 + p.phase) * 0.05);
        ctx.rotate(rot);
      }
      ctx.scale(p.rx / r, p.ry / r);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = grad;
      ctx.fillRect(cx - r * 1.2, cy - r * 1.2, r * 2.4, r * 2.4);
      ctx.restore();
    }

    ctx.restore();
  }

  // ===== NEBULA FILAMENTS (wispy detail streaks) =====
  function drawFilaments(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = reduced ? 0.3 : 0.15 + 0.15 * Math.sin(time * 0.0002);

    var filaments = [
      { x1: width * 0.1, y1: height * 0.15, x2: width * 0.5, y2: height * 0.35, color: [120, 40, 200], width: 60 },
      { x1: width * 0.4, y1: height * 0.05, x2: width * 0.8, y2: height * 0.3, color: [180, 50, 180], width: 45 },
      { x1: width * 0.3, y1: height * 0.4, x2: width * 0.9, y2: height * 0.55, color: [30, 100, 200], width: 50 },
      { x1: width * 0.05, y1: height * 0.5, x2: width * 0.4, y2: height * 0.7, color: [80, 30, 180], width: 40 },
      { x1: width * 0.6, y1: height * 0.45, x2: width * 0.95, y2: height * 0.7, color: [20, 140, 180], width: 35 },
    ];

    for (var i = 0; i < filaments.length; i++) {
      var f = filaments[i];
      var drift = reduced ? 0 : Math.sin(time * 0.0001 + i * 2) * 20;

      var grad = ctx.createLinearGradient(f.x1, f.y1 + drift, f.x2, f.y2 + drift);
      grad.addColorStop(0, 'rgba(' + f.color[0] + ',' + f.color[1] + ',' + f.color[2] + ',0)');
      grad.addColorStop(0.3, 'rgba(' + f.color[0] + ',' + f.color[1] + ',' + f.color[2] + ',0.08)');
      grad.addColorStop(0.5, 'rgba(' + f.color[0] + ',' + f.color[1] + ',' + f.color[2] + ',0.12)');
      grad.addColorStop(0.7, 'rgba(' + f.color[0] + ',' + f.color[1] + ',' + f.color[2] + ',0.06)');
      grad.addColorStop(1, 'rgba(' + f.color[0] + ',' + f.color[1] + ',' + f.color[2] + ',0)');

      ctx.beginPath();
      ctx.moveTo(f.x1, f.y1 + drift - f.width / 2);
      // Curved filament path
      var mx = (f.x1 + f.x2) / 2 + Math.sin(time * 0.00005 + i) * 30;
      var my = (f.y1 + f.y2) / 2 + drift + Math.cos(time * 0.00004 + i) * 20;
      ctx.quadraticCurveTo(mx, my - f.width / 2, f.x2, f.y2 + drift - f.width / 2);
      ctx.lineTo(f.x2, f.y2 + drift + f.width / 2);
      ctx.quadraticCurveTo(mx, my + f.width / 2, f.x1, f.y1 + drift + f.width / 2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.restore();
  }

  // ===== AURORA CURTAINS =====
  function drawAurora(time) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    var curtains = [
      { xStart: width * 0.05, xEnd: width * 0.4, yBase: height * 0.1, curtainHeight: height * 0.45,
        color: [30, 200, 170], alpha: 0.04, speed: 0.0003, segments: 10 },
      { xStart: width * 0.3, xEnd: width * 0.7, yBase: height * 0.08, curtainHeight: height * 0.5,
        color: [100, 60, 220], alpha: 0.035, speed: 0.00025, segments: 12 },
      { xStart: width * 0.55, xEnd: width * 0.95, yBase: height * 0.12, curtainHeight: height * 0.4,
        color: [160, 50, 180], alpha: 0.03, speed: 0.00035, segments: 10 },
    ];

    for (var c = 0; c < curtains.length; c++) {
      var cur = curtains[c];
      var breathe = reduced ? 0.7 : 0.3 + 0.7 * Math.sin(time * 0.0003 + c * 2);
      var alpha = cur.alpha * breathe;

      for (var i = 0; i < cur.segments; i++) {
        var t = i / cur.segments;
        var t2 = (i + 1) / cur.segments;
        var x1 = cur.xStart + (cur.xEnd - cur.xStart) * t;
        var x2 = cur.xStart + (cur.xEnd - cur.xStart) * t2;

        var wave1 = reduced ? 0 : Math.sin(time * cur.speed + i * 0.8 + c) * 25;
        var wave2 = reduced ? 0 : Math.sin(time * cur.speed + (i + 1) * 0.8 + c) * 25;

        var y1 = cur.yBase + wave1;
        var y2 = cur.yBase + wave2;

        var grad = ctx.createLinearGradient(0, y1, 0, y1 + cur.curtainHeight);
        grad.addColorStop(0, 'rgba(' + cur.color[0] + ',' + cur.color[1] + ',' + cur.color[2] + ',0)');
        grad.addColorStop(0.08, 'rgba(' + cur.color[0] + ',' + cur.color[1] + ',' + cur.color[2] + ',' + (alpha * 0.5) + ')');
        grad.addColorStop(0.25, 'rgba(' + cur.color[0] + ',' + cur.color[1] + ',' + cur.color[2] + ',' + alpha + ')');
        grad.addColorStop(0.5, 'rgba(' + cur.color[0] + ',' + cur.color[1] + ',' + cur.color[2] + ',' + (alpha * 0.6) + ')');
        grad.addColorStop(1, 'rgba(' + cur.color[0] + ',' + cur.color[1] + ',' + cur.color[2] + ',0)');

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y2 + cur.curtainHeight);
        ctx.lineTo(x1, y1 + cur.curtainHeight);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // ===== STARS WITH DRIFT =====
  function drawStars(time) {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      // Slow drift
      if (!reduced) {
        s.x = s.baseX + Math.sin(time * 0.00005 + s.twinkleOffset) * (3 + s.layer * 2)
              + (time * s.driftDx * 0.001) % (width + 20);
        s.y = s.baseY + Math.cos(time * 0.00004 + s.twinkleOffset) * (2 + s.layer * 1.5)
              + (time * s.driftDy * 0.001) % (height + 20);

        // Wrap around screen edges
        if (s.x > width + 5) s.x -= width + 10;
        if (s.x < -5) s.x += width + 10;
        if (s.y > height + 5) s.y -= height + 10;
        if (s.y < -5) s.y += height + 10;
      }

      // Twinkle
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
        var gr = s.size * 7;
        var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.2) + ')');
        glow.addColorStop(0.4, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.06) + ')');
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
      length: 80 + Math.random() * 120,
      life: 0,
      maxLife: 35 + Math.random() * 25,
      color: Math.random() > 0.5 ? [160, 240, 220] : [180, 170, 255],
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

      // Bright head
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();

      // Subtle glow around head
      var headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
      headGlow.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.3) + ')');
      headGlow.addColorStop(1, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      ctx.fillStyle = headGlow;
      ctx.fillRect(s.x - 8, s.y - 8, 16, 16);
    }
  }

  // ===== MAIN DRAW LOOP =====
  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    // Layer 1: Dramatic nebula clouds
    drawNebula(time);

    // Layer 2: Nebula filaments (wispy details)
    drawFilaments(time);

    // Layer 3: Aurora curtains (subtle)
    drawAurora(time);

    // Layer 4: Stars with drift and twinkle
    drawStars(time);

    // Layer 5: Shooting stars
    if (!reduced) {
      drawShootingStars();
      if (Math.random() < 0.005) {
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
