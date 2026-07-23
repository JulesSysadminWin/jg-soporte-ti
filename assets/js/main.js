
(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const header = $('[data-header]');
  const toggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold: .14});
  $$('.reveal').forEach(el => io.observe(el));

  // Services filtering
  const filterBtns = $$('[data-service-filter]');
  const cards = $$('.service-card');
  function applyFilter(f) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.serviceFilter === f));
    cards.forEach(c => {
      const cat = c.dataset.category || '';
      c.classList.toggle('hidden', f !== 'all' && !cat.includes(f));
    });
    const grid = $('[data-services-grid]');
    if (grid && window.innerWidth < 760) grid.scrollIntoView({behavior:'smooth', block:'start'});
  }
  filterBtns.forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.serviceFilter)));
  $$('[data-filter]').forEach(b => b.addEventListener('click', () => applyFilter(b.dataset.filter)));

  // Price tabs
  $$('[data-price-tab]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.priceTab;
    $$('[data-price-tab]').forEach(b => b.classList.toggle('active', b === btn));
    $$('[data-price-panel]').forEach(p => p.classList.toggle('active', p.dataset.pricePanel === id));
  }));

  // Subtle tilt + cursor glow on cards
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (ev) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width;
      const y = (ev.clientY - r.top) / r.height;
      el.style.setProperty('--mx', (x*100).toFixed(1)+'%');
      el.style.setProperty('--my', (y*100).toFixed(1)+'%');
      if (window.innerWidth > 900) {
        el.style.transform = `perspective(900px) rotateX(${(0.5-y)*4}deg) rotateY(${(x-0.5)*5}deg) translateY(-2px)`;
      }
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // Ambient particles canvas
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr, particles;
  const mouse = {x: -9999, y: -9999};
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = Math.floor(innerWidth * dpr);
    h = canvas.height = Math.floor(innerHeight * dpr);
    canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
    const count = innerWidth < 700 ? 38 : 72;
    particles = Array.from({length: count}, () => ({x: Math.random()*w, y: Math.random()*h, vx:(Math.random()-.5)*.18*dpr, vy:(Math.random()-.5)*.18*dpr, r:(Math.random()*1.6+0.5)*dpr}));
  }
  addEventListener('resize', resize, {passive:true}); resize();
  addEventListener('mousemove', e => { mouse.x = e.clientX*dpr; mouse.y = e.clientY*dpr; }, {passive:true});
  function frame(){
    ctx.clearRect(0,0,w,h);
    for (const p of particles){
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx,dy);
      if (dist < 120*dpr){ p.x += dx/dist*.35*dpr || 0; p.y += dy/dist*.35*dpr || 0; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(32,213,255,.55)'; ctx.fill();
    }
    for (let i=0;i<particles.length;i++) for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j], dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
      if (dist < 125*dpr){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(32,213,255,${(1-dist/(125*dpr))*0.14})`; ctx.lineWidth=1*dpr; ctx.stroke(); }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();
