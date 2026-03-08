/**
 * Deep Space Aurora Background
 * - Multi-layer starfield with depth (parallax-like size/brightness)
 * - Twinkling stars with color variation (white, blue, violet, teal, green)
 * - Occasional shooting stars
 * - Soft nebula glow patches
 * Respects prefers-reduced-motion.
 */
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let shootingStars = [];
  let nebulaPatches = [];
  let width, height;

  // Aurora star color palette
  var starColors = [
    [200, 220, 255],  // cool white
    [180, 200, 255],  // ice blue
    [160, 180, 255],  // soft blue
    [190, 170, 255],  // lavender
    [130, 220, 230],  // teal hint
    [170, 240, 210],  // aurora green hint
    [255, 255, 255],  // pure white
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
    createNebula();
  }

  function createStars() {
    var count = Math.min(Math.floor(width * height / 4000), 350);
    stars = [];
    for (var i = 0; i < count; i++) {
      var depth = Math.random();
      var layer = depth < 0.6 ? 0 : depth < 0.9 ? 1 : 2;
      var sizes = [0.4, 0.9, 1.6];
      var opacities = [0.25, 0.45, 0.7];
      var color = starColors[Math.floor(Math.random() * starColors.length)];

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: sizes[layer] + Math.random() * 0.4,
        baseOpacity: opacities[layer] + Math.random() * 0.15,
        opacity: 0,
        twinkleSpeed: 0.001 + Math.random() * 0.006,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: color,
        hasGlow: layer === 2 && Math.random() > 0.5,
      });
    }
  }

  function createNebula() {
    nebulaPatches = [
      { x: width * 0.15, y: height * 0.2, r: Math.max(width, height) * 0.2, color: [52, 211, 153], alpha: 0.012, phase: 0 },
      { x: width * 0.75, y: height * 0.15, r: Math.max(width, height) * 0.18, color: [124, 92, 255], alpha: 0.015, phase: 2 },
      { x: width * 0.5, y: height * 0.65, r: Math.max(width, height) * 0.22, color: [6, 182, 212], alpha: 0.01, phase: 4 },
      { x: width * 0.85, y: height * 0.7, r: Math.max(width, height) * 0.14, color: [52, 211, 153], alpha: 0.008, phase: 1 },
      { x: width * 0.3, y: height * 0.85, r: Math.max(width, height) * 0.16, color: [124, 92, 255], alpha: 0.01, phase: 3 },
    ];
  }

  function spawnShootingStar() {
    if (shootingStars.length >= 2) return;
    shootingStars.push({
      x: Math.random() * width * 0.8,
      y: Math.random() * height * 0.4,
      angle: Math.PI / 6 + Math.random() * Math.PI / 6,
      speed: 4 + Math.random() * 4,
      length: 60 + Math.random() * 80,
      opacity: 1,
      life: 0,
      maxLife: 40 + Math.random() * 30,
      color: Math.random() > 0.5 ? [180, 240, 220] : [180, 190, 255],
    });
  }

  function drawNebula(time) {
    for (var i = 0; i < nebulaPatches.length; i++) {
      var p = nebulaPatches[i];
      var breathe = prefersReducedMotion ? 1 : 0.7 + 0.3 * Math.sin(time * 0.0003 + p.phase);
      var alpha = p.alpha * breathe;

      var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      gradient.addColorStop(0, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + alpha + ')');
      gradient.addColorStop(0.5, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',' + (alpha * 0.3) + ')');
      gradient.addColorStop(1, 'rgba(' + p.color[0] + ',' + p.color[1] + ',' + p.color[2] + ',0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
    }
  }

  function drawStars(time) {
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      if (prefersReducedMotion) {
        star.opacity = star.baseOpacity;
      } else {
        star.opacity = star.baseOpacity + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.25;
        if (star.opacity < 0.05) star.opacity = 0.05;
        if (star.opacity > 1) star.opacity = 1;
      }

      var r = star.color[0], g = star.color[1], b = star.color[2];

      // Glow halo for bright stars
      if (star.hasGlow && !prefersReducedMotion) {
        var glowR = star.size * 5;
        var glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
        glow.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + (star.opacity * 0.12) + ')');
        glow.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
        ctx.fillStyle = glow;
        ctx.fillRect(star.x - glowR, star.y - glowR, glowR * 2, glowR * 2);
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + star.opacity + ')';
      ctx.fill();
    }
  }

  function drawShootingStars() {
    for (var i = shootingStars.length - 1; i >= 0; i--) {
      var s = shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life++;

      var progress = s.life / s.maxLife;
      s.opacity = progress < 0.1 ? progress * 10 : 1 - (progress - 0.1) / 0.9;
      if (s.opacity < 0) s.opacity = 0;

      if (s.life >= s.maxLife || s.x > width + 100 || s.y > height + 100) {
        shootingStars.splice(i, 1);
        continue;
      }

      var tailX = s.x - Math.cos(s.angle) * s.length;
      var tailY = s.y - Math.sin(s.angle) * s.length;

      var grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',0)');
      grad.addColorStop(0.7, 'rgba(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ',' + (s.opacity * 0.4) + ')');
      grad.addColorStop(1, 'rgba(255,255,255,' + (s.opacity * 0.8) + ')');

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright head dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + s.opacity + ')';
      ctx.fill();
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    drawNebula(time);
    drawStars(time);

    if (!prefersReducedMotion) {
      drawShootingStars();
      if (Math.random() < 0.003) {
        spawnShootingStar();
      }
      requestAnimationFrame(draw);
    }
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();

  if (prefersReducedMotion) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();
