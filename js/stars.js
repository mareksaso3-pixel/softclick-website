/**
 * Deep Space Nebula — Textured HD
 *
 * Generates realistic nebula clouds from clusters of hundreds of
 * overlapping semi-transparent particles (not simple gradients).
 * This creates the "painted/watercolor" texture seen in real nebula photos.
 *
 * Architecture:
 *   - Seeded PRNG for consistent nebula across reloads
 *   - Offscreen canvas: textured nebula (rendered once on resize)
 *   - devicePixelRatio scaling for HiDPI
 *   - Main canvas: nebula composite + stars + shooting stars
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Seeded PRNG (mulberry32) for consistent nebula
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  var rng = mulberry32(42);

  // Offscreen canvases
  var nebulaCanvas = document.createElement('canvas');
  var nebulaCtx = nebulaCanvas.getContext('2d');
  var detailCanvas = document.createElement('canvas');
  var detailCtx = detailCanvas.getContext('2d');

  var stars = [];
  var shootingStars = [];
  var W, H, cW, cH;

  var starColors = [
    [225, 235, 255], [205, 220, 255], [190, 205, 255],
    [175, 190, 255], [155, 210, 250], [145, 235, 230],
    [255, 255, 255], [248, 245, 255], [215, 195, 255],
    [170, 228, 255], [190, 255, 248], [255, 254, 254],
  ];

  // ───────────────────────────────────────────
  //  TEXTURED CLOUD GENERATOR
  // ───────────────────────────────────────────

  /**
   * Generates a textured cloud zone from many overlapping particles.
   * @param {CanvasRenderingContext2D} c - target context
   * @param {number} cx - center x (canvas px)
   * @param {number} cy - center y (canvas px)
   * @param {number} spreadX - horizontal spread radius
   * @param {number} spreadY - vertical spread radius
   * @param {Array} color - [r, g, b]
   * @param {number} alpha - base alpha for particles
   * @param {number} count - number of particles
   * @param {number} minR - min particle radius
   * @param {number} maxR - max particle radius
   */
  function generateCloudZone(c, cx, cy, spreadX, spreadY, color, alpha, count, minR, maxR) {
    for (var i = 0; i < count; i++) {
      // Gaussian-ish distribution (box-muller lite using seeded rng)
      var u1 = rng(), u2 = rng();
      var g1 = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
      var g2 = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.sin(2 * Math.PI * u2);

      var px = cx + g1 * spreadX * 0.45;
      var py = cy + g2 * spreadY * 0.45;
      var r = minR + rng() * (maxR - minR);
      var a = alpha * (0.3 + rng() * 0.7);

      // Slight color variation
      var cr = Math.min(255, Math.max(0, color[0] + (rng() - 0.5) * 30));
      var cg = Math.min(255, Math.max(0, color[1] + (rng() - 0.5) * 20));
      var cb = Math.min(255, Math.max(0, color[2] + (rng() - 0.5) * 25));

      var grad = c.createRadialGradient(px, py, 0, px, py, r);
      grad.addColorStop(0, 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',' + a + ')');
      grad.addColorStop(0.3, 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',' + (a * 0.6) + ')');
      grad.addColorStop(0.7, 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',' + (a * 0.15) + ')');
      grad.addColorStop(1, 'rgba(' + (cr | 0) + ',' + (cg | 0) + ',' + (cb | 0) + ',0)');

      c.fillStyle = grad;
      c.beginPath();
      c.arc(px, py, r, 0, Math.PI * 2);
      c.fill();
    }
  }

  // ───────────────────────────────────────────
  //  RENDER NEBULA (offscreen, once per resize)
  // ───────────────────────────────────────────

  function renderNebula() {
    rng = mulberry32(42); // reset seed for consistency

    nebulaCanvas.width = cW;
    nebulaCanvas.height = cH;
    detailCanvas.width = cW;
    detailCanvas.height = cH;

    var nc = nebulaCtx;
    var dc = detailCtx;
    nc.clearRect(0, 0, cW, cH);
    dc.clearRect(0, 0, cW, cH);

    var baseR = Math.max(cW, cH);

    // === PASS 1: Deep base washes (nebulaCanvas, screen mode) ===
    nc.globalCompositeOperation = 'screen';

    // Large deep indigo-purple wash (covers most of canvas)
    generateCloudZone(nc,
      cW * 0.35, cH * 0.40,
      cW * 0.6, cH * 0.5,
      [20, 8, 80], 0.25, 80,
      baseR * 0.08, baseR * 0.25
    );

    // Dark blue wash (full canvas ambient)
    generateCloudZone(nc,
      cW * 0.50, cH * 0.50,
      cW * 0.7, cH * 0.6,
      [8, 15, 60], 0.18, 60,
      baseR * 0.1, baseR * 0.3
    );

    // === PASS 2: Main cloud masses (matching reference image) ===
    nc.globalCompositeOperation = 'screen';

    // PURPLE/VIOLET MASS — upper-center to right (dominant cloud)
    // Base layer
    generateCloudZone(nc,
      cW * 0.58, cH * 0.32,
      cW * 0.28, cH * 0.22,
      [90, 20, 160], 0.35, 120,
      baseR * 0.03, baseR * 0.14
    );
    // Brighter inner purple
    generateCloudZone(nc,
      cW * 0.62, cH * 0.28,
      cW * 0.18, cH * 0.15,
      [140, 50, 200], 0.40, 90,
      baseR * 0.02, baseR * 0.10
    );
    // Hot magenta highlights within purple cloud
    generateCloudZone(nc,
      cW * 0.65, cH * 0.25,
      cW * 0.12, cH * 0.10,
      [190, 80, 230], 0.45, 60,
      baseR * 0.015, baseR * 0.07
    );
    // Bright magenta-white core
    generateCloudZone(nc,
      cW * 0.63, cH * 0.27,
      cW * 0.06, cH * 0.05,
      [220, 160, 255], 0.55, 40,
      baseR * 0.01, baseR * 0.04
    );

    // BLUE MASS — lower-left (second dominant cloud)
    // Base blue
    generateCloudZone(nc,
      cW * 0.20, cH * 0.68,
      cW * 0.22, cH * 0.20,
      [20, 60, 180], 0.35, 110,
      baseR * 0.03, baseR * 0.13
    );
    // Brighter cyan-blue inner
    generateCloudZone(nc,
      cW * 0.18, cH * 0.72,
      cW * 0.15, cH * 0.13,
      [40, 110, 220], 0.40, 80,
      baseR * 0.02, baseR * 0.09
    );
    // Bright blue core
    generateCloudZone(nc,
      cW * 0.17, cH * 0.73,
      cW * 0.08, cH * 0.06,
      [80, 170, 255], 0.50, 50,
      baseR * 0.01, baseR * 0.05
    );

    // DEEP BLUE band across center
    generateCloudZone(nc,
      cW * 0.40, cH * 0.50,
      cW * 0.35, cH * 0.15,
      [15, 30, 130], 0.28, 90,
      baseR * 0.04, baseR * 0.15
    );

    // PURPLE wisps — upper-left area
    generateCloudZone(nc,
      cW * 0.15, cH * 0.25,
      cW * 0.18, cH * 0.18,
      [70, 20, 140], 0.28, 70,
      baseR * 0.03, baseR * 0.10
    );

    // VIOLET accent — right edge
    generateCloudZone(nc,
      cW * 0.88, cH * 0.45,
      cW * 0.14, cH * 0.25,
      [80, 15, 130], 0.22, 60,
      baseR * 0.03, baseR * 0.10
    );

    // BLUE-PURPLE lower-right
    generateCloudZone(nc,
      cW * 0.78, cH * 0.75,
      cW * 0.16, cH * 0.16,
      [30, 25, 120], 0.22, 50,
      baseR * 0.03, baseR * 0.10
    );

    // === PASS 3: Detail texture layer (detailCanvas) ===
    dc.globalCompositeOperation = 'screen';

    // Small bright specks within the purple mass (texture)
    generateCloudZone(dc,
      cW * 0.60, cH * 0.30,
      cW * 0.22, cH * 0.18,
      [160, 100, 240], 0.30, 150,
      baseR * 0.005, baseR * 0.025
    );

    // Small bright specks within the blue mass
    generateCloudZone(dc,
      cW * 0.19, cH * 0.70,
      cW * 0.16, cH * 0.14,
      [60, 140, 255], 0.28, 120,
      baseR * 0.005, baseR * 0.02
    );

    // Scattered dim particles everywhere (dust)
    generateCloudZone(dc,
      cW * 0.50, cH * 0.50,
      cW * 0.55, cH * 0.50,
      [50, 30, 100], 0.08, 200,
      baseR * 0.003, baseR * 0.015
    );

    // Edge wisps - purple haze top
    generateCloudZone(dc,
      cW * 0.45, cH * 0.08,
      cW * 0.35, cH * 0.10,
      [100, 40, 160], 0.18, 60,
      baseR * 0.015, baseR * 0.06
    );

    // Edge wisps - blue haze bottom
    generateCloudZone(dc,
      cW * 0.50, cH * 0.92,
      cW * 0.35, cH * 0.10,
      [15, 30, 100], 0.15, 50,
      baseR * 0.015, baseR * 0.06
    );

    // Additional nebula wisps connecting the two main clouds
    generateCloudZone(dc,
      cW * 0.38, cH * 0.50,
      cW * 0.20, cH * 0.15,
      [60, 30, 140], 0.18, 80,
      baseR * 0.01, baseR * 0.05
    );
  }

  // ───────────────────────────────────────────
  //  STARFIELD
  // ───────────────────────────────────────────

  function createStars() {
    var count = Math.min(Math.floor(W * H / 1100), 1200);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.45 ? 0 : depth < 0.75 ? 1 : depth < 0.93 ? 2 : 3;
      var sizes = [0.35, 0.7, 1.3, 2.2];
      var opacities = [0.18, 0.42, 0.72, 0.95];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      var y = Math.random() * H;
      if (Math.random() < 0.25) {
        y = H * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * H * 0.2;
      }

      var angle = Math.random() * Math.PI * 2;
      var spd = 0.01 + Math.random() * 0.04;

      stars.push({
        x: Math.random() * W, y: y,
        baseX: 0, baseY: 0,
        size: (sizes[layer] + Math.random() * 0.3) * dpr,
        baseOpacity: opacities[layer],
        twinkleSpeed: 0.0006 + Math.random() * 0.004,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleAmt: layer < 2 ? 0.06 : 0.18 + Math.random() * 0.25,
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

      ctx.beginPath();
      ctx.arc(sx, sy, 3 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();

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

    // === NEBULA BASE (textured clouds) ===
    var baseBreath = reduced ? 0.9 : 0.82 + 0.18 * Math.sin(time * 0.00012);
    var baseDx = reduced ? 0 : Math.sin(time * 0.000025) * 5 * dpr;
    var baseDy = reduced ? 0 : Math.cos(time * 0.00002) * 3 * dpr;
    ctx.globalAlpha = baseBreath;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(nebulaCanvas, baseDx, baseDy);

    // === DETAIL LAYER (texture, wisps, dust) ===
    var detBreath = reduced ? 0.85 : 0.6 + 0.4 * Math.sin(time * 0.0002 + 1.5);
    var detDx = reduced ? 0 : Math.sin(time * 0.00006 + 1) * 10 * dpr;
    var detDy = reduced ? 0 : Math.cos(time * 0.00005 + 0.8) * 7 * dpr;
    ctx.globalAlpha = detBreath;
    ctx.drawImage(detailCanvas, detDx, detDy);

    // Reset
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // === STARS ===
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      if (!reduced) {
        s.x = s.baseX
              + Math.sin(time * 0.00004 + s.twinklePhase) * (2 + s.layer * 1.5)
              + (time * s.dx * 0.0007);
        s.y = s.baseY
              + Math.cos(time * 0.00003 + s.twinklePhase) * (1.5 + s.layer)
              + (time * s.dy * 0.0007);

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
      var px = s.x * dpr, py = s.y * dpr;

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

    renderNebula();
    createStars();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 300);
  });

  resize();

  if (reduced) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
