/**
 * Cosmic star background with twinkle animation.
 * Renders on a fixed canvas behind all content.
 * Respects prefers-reduced-motion.
 */
(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let stars = [];
  let width, height;
  let animationId;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    const density = Math.min(width * height / 6000, 250);
    stars = [];
    for (let i = 0; i < density; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.3,
        baseOpacity: Math.random() * 0.5 + 0.1,
        opacity: 0,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      if (prefersReducedMotion) {
        star.opacity = star.baseOpacity;
      } else {
        star.opacity = star.baseOpacity + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.2;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${Math.max(0, star.opacity)})`;
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      animationId = requestAnimationFrame(draw);
    }
  }

  // Throttled resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();

  if (prefersReducedMotion) {
    draw(0);
  } else {
    animationId = requestAnimationFrame(draw);
  }
})();
