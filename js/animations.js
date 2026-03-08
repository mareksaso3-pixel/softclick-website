/**
 * Scroll-triggered animations using IntersectionObserver.
 * Respects prefers-reduced-motion.
 */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show everything immediately
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.animate-on-scroll').forEach(function (el) {
    observer.observe(el);
  });

  // Parallax for hero orb (subtle)
  const heroOrb = document.querySelector('.hero-orb');
  if (heroOrb) {
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          const scrollY = window.scrollY;
          heroOrb.style.transform = 'translateY(' + scrollY * 0.15 + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
