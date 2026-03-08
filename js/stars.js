/**
 * Deep Space Nebula — Ultra HD
 *
 * Key quality features:
 *   - devicePixelRatio scaling (crisp on retina/HiDPI)
 *   - 3 depth layers of nebula (far → mid → near) with different blur
 *   - Procedural noise texture for dusty nebula grain
 *   - 35+ nebula cloud patches across all layers
 *   - Stars with glow halos, twinkle, slow drift
 *   - Shooting stars
 *
 * Architecture:
 *   - 3 offscreen canvases (far, mid, near nebula) rendered once on resize
 *   - 1 noise texture canvas (static grain)
 *   - Main canvas composites everything each frame with breathing animation
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Offscreen canvases for 3 depth layers
  var farCanvas = document.createElement('canvas');
  var farCtx = farCanvas.getContext('2d');
  var midCanvas = document.createElement('canvas');
  var midCtx = midCanvas.getContext('2d');
  var nearCanvas = document.createElement('canvas');
  var nearCtx = nearCanvas.getContext('2d');
  var noiseCanvas = document.createElement('canvas');
  var noiseCtx = noiseCanvas.getContext('2d');

  var stars = [];
  var shootingStars = [];
  var W, H, cW, cH; // logical vs canvas (pixel) dimensions

  var starColors = [
    [220, 232, 255], [200, 218, 255], [185, 200, 255],
    [170, 188, 255], [150, 205, 248], [140, 232, 228],
    [255, 255, 255], [245, 240, 255], [210, 190, 255],
    [165, 225, 255], [185, 255, 245], [255, 252, 252],
  ];

  // ───────────────────────────────────────────
  //  NEBULA CLOUD RENDERER
  // ───────────────────────────────────────────

  function drawCloud(c, cx, cy, rx, ry, col, alpha, stops) {
    var r = Math.max(rx, ry);
    c.save();
    c.translate(cx, cy);
    c.scale(rx / r, ry / r);
    c.translate(-cx, -cy);

    var grad = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    if (stops) {
      for (var i = 0; i < stops.length; i++) {
        var s = stops[i];
        grad.addColorStop(s[0], 'rgba(' + s[1] + ',' + s[2] + ',' + s[3] + ',' + (alpha * s[4]) + ')');
      }
    } else {
      grad.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + alpha + ')');
      grad.addColorStop(0.15, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (alpha * 0.85) + ')');
      grad.addColorStop(0.35, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (alpha * 0.5) + ')');
      grad.addColorStop(0.6, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (alpha * 0.18) + ')');
      grad.addColorStop(0.85, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (alpha * 0.04) + ')');
      grad.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
    }
    c.fillStyle = grad;
    c.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6);
    c.restore();
  }

  // ───────────────────────────────────────────
  //  FAR LAYER (deepest, most blurred feel - large washes)
  // ───────────────────────────────────────────

  function renderFarLayer() {
    farCanvas.width = cW;
    farCanvas.height = cH;
    var c = farCtx;
    c.clearRect(0, 0, cW, cH);
    c.globalCompositeOperation = 'screen';

    var clouds = [
      // Massive deep indigo wash
      { x: 0.20, y: 0.25, rx: 0.55, ry: 0.45, col: [18, 8, 70], a: 0.55 },
      // Large purple haze
      { x: 0.75, y: 0.20, rx: 0.45, ry: 0.40, col: [80, 15, 110], a: 0.45 },
      // Deep blue center band
      { x: 0.50, y: 0.48, rx: 0.60, ry: 0.35, col: [10, 40, 120], a: 0.40 },
      // Violet bottom-left
      { x: 0.12, y: 0.68, rx: 0.42, ry: 0.38, col: [50, 10, 110], a: 0.38 },
      // Dark blue bottom-right
      { x: 0.82, y: 0.65, rx: 0.38, ry: 0.35, col: [8, 55, 120], a: 0.32 },
      // Purple top band
      { x: 0.48, y: 0.05, rx: 0.50, ry: 0.28, col: [60, 12, 120], a: 0.35 },
      // Bottom center dark
      { x: 0.50, y: 0.90, rx: 0.55, ry: 0.30, col: [12, 8, 60], a: 0.30 },
    ];

    for (var i = 0; i < clouds.length; i++) {
      var cl = clouds[i];
      drawCloud(c, cW * cl.x, cH * cl.y, cW * cl.rx, cH * cl.ry, cl.col, cl.a);
    }
  }

  // ───────────────────────────────────────────
  //  MID LAYER (medium depth, vivid colors)
  // ───────────────────────────────────────────

  function renderMidLayer() {
    midCanvas.width = cW;
    midCanvas.height = cH;
    var c = midCtx;
    c.clearRect(0, 0, cW, cH);
    c.globalCompositeOperation = 'screen';

    var clouds = [
      // Bright magenta bloom upper-right
      { x: 0.70, y: 0.18, rx: 0.25, ry: 0.22, col: [160, 35, 190], a: 0.50 },
      // Vivid purple cluster left
      { x: 0.22, y: 0.32, rx: 0.22, ry: 0.20, col: [120, 40, 210], a: 0.45 },
      // Cyan accent center-left
      { x: 0.32, y: 0.52, rx: 0.25, ry: 0.18, col: [15, 130, 200], a: 0.40 },
      // Blue glow lower-center
      { x: 0.55, y: 0.72, rx: 0.28, ry: 0.20, col: [25, 70, 190], a: 0.38 },
      // Magenta wisp far-right
      { x: 0.90, y: 0.38, rx: 0.18, ry: 0.22, col: [150, 25, 170], a: 0.35 },
      // Blue upper-left
      { x: 0.08, y: 0.15, rx: 0.22, ry: 0.18, col: [15, 35, 170], a: 0.38 },
      // Purple-pink center
      { x: 0.48, y: 0.35, rx: 0.20, ry: 0.16, col: [100, 30, 180], a: 0.35 },
      // Teal lower-left
      { x: 0.18, y: 0.78, rx: 0.20, ry: 0.15, col: [10, 120, 160], a: 0.30 },
      // Violet upper-center
      { x: 0.55, y: 0.10, rx: 0.18, ry: 0.14, col: [130, 30, 180], a: 0.32 },
      // Blue-indigo right
      { x: 0.85, y: 0.58, rx: 0.18, ry: 0.16, col: [20, 50, 160], a: 0.30 },
    ];

    for (var i = 0; i < clouds.length; i++) {
      var cl = clouds[i];
      drawCloud(c, cW * cl.x, cH * cl.y, cW * cl.rx, cH * cl.ry, cl.col, cl.a);
    }
  }

  // ───────────────────────────────────────────
  //  NEAR LAYER (foreground, sharpest, brightest cores)
  // ───────────────────────────────────────────

  function renderNearLayer() {
    nearCanvas.width = cW;
    nearCanvas.height = cH;
    var c = nearCtx;
    c.clearRect(0, 0, cW, cH);
    c.globalCompositeOperation = 'screen';

    var cores = [
      // Bright violet-white core
      { x: 0.28, y: 0.28, rx: 0.10, ry: 0.08, col: [150, 100, 255], a: 0.60 },
      // Hot magenta core
      { x: 0.68, y: 0.22, rx: 0.09, ry: 0.07, col: [200, 70, 230], a: 0.55 },
      // Cyan-blue core
      { x: 0.42, y: 0.50, rx: 0.10, ry: 0.08, col: [40, 140, 240], a: 0.50 },
      // Blue-white core
      { x: 0.80, y: 0.55, rx: 0.07, ry: 0.06, col: [80, 150, 255], a: 0.45 },
      // Purple core left
      { x: 0.15, y: 0.50, rx: 0.08, ry: 0.07, col: [120, 50, 220], a: 0.48 },
      // Magenta spot top-center
      { x: 0.52, y: 0.12, rx: 0.07, ry: 0.06, col: [180, 60, 210], a: 0.42 },
      // Teal spot bottom
      { x: 0.38, y: 0.75, rx: 0.08, ry: 0.06, col: [30, 180, 210], a: 0.40 },
      // Violet spot bottom-right
      { x: 0.72, y: 0.70, rx: 0.07, ry: 0.06, col: [110, 40, 200], a: 0.38 },

      // Extra bright tiny cores (nebula "hearts")
      { x: 0.30, y: 0.30, rx: 0.04, ry: 0.03, col: [200, 170, 255], a: 0.70 },
      { x: 0.66, y: 0.24, rx: 0.035, ry: 0.025, col: [230, 140, 255], a: 0.65 },
      { x: 0.44, y: 0.48, rx: 0.04, ry: 0.03, col: [120, 200, 255], a: 0.55 },
      { x: 0.16, y: 0.48, rx: 0.03, ry: 0.025, col: [170, 120, 255], a: 0.50 },
    ];

    for (var i = 0; i < cores.length; i++) {
      var cl = cores[i];
      drawCloud(c, cW * cl.x, cH * cl.y, cW * cl.rx, cH * cl.ry, cl.col, cl.a);
    }
  }

  // ───────────────────────────────────────────
  //  NOISE TEXTURE (dusty grain)
  // ───────────────────────────────────────────

  function renderNoise() {
    // Use lower res for noise (perf) then scale up
    var nw = Math.floor(W / 2);
    var nh = Math.floor(H / 2);
    noiseCanvas.width = nw;
    noiseCanvas.height = nh;
    var c = noiseCtx;
    var imgData = c.createImageData(nw, nh);
    var d = imgData.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = Math.random() * 255;
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      // Very subtle alpha - just enough for grain texture
      d[i + 3] = Math.random() < 0.4 ? Math.floor(Math.random() * 12) : 0;
    }
    c.putImageData(imgData, 0, 0);
  }

  // ───────────────────────────────────────────
  //  STARFIELD
  // ───────────────────────────────────────────

  function createStars() {
    var count = Math.min(Math.floor(W * H / 1200), 1100);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.45 ? 0 : depth < 0.75 ? 1 : depth < 0.92 ? 2 : 3;
      var sizes = [0.4, 0.8, 1.4, 2.4];
      var opacities = [0.2, 0.45, 0.7, 0.95];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      var y = Math.random() * H;
      if (Math.random() < 0.3) {
        y = H * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * H * 0.2;
      }

      var angle = Math.random() * Math.PI * 2;
      var spd = 0.012 + Math.random() * 0.05;

      stars.push({
        x: Math.random() * W, y: y,
        baseX: 0, baseY: 0,
        size: (sizes[layer] + Math.random() * 0.4) * dpr,
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
      length: 90 + Math.random() * 140,
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

      // Convert to canvas coords
      var sx = s.x * dpr, sy = s.y * dpr;
      var tx = (s.x - Math.cos(s.angle) * s.length) * dpr;
      var ty = (s.y - Math.sin(s.angle) * s.length) * dpr;

      var grad = ctx.createLinearGradient(tx, ty, sx, sy);
      grad.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      grad.addColorStop(0.5, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.3) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + (op * 0.9) + ')');

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2 * dpr;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright head
      ctx.beginPath();
      ctx.arc(sx, sy, 3 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();

      // Head glow
      var glowR = 14 * dpr;
      var hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowR);
      hg.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (op * 0.5) + ')');
      hg.addColorStop(1, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      ctx.fillStyle = hg;
      ctx.fillRect(sx - glowR, sy - glowR, glowR * 2, glowR * 2);
    }
  }

  // ───────────────────────────────────────────
  //  MAIN DRAW LOOP
  // ───────────────────────────────────────────

  function draw(time) {
    ctx.clearRect(0, 0, cW, cH);

    // === FAR NEBULA (deepest, slow breathe) ===
    var farBreath = reduced ? 0.85 : 0.75 + 0.25 * Math.sin(time * 0.00012);
    var farDx = reduced ? 0 : Math.sin(time * 0.00003) * 6 * dpr;
    var farDy = reduced ? 0 : Math.cos(time * 0.000025) * 4 * dpr;
    ctx.globalAlpha = farBreath;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(farCanvas, farDx, farDy);

    // === MID NEBULA (medium depth, medium breathe) ===
    var midBreath = reduced ? 0.8 : 0.6 + 0.4 * Math.sin(time * 0.00018 + 1.2);
    var midDx = reduced ? 0 : Math.sin(time * 0.00005 + 1) * 10 * dpr;
    var midDy = reduced ? 0 : Math.cos(time * 0.00004 + 0.8) * 8 * dpr;
    ctx.globalAlpha = midBreath;
    ctx.drawImage(midCanvas, midDx, midDy);

    // === NEAR NEBULA (foreground, bright cores, faster breathe) ===
    var nearBreath = reduced ? 0.75 : 0.5 + 0.5 * Math.sin(time * 0.00025 + 2.5);
    var nearDx = reduced ? 0 : Math.sin(time * 0.00007 + 2) * 14 * dpr;
    var nearDy = reduced ? 0 : Math.cos(time * 0.00006 + 1.5) * 10 * dpr;
    ctx.globalAlpha = nearBreath;
    ctx.drawImage(nearCanvas, nearDx, nearDy);

    // === NOISE TEXTURE (subtle grain overlay) ===
    ctx.globalAlpha = reduced ? 0.15 : 0.12 + 0.08 * Math.sin(time * 0.0003);
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(noiseCanvas, 0, 0, cW, cH);

    // Reset composite
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // === STARS ===
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
      var px = s.x * dpr, py = s.y * dpr;

      // Glow halo for brighter stars
      if (s.glow) {
        var gr = s.size * (s.layer === 3 ? 8 : 5);
        var glow = ctx.createRadialGradient(px, py, 0, px, py, gr);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.3) + ')');
        glow.addColorStop(0.4, 'rgba(' + r + ',' + g + ',' + b + ',' + (op * 0.08) + ')');
        glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(px - gr, py - gr, gr * 2, gr * 2);
      }

      ctx.beginPath();
      ctx.arc(px, py, s.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + op + ')';
      ctx.fill();
    }

    // === SHOOTING STARS ===
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
    W = window.innerWidth;
    H = window.innerHeight;
    cW = Math.floor(W * dpr);
    cH = Math.floor(H * dpr);
    canvas.width = cW;
    canvas.height = cH;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    renderFarLayer();
    renderMidLayer();
    renderNearLayer();
    renderNoise();
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
