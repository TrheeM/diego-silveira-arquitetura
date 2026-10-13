/* =========================================================
   Diego Silveira Arquitetura: interface e movimento
   Conteúdo (projetos, serviços, passos, bastidores) fica em data.js.
   ========================================================= */
import { INSTAGRAM, WHATSAPP, PROJECTS, HERO, SERVICES, STEPS, BACKSTAGE } from './data.js';

const root = document.documentElement;
root.classList.add('js');

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = id => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const EXT = 'target="_blank" rel="noopener noreferrer"';
const byId = Object.fromEntries(PROJECTS.map(p => [p.id, p]));
const HEROS = HERO.map(id => byId[id]);
const src = (ph, big = false) => `assets/img/${ph.src}-${big && ph.big ? 1600 : 800}.webp`;
const srcset = ph => (ph.big ? `assets/img/${ph.src}-800.webp 800w, assets/img/${ph.src}-1600.webp 1600w` : '');
const imgTag = (ph, alt, sizes, extra = '') => `<img src="${src(ph)}"${ph.big ? ` srcset="${srcset(ph)}" sizes="${sizes}"` : ''} width="${ph.w}" height="${ph.h}" alt="${esc(alt)}" loading="lazy" decoding="async"${extra}>`;

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined';
const motionOK = hasGsap && !reduceMotion;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!motionOK) root.classList.remove('motion');

/* ---------- contato: Direct do Instagram; WhatsApp com mensagem pronta quando houver número ---------- */
const MSG = {
    geral: 'Olá, Diego! Vim pelo seu site.',
    projeto: 'Olá, Diego! Vi seu site e quero conversar sobre o projeto da minha casa. O terreno fica em: ',
};
const DM = `https://ig.me/m/${INSTAGRAM}`;
const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
if (/^\d{12,13}$/.test(WHATSAPP)) {
    $$('[data-contact]').forEach(a => { a.href = waLink(MSG[a.dataset.contact] || MSG.geral); });
    $$('[data-contact] use').forEach(u => u.setAttribute('href', '#i-wa'));
    $('#contact-actions').insertAdjacentHTML('beforeend', `<a class="btn btn-glass btn-lg" href="${DM}" ${EXT}>${icon('dm')}Direct no Instagram</a>`);
}

/* =========================================================
   Render
   ========================================================= */
$('#works').innerHTML = PROJECTS.map((p, i) => `
    <li class="work w-${i + 1}">
        <button class="work-btn" type="button" data-project="${p.id}" aria-label="Ver fotos: ${esc(p.name)}, ${esc(p.place)}">
            <span class="work-img">${imgTag(p.photos[0], '', '(max-width: 760px) 92vw, 50vw')}</span>
            <span class="work-tag">${esc(p.tag)}</span>
            <span class="work-cap">
                <span class="work-name">${esc(p.name)}</span>
                <span class="work-place">${icon('pin')}${esc(p.place)}</span>
            </span>
            <span class="work-go" aria-hidden="true">${icon('arrow-up')}</span>
            <span class="work-count" aria-hidden="true">${p.photos.length} fotos</span>
        </button>
    </li>`).join('');

$('#s-track').innerHTML = SERVICES.map(s => `
    <article class="s-card">
        <span class="s-n" aria-hidden="true">${s.n}</span>
        <span class="s-ic">${icon(s.icon)}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <ul class="s-tags">${s.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
        <span class="s-bar" aria-hidden="true"></span>
    </article>`).join('');

$('#p-list').innerHTML = STEPS.map((s, i) => `
    <li class="p-card">
        <div class="p-copy">
            <span class="p-n">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(s.title)}</h3>
            <p>${esc(s.text)}</p>
        </div>
        <div class="p-img">${imgTag(s.photo, s.label, '(max-width: 760px) 92vw, 46vw')}<span class="p-label">${esc(s.label)}</span></div>
    </li>`).join('');
$$('.p-card').forEach((c, i) => c.style.setProperty('--i', i)); // CSP: sem style inline no HTML

BACKSTAGE.forEach((row, r) => {
    const html = row.map(ph => `<span class="bs-item">${imgTag(ph, '', '30vw')}</span>`).join('');
    $(`#bs-row-${r + 1}`).innerHTML = `<div class="bs-group">${html}</div><div class="bs-group">${html}</div>`;
});

