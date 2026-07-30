/**
 * Cosmic Background — skutocna 3D perspektiva
 *
 * Hviezdy maju realne suradnice (x, y, z) a letia smerom ku kamere,
 * takze rastu, zrychluju a rozostupuju sa od stredu (uicaci bod).
 * Hmlovina je v troch hlbkovych vrstvach, kazda sa hybe inou rychlostou,
 * co dava priestoru objem.
 *
 * Vykon: ziadne createRadialGradient v kazdom snimku. Ziara hviezd sa
 * kresli z predpripravenych sprite obrazkov (drawImage), co je radovo
 * lacnejsie a nesekalo pri scrollovani.
 *
 * Respektuje prefers-reduced-motion.
 */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d', { alpha: true });
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var W, H, CX, CY;
  var stars = [];
  var shootingStars = [];
  var nebulaLayers = [];
  var glowSprites = {};

  // ── Perspektiva ────────────────────────────────────────────
  var FOCAL = 620;      // ohniskova vzdialenost, vyssie = uzsi zaber
  var Z_NEAR = 140;      // za tymto bodom hviezda "preleti" a znovu sa zrodi
  var Z_FAR = 1500;
  var STAR_MIN_SPEED = 9;
  var STAR_MAX_SPEED = 34;

  // ── Mys: posuva ubiehaci bod, tym sa cely priestor natoci ──
  var mx = 0, my = 0, tmx = 0, tmy = 0;
  if (!reduced) {
    window.addEventListener('mousemove', function (e) {
      tmx = (e.clientX / window.innerWidth - 0.5) * 2;
      tmy = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  var starColors = [
    [220, 230, 255], [200, 215, 255], [175, 195, 255],
    [255, 255, 255], [240, 235, 255], [255, 215, 250],
    [165, 220, 255], [225, 195, 255], [255, 200, 235],
  ];

  // ───────────────────────────────────────────
  //  PREDPRIPRAVENE SPRITY ZIARY (kreslia sa cez drawImage)
  // ───────────────────────────────────────────
  function buildGlowSprites() {
    glowSprites = {};
    for (var i = 0; i < starColors.length; i++) {
      var col = starColors[i];
      var size = 64;
      var cv = document.createElement('canvas');
      cv.width = cv.height = size;
      var c = cv.getContext('2d');
      var g = c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      var rgb = col[0] + ',' + col[1] + ',' + col[2];
      g.addColorStop(0.00, 'rgba(' + rgb + ',1)');
      g.addColorStop(0.18, 'rgba(' + rgb + ',0.55)');
      g.addColorStop(0.45, 'rgba(' + rgb + ',0.14)');
      g.addColorStop(1.00, 'rgba(' + rgb + ',0)');
      c.fillStyle = g;
      c.fillRect(0, 0, size, size);
      glowSprites[i] = cv;
    }
  }

  // ───────────────────────────────────────────
  //  HMLOVINA V TROCH HLBKOVYCH VRSTVACH
  // ───────────────────────────────────────────
  function drawCloud(c, cloud, w, h) {
    var cx = w * cloud.x, cy = h * cloud.y;
    var rx = w * cloud.rx, ry = h * cloud.ry;
    var r = Math.max(rx, ry);
    c.save();
    c.translate(cx, cy);
    c.scale(rx / r, ry / r);
    c.translate(-cx, -cy);
    var grad = c.createRadialGradient(cx, cy, 0, cx, cy, r);
    var col = cloud.c, a = cloud.a;
    var rgb = col[0] + ',' + col[1] + ',' + col[2];
    grad.addColorStop(0.00, 'rgba(' + rgb + ',' + a + ')');
    grad.addColorStop(0.15, 'rgba(' + rgb + ',' + (a * 0.85) + ')');
    grad.addColorStop(0.40, 'rgba(' + rgb + ',' + (a * 0.45) + ')');
    grad.addColorStop(0.70, 'rgba(' + rgb + ',' + (a * 0.12) + ')');
    grad.addColorStop(1.00, 'rgba(' + rgb + ',0)');
    c.fillStyle = grad;
    c.fillRect(cx - r * 1.3, cy - r * 1.3, r * 2.6, r * 2.6);
    c.restore();
  }

  function buildNebula() {
    // depth: 0 = najdalej (hybe sa najmenej), 2 = najblizsie
    var groups = [
      // Vzdialene pozadie, siroke masy
      { depth: 0, parallax: 10, scale: 1.10, clouds: [
        { x: 0.25, y: 0.38, rx: 0.38, ry: 0.32, c: [60, 10, 100], a: 0.22 },
        { x: 0.78, y: 0.35, rx: 0.33, ry: 0.30, c: [18, 45, 140], a: 0.18 },
        { x: 0.35, y: 0.72, rx: 0.30, ry: 0.24, c: [35, 18, 100], a: 0.15 },
        { x: 0.65, y: 0.68, rx: 0.27, ry: 0.22, c: [25, 40, 120], a: 0.12 },
      ]},
      // Stredna vrstva
      { depth: 1, parallax: 26, scale: 1.05, clouds: [
        { x: 0.18, y: 0.30, rx: 0.25, ry: 0.22, c: [120, 25, 140], a: 0.16 },
        { x: 0.12, y: 0.50, rx: 0.22, ry: 0.28, c: [90, 18, 120], a: 0.14 },
        { x: 0.85, y: 0.45, rx: 0.25, ry: 0.25, c: [12, 90, 150], a: 0.14 },
        { x: 0.72, y: 0.25, rx: 0.20, ry: 0.18, c: [35, 75, 180], a: 0.12 },
        { x: 0.40, y: 0.15, rx: 0.30, ry: 0.18, c: [120, 30, 120], a: 0.13 },
        { x: 0.60, y: 0.12, rx: 0.25, ry: 0.15, c: [140, 35, 110], a: 0.11 },
      ]},
      // Blizke jasne jadra, hybu sa najviac
      { depth: 2, parallax: 52, scale: 1.0, clouds: [
        { x: 0.30, y: 0.35, rx: 0.10, ry: 0.08, c: [140, 50, 200], a: 0.30 },
        { x: 0.70, y: 0.38, rx: 0.08, ry: 0.07, c: [25, 120, 180], a: 0.26 },
        { x: 0.22, y: 0.45, rx: 0.07, ry: 0.06, c: [160, 35, 150], a: 0.24 },
        { x: 0.80, y: 0.30, rx: 0.06, ry: 0.05, c: [50, 100, 200], a: 0.22 },
        { x: 0.45, y: 0.20, rx: 0.06, ry: 0.05, c: [200, 80, 130], a: 0.20 },
        { x: 0.55, y: 0.65, rx: 0.07, ry: 0.06, c: [65, 35, 160], a: 0.18 },
      ]},
    ];

    nebulaLayers = groups.map(function (g) {
      var lw = Math.ceil(W * g.scale), lh = Math.ceil(H * g.scale);
      var cv = document.createElement('canvas');
      cv.width = lw; cv.height = lh;
      var c = cv.getContext('2d');
      c.globalCompositeOperation = 'screen';
      for (var i = 0; i < g.clouds.length; i++) drawCloud(c, g.clouds[i], lw, lh);
      return { canvas: cv, parallax: g.parallax, w: lw, h: lh };
    });
  }

  // ───────────────────────────────────────────
  //  3D HVIEZDNE POLE
  // ───────────────────────────────────────────
  function newStar(atFar) {
    var z = atFar ? Z_FAR - Math.random() * 120
                  : Z_NEAR + Math.random() * (Z_FAR - Z_NEAR);
    // Rozptyl rastie s hlbkou, takze hviezdy pokryvaju obrazovku rovnomerne
    // v kazdej vzdialenosti (inak by blizke skoro vsetky ulietli mimo zaber).
    var k = z / Z_FAR;
    var spreadX = W * 1.25 * k, spreadY = H * 1.25 * k;
    return {
      x: (Math.random() * 2 - 1) * spreadX,
      y: (Math.random() * 2 - 1) * spreadY,
      z: z,
      speed: STAR_MIN_SPEED + Math.random() * (STAR_MAX_SPEED - STAR_MIN_SPEED),
      size: 0.55 + Math.random() * 1.5,
      ci: Math.floor(Math.random() * starColors.length),
      tw: Math.random() * Math.PI * 2,          // faza blikania
      tws: 0.6 + Math.random() * 1.8,           // rychlost blikania
      glow: Math.random() < 0.34,               // len cast ma ziaru (vykon)
    };
  }

  function createStars() {
    var count = Math.min(Math.round(W * H / 1500), 900);
    stars = [];
    for (var i = 0; i < count; i++) stars.push(newStar(false));
  }

  // ───────────────────────────────────────────
  //  PADAJUCE HVIEZDY
  // ───────────────────────────────────────────
  function spawnShootingStar() {
    if (shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * W * 0.7 + W * 0.1,
      y: Math.random() * H * 0.35,
      angle: Math.PI / 5 + Math.random() * Math.PI / 5,
      speed: 2.2 + Math.random() * 3,
      length: 100 + Math.random() * 150,
      life: 0,
      maxLife: 60 + Math.random() * 55,
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
      var g = ctx.createLinearGradient(tx, ty, s.x, s.y);
      var rgb = s.color[0] + ',' + s.color[1] + ',' + s.color[2];
      g.addColorStop(0, 'rgba(' + rgb + ',0)');
      g.addColorStop(0.5, 'rgba(' + rgb + ',' + (op * 0.3) + ')');
      g.addColorStop(1, 'rgba(255,255,255,' + (op * 0.9) + ')');
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + op + ')';
      ctx.fill();
    }
  }

  // ───────────────────────────────────────────
  //  HLAVNA SLUCKA
  // ───────────────────────────────────────────
  var lastTs = 0;

  function draw(ts) {
    var dt = lastTs ? Math.min((ts - lastTs) / 1000, 0.08) : 0.016;
    lastTs = ts;

    // mekke dobiehanie mysi
    mx += (tmx - mx) * 0.045;
    my += (tmy - my) * 0.045;

    ctx.clearRect(0, 0, W, H);

    // 1) Hmlovina po vrstvach, kazda s inym posunom = hlbka
    ctx.globalCompositeOperation = 'screen';
    var breath = reduced ? 0.95 : 0.88 + 0.12 * Math.sin(ts * 0.00011);
    for (var n = 0; n < nebulaLayers.length; n++) {
      var L = nebulaLayers[n];
      ctx.globalAlpha = breath;
      ctx.drawImage(
        L.canvas,
        (W - L.w) / 2 - mx * L.parallax,
        (H - L.h) / 2 - my * L.parallax
      );
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // 2) Ubiehaci bod sa posuva s mysou => cely priestor sa natoci
    var vpx = CX + mx * 90;
    var vpy = CY + my * 70;

    // 3) Hviezdy v perspektive
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      if (!reduced) {
        s.z -= s.speed * dt * 3;
        if (s.z <= Z_NEAR) { stars[i] = newStar(true); continue; }
      }

      var p = FOCAL / s.z;                 // perspektivny faktor
      var sx = vpx + s.x * p;
      var sy = vpy + s.y * p;

      // mimo obrazovky -> preskocit (lacne)
      if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

      // velkost aj jas rastu ako sa hviezda priblizuje
      var depth = 1 - (s.z - Z_NEAR) / (Z_FAR - Z_NEAR);   // 0 daleko .. 1 blizko
      var r = s.size * p * 1.35;
      if (r < 0.25) continue;
      if (r > 3.2) r = 3.2;

      var alpha = 0.12 + depth * 0.88;
      if (!reduced) alpha *= 0.78 + 0.22 * Math.sin(ts * 0.001 * s.tws + s.tw);
      if (alpha <= 0.02) continue;

      // ziara zo sprite (bez gradientu v kazdom snimku)
      if (s.glow && depth > 0.35) {
        var gr = r * 9;
        ctx.globalAlpha = alpha * 0.5;
        ctx.drawImage(glowSprites[s.ci], sx - gr, sy - gr, gr * 2, gr * 2);
      }

      var col = starColors[s.ci];
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'rgb(' + col[0] + ',' + col[1] + ',' + col[2] + ')';
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';

    // 4) Padajuce hviezdy
    if (!reduced) {
      drawShootingStars();
      if (Math.random() < 0.004) spawnShootingStar();
      requestAnimationFrame(draw);
    }
  }

  // ───────────────────────────────────────────
  //  RESIZE + START
  // ───────────────────────────────────────────
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    CX = W * 0.5;
    CY = H * 0.44;
    buildNebula();
    createStars();
  }

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(resize, 250);
  });

  buildGlowSprites();
  resize();

  if (reduced) draw(0);
  else requestAnimationFrame(draw);
})();
