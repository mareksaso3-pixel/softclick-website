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

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on Escape
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

      // Close all
      document.querySelectorAll('.faq-item.active').forEach(function (openItem) {
        openItem.classList.remove('active');
        openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ===== STATS COUNTER ANIMATION =====
  var COUNTER_DURATION = 3000; // all counters finish together in 3s

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

  // Observe stats - all start together so they finish together
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
  var videoCarousel = document.getElementById('videoCarousel');
  if (videoCarousel) {
    var track       = document.getElementById('videoTrack');
    var slides      = track ? track.querySelectorAll('.video-slide') : [];
    var dots        = document.querySelectorAll('.carousel-dot');
    var prevBtn     = document.getElementById('carouselPrev');
    var nextBtn     = document.getElementById('carouselNext');
    var current     = 0;

    // Blob cache – pre-fetch videos into memory for stutter-free fullscreen
    var blobCache = {};
    function fetchBlob(src) {
      if (!src) return Promise.reject();
      if (blobCache[src]) return Promise.resolve(blobCache[src]);
      return fetch(src)
        .then(function (r) { return r.blob(); })
        .then(function (b) { var u = URL.createObjectURL(b); blobCache[src] = u; return u; });
    }

    function goTo(idx) {
      var prev = current;
      current = (idx + slides.length) % slides.length;
      var prevVid = slides[prev].querySelector('video');
      if (prevVid) { prevVid.pause(); prevVid.currentTime = 0; }
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      var nextVid = slides[current].querySelector('video');
      if (nextVid) nextVid.play().catch(function () {});
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function () { goTo(+this.getAttribute('data-idx')); });
    });

    // Autoplay when carousel enters viewport; pre-fetch blobs in background
    var carouselObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        var first = slides[0] && slides[0].querySelector('video');
        if (first) first.play().catch(function () {});
        slides.forEach(function (s) {
          var v = s.querySelector('video');
          if (v) fetchBlob(v.getAttribute('src') || '').catch(function () {});
        });
        carouselObserver.unobserve(videoCarousel);
      }
    }, { threshold: 0.3 });
    carouselObserver.observe(videoCarousel);

    // ===== FULLSCREEN OVERLAY =====
    var overlay       = document.getElementById('videoOverlay');
    var overlayPlayer = document.getElementById('videoOverlayPlayer');
    var overlayClose  = document.getElementById('videoOverlayClose');
    var overlayPrev   = document.getElementById('overlayPrev');
    var overlayNext   = document.getElementById('overlayNext');
    var overlayDots   = document.querySelectorAll('.overlay-dot');
    var allSlides     = document.querySelectorAll('.video-slide');
    var overlayIdx    = 0;

    function overlayGoTo(idx) {
      if (!overlayPlayer) return;
      overlayIdx = (idx + allSlides.length) % allSlides.length;
      var v = allSlides[overlayIdx] && allSlides[overlayIdx].querySelector('video');
      if (!v) return;
      var rel = v.getAttribute('src') || '';
      overlayDots.forEach(function (d, i) { d.classList.toggle('active', i === overlayIdx); });
      overlayPlayer.volume = 0.08;
      var cached = blobCache[rel];
      if (cached) {
        overlayPlayer.src = cached;
        overlayPlayer.play().catch(function () {});
      } else {
        overlayPlayer.src = v.src; // absolute URL resolved by browser
        overlayPlayer.load();
        overlayPlayer.addEventListener('canplay', function h() {
          overlayPlayer.removeEventListener('canplay', h);
          overlayPlayer.play().catch(function () {});
        });
        fetchBlob(rel).then(function () {}).catch(function () {});
      }
    }

    function openOverlay(idx) {
      if (!overlay) return;
      var cv = slides[current] && slides[current].querySelector('video');
      if (cv) cv.pause();
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      overlayGoTo(idx);
    }

    function closeOverlay() {
      if (!overlay) return;
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (overlayPlayer) { overlayPlayer.pause(); overlayPlayer.removeAttribute('src'); overlayPlayer.load(); }
      var cv = slides[current] && slides[current].querySelector('video');
      if (cv) cv.play().catch(function () {});
    }

    allSlides.forEach(function (s, i) {
      s.addEventListener('click', function () { openOverlay(i); });
    });
    if (overlayClose) overlayClose.addEventListener('click', closeOverlay);
    if (overlay) overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    if (overlayPrev) overlayPrev.addEventListener('click', function () { overlayGoTo(overlayIdx - 1); });
    if (overlayNext) overlayNext.addEventListener('click', function () { overlayGoTo(overlayIdx + 1); });
    overlayDots.forEach(function (d) {
      d.addEventListener('click', function () { overlayGoTo(+this.getAttribute('data-idx')); });
    });
    document.addEventListener('keydown', function (e) {
      if (!overlay || !overlay.classList.contains('active')) return;
      if (e.key === 'Escape') closeOverlay();
      if (e.key === 'ArrowLeft') overlayGoTo(overlayIdx - 1);
      if (e.key === 'ArrowRight') overlayGoTo(overlayIdx + 1);
    });
  }

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