/* =========================================================
   GALERIA (dialog nativo): fotos do projeto, setas, teclado e arrastar
   ========================================================= */
const gallery = (() => {
    const dlg = $('#gallery');
    const imgEl = $('#g-img');
    const thumbs = $('#g-thumbs');
    let proj = null, idx = 0, opener = null;

    function show(i, dir = 1) {
        idx = (i + proj.photos.length) % proj.photos.length;
        const ph = proj.photos[idx];
        const apply = () => {
            imgEl.src = src(ph, true);
            imgEl.width = ph.w; imgEl.height = ph.h;
            imgEl.alt = `${proj.name}: foto ${idx + 1} de ${proj.photos.length}`;
        };
        if (motionOK && dlg.open) {
            gsap.to(imgEl, {
                x: -40 * dir, opacity: 0, duration: 0.22, ease: 'power2.in', overwrite: true,
                onComplete() {
                    apply();
                    const go = () => gsap.fromTo(imgEl, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
                    if (imgEl.complete) go(); else imgEl.addEventListener('load', go, { once: true });
                },
            });
        } else apply();
        $('#g-count').textContent = `${idx + 1} / ${proj.photos.length}`;
        $$('.g-thumb', thumbs).forEach((t, k) => t.setAttribute('aria-current', String(k === idx)));
        const cur = $$('.g-thumb', thumbs)[idx];
        if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: motionOK ? 'smooth' : 'auto' });
    }

    function open(id, from) {
        proj = byId[id];
        if (!proj) return;
        opener = from || document.activeElement;
        $('#g-tag').textContent = proj.tag;
        $('#g-title').textContent = proj.name;
        $('#g-place').textContent = proj.place;
        $('#g-text').textContent = proj.text;
        thumbs.innerHTML = proj.photos.map((ph, k) => `<button class="g-thumb" type="button" data-k="${k}" aria-label="Foto ${k + 1}"><img src="${src(ph)}" alt="" width="${ph.w}" height="${ph.h}" loading="lazy"></button>`).join('');
        idx = 0;
        show(0);
        dlg.showModal();
        root.classList.add('no-scroll');
        if (motionOK) {
            gsap.fromTo(dlg, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
            gsap.fromTo([$('.g-info'), imgEl, thumbs], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'expo.out', delay: 0.05 });
        }
    }
    function close() {
        const done = () => { dlg.close(); };
        if (motionOK) gsap.to(dlg, { opacity: 0, scale: 0.97, duration: 0.25, ease: 'power2.in', onComplete: done });
        else done();
    }
    dlg.addEventListener('close', () => {
        root.classList.remove('no-scroll');
        if (hasGsap) gsap.set(dlg, { clearProps: 'opacity,transform' });
        if (opener && opener.focus) opener.focus();
    });
    dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
    dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
    $('#g-close').addEventListener('click', close);
    $('#g-prev').addEventListener('click', () => show(idx - 1, -1));
    $('#g-next').addEventListener('click', () => show(idx + 1, 1));
    thumbs.addEventListener('click', e => { const t = e.target.closest('.g-thumb'); if (t) show(+t.dataset.k, +t.dataset.k > idx ? 1 : -1); });
    dlg.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1, 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1, -1); }
    });
    // arrastar a foto para o lado
    const fig = $('#g-figure');
    let x0 = null;
    fig.addEventListener('pointerdown', e => { x0 = e.clientX; });
    fig.addEventListener('pointerup', e => {
        if (x0 === null) return;
        const dx = e.clientX - x0; x0 = null;
        if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    fig.addEventListener('pointercancel', () => { x0 = null; });
    return { open };
})();

$('#works').addEventListener('click', e => {
    const b = e.target.closest('[data-project]');
    if (b) gallery.open(b.dataset.project, b);
});

/* =========================================================
   HERO: os projetos passam pelo arco do Diego
   ========================================================= */
const heroEl = $('#inicio');
const cardEl = $('#hero-card');
const tiltEl = $('#tilt');
const archEl = $('#arch');
const archBg = $('#arch-bg');
const personEl = $('#person');
const wordEl = $('#hero-word');
const openBtn = $('#hero-open');
const liveEl = $('#hero-live');
const picker = $('#picker');

