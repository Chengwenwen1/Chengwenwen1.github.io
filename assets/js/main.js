/* ═══════════════════════════════════════════════════════════
   程文文 Wenwen Cheng — homepage behaviour
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const STORAGE_KEY = 'wc-lang';
  const html = document.documentElement;

  /* ── i18n ───────────────────────────────────────────────── */

  function swap(lang) {
    document.querySelectorAll('[data-zh][data-en]').forEach(function (el) {
      const text = el.dataset[lang];
      if (typeof text === 'string') el.innerHTML = text;
    });

    html.lang = lang === 'zh' ? 'zh-CN' : 'en';

    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.classList.toggle('is-on', btn.dataset.langBtn === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
    btn.addEventListener('click', function () { swap(btn.dataset.langBtn); });
  });

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* private mode */ }
  if (saved !== 'zh' && saved !== 'en') {
    saved = (navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
  }
  swap(saved);

  /* ── scrollspy ──────────────────────────────────────────── */

  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  const byId = {};
  navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

  const targets = Object.keys(byId)
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  let ticking = false;

  function sync() {
    ticking = false;
    const marker = window.innerHeight * 0.32;
    let current = targets[0];

    targets.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= marker) current = sec;
    });

    // bottom of page → last section stays lit
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      current = targets[targets.length - 1];
    }

    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', byId[current.id] === a);
    });
  }

  function requestSync() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(sync); }
  }

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync);
  sync();

  /* ── hero backdrop: single-cell clusters ────────────────── */

  const drift = document.querySelector('.hero__drift');
  if (drift) {
    const NS = 'http://www.w3.org/2000/svg';
    const CLUSTERS = [
      { x: 250, y: 195, r: 96,  fill: '#1D4ED8', op: 0.10, n: 16, spread: 84 },
      { x: 372, y: 108, r: 72,  fill: '#2563EB', op: 0.08, n: 11, spread: 62 },
      { x: 300, y: 300, r: 78,  fill: '#7FA8F0', op: 0.09, n: 12, spread: 70 },
      { x: 930, y: 168, r: 88,  fill: '#1D4ED8', op: 0.07, n: 13, spread: 76 },
      { x: 845, y: 300, r: 66,  fill: '#7FA8F0', op: 0.10, n: 10, spread: 58 }
    ];

    // deterministic PRNG so the field is identical on every load
    let seed = 20250919;
    function rand() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    CLUSTERS.forEach(function (c) {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('fill', c.fill);
      g.setAttribute('fill-opacity', String(c.op));

      for (let i = 0; i < c.n; i++) {
        const a = rand() * Math.PI * 2;
        const d = Math.sqrt(rand()) * c.spread;
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('cx', (c.x + Math.cos(a) * d).toFixed(1));
        dot.setAttribute('cy', (c.y + Math.sin(a) * d).toFixed(1));
        dot.setAttribute('r', (11 + rand() * 12).toFixed(1));
        g.appendChild(dot);
      }

      const halo = document.createElementNS(NS, 'circle');
      halo.setAttribute('cx', c.x);
      halo.setAttribute('cy', c.y);
      halo.setAttribute('r', c.r);
      halo.setAttribute('fill', 'none');
      halo.setAttribute('stroke', c.fill);
      halo.setAttribute('stroke-opacity', String(Math.min(c.op * 1.2, 0.14)));
      halo.setAttribute('stroke-width', '1');
      g.appendChild(halo);

      drift.appendChild(g);
    });
  }

  /* ── footer year ────────────────────────────────────────── */

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
