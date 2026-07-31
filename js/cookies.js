/**
 * Cookie lista + suhlas.
 *
 * Dolezite: Google Analytics sa NENACITA, kym navstevnik nesuhlasi.
 * Predtym sa gtag nacitaval hned v <head>, teda bez suhlasu.
 *
 * Volba sa uklada do localStorage ako 'softclick-cookies' = 'all' | 'necessary'.
 * Sam sebe vystaci, nezavisi na i18n.js (bezi aj na blogovych strankach).
 */
(function () {
  var KEY = 'softclick-cookies';
  var GA_ID = 'G-WQRX1E29P0';

  var T = {
    sk: {
      title: 'Používame cookies',
      text: 'Nevyhnutné cookies potrebujeme na fungovanie stránky. S vaším súhlasom používame aj analytické cookies (Google Analytics), aby sme vedeli, ktoré časti webu sú pre vás užitočné.',
      more: 'Viac o cookies',
      accept: 'Prijať všetko',
      reject: 'Iba nevyhnutné'
    },
    en: {
      title: 'We use cookies',
      text: 'Necessary cookies keep the site running. With your consent we also use analytics cookies (Google Analytics) to understand which parts of the site are useful to you.',
      more: 'More about cookies',
      accept: 'Accept all',
      reject: 'Necessary only'
    }
  };

  function lang() {
    var l = (document.documentElement.lang || 'sk').toLowerCase();
    return l.indexOf('en') === 0 ? 'en' : 'sk';
  }

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // ── Analytika sa spusti az po suhlase ────────────────────
  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  // ── Lista ────────────────────────────────────────────────
  function build() {
    var t = T[lang()];
    var base = location.pathname.indexOf('/blog/') === 0 ? '../' : '';

    var bar = document.createElement('div');
    bar.className = 'cookie-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-live', 'polite');
    bar.setAttribute('aria-label', t.title);
    bar.innerHTML =
      '<div class="cookie-bar__inner">' +
        '<div class="cookie-bar__text">' +
          '<strong>' + t.title + '</strong>' +
          '<p>' + t.text + ' <a href="' + base + 'cookies.html">' + t.more + '</a></p>' +
        '</div>' +
        '<div class="cookie-bar__actions">' +
          '<button type="button" class="btn btn-secondary btn-sm" data-cookie="necessary">' + t.reject + '</button>' +
          '<button type="button" class="btn btn-primary btn-sm" data-cookie="all">' + t.accept + '</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('is-open'); });

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      var choice = b.getAttribute('data-cookie');
      save(choice);
      if (choice === 'all') loadAnalytics();
      bar.classList.remove('is-open');
      setTimeout(function () { bar.remove(); }, 400);
    });
  }

  // ── Start ────────────────────────────────────────────────
  var choice = stored();
  if (choice === 'all') {
    loadAnalytics();               // suhlasil uz skor
  } else if (choice !== 'necessary') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', build);
    } else {
      build();
    }
  }

  // Aby sa dalo rozhodnutie zmenit (odkaz v paticke / na stranke o cookies)
  window.SoftClickCookies = {
    // Znovu otvori listu bez obnovovania stranky
    open: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      var old = document.querySelector('.cookie-bar');
      if (old) old.remove();
      build();
    },
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      location.reload();
    }
  };

  // Odkazy s data-cookie-settings otvoria nastavenia
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-cookie-settings]');
    if (!t) return;
    e.preventDefault();
    window.SoftClickCookies.open();
  });
})();