picker.innerHTML = HEROS.map((p, i) => `<li><button class="pick" type="button" data-index="${i}" aria-current="${i === 0}">
        <span class="pick-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="pick-thumb"><img src="${src(p.photos[0])}" alt="" width="${p.photos[0].w}" height="${p.photos[0].h}"></span>
        <span class="pick-txt"><span class="pick-name">${esc(p.name)}</span><span class="pick-place">${esc(p.place)}</span></span>
    </button></li>`).join('');
const picks = $$('.pick', picker);

const charsHTML = text => [...text].map(ch => (ch === ' ' ? ' ' : `<span class="ch${ch === '|' ? ' bar' : ''}">${esc(ch)}</span>`)).join('');
const heroWord = p => p.code;
wordEl.innerHTML = charsHTML(heroWord(HEROS[0]));

let introResolve;
const introDone = new Promise(r => { introResolve = r; });
let heroIndex = 0;
let spinning = false;
let hero3d = null;

function archLayer(p) {
    const el = document.createElement('img');
    const ph = p.photos[0];
    el.src = src(ph, true);
    el.alt = '';
    el.width = ph.w; el.height = ph.h;
    el.decoding = 'async';
    el.draggable = false;
    return el;
}
archBg.appendChild(archLayer(HEROS[0]));

function setOpen(i) {
    $('span', openBtn).textContent = `Ver ${HEROS[i].name}`;
}
setOpen(0);

function setCard(i) {
    const p = HEROS[i];
    const ph = p.photos[1] || p.photos[0];
    const im = $('#card-img');
    im.src = src(ph); im.width = ph.w; im.height = ph.h;
    $('#card-name').textContent = p.name;
    $('#card-tag').textContent = p.tag;
    $('#card-place span').textContent = p.place;
}
setCard(0);

function setTheme(p, animate) {
    const vars = { '--bg-inner': p.theme[0], '--bg-mid': p.theme[1], '--bg-outer': p.theme[2], '--glow': p.glow };
    if (animate) gsap.to(heroEl, { ...vars, duration: 1.5, ease: 'power2.inOut' });
    else Object.entries(vars).forEach(([k, v]) => heroEl.style.setProperty(k, v));
}
setTheme(HEROS[0], false);

function swapArch(p) {
    const next = archLayer(p);
    const old = $$('img', archBg);
    archBg.appendChild(next);
    const done = () => old.forEach(o => o.remove());
    if (!motionOK) { done(); return; }
    const go = () => {
        gsap.fromTo(next, { clipPath: 'circle(0% at 50% 100%)', scale: 1.18 }, {
            clipPath: 'circle(150% at 50% 100%)', scale: 1, duration: 1.5, ease: 'expo.inOut', onComplete: done,
        });
        gsap.to(old, { scale: 1.08, duration: 1.5, ease: 'expo.inOut' });
    };
    gsap.set(next, { clipPath: 'circle(0% at 50% 100%)' });
    if (next.complete) go(); else { next.addEventListener('load', go, { once: true }); next.addEventListener('error', done, { once: true }); }
}

function swapWord(i) {
    const text = heroWord(HEROS[i]);
    gsap.to($$('.ch', wordEl), {
        yPercent: -70, opacity: 0, filter: 'blur(8px)', duration: 0.42, stagger: 0.03, ease: 'power2.in', overwrite: true,
        onComplete() {
            wordEl.innerHTML = charsHTML(text);
            gsap.fromTo($$('.ch', wordEl), { yPercent: 80, opacity: 0, filter: 'blur(10px)' },
                { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.05, ease: 'expo.out', clearProps: 'filter' });
        },
    });
}

