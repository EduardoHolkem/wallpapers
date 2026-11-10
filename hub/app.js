/* ============ Hub de Wallpapers ============ */
(function () {
  const W = window.WALLPAPERS || [];
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, '0');
  const SLOTS = 4;                 // destaques no topo
  const LOCK_ACCENT = '#5d6f9c';
  const LOCK_SVG = '<svg class="lock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                   '<rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  // No toque (celular, tablet) não existe "passar o mouse". O primeiro toque
  // mostra a prévia e o segundo abre a página. lastPointer guarda se a última
  // interação foi toque, mouse ou teclado.
  const noHover = matchMedia('(hover: none)').matches;
  let lastPointer = noHover ? 'touch' : 'mouse';
  addEventListener('pointerdown', e => { lastPointer = e.pointerType || 'mouse'; }, true);
  addEventListener('keydown', () => { lastPointer = 'keyboard'; }, true);
  const isTouch = () => lastPointer === 'touch' || (noHover && lastPointer !== 'keyboard');
  if (noHover) {
    document.querySelector('.lead').textContent =
      'Wallpapers animados para Wallpaper Engine e Lively. Toque em um deles para ver a prévia.';
    document.querySelector('.cat-sub').textContent =
      'Cada wallpaper que eu já criei, com prévia ao vivo. Toque para ver rodando e toque de novo para abrir.';
  }

  function tag(name, text, cls) { const e = document.createElement(name); if (text != null) e.textContent = text; if (cls) e.className = cls; return e; }
  function linkTo(a, href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; }

  /* ================= Destaques ================= */
  // os marcados como destaque, completados com espaços bloqueados
  const featured = W.filter(w => w.featured).slice(0, SLOTS);
  while (featured.length < SLOTS) featured.push(null);

  const list = $('list');
  $('count').textContent = pad(featured.filter(Boolean).length) + ' / ' + pad(SLOTS);
  // Os destaques são botões, não links: servem só para trocar a prévia, no
  // mouse e no toque. Abrir o repositório fica para o catálogo lá embaixo, e
  // baixar fica nos botões de download do painel.
  const items = featured.map((w, i) => {
    const li = tag('li');
    const b = tag('button', null, 'item' + (w ? '' : ' locked'));
    b.type = 'button';
    b.style.setProperty('--i', i);
    if (w) {
      b.style.setProperty('--a', w.accent);
      b.innerHTML = `<span class="num">${pad(i + 1)}</span><span class="name"></span><span class="go">prévia</span>`;
      b.querySelector('.name').textContent = w.name;
      b.setAttribute('aria-label', 'Ver a prévia do ' + w.name);
    } else {
      b.setAttribute('aria-label', 'Espaço bloqueado');
      b.innerHTML = `<span class="num">${pad(i + 1)}</span><span class="name">bloqueado</span><span class="go">${LOCK_SVG}</span>`;
    }
    b.addEventListener('mouseenter', () => { if (!isTouch()) select(i); });
    b.addEventListener('focus', () => { if (!isTouch()) select(i); });
    b.addEventListener('click', () => {
      select(i);
      // no celular a prévia fica acima da lista: rola até ela se estiver fora da tela
      if (isTouch()) {
        const top = $('frame').getBoundingClientRect().top;
        if (top < 0 || top > innerHeight * .6) $('frame').scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    li.append(b); list.append(li);
    return b;
  });

  // setas do teclado andam pelos destaques (só enquanto o topo está na tela)
  document.addEventListener('keydown', e => {
    if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || scrollY > innerHeight * .5) return;
    e.preventDefault();
    items[(current + (e.key === 'ArrowDown' ? 1 : -1) + SLOTS) % SLOTS].focus();
  });

  /* ---------- prévia grande ---------- */
  const media = $('media');
  let current = -1, liveTimer = 0;

  function addLayer(el) {
    el.classList.add('layer');
    if (el.parentNode !== media) media.append(el);
    void el.offsetWidth;                // registra o estado apagado para o fade rodar
    el.classList.add('on');
    [...media.children].forEach(old => {
      if (old === el) return;
      old.classList.remove('on');
      setTimeout(() => old.remove(), 750);
    });
  }

  // depois de um instante, o wallpaper de verdade entra no lugar da capa
  function liveFrame(url, title, onReady) {
    const f = document.createElement('iframe');
    f.src = url; f.title = title; f.tabIndex = -1; f.loading = 'lazy';
    f.addEventListener('load', () => setTimeout(() => onReady(f), 700));
    return f;
  }

  function showPreview(w) {
    clearTimeout(liveTimer);
    if (!w) {
      const box = tag('div', null, 'locked-preview');
      box.innerHTML = LOCK_SVG + '<b>bloqueado</b><span>espaço reservado para o próximo wallpaper</span>';
      addLayer(box);
      return;
    }
    let el;
    if (w.video) {
      el = document.createElement('video');
      Object.assign(el, { src: w.video, muted: true, loop: true, autoplay: true, playsInline: true });
    } else {
      el = new Image(); el.src = w.poster; el.alt = 'Prévia do wallpaper ' + w.name;
    }
    addLayer(el);
    if (w.live) {
      liveTimer = setTimeout(() => {
        const f = liveFrame(w.live, 'Wallpaper ' + w.name + ' rodando', f => {
          if (featured[current] === w) addLayer(f); else f.remove();
        });
        f.className = 'layer';
        media.append(f);
      }, 900);
    }
  }

  /* ---------- informações ---------- */
  function button(text, href, cls) {
    const a = tag('a', text, 'btn' + (cls ? ' ' + cls : '') + (href ? '' : ' off'));
    if (href) linkTo(a, href);
    return a;
  }
  // botão que baixa o zip direto da release, com uma setinha de download
  const DL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">' +
                 '<path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14"/></svg>';
  function downloadButton(d) {
    const a = button(d.label, d.url, 'dl');
    a.removeAttribute('target');
    a.setAttribute('download', '');
    a.setAttribute('aria-label', 'Baixar para ' + d.label);
    a.insertAdjacentHTML('afterbegin', DL_SVG);
    return a;
  }
  function fillInfo(w) {
    const info = $('info');
    $('info-name').textContent = w ? w.name : 'Bloqueado';
    $('info-about').textContent = w ? w.about : 'Este espaço está reservado para o próximo wallpaper. Quando ele ficar pronto, aparece aqui.';
    $('info-platforms').replaceChildren(...(w ? w.platforms : ['em produção']).map(p => tag('li', p)));
    $('info-tech').replaceChildren(...(w ? w.tech : []).map(t => tag('li', t)));
    const dls = w && w.downloads && w.downloads.length ? w.downloads : null;
    // nos destaques não tem botão para o repositório: ele fica no catálogo
    $('info-actions').replaceChildren(...(w ? [
      ...(w.live ? [button('Demo ao vivo', w.live)] : []),
      ...(dls ? dls.map(downloadButton) : [button('Em breve', '')])
    ] : [button('Em breve', '')]));
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
  }

  function select(i) {
    if (i === current) return;
    current = i;
    const w = featured[i];
    items.forEach((it, k) => it.classList.toggle('on', k === i));
    document.documentElement.style.setProperty('--acc', w ? w.accent : LOCK_ACCENT);
    $('stage-name').textContent = w ? w.name : 'bloqueado';
    $('stage-count').textContent = pad(i + 1) + ' / ' + pad(SLOTS);
    showPreview(w);
    fillInfo(w);
  }
  select(0);

  /* ================= Catálogo ================= */
  const grid = $('grid');
  $('cat-count').textContent = pad(W.length) + (W.length === 1 ? ' wallpaper' : ' wallpapers');
  let cardLive = null, cardTimer = 0;

  function card(w, i) {
    const a = tag('a', null, 'card');
    a.style.setProperty('--a', w.accent);
    const href = w.repo || w.live;
    if (href) linkTo(a, href); else a.href = '#';
    a.innerHTML =
      `<div class="card-media"><img loading="lazy" alt=""><p class="card-about"></p></div>` +
      `<div class="card-body"><span class="card-num">${pad(i + 1)}</span><h3 class="card-name"></h3><span class="card-tags"></span></div>`;
    const img = a.querySelector('img');
    img.src = w.poster; img.alt = 'Capa do wallpaper ' + w.name;
    a.querySelector('.card-about').textContent = w.about;
    a.querySelector('.card-name').textContent = w.name;
    a.querySelector('.card-tags').textContent = w.platforms.map(p => p === 'Wallpaper Engine' ? 'WE' : p).join(' / ');
    // com o mouse em cima (ou no primeiro toque) o wallpaper roda dentro do
    // cartão, um por vez
    const box = a.querySelector('.card-media');
    const start = delay => {
      clearTimeout(cardTimer);
      if (!w.live) return;
      cardTimer = setTimeout(() => {
        stopCardLive();
        const f = liveFrame(w.live, 'Wallpaper ' + w.name + ' rodando', f => f.classList.add('on'));
        box.insertBefore(f, box.querySelector('.card-about'));
        cardLive = f;
      }, delay);
    };
    a.addEventListener('mouseenter', () => { if (!isTouch()) start(650); });
    a.addEventListener('mouseleave', () => { if (!isTouch()) { clearTimeout(cardTimer); stopCardLive(); } });
    a.addEventListener('click', e => {
      if (isTouch() && !a.classList.contains('touched')) {
        e.preventDefault();
        grid.querySelectorAll('.card.touched').forEach(c => c.classList.remove('touched'));
        a.classList.add('touched');
        start(250);
        return;
      }
      if (!href) e.preventDefault();
    });
    return a;
  }
  function stopCardLive() {
    if (!cardLive) return;
    const f = cardLive; cardLive = null;
    f.classList.remove('on');
    setTimeout(() => f.remove(), 700);
  }
  function lockedCard() {
    const a = tag('div', null, 'card locked');
    a.innerHTML =
      `<div class="card-media"><div class="lock-big">${LOCK_SVG}<span>bloqueado</span></div></div>` +
      `<div class="card-body"><span class="card-num">--</span><h3 class="card-name">Em produção</h3><span class="card-tags">em breve</span></div>`;
    return a;
  }

  W.forEach((w, i) => grid.append(card(w, i)));

  // completa a última linha da grade com espaços bloqueados
  function fillRow() {
    grid.querySelectorAll('.card.locked').forEach(c => c.remove());
    const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    // sempre sobra pelo menos um bloqueado, mostrando que vem mais por aí
    const extra = (cols - (W.length % cols)) % cols || cols;
    for (let k = 0; k < extra; k++) grid.append(lockedCard());
    reveal();
  }
  let rowTimer = 0;
  addEventListener('resize', () => { clearTimeout(rowTimer); rowTimer = setTimeout(fillRow, 150); });

  // cartões entram um de cada vez quando aparecem na tela
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 }) : null;
  function reveal() {
    [...grid.children].forEach((c, k) => {
      if (c.classList.contains('in')) return;
      c.style.transitionDelay = (k % 4) * 80 + 'ms';
      if (io) io.observe(c); else c.classList.add('in');
    });
  }
  fillRow();

  /* ================= Granulação ================= */
  (function grain() {
    const s = 200, c = document.createElement('canvas'); c.width = c.height = s;
    const x = c.getContext('2d'), d = x.createImageData(s, s), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const v = Math.random() * 2 - 1;
      p[i] = p[i + 1] = p[i + 2] = v > 0 ? 255 : 0;
      p[i + 3] = Math.abs(v) * 22;
    }
    x.putImageData(d, 0, 0);
    document.querySelector('.grain').style.backgroundImage = `url(${c.toDataURL()})`;
  })();

  /* ================= Fundo: luzes azuis em movimento =================
     Desenhado em 1/8 da resolução e ampliado. As luzes já são borradas,
     então fica bonito e quase não pesa no processador. */
  const bg = $('bg'), ctx = bg.getContext('2d');
  const ORBS = [
    { c: [31, 61, 255],   r: .55, x: .18, y: .30, sx: .07, sy: .05, ph: 0 },
    { c: [61, 123, 255],  r: .45, x: .78, y: .22, sx: .05, sy: .08, ph: 1.7 },
    { c: [0, 170, 255],   r: .38, x: .62, y: .82, sx: .09, sy: .04, ph: 3.1 },
    { c: [92, 70, 255],   r: .42, x: .30, y: .85, sx: .06, sy: .07, ph: 4.4 },
    { c: [124, 194, 255], r: .22, x: .52, y: .48, sx: .10, sy: .09, ph: 2.2 }
  ];
  const BOKEH = Array.from({ length: 26 }, () => ({
    x: Math.random(), y: Math.random(), r: .006 + Math.random() * .018,
    v: .004 + Math.random() * .012, ph: Math.random() * 6.28, a: .15 + Math.random() * .35
  }));
  let mx = 0, my = 0, smx = 0, smy = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });

  function size() {
    bg.width = Math.max(80, Math.round(innerWidth / 8));
    bg.height = Math.max(45, Math.round(innerHeight / 8));
  }
  addEventListener('resize', size); size();

  let last = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || now - last < 1000 / 30) return;
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    const t = now / 1000, w = bg.width, h = bg.height, m = Math.max(w, h);
    smx += (mx - smx) * .04; smy += (my - smy) * .04;
    // ao rolar para o catálogo, as luzes sobem um pouco (parallax)
    const sc = Math.min(1, scrollY / innerHeight) * .25;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#020615'; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'screen';

    for (const o of ORBS) {
      const x = w * (o.x + Math.sin(t * o.sx + o.ph) * .12) - smx * w * .04;
      const y = h * (o.y - sc + Math.cos(t * o.sy + o.ph) * .10) - smy * h * .04;
      const r = m * o.r * (.9 + .1 * Math.sin(t * .4 + o.ph));
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${o.c},.55)`);
      g.addColorStop(.5, `rgba(${o.c},.16)`);
      g.addColorStop(1, `rgba(${o.c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    // feixe de luz diagonal que atravessa a tela de tempos em tempos
    const sweep = ((t * .05) % 1.6) - .3;
    const lg = ctx.createLinearGradient(w * (sweep - .2), 0, w * (sweep + .2), h);
    lg.addColorStop(0, 'rgba(124,194,255,0)');
    lg.addColorStop(.5, 'rgba(124,194,255,.10)');
    lg.addColorStop(1, 'rgba(124,194,255,0)');
    ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);

    // bolinhas de luz subindo
    for (const b of BOKEH) {
      b.y -= b.v * dt; if (b.y < -.05) { b.y = 1.05; b.x = Math.random(); }
      const x = (b.x + Math.sin(t * .3 + b.ph) * .02 - smx * .02) * w, y = b.y * h, r = b.r * m;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const a = b.a * (.6 + .4 * Math.sin(t * 1.3 + b.ph));
      g.addColorStop(0, `rgba(190,220,255,${a})`); g.addColorStop(1, 'rgba(190,220,255,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  }
  requestAnimationFrame(frame);
})();
