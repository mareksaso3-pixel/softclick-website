/**
 * Main JS: Sticky header, mobile menu, smooth scroll, FAQ accordion, contact form, stats counter.
 */
(function () {
  // ===== CALENDLY POPUP =====
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-calendly]');
    if (btn) {
      e.preventDefault();
      if (typeof Calendly !== 'undefined') {
        Calendly.initPopupWidget({ url: btn.getAttribute('data-calendly') });
      }
    }
  });

  // ===== STICKY HEADER =====
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ===== MOBILE MENU =====
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
      }
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== STATS COUNTER ANIMATION =====
  var COUNTER_DURATION = 3000;

  function animateCountUp(el) {
    var num = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var start = performance.now();

    function update(now) {
      var progress = Math.min((now - start) / COUNTER_DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.round(eased * num) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function animateCountDown(el) {
    var from = parseInt(el.getAttribute('data-countdown'), 10);
    var finalText = el.getAttribute('data-final');
    var start = performance.now();

    function update(now) {
      var progress = Math.min((now - start) / COUNTER_DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      if (progress >= 1) {
        el.textContent = finalText;
      } else {
        el.textContent = Math.round(from - eased * from);
      }
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var counters = entry.target.querySelectorAll('.stat-number[data-sync]');
        counters.forEach(function (el) {
          if (el.hasAttribute('data-countdown')) {
            animateCountDown(el);
          } else if (el.hasAttribute('data-count')) {
            animateCountUp(el);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ===== VIDEO CAROUSEL =====
  var slides = null;
  var current = 0;
  var videoCarousel = document.getElementById('videoCarousel');

  if (videoCarousel) {
    var track = document.getElementById('videoTrack');
    slides = track.querySelectorAll('.video-slide');
    var dots = document.querySelectorAll('.carousel-dot');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');

    function goTo(idx) {
      var prev = current;
      current = (idx + slides.length) % slides.length;
      var prevVideo = slides[prev].querySelector('video');
      if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots[prev].classList.remove('active');
      dots[current].classList.add('active');
      var nextVideo = slides[current].querySelector('video');
      if (nextVideo) nextVideo.play().catch(function () {});
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(parseInt(this.getAttribute('data-idx'), 10)); });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });

    var carouselObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var firstVideo = slides[0].querySelector('video');
          if (firstVideo) firstVideo.play().catch(function () {});
          carouselObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    carouselObserver.observe(videoCarousel);
  }

  // ===== VIDEO FULLSCREEN OVERLAY =====
  var overlay = document.getElementById('videoOverlay');
  var overlayPlayer = document.getElementById('videoOverlayPlayer');
  var overlayClose = document.getElementById('videoOverlayClose');
  var overlayPrevBtn = document.getElementById('overlayPrev');
  var overlayNextBtn = document.getElementById('overlayNext');
  var overlayDotEls = document.querySelectorAll('.overlay-dot');
  var overlayCurrentIdx = 0;
  var allSlides = document.querySelectorAll('.video-slide');

  function overlayGoTo(idx) {
    if (!overlayPlayer) return;
    overlayCurrentIdx = (idx + allSlides.length) % allSlides.length;
    var video = allSlides[overlayCurrentIdx] ? allSlides[overlayCurrentIdx].querySelector('video') : null;
    var src = video ? (video.getAttribute('src') || '') : '';
    if (!src) return;
    overlayDotEls.forEach(function (d, i) { d.classList.toggle('active', i === overlayCurrentIdx); });
    overlayPlayer.volume = 0.5;
    overlayPlayer.src = src;
    overlayPlayer.play().catch(function () {});
  }

  function openOverlay(slideIdx) {
    if (!overlay || !overlayPlayer) return;
    if (slides && slides[current]) slides[current].querySelector('video').pause();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlayGoTo(slideIdx);
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (overlayPlayer) { overlayPlayer.pause(); overlayPlayer.removeAttribute('src'); overlayPlayer.load(); }
    if (slides && slides[current]) {
      var v = slides[current].querySelector('video');
      if (v) v.play().catch(function () {});
    }
  }

  allSlides.forEach(function (slide, i) {
    slide.addEventListener('click', function () { openOverlay(i); });
  });

  if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
  if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
  if (overlayPrevBtn) overlayPrevBtn.addEventListener('click', function () { overlayGoTo(overlayCurrentIdx - 1); });
  if (overlayNextBtn) overlayNextBtn.addEventListener('click', function () { overlayGoTo(overlayCurrentIdx + 1); });
  overlayDotEls.forEach(function (dot) {
    dot.addEventListener('click', function () { overlayGoTo(parseInt(this.getAttribute('data-idx'), 10)); });
  });
  document.addEventListener('keydown', function (e) {
    if (!overlay || !overlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeOverlay();
    if (e.key === 'ArrowLeft') overlayGoTo(overlayCurrentIdx - 1);
    if (e.key === 'ArrowRight') overlayGoTo(overlayCurrentIdx + 1);
  });

  // ===== CONTACT FORM (Web3Forms) =====
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const status = contactForm.querySelector('.form-status');
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = I18n.t('js.sending');
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          status.textContent = I18n.t('js.success');
          status.className = 'form-status success';
          contactForm.reset();
        } else {
          throw new Error(I18n.t('js.sendFailed'));
        }
      } catch (err) {
        status.textContent = I18n.t('js.error');
        status.className = 'form-status error';
      }

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }
})();