function selectHero(i, { user = false, dir: forceDir = 0 } = {}) {
    i = (i + HEROS.length) % HEROS.length;
    if (i === heroIndex || spinning) return false;
    const from = heroIndex;
    heroIndex = i;
    picks.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    setOpen(i);
    const p = HEROS[i];
    if (user) liveEl.textContent = `Projeto em destaque: ${p.name}, ${p.place}`;

    if (!motionOK) {
        setTheme(p, false);
        setCard(i);
        swapArch(p);
        wordEl.innerHTML = charsHTML(heroWord(p));
        if (hero3d) hero3d.switchTo(p);
        return true;
    }

    setTheme(p, true);
    swapWord(i);
    swapArch(p);
    if (hero3d) hero3d.switchTo(p);
    // giro de vitrine no eixo Y (a mesma coreografia do cartão do Mais Saúde): 0→360 com desfoque, troca, 360→720 assentando
    const dir = forceDir || (user && i === (from - 1 + HEROS.length) % HEROS.length ? -1 : 1);
    spinning = true;
    gsap.to(cardEl, {
        rotationY: 360 * dir, scale: 0.86, '--blur': '10px', duration: 0.6, ease: 'power2.in',
        onComplete() {
            setCard(i);
            gsap.fromTo(cardEl, { rotationY: 360 * dir }, {
                rotationY: 720 * dir, scale: 1, '--blur': '0px', duration: 1.5, ease: 'back.out(0.7)',
                onComplete() { gsap.set(cardEl, { rotationY: 0 }); spinning = false; },
            });
        },
    });
    // o Diego dá um passo para trás e volta enquanto o fundo troca
    gsap.timeline()
        .to(personEl, { y: 14, scale: 0.985, duration: 0.5, ease: 'power2.in' })
        .to(personEl, { y: 0, scale: 1, duration: 1.2, ease: 'expo.out' });
    return true;
}

/* troca automática a cada 6 s com barra de tempo; pausa com mouse/foco/fora da tela
   e para de vez quando a pessoa assume (clique, setas ou arrastar) */
const DWELL = 6;
let auto = motionOK;
let hold = false;
let heroVisible = true;
let timer = null;

function syncTimer() {
    if (!timer) return;
    if (hold || !heroVisible || document.hidden) timer.pause();
    else timer.play();
}
function startTimer() {
    if (timer) timer.kill();
    timer = null;
    picks.forEach(p => p.style.setProperty('--p', '0'));
    if (!auto || !hasGsap) return;
    timer = gsap.fromTo(picks[heroIndex], { '--p': 0 }, {
        '--p': 1, duration: DWELL, ease: 'none',
        onComplete() { selectHero(heroIndex + 1); startTimer(); },
    });
    syncTimer();
}
function userGo(i, opts = {}) {
    auto = false;
    startTimer();
    return selectHero(i, { user: true, ...opts });
}

picker.addEventListener('click', e => {
    const b = e.target.closest('.pick');
    if (b) userGo(+b.dataset.index);
});
$('#hero-prev').addEventListener('click', () => userGo(heroIndex - 1, { dir: -1 }));
$('#hero-next').addEventListener('click', () => userGo(heroIndex + 1, { dir: 1 }));
openBtn.addEventListener('click', () => gallery.open(HEROS[heroIndex].id, openBtn));
cardEl.addEventListener('click', () => { if (!dragMoved) gallery.open(HEROS[heroIndex].id, openBtn); });
const heroRight = $('.hero-right');
heroRight.addEventListener('pointerenter', () => { hold = true; syncTimer(); });
heroRight.addEventListener('pointerleave', () => { hold = false; syncTimer(); });
heroRight.addEventListener('focusin', () => { hold = true; syncTimer(); });
heroRight.addEventListener('focusout', e => { if (!heroRight.contains(e.relatedTarget)) { hold = false; syncTimer(); } });

/* arrastar no palco: esquerda = próximo, direita = anterior.
   Enquanto arrasta, o cartão gira junto; abaixo do limite volta com mola. */
