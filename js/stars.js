/**
 * Cosmic Vortex Background — 3D Depth Effect
 * Central dark vortex with radiating light rays, nebula clouds,
 * depth particles moving outward, and twinkling stars.
 *
 * Respects prefers-reduced-motion.
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Offscreen canvases
  var nebulaCanvas = document.createElement('canvas');
  var nebulaCtx = nebulaCanvas.getContext('2d');
  var raysCanvas = document.createElement('canvas');
  var raysCtx = raysCanvas.getContext('2d');

  var stars = [];
  var depthParticles = [];
  var shootingStars = [];
  var W, H, CX, CY;

  // Color palette matching the cosmic nebula reference
  var nebulaColors = {
    deepPurple: [80, 20, 160],
    magenta: [200, 50, 180],
    hotPink: [244, 114, 182],
    cyan: [34, 211, 238],
    blue: [60, 140, 255],
    violet: [155, 108, 255],
    warmPink: [255, 120, 160],
    orange: [255, 160, 80],
  };

  var starColors = [
    [220, 230, 255], [200, 215, 255], [180, 200, 255],
    [170, 185, 255], [150, 200, 245], [200, 180, 255],
    [255, 255, 255], [240, 235, 255], [255, 220, 255],
    [160, 220, 255], [255, 200, 240], [230, 200, 255],
  ];

  // ───────────────────────────────────────────
  //  STATIC NEBULA (offscreen, rendered once)
  // ───────────────────────────────────────────

  function renderStaticNebula() {
    nebulaCanvas.width = W;
    nebulaCanvas.height = H;

    var c = nebulaCtx;
    c.clearRect(0, 0, W, H);
    c.globalCompositeOperation = 'screen';

    // Large nebula clouds radiating from center
    var clouds = [
      // Left purple-magenta cloud mass
      { x: 0.25, y: 0.38, rx: 0.35, ry: 0.30, c: [60, 10, 100], a: 0.22 },
      { x: 0.18, y: 0.30, rx: 0.25, ry: 0.22, c: [120, 25, 140], a: 0.16 },
      { x: 0.12, y: 0.50, rx: 0.22, ry: 0.28, c: [90, 18, 120], a: 0.14 },

      // Right blue-cyan cloud mass
      { x: 0.78, y: 0.35, rx: 0.30, ry: 0.28, c: [18, 45, 140], a: 0.18 },
      { x: 0.85, y: 0.45, rx: 0.25, ry: 0.25, c: [12, 90, 150], a: 0.14 },
      { x: 0.72, y: 0.25, rx: 0.20, ry: 0.18, c: [35, 75, 180], a: 0.12 },

      // Top pink-purple wisps
      { x: 0.40, y: 0.15, rx: 0.30, ry: 0.18, c: [120, 30, 120], a: 0.13 },
      { x: 0.60, y: 0.12, rx: 0.25, ry: 0.15, c: [140, 35, 110], a: 0.11 },

      // Bottom blue-purple
      { x: 0.35, y: 0.72, rx: 0.28, ry: 0.22, c: [35, 18, 100], a: 0.15 },
      { x: 0.65, y: 0.68, rx: 0.25, ry: 0.20, c: [25, 40, 120], a: 0.12 },

      // Subtle accent cores
      { x: 0.30, y: 0.35, rx: 0.10, ry: 0.08, c: [140, 50, 200], a: 0.28 },
      { x: 0.70, y: 0.38, rx: 0.08, ry: 0.07, c: [25, 120, 180], a: 0.24 },
      { x: 0.22, y: 0.45, rx: 0.07, ry: 0.06, c: [160, 35, 150], a: 0.22 },
      { x: 0.80, y: 0.30, rx: 0.06, ry: 0.05, c: [50, 100, 200], a: 0.20 },
      { x: 0.45, y: 0.20, rx: 0.06, ry: 0.05, c: [200, 80, 130], a: 0.18 },
      { x: 0.55, y: 0.65, rx: 0.07, ry: 0.06, c: [65, 35, 160], a: 0.16 },
    ];

    for (var i = 0; i < clouds.length; i++) {
      drawCloud(c, clouds[i]);
    }
  }

  function drawCloud(c, cloud) {
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
    grad.addColorStop(0.15, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.85) + ')');
    grad.addColorStop(0.4, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.45) + ')');
    grad.addColorStop(0.7, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.12) + ')');
    grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');

    c.fillStyle = grad;
    c.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6);
    c.restore();
  }

  // ───────────────────────────────────────────
  //  LIGHT RAYS (offscreen, static base)
  // ───────────────────────────────────────────

  function renderStaticRays() {
    raysCanvas.width = W;
    raysCanvas.height = H;

    var c = raysCtx;
    c.clearRect(0, 0, W, H);

    var numRays = 48;
    var maxLen = Math.max(W, H) * 0.85;

    for (var i = 0; i < numRays; i++) {
      var angle = (i / numRays) * Math.PI * 2 + (Math.random() - 0.5) * 0.08;
      var length = maxLen * (0.4 + Math.random() * 0.6);
      var width = 0.8 + Math.random() * 2.5;
      var opacity = 0.01 + Math.random() * 0.035;

      // Alternate colors: purple, magenta, blue, cyan, pink
      var rayColors = [
        nebulaColors.violet, nebulaColors.magenta, nebulaColors.blue,
        nebulaColors.cyan, nebulaColors.hotPink, nebulaColors.deepPurple,
        nebulaColors.warmPink, nebulaColors.orange,
      ];
      var col = rayColors[i % rayColors.length];

      var ex = CX + Math.cos(angle) * length;
      var ey = CY + Math.sin(angle) * length;

      var grad = c.createLinearGradient(CX, CY, ex, ey);
      grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
      grad.addColorStop(0.1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (opacity * 0.5) + ')');
      grad.addColorStop(0.3, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + opacity + ')');
      grad.addColorStop(0.7, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (opacity * 0.6) + ')');
      grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');

      c.save();
      c.beginPath();
      c.moveTo(CX, CY);
      c.lineTo(ex, ey);
      c.strokeStyle = grad;
      c.lineWidth = width;
      c.lineCap = 'round';
      c.globalCompositeOperation = 'screen';
      c.stroke();
      c.restore();
    }
  }

  // ───────────────────────────────────────────
  //  STARFIELD (with depth layers)
  // ───────────────────────────────────────────

  function createStars() {
    var count = Math.min(Math.floor(W * H / 1600), 800);
    stars = [];

    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.5 ? 0 : depth < 0.8 ? 1 : depth < 0.95 ? 2 : 3;
      var sizes = [0.3, 0.7, 1.4, 2.4];
      var opacities = [0.15, 0.35, 0.6, 0.85];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      var y = Math.random() * H;
      var angle = Math.random() * Math.PI * 2;
      var spd = 0.01 + Math.random() * 0.04;

      stars.push({
        x: Math.random() * W,
        y: y,
        baseX: 0, baseY: 0,
        size: sizes[layer] + Math.random() * 0.4,
        baseOpacity: opacities[layer],
        twinkleSpeed: 0.001 + Math.random() * 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleAmt: layer < 2 ? 0.1 : 0.25 + Math.random() * 0.3,
        color: color,
        glow: layer >= 2,
        dx: Math.cos(angle) * spd,
        dy: Math.sin(angle) * spd,
        layer: layer,
      });
    }
    for (var k = 0; k < stars.length; k++) {
      stars[k].baseX = stars[k].x;
      stars[k].baseY = stars[k].y;
    }
  }

  // ───────────────────────────────────────────
  //  DEPTH PARTICLES (3D outward flow)
  // ───────────────────────────────────────────

  function createDepthParticles() {
    var count = Math.min(Math.floor(W * H / 8000), 150);
    depthParticles = [];

    for (var i = 0; i < count; i++) {
      depthParticles.push(newDepthParticle());
    }
  }

  function newDepthParticle() {
    var angle = Math.random() * Math.PI * 2;
    var dist = Math.random() * 0.15; // start near center
    var speed = 0.0002 + Math.random() * 0.0006;
    var palettes = [
      nebulaColors.violet, nebulaColors.magenta, nebulaColors.cyan,
      nebulaColors.blue, nebulaColors.hotPink, [255, 255, 255],
    ];
    var col = palettes[Math.floor(Math.random() * palettes.length)];

    return {
      angle: angle,
      dist: dist,
      speed: speed,
      maxDist: 0.6 + Math.random() * 0.5,
      size: 0.5 + Math.random() * 1.5,
      color: col,
      baseOpacity: 0.15 + Math.random() * 0.4,
      trail: 3 + Math.random() * 8,
    };
  }

  function drawDepthParticles() {
    for (var i = 0; i < depthParticles.length; i++) {
      var p = depthParticles[i];

      // Move outward from center
      p.dist += p.speed;

      // Reset when too far
      if (p.dist > p.maxDist) {
        depthParticles[i] = newDepthParticle();
        continue;
      }

      // Progress 0..1 through life
      var life = p.dist / p.maxDist;
      // Fade in then out
      var opacity = life < 0.15 ? life / 0.15 : 1 - Math.pow((life - 0.15) / 0.85, 2);
      opacity *= p.baseOpacity;
      if (opacity < 0.01) continue;

      // Size grows with distance (3D perspective)
      var size = p.size * (0.5 + life * 2);

      var px = CX + Math.cos(p.angle) * p.dist * Math.max(W, H);
      var py = CY + Math.sin(p.angle) * p.dist * Math.max(W, H);

      // Skip if offscreen
      if (px < -20 || px > W + 20 || py < -20 || py > H + 20) continue;

      // Trail line toward center
      var trailLen = p.trail * life;
      var tx = px - Math.cos(p.angle) * trailLen;
      var ty = py - Math.sin(p.angle) * trailLen;

      var col = p.color;

      if (trailLen > 1) {
        var grad = ctx.createLinearGradient(tx, ty, px, py);
        grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
        grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (opacity * 0.6) + ')');
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = grad;
        ctx.lineWidth = size * 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // Particle head
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + opacity + ')';
      ctx.fill();

      // Glow on larger particles
      if (size > 1.2) {
        var glowR = size * 3;
        var glow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        glow.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (opacity * 0.3) + ')');
        glow.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(px - glowR, py - glowR, glowR * 2, glowR * 2);
      }
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
      speed: 5 + Math.random() * 7,
      length: 100 + Math.random() * 150,
      life: 0,
      maxLife: 28 + Math.random() * 30,
      color: Math.random() > 0.5 ? [200, 180, 255] : [255, 180, 240],
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

      var grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
      grad.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      grad.addColorStop(0.5, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + (op * 0.9) + ')');

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();

      var hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14);
      hg.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.45) + ')');
      hg.addColorStop(1, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      ctx.fillStyle = hg;
      ctx.fillRect(s.x - 14, s.y - 14, 28, 28);
    }
  }

  // ───────────────────────────────────────────
  //  MAIN DRAW LOOP
  // ───────────────────────────────────────────

  function draw(time) {
    ctx.clearRect(0, 0, W, H);

    // 1. Nebula base layer (breathing)
    var baseBreath = reduced ? 0.6 : 0.5 + 0.15 * Math.sin(time * 0.00012);
    ctx.globalAlpha = baseBreath;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(nebulaCanvas, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // 2. Light rays (rotating slowly, pulsing)
    if (!reduced) {
      var rayRotation = time * 0.000008;
      var rayPulse = 0.5 + 0.5 * Math.sin(time * 0.0002);
      ctx.save();
      ctx.globalAlpha = 0.2 + rayPulse * 0.2;
      ctx.globalCompositeOperation = 'screen';
      ctx.translate(CX, CY);
      ctx.rotate(rayRotation);
      ctx.translate(-CX, -CY);
      ctx.drawImage(raysCanvas, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // Second ray layer, counter-rotating
      var rayPulse2 = 0.4 + 0.4 * Math.sin(time * 0.00025 + 2);
      ctx.save();
      ctx.globalAlpha = 0.12 + rayPulse2 * 0.15;
      ctx.globalCompositeOperation = 'screen';
      ctx.translate(CX, CY);
      ctx.rotate(-rayRotation * 1.3);
      ctx.translate(-CX, -CY);
      ctx.drawImage(raysCanvas, 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    // 3. Depth particles (3D outward flow)
    if (!reduced) {
      drawDepthParticles();
    }

    // 5. Stars
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      if (!reduced) {
        s.x = s.baseX
              + Math.sin(time * 0.00004 + s.twinklePhase) * (2 + s.layer * 1.5)
              + (time * s.dx * 0.0006);
        s.y = s.baseY
              + Math.cos(time * 0.00003 + s.twinklePhase) * (1.5 + s.layer)
              + (time * s.dy * 0.0006);

        if (s.x > W + 4) { s.x -= W + 8; s.baseX -= W + 8; }
        if (s.x < -4) { s.x += W + 8; s.baseX += W + 8; }
        if (s.y > H + 4) { s.y -= H + 8; s.baseY -= H + 8; }
        if (s.y < -4) { s.y += H + 8; s.baseY += H + 8; }
      }

      var op;
      if (reduced) {
        op = s.baseOpacity;
      } else {
        op = s.baseOpacity + Math.sin(time * s.twinkleSpeed + s.twinklePhase) * s.twinkleAmt;
        if (op < 0.05) op = 0.05;
        if (op > 1) op = 1;
      }

      var r = s.color[0], g = s.color[1], b = s.color[2];

      if (s.glow) {
        var gr = s.size * (s.layer === 3 ? 8 : 5);
        var glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, gr);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.3) + ')');
        glow.addColorStop(0.5, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.08) + ')');
        glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(s.x - gr, s.y - gr, gr * 2, gr * 2);
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
      ctx.fill();
    }

    // 6. Shooting stars
    if (!reduced) {
      drawShootingStars();
      if (Math.random() < 0.005) spawnShootingStar();
      requestAnimationFrame(draw);
    }
  }

  // ───────────────────────────────────────────
  //  RESIZE & INIT
  // ───────────────────────────────────────────

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    CX = W * 0.5;
    CY = H * 0.42; // slightly above center for visual balance

    renderStaticNebula();
    renderStaticRays();
    createStars();
    createDepthParticles();
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
