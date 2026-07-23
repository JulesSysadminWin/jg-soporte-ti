(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const body = document.body;
  const header = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = body.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    $$('.main-nav a').forEach(a => a.addEventListener('click', () => {
      body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded','false');
    }));
  }

  const progress = $('[data-scroll-progress]');
  const onScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12});
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  // Price tabs
  $$('[data-price-tab]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.priceTab;
    $$('[data-price-tab]').forEach(b => b.classList.toggle('active', b === btn));
    $$('[data-price-panel]').forEach(p => p.classList.toggle('active', p.dataset.pricePanel === id));
  }));

  // Interactive diagnosis
  const diagnosis = {
    slow: {
      icon:'◴', title:'Primero revisemos el rendimiento',
      text:'Conviene validar inicio de Windows, procesos, espacio disponible, estado del disco y programas que consumen recursos.',
      mode:'Remoto o presencial', price:'Desde S/ 50', link:'laptop-lenta-lima.html'
    },
    windows: {
      icon:'▦', title:'Validemos qué necesitas instalar o configurar',
      text:'Se revisa la versión de Windows, controladores, programas requeridos y si cuentas con una licencia o cuenta válida para software de pago.',
      mode:'Remoto o presencial', price:'Desde S/ 40', link:'instalacion-windows-office.html'
    },
    remote: {
      icon:'◎', title:'Puede resolverse sin mover el equipo',
      text:'Para errores puntuales, configuraciones o una revisión inicial, el soporte remoto suele ser la forma más rápida de empezar.',
      mode:'Atención remota', price:'Desde S/ 30', link:'soporte-remoto-pc.html'
    },
    business: {
      icon:'◌', title:'Primero definimos qué debe lograr tu web',
      text:'Se prioriza una web rápida, responsive y orientada a contacto. Luego se puede sumar Search Console y una base SEO técnica.',
      mode:'Implementación web', price:'Desde S/ 350', link:'paginas-web-negocios.html'
    }
  };
  const result = $('[data-diagnosis-result]');
  $$('[data-diagnosis]').forEach(btn => btn.addEventListener('click', () => {
    const data = diagnosis[btn.dataset.diagnosis];
    if (!data || !result) return;
    $$('[data-diagnosis]').forEach(b => b.classList.toggle('active', b === btn));
    result.animate([{opacity:.55,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:250,easing:'ease-out'});
    $('[data-result-icon]').textContent = data.icon;
    $('[data-result-title]').textContent = data.title;
    $('[data-result-text]').textContent = data.text;
    $('[data-result-mode]').textContent = data.mode;
    $('[data-result-price]').textContent = data.price;
    $('[data-result-link]').href = data.link;
  }));

  // Card spotlight and subtle tilt. Disabled on touch/mobile.
  if (matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', ev => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX-r.left)/r.width;
        const y = (ev.clientY-r.top)/r.height;
        el.style.setProperty('--mx', `${(x*100).toFixed(1)}%`);
        el.style.setProperty('--my', `${(y*100).toFixed(1)}%`);
        el.style.transform = `perspective(1000px) rotateX(${(0.5-y)*2.5}deg) rotateY(${(x-0.5)*3}deg) translateY(-2px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform=''; });
    });
    $$('.spotlight').forEach(el => el.addEventListener('mousemove', ev => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${ev.clientX-r.left}px`);
      el.style.setProperty('--my', `${ev.clientY-r.top}px`);
    }));
  }

  // Lightweight network animation inside the hero only.
  const canvas = $('#networkCanvas');
  const host = $('[data-hero-visual]');
  if (canvas && host && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let points = [], w=0, h=0, dpr=1, raf=0;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(rect.width*dpr)); h = Math.max(1, Math.round(rect.height*dpr));
      canvas.width=w; canvas.height=h;
      const count = innerWidth < 700 ? 22 : 34;
      points = Array.from({length:count}, () => ({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.12*dpr,vy:(Math.random()-.5)*.12*dpr}));
    };
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      for (const p of points) {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>w)p.vx*=-1; if(p.y<0||p.y>h)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,1.1*dpr,0,Math.PI*2);ctx.fillStyle='rgba(65,210,255,.42)';ctx.fill();
      }
      for(let i=0;i<points.length;i++) for(let j=i+1;j<points.length;j++) {
        const a=points[i],b=points[j],dx=a.x-b.x,dy=a.y-b.y,dist=Math.hypot(dx,dy),limit=115*dpr;
        if(dist<limit){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(55,180,255,${(1-dist/limit)*.09})`;ctx.lineWidth=.7*dpr;ctx.stroke();}
      }
      raf=requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener('resize', resize, {passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else draw();});
  }
})();