let dragMoved = false;
(() => {
    const stage = $('#hero-stage');
    const hint = $('.drag-hint');
    let x0 = 0, y0 = 0, dx = 0, dragging = false, decided = false, id = null;
    const LIMIT = 60;
    stage.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; decided = false; dragMoved = false; dx = 0; id = e.pointerId;
        x0 = e.clientX; y0 = e.clientY;
    });
    stage.addEventListener('pointermove', e => {
        if (!dragging || e.pointerId !== id) return;
        dx = e.clientX - x0;
        const dy = e.clientY - y0;
        if (!decided) {
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            decided = true;
            if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; } // rolagem vertical
            dragMoved = true;
            stage.setPointerCapture(id);
            stage.classList.add('dragging');
            auto = false; startTimer();
        }
        if (hasGsap && !spinning) {
            gsap.set(cardEl, { rotationY: Math.max(-70, Math.min(70, -dx * 0.35)), x: dx * 0.25 });
            gsap.set(archBg, { x: dx * 0.06 });
        }
    });
    const end = () => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('dragging');
        if (!decided) return;
        if (hint) hint.classList.add('used');
        if (hasGsap) gsap.to(archBg, { x: 0, duration: 0.9, ease: 'expo.out' });
        if (Math.abs(dx) > LIMIT) {
            const step = dx < 0 ? 1 : -1;
            const go = () => (spinning ? gsap.delayedCall(0.1, go) : userGo(heroIndex + step, { dir: step }));
            if (hasGsap) { gsap.to(cardEl, { x: 0, duration: 0.6, ease: 'expo.out' }); go(); }
            else userGo(heroIndex + step, { dir: step });
        } else if (hasGsap && !spinning) {
            gsap.to(cardEl, { rotationY: 0, x: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
        }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    heroRight.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); userGo(heroIndex + 1, { dir: 1 }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); userGo(heroIndex - 1, { dir: -1 }); }
    });
})();

/* laço do topo: cartão inclina e flutua, o Diego e o arco andam em camadas; peças 3D */
(() => {
    const mouse = { x: 0, y: 0, cx: -9999, cy: -9999 };
    const cm = { x: 0, y: 0 };
    if (canHover) {
        addEventListener('pointermove', e => {
            mouse.x = e.clientX / innerWidth - 0.5;
            mouse.y = e.clientY / innerHeight - 0.5;
            mouse.cx = e.clientX;
            mouse.cy = e.clientY;
        }, { passive: true });
    }
    let running = false;
    let raf = 0;
    function frame() {
        const t = performance.now() / 1000;
        if (!canHover) { mouse.x = Math.sin(t * 0.5) * 0.22; mouse.y = Math.cos(t * 0.4) * 0.12; }
        cm.x += (mouse.x - cm.x) * 0.06;
        cm.y += (mouse.y - cm.y) * 0.06;
        const fy = Math.sin(t * Math.PI * 2 / 6) * 10;
        tiltEl.style.transform = `translate3d(${(cm.x * 22).toFixed(2)}px, ${(fy + cm.y * 14).toFixed(2)}px, 0) rotateY(${(cm.x * 30).toFixed(2)}deg) rotateX(${(-cm.y * 18).toFixed(2)}deg)`;
        personEl.style.translate = `${(cm.x * 10).toFixed(2)}px ${(cm.y * 6).toFixed(2)}px`;
        archEl.style.translate = `${(cm.x * -8).toFixed(2)}px ${(cm.y * -5).toFixed(2)}px`;
        if (hero3d) hero3d.render(t, cm, mouse);
        raf = running ? requestAnimationFrame(frame) : 0;
    }
    function setRunning(on) {
        running = on && !document.hidden && !reduceMotion;
        if (running && !raf) raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        setRunning(heroVisible);
        syncTimer();
    }).observe(heroEl);
    document.addEventListener('visibilitychange', () => { setRunning(heroVisible); syncTimer(); });

    function load3D() {
        const probe = document.createElement('canvas');
        if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
        import('./hero3d.js').then(({ initHero3D }) => {
            hero3d = initHero3D({ hero: heroEl, anchor: archEl, back: $('#hero-back'), front: $('#hero-front'), reduceMotion, theme: HEROS[heroIndex] });
            let rt;
            addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { hero3d.resize(); if (!running) hero3d.render(0, cm, mouse); }, 150); });
            if (motionOK) hero3d.burst();
            if (!running) hero3d.render(0, cm, mouse);
        }).catch(err => console.warn('Peças 3D indisponíveis', err));
    }
    // só depois da página carregada e da entrada terminar: o Three.js não disputa a thread com a abertura
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 250));
    const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(r => addEventListener('load', r, { once: true }));
    Promise.all([loaded, introDone]).then(() => idle(load3D, { timeout: 2000 }));
})();

/* =========================================================
   Cabeçalho, navegação, botão flutuante
   ========================================================= */
