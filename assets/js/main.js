
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const fill = document.querySelector('.progress-fill');
  if (fill) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    update();
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      a.classList.add('ativo');
    }
  });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); o.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal, .stagger, .road-stripe').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(el => el.classList.add('vis'));
  }

  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries, o) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animateCount(e.target);
        o.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec    = parseInt(el.dataset.dec || 0, 10);
    const dur    = 1500;
    const start  = performance.now();
    const step = now => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * ease).toFixed(dec);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const nome    = (d.get('nome') || '').trim();
      const fone    = (d.get('fone') || '').trim();
      const servico = d.get('servico') || '';
      const msg     = (d.get('mensagem') || '').trim();
      const msg2    = document.getElementById('form-msg');

      if (!nome || !fone) {
        if (msg2) { msg2.textContent = 'Preencha nome e telefone para continuar.'; msg2.className = 'form-msg err'; }
        return;
      }

      const texto = encodeURIComponent(
        `Olá! Sou ${nome}.\n` +
        `Serviço de interesse: ${servico || 'não informado'}.\n\n` +
        `${msg}\n\nContato: ${fone}`
      );
      window.open(`https://api.whatsapp.com/send?phone=555198195250&text=${texto}`, '_blank', 'noopener');

      if (msg2) { msg2.textContent = 'Tudo pronto! O WhatsApp vai abrir em instantes.'; msg2.className = 'form-msg ok'; }
      form.reset();
    });
  }

  const ticker = document.querySelector('.ticker');
  if (ticker) {
    const clone = ticker.cloneNode(true);
    ticker.parentNode.appendChild(clone);
  }

});
