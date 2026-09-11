/* ============================================================
   Makeup by Mumbe — shared behaviour
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var WA = '254796042515';                       // confirmed WhatsApp: +254 796 042 515
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- preload splash ---------- */
  var splash = document.getElementById('splash');
  if (splash) {
    var lift = function () { setTimeout(function () { splash.classList.add('gone'); }, reduced ? 0 : 520); };
    if (document.readyState === 'complete') lift();
    else window.addEventListener('load', lift);
    setTimeout(lift, 2600);                       // never trap the page behind a slow asset
  }

  /* ---------- smart sticky header ---------- */
  var hdr = document.querySelector('.hdr');
  if (hdr) {
    var last = window.pageYOffset, ticking = false;
    var onScroll = function () {
      var y = window.pageYOffset;
      hdr.classList.toggle('solid', y > 40);
      // hide going down, reveal on any upward scroll from anywhere
      if (y > 220 && y > last + 4) hdr.classList.add('up');
      else if (y < last - 4) hdr.classList.remove('up');
      last = y; ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* ---------- mobile panel ---------- */
  var burger = document.querySelector('.burger'), panel = document.querySelector('.panel');
  if (burger && panel) {
    var setPanel = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      setPanel(burger.getAttribute('aria-expanded') !== 'true');
    });
    panel.addEventListener('click', function (e) { if (e.target.tagName === 'A') setPanel(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setPanel(false); });
  }

  /* ---------- scroll reveal ---------- */
  var rv = document.querySelectorAll('.rv');
  if (rv.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      rv.forEach(function (el) { el.classList.add('in'); });
    } else {
      var ro = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      rv.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ============================================================
     Photo lightbox
     ============================================================ */
  var cells = Array.prototype.slice.call(document.querySelectorAll('.gcell'));
  var lb = document.querySelector('.lb');
  if (cells.length && lb) {
    var lbImg = lb.querySelector('.lb-stage img'),
        lbCap = lb.querySelector('.lb-cap'),
        lbNum = lb.querySelector('.lb-count'),
        at = 0, opener = null;

    var show = function (i) {
      at = (i + cells.length) % cells.length;
      var c = cells[at], img = c.querySelector('img');
      lbImg.src = c.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      lbCap.innerHTML = '<b>' + (c.getAttribute('data-cat') || '') + '</b>' + (c.getAttribute('data-cap') || '');
      lbNum.textContent = (at + 1) + ' / ' + cells.length;
    };
    var open = function (i, from) {
      opener = from; show(i); lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb-x').focus();
    };
    var close = function () {
      lb.classList.remove('open'); document.body.style.overflow = '';
      if (opener) opener.focus();
    };

    cells.forEach(function (c, i) {
      c.setAttribute('tabindex', '0');
      c.setAttribute('role', 'button');
      c.addEventListener('click', function () { open(i, c); });
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i, c); }
      });
    });
    lb.querySelector('.lb-x').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', function () { show(at - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { show(at + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-stage')) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(at - 1);
      if (e.key === 'ArrowRight') show(at + 1);
    });
  }

  /* ============================================================
     Film cards — lazy <video>, muted autoplay in view,
     one sound at a time, tap for fullscreen
     ============================================================ */
  var films = Array.prototype.slice.call(document.querySelectorAll('.film'));
  var fp = document.querySelector('.fp');
  if (films.length) {
    var loud = null;   // the single card currently allowed sound

    var build = function (card) {
      if (card._v) return card._v;
      var v = document.createElement('video');
      v.src = card.getAttribute('data-src');
      v.poster = card.querySelector('.poster').getAttribute('src');
      v.muted = true; v.loop = true; v.playsInline = true;
      v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', '');
      v.preload = 'none';                        // nothing downloads until it scrolls into view
      v.tabIndex = -1;
      // only uncover the video once it is genuinely rendering frames — if autoplay is
      // refused (data saver, iOS low power) the poster stays put instead of going black
      v.addEventListener('playing', function () { card.classList.add('playing'); });
      v.addEventListener('pause', function () { card.classList.remove('playing'); });
      v.addEventListener('error', function () { card.classList.remove('playing'); });
      card.insertBefore(v, card.querySelector('.shade'));
      card._v = v;
      return v;
    };

    if ('IntersectionObserver' in window && !reduced) {
      var vo = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var card = e.target;
          if (e.isIntersecting) {
            var v = build(card);
            v.preload = 'auto';
            var p = v.play();
            if (p && p.catch) p.catch(function () { /* autoplay blocked — poster stays, tap still works */ });
          } else if (card._v) {
            card._v.pause();
            card.classList.remove('playing');
            if (loud === card) { card._v.muted = true; setSound(card, false); loud = null; }
          }
        });
      }, { threshold: .45 });
      films.forEach(function (c) { vo.observe(c); });
    }

    var setSound = function (card, on) {
      var b = card.querySelector('.tool.sound');
      if (!b) return;
      b.classList.toggle('muted', !on);
      b.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
      b.setAttribute('aria-pressed', String(on));
    };

    films.forEach(function (card) {
      var sound = card.querySelector('.tool.sound');
      if (sound) {
        sound.addEventListener('click', function (e) {
          e.stopPropagation();
          var v = build(card);
          if (loud === card) {                    // turning this one off
            v.muted = true; setSound(card, false); loud = null;
          } else {
            if (loud && loud._v) { loud._v.muted = true; setSound(loud, false); }
            v.muted = false; setSound(card, true); loud = card;
            if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          }
        });
      }
      var full = card.querySelector('.tool.full');
      if (full) full.addEventListener('click', function (e) { e.stopPropagation(); openFilm(card); });
      card.addEventListener('click', function () { openFilm(card); });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFilm(card); }
      });
    });

    var fpV = fp && fp.querySelector('video'), fpC = fp && fp.querySelector('.fp-cap'), fpFrom = null;
    function openFilm(card) {
      if (!fp) return;
      fpFrom = card;
      fpV.src = card.getAttribute('data-src');
      fpV.poster = card.querySelector('.poster').getAttribute('src');
      fpV.muted = false; fpV.controls = true; fpV.loop = true; fpV.playsInline = true;
      fpC.textContent = card.getAttribute('data-title') + ' · ' + card.getAttribute('data-views') + ' views';
      fp.classList.add('open'); document.body.style.overflow = 'hidden';
      // whatever was audible in the grid goes quiet while the player is up
      if (loud && loud._v) { loud._v.muted = true; setSound(loud, false); loud = null; }
      films.forEach(function (c) { if (c._v) c._v.pause(); });
      var p = fpV.play(); if (p && p.catch) p.catch(function () {});
      fp.querySelector('.fp-x').focus();
    }
    function closeFilm() {
      if (!fp) return;
      fpV.pause(); fpV.removeAttribute('src'); fpV.load();
      fp.classList.remove('open'); document.body.style.overflow = '';
      if (fpFrom) fpFrom.focus();
    }
    if (fp) {
      fp.querySelector('.fp-x').addEventListener('click', closeFilm);
      fp.addEventListener('click', function (e) { if (e.target === fp) closeFilm(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && fp.classList.contains('open')) closeFilm();
      });
    }
  }

  /* ============================================================
     Booking flow → pre-filled WhatsApp message
     ============================================================ */
  var bk = document.querySelector('.bk');
  if (bk) {
    var steps = Array.prototype.slice.call(bk.querySelectorAll('.step')),
        bar = bk.querySelector('.bk-bar i'),
        marks = Array.prototype.slice.call(bk.querySelectorAll('.bk-steps span')),
        pre = bk.querySelector('.preview pre'),
        cur = 0;

    var val = function (n) {
      var f = bk.querySelector('[name="' + n + '"]:checked') || bk.querySelector('[name="' + n + '"]');
      return f ? f.value.trim() : '';
    };

    var prettyDate = function (iso) {
      if (!iso) return '';
      var d = new Date(iso + 'T00:00:00');
      if (isNaN(d)) return iso;
      return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    var message = function () {
      var L = ['Hello Mumbe! I would like to book a session.', ''];
      L.push('Service: ' + (val('service') || '—'));
      if (val('date')) L.push('Date: ' + prettyDate(val('date')));
      if (val('time')) L.push('Ready by: ' + val('time'));
      L.push('Location: ' + (val('place') || '—'));
      if (val('area')) L.push('Area: ' + val('area'));
      if (val('people')) L.push('People: ' + val('people'));
      L.push('');
      if (val('name')) L.push('Name: ' + val('name'));
      if (val('notes')) L.push('Notes: ' + val('notes'));
      L.push('');
      L.push('(Sent from your website)');
      return L.join('\n');
    };

    var paint = function () {
      steps.forEach(function (s, i) { s.classList.toggle('on', i === cur); });
      bar.style.width = ((cur + 1) / steps.length * 100) + '%';
      marks.forEach(function (m, i) {
        m.classList.toggle('on', i === cur);
        m.classList.toggle('done', i < cur);
      });
      if (pre) pre.textContent = message();
    };

    var validate = function (i) {
      var ok = true;
      steps[i].querySelectorAll('[data-req]').forEach(function (f) {
        var group = f.getAttribute('name'),
            filled = f.type === 'radio'
              ? !!bk.querySelector('[name="' + group + '"]:checked')
              : !!f.value.trim();
        var wrap = f.closest('.fld');
        if (wrap) wrap.classList.toggle('bad', !filled);
        if (!filled) ok = false;
      });
      var need = steps[i].querySelector('[data-reqgroup]');
      if (need) {
        var g = need.getAttribute('data-reqgroup');
        if (!bk.querySelector('[name="' + g + '"]:checked')) {
          ok = false;
          var w = steps[i].querySelector('.group-err');
          if (w) w.style.display = 'block';
        }
      }
      return ok;
    };

    bk.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]'), back = e.target.closest('[data-back]');
      if (next) {
        if (!validate(cur)) return;
        cur = Math.min(cur + 1, steps.length - 1); paint();
        bk.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
      if (back) { cur = Math.max(cur - 1, 0); paint(); }
    });

    bk.addEventListener('change', function (e) {
      var w = e.target.closest('.fld'); if (w) w.classList.remove('bad');
      var ge = bk.querySelector('.group-err'); if (ge) ge.style.display = 'none';
      paint();
    });
    bk.addEventListener('input', paint);

    var send = bk.querySelector('[data-send]');
    if (send) send.addEventListener('click', function (e) {
      e.preventDefault();
      if (!validate(cur)) return;
      window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(message()), '_blank', 'noopener');
    });

    // sensible floor on the date picker: today
    var dt = bk.querySelector('input[type="date"]');
    if (dt) dt.min = new Date().toISOString().slice(0, 10);

    paint();
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