(() => {
    const header = $('#header');
    const progress = $('#progress');
    const fab = $('.fab');
    let lastY = scrollY;
    let ticking = false;
    function update() {
        const y = scrollY;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
        if (y > 500 && y > lastY + 6) header.classList.add('away');
        else if (y < lastY - 6 || y < 500) header.classList.remove('away');
        fab.classList.toggle('show', y > innerHeight * 0.7);
        lastY = y;
        ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('away'));
    update();
    // some na seção de contato, onde os botões já estão na tela
    new IntersectionObserver(([e]) => fab.classList.toggle('hide', e.isIntersecting), { threshold: 0.15 }).observe($('#contato'));

    // vidro escuro sobre fundos escuros, claro sobre o papel
    const dark = new Set();
    const darkIO = new IntersectionObserver(entries => {
        entries.forEach(en => (en.isIntersecting ? dark.add(en.target) : dark.delete(en.target)));
        header.classList.toggle('light', dark.size === 0);
    }, { rootMargin: '-30px 0px -92% 0px' });
    ['#inicio', '#servicos', '#processo', '#contato', '.footer'].forEach(s => darkIO.observe($(s)));

    const links = $$('.nav-item');
    const navIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'projetos', 'servicos', 'sobre', 'processo', 'contato'].forEach(id => navIO.observe(document.getElementById(id)));
})();

/* ---------- botões magnéticos ---------- */
if (motionOK && canHover) {
    $$('.magnetic').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
    });
}

/* =========================================================
   Movimento: entrada orquestrada e revelações na rolagem
   ========================================================= */
const ST = motionOK && window.ScrollTrigger ? window.ScrollTrigger : null;
const Split = motionOK && window.SplitText ? window.SplitText : null;
if (ST) gsap.registerPlugin(ST);
if (Split) gsap.registerPlugin(Split);

function showStatic() {
    $$('.intro').forEach(el => { el.style.opacity = '1'; });
    root.classList.add('intro-done');
    const loader = $('#loader');
    if (loader) loader.remove();
}

function playIntro() {
    if (!motionOK) { showStatic(); startTimer(); introResolve(); return; }
    const loader = $('#loader');
    const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete() { root.classList.add('intro-done'); startTimer(); introResolve(); },
    });

    // 1. as curvas de nível correm, o D|S se desenha a lápis e a cortina sobe
    if (loader) {
        const strokes = $$('.loader-mark path, .loader-topo path', loader);
        strokes.forEach(p => { const l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l, strokeDashoffset: l }); });
        tl.to('.loader-topo path', { strokeDashoffset: 0, duration: 1.4, stagger: 0.08, ease: 'power2.inOut' }, 0)
          .to('.lm-d', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.1)
          .to('.lm-bar', { strokeDashoffset: 0, duration: 0.45, ease: 'power3.inOut' }, 0.5)
          .to('.lm-s', { strokeDashoffset: 0, duration: 0.8, ease: 'power2.inOut' }, 0.55)
          .to('.loader-mark', { scale: 0.85, opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.3)
          .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut' }, 1.35)
          .add(() => loader.remove());
    }
    const T = loader ? 1.6 : 0.1;

    // 2. topo
    const title = $('#hero-title');
    tl.set(title, { opacity: 1 }, T);
    if (Split) {
        const split = new Split(title, { type: 'lines,words', mask: 'lines' });
        tl.from(split.words, { yPercent: 115, rotation: 4, duration: 1.3, stagger: 0.07 }, T);
    } else {
        tl.from(title, { y: 60, opacity: 0, duration: 1.2 }, T);
    }
    tl.fromTo('.eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, T - 0.05)
      // o arco sobe do chão e a foto do projeto se abre dentro dele
      .set(archEl, { opacity: 1 }, T)
      .fromTo(archEl, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', clearProps: 'clipPath' }, T - 0.1)
      .fromTo('#arch-bg img', { scale: 1.35 }, { scale: 1, duration: 2.2 }, T)
      // o Diego entra de baixo, sai do desfoque e "salta" para fora do arco
      .set(personEl, { opacity: 1 }, T + 0.45)
      .fromTo(personEl, { yPercent: 38, scale: 0.92, filter: 'blur(14px) brightness(.4)' }, { yPercent: 0, scale: 1, filter: 'blur(0px) brightness(1)', duration: 1.7, clearProps: 'filter,transform' }, T + 0.45)
      .set(cardEl, { opacity: 1 }, T + 0.8)
      .fromTo(cardEl, { rotationY: -200, y: 120, scale: 0.6, '--blur': '14px' }, { rotationY: 0, y: 0, scale: 1, '--blur': '0px', duration: 2, clearProps: 'transform' }, T + 0.8)
      .add(() => { if (hero3d) hero3d.burst(); }, T + 0.5)
      .fromTo('.hw-top', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, T + 0.25)
      .set('.hw-main', { opacity: 1 }, T + 0.3)
      .from($$('.ch', wordEl), { yPercent: 90, opacity: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.06, clearProps: 'filter' }, T + 0.3)
      .fromTo(['.hero-lede', '.hero-actions'], { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, clearProps: 'transform' }, T + 0.45)
      .fromTo('.picker-label', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, T + 0.6)
      .set('#picker', { opacity: 1 }, T + 0.65)
      .from(picks, { x: 50, opacity: 0, duration: 1, stagger: 0.07, clearProps: 'transform,opacity' }, T + 0.65)
      .fromTo('.picker-nav', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform' }, T + 1)
      .fromTo('.drag-hint', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, T + 1.3)
      .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 1 }, T + 1.4);
}

