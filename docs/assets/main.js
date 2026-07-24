(() => {
  // ── Mobile nav ──
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav    = document.querySelector('nav[data-site-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Animated counters ──
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animate = el => {
      const target   = +el.getAttribute('data-count') || 0;
      const suffix   = el.getAttribute('data-suffix') || '';
      const duration = 1100;
      const t0       = performance.now();
      const step = now => {
        const p    = Math.min((now - t0) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
    }, { threshold: 0.1 });
    reveals.forEach(el => ro.observe(el));
  }

  // ── Back to top ──
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => btt.classList.toggle('visible', scrollY > 420), { passive: true });
    btt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ── Photo lightbox ──
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = lightbox?.querySelector('.lightbox-img');
  const lbClose      = lightbox?.querySelector('.lightbox-close');
  if (lightbox && lbImg) {
    const open  = (src, alt) => { lbImg.src = src; lbImg.alt = alt || ''; lightbox.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = ()         => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
    const sel   = '.photo-card img, .project-card img, .mosaic-main img, .mosaic-stack img, .photo-tall img, .photo-cell img';
    document.querySelectorAll(sel).forEach(img => img.addEventListener('click', () => open(img.src, img.alt)));
    lbClose?.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // ── Before/after compare slider ──
  document.querySelectorAll('[data-compare-slider]').forEach(input => {
    const frame = document.getElementById(input.getAttribute('data-target'));
    if (!frame) return;
    const update = () => frame.style.setProperty('--split', `${input.value}%`);
    input.addEventListener('input', update);
    update();
  });
})();
