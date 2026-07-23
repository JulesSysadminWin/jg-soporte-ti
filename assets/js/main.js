(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.menu');

  if (header && toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        header.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const links = document.querySelectorAll('.menu a[href^="#"], .menu a[href^="index.html#"]');
  const sectionLinks = [...links].filter(link => {
    const href = link.getAttribute('href') || '';
    const id = href.includes('#') ? href.split('#').pop() : '';
    return id && document.getElementById(id);
  });
  const sections = sectionLinks.map(link => document.getElementById((link.getAttribute('href') || '').split('#').pop())).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sectionLinks.forEach(link => link.classList.remove('active'));
      const activeId = visible.target.id;
      sectionLinks.forEach(link => {
        if ((link.getAttribute('href') || '').endsWith('#' + activeId)) link.classList.add('active');
      });
    }, { threshold: [0.25, 0.45, 0.65] });
    sections.forEach(section => observer.observe(section));
  }

  const revealTargets = document.querySelectorAll('.service-card, .price-card, .problem-card, .step-card, .link-card, .page-service-card, .page-panel, .support-card, .about-profile, .why-card, .contact-card');
  if ('IntersectionObserver' in window && revealTargets.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  }
})();