(() => {
    const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
    fontsReady.then(playIntro);
})();

/* ---------- faixas que correm sozinhas e aceleram com a rolagem ---------- */
function runLoop(track, trigger, duration, reverse = false) {
    if (reduceMotion) return;
    if (!hasGsap) { track.classList.add('css-run'); return; }
    const loop = gsap.fromTo(track, { xPercent: reverse ? -50 : 0 }, { xPercent: reverse ? 0 : -50, duration, ease: 'none', repeat: -1 });
    if (!ST) return;
    ST.create({
        trigger, start: 'top bottom', end: 'bottom top',
        onToggle: self => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: self => {
            const dir = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' }) });
        },
    });
}
(() => {
    const track = $('#ticker-track');
    track.appendChild($('.ticker-group', track).cloneNode(true));
    runLoop(track, '.ticker', 36);
    runLoop($('#bs-row-1'), '.backstage', 60);
    runLoop($('#bs-row-2'), '.backstage', 70, true);
})();

/* ---------- revelações ---------- */
if (ST) {
    // o topo sai devagar: palavra gigante desce, o arco sobe
    gsap.to('.hero-word', { yPercent: 45, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-left', { y: -90, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-stage', { y: -120, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });

    // títulos: linhas sobem de dentro de uma máscara
    $$('.h2.split').forEach(h => {
        const head = h.closest('.section-head, .s-head, .about-copy, .contact-card') || h.parentElement;
        const kicker = $('.kicker', head);
        const lede = $('.lede', head);
        const parts = Split ? new Split(h, { type: 'lines', mask: 'lines', linesClass: 'line' }).lines : [h];
        gsap.set(parts, { yPercent: 110 });
        if (kicker) gsap.set(kicker, { x: -24, opacity: 0 });
        if (lede) gsap.set(lede, { y: 30, opacity: 0 });
        ST.create({
            trigger: h, start: 'top 86%', once: true,
            onEnter() {
                if (kicker) gsap.to(kicker, { x: 0, opacity: 1, duration: 1, ease: 'expo.out' });
                gsap.to(parts, { yPercent: 0, duration: 1.25, stagger: 0.1, ease: 'expo.out' });
                if (lede) gsap.to(lede, { y: 0, opacity: 1, duration: 1.1, delay: 0.2, ease: 'expo.out' });
            },
        });
    });

    // projetos: cada foto abre de baixo para cima e a imagem desliza por dentro
    gsap.set('.work', { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set('.work .work-cap, .work .work-tag', { y: 24, opacity: 0 });
    ST.batch('.work', {
        start: 'top 90%', once: true,
        onEnter: b => {
            gsap.to(b, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, stagger: 0.12, ease: 'expo.inOut', clearProps: 'clipPath' });
            gsap.to(b.flatMap(w => $$('.work-cap, .work-tag', w)), { y: 0, opacity: 1, duration: 1, stagger: 0.06, delay: 0.6, ease: 'expo.out', clearProps: 'transform,opacity' });
        },
    });
    $$('.work-img img').forEach(im => {
        gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.closest('.work'), start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // serviços: no desktop a seção fixa e os cartões correm na horizontal
    const mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', () => {
        const track = $('#s-track');
        const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const hTween = gsap.to(track, {
            x: () => -dist(), ease: 'none',
            scrollTrigger: {
                trigger: '#servicos', start: 'top top', end: () => `+=${dist() + innerHeight * 0.4}`,
                pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: self => gsap.set('#s-meter', { scaleX: self.progress }),
            },
        });
        $$('.s-card').forEach(card => {
            const st = { trigger: card, containerAnimation: hTween };
            gsap.fromTo($('.s-bar', card), { scaleX: 0.18 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...st, start: 'left 95%', end: 'center 50%', scrub: true } });
            gsap.fromTo($('.s-n', card), { xPercent: 40 }, { xPercent: -30, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left', scrub: true } });
            gsap.fromTo($('.s-ic', card), { rotation: -30, scale: 0.6 }, { rotation: 0, scale: 1, duration: 0.9, ease: 'back.out(2.2)', scrollTrigger: { ...st, start: 'left 85%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.s-card', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '#servicos', start: 'top 70%', once: true } });
        const onFocus = e => {
            const card = e.target.closest('.s-card');
            const st = hTween.scrollTrigger;
            if (!card || !st || dist() <= 0) return;
            const p = Math.min(1, Math.max(0, (card.offsetLeft - track.clientWidth * 0.3) / dist()));
            window.scrollTo(0, st.start + (st.end - st.start) * p * (dist() / (dist() + innerHeight * 0.4)));
        };
        track.addEventListener('focusin', onFocus);
        return () => track.removeEventListener('focusin', onFocus);
    });
    mm.add('(max-width: 980px)', () => {
        gsap.set('.s-card', { y: 60, opacity: 0 });
        ST.batch('.s-card', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }) });
        $$('.s-bar').forEach(bar => gsap.fromTo(bar, { scaleX: 0.18 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: bar.parentElement, start: 'top 85%', end: 'bottom 60%', scrub: true } }));
    });

    // sobre: a foto abre num arco e anda mais devagar que a página
    gsap.fromTo('#about-photo', { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.about', start: 'top 75%', once: true },
    });
    gsap.fromTo('#about-photo img', { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.about-chip', { scale: 0.6, opacity: 0, duration: 1, stagger: 0.15, ease: 'back.out(2)', scrollTrigger: { trigger: '.about', start: 'top 60%', once: true } });
    gsap.to('.chip-a', { y: -40, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('.chip-b', { y: 40, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.set('.about-lede, .about-text, .about-facts li', { y: 30, opacity: 0 });
    ST.batch('.about-lede, .about-text, .about-facts li', { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'expo.out', clearProps: 'transform,opacity' }) });

    // processo: cartões empilham presos ao topo; o de baixo encolhe quando o próximo chega
    const cards = $$('.p-card');
    cards.forEach((c, i) => {
        const next = cards[i + 1];
        if (next) {
            gsap.to(c, {
                scale: 0.94, '--dim': 0.55, ease: 'none',
                scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 20%', scrub: true },
            });
        }
        gsap.from($('.p-img img', c), { scale: 1.3, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'top 30%', scrub: true } });
    });
    const path = $('#p-path');
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '#p-stage', start: 'top 80%', end: 'bottom 60%', scrub: true } });

    // contato: o cartão cresce e as curvas de nível se desenham
    gsap.fromTo('#contact-card', { scale: 0.92 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#contato', start: 'top bottom', end: 'top 30%', scrub: true } });
    $$('.contact-topo path').forEach((p, i) => {
        const l = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: l, strokeDashoffset: l }, { strokeDashoffset: 0, duration: 2.2, delay: i * 0.12, ease: 'power2.inOut', scrollTrigger: { trigger: '#contato', start: 'top 70%', once: true } });
    });
    gsap.from('.contact-actions .btn, .contact-places li', { y: 30, opacity: 0, duration: 1, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.contact-actions', start: 'top 92%', once: true } });

    // SplitText e fontes mudam alturas: recalcula depois que tudo carregar
    addEventListener('load', () => ST.refresh(), { once: true });
}
