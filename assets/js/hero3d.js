/* =========================================================
   Peças 3D do topo (Three.js): o canteiro do Diego desmontado.
   Pórticos de aço, vigas, ripas de madeira, tijolos, placas de
   vidro e laje flutuam em volta do arco. Na troca de projeto
   tudo implode no arco e se monta de novo, girando.
   Carregado só depois da página pronta.
   ========================================================= */
import * as THREE from '../vendor/three/three.module.min.js';
import { RoundedBoxGeometry } from '../vendor/three/RoundedBoxGeometry.js';
import { RoomEnvironment } from '../vendor/three/RoomEnvironment.js';

// posições em "larguras do arco" a partir do centro do arco; z negativo = atrás
const BACK = [
    { p: [-0.72, 0.6, -2.6], s: 0.3, kind: 'frame' },
    { p: [0.74, 0.7, -3.2], s: 0.26, kind: 'slats' },
    { p: [-0.78, -0.42, -2.2], s: 0.14, kind: 'brick' },
    { p: [0.8, -0.12, -2.8], s: 0.24, kind: 'glass' },
    { p: [0.08, 0.95, -3.8], s: 0.32, kind: 'beam' },
    { p: [-0.4, 0.98, -3.4], s: 0.12, kind: 'brick', wide: true },
    { p: [0.62, -0.62, -3.6], s: 0.22, kind: 'slab', wide: true },
    { p: [-0.7, 0.12, -4.2], s: 0.22, kind: 'frame', wide: true },
];
const FRONT = [
    { p: [-0.62, -0.62, 2.0], s: 0.09, kind: 'brick' },
    { p: [0.66, 0.5, 2.4], s: 0.16, kind: 'beam' },
    { p: [-0.58, 0.74, 1.8], s: 0.1, kind: 'slats' },
];

export function initHero3D({ hero, anchor, back, front, reduceMotion, theme }) {
    const small = innerWidth < 760;
    const make = canvas => {
        const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        r.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.6));
        r.toneMapping = THREE.ACESFilmicToneMapping;
        r.toneMappingExposure = 1.05;
        return r;
    };
    const rimColor = new THREE.Color(theme.glow);
    const makeScene = r => {
        const s = new THREE.Scene();
        const pm = new THREE.PMREMGenerator(r);
        s.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
        s.environmentIntensity = 0.8;
        pm.dispose();
        const key = new THREE.DirectionalLight('#ffffff', 2.4); key.position.set(3, 5, 5);
        const rim = new THREE.DirectionalLight(rimColor, 3); rim.position.set(-4, 1, -2);
        s.add(key, rim, new THREE.AmbientLight('#ffffff', 0.3));
        s.userData.rim = rim;
        return s;
    };
    const rb = make(back), rf = make(front);
    const sb = makeScene(rb), sf = makeScene(rf);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    // materiais: aço preto acetinado, madeira, tijolo, vidro, concreto
    const M = {
        steel: new THREE.MeshPhysicalMaterial({ color: '#1d1f22', metalness: 0.85, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 }),
        wood: new THREE.MeshPhysicalMaterial({ color: '#b8743d', metalness: 0, roughness: 0.55, clearcoat: 0.5, clearcoatRoughness: 0.4 }),
        brick: new THREE.MeshPhysicalMaterial({ color: '#c0532f', metalness: 0, roughness: 0.75 }),
        glass: new THREE.MeshPhysicalMaterial({ color: '#cfe6ee', metalness: 0, roughness: 0.05, transparent: true, opacity: 0.32, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false }),
        slab: new THREE.MeshPhysicalMaterial({ color: '#d9d4cb', metalness: 0, roughness: 0.85 }),
        red: new THREE.MeshPhysicalMaterial({ color: '#e3323b', metalness: 0.1, roughness: 0.35, clearcoat: 1 }),
    };
    const box = new THREE.BoxGeometry(1, 1, 1);
    const rbox = new RoundedBoxGeometry(1, 1, 1, 3, 0.12);
    const mesh = (geo, mat, sx, sy, sz, x = 0, y = 0, z = 0) => {
        const m = new THREE.Mesh(geo, mat);
        m.scale.set(sx, sy, sz);
        m.position.set(x, y, z);
        return m;
    };
    // cada peça cabe num cubo de lado ~1
    const BUILD = {
        frame() { // pórtico: dois pilares, viga e uma diagonal vermelha
            const g = new THREE.Group();
            const t = 0.07;
            g.add(mesh(box, M.steel, t, 1, t, -0.45, 0, 0), mesh(box, M.steel, t, 1, t, 0.45, 0, 0), mesh(box, M.steel, 1, t, t, 0, 0.5, 0), mesh(box, M.steel, 1, t, t, 0, -0.5, 0));
            const d = mesh(box, M.red, t * 0.6, 1.3, t * 0.6);
            d.rotation.z = Math.atan2(0.9, 1);
            g.add(d);
            return g;
        },
        beam() { // perfil I
            const g = new THREE.Group();
            g.add(mesh(box, M.steel, 1, 0.05, 0.22, 0, 0.12, 0), mesh(box, M.steel, 1, 0.05, 0.22, 0, -0.12, 0), mesh(box, M.steel, 1, 0.22, 0.04));
            return g;
        },
        slats() { // ripado de madeira
            const g = new THREE.Group();
            for (let i = 0; i < 5; i++) g.add(mesh(box, M.wood, 0.11, 1, 0.08, -0.4 + i * 0.2, 0, 0));
            g.add(mesh(box, M.steel, 1, 0.05, 0.05, 0, 0.36, -0.07), mesh(box, M.steel, 1, 0.05, 0.05, 0, -0.36, -0.07));
            return g;
        },
        brick() {
            const g = new THREE.Group();
            g.add(mesh(rbox, M.brick, 1, 0.48, 0.5));
            return g;
        },
        glass() { // placa de vidro com caixilho
            const g = new THREE.Group();
            g.add(mesh(box, M.glass, 0.78, 1, 0.02));
            const t = 0.045;
            g.add(mesh(box, M.steel, t, 1, t, -0.39, 0, 0), mesh(box, M.steel, t, 1, t, 0.39, 0, 0), mesh(box, M.steel, 0.82, t, t, 0, 0.5, 0), mesh(box, M.steel, 0.82, t, t, 0, -0.5, 0));
            return g;
        },
        slab() {
            const g = new THREE.Group();
            g.add(mesh(rbox, M.slab, 1, 0.12, 0.62));
            return g;
        },
    };

    const items = [];
    const add = (list, scene) => list.forEach((d, i) => {
        if (small && (d.wide || i % 3 === 2)) return;
        const obj = BUILD[d.kind]();
        scene.add(obj);
        items.push({
            obj, d,
            k: d.s,
            phase: Math.random() * Math.PI * 2,
            spin: new THREE.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.7, (Math.random() - 0.5) * 0.3),
            rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
            push: new THREE.Vector2(),
        });
    });
    add(BACK, sb);
    add(FRONT, sf);

    const st = { spread: 1, size: 1, twist: 0 };
    const view = { cx: 0, cy: 0, unit: 3 };
    const tmp = new THREE.Vector3();
    const dir = new THREE.Vector3();

    function resize() {
        const w = hero.clientWidth, h = hero.clientHeight;
        rb.setSize(w, h, false); rf.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const hr = hero.getBoundingClientRect();
        const ar = anchor.getBoundingClientRect();
        const worldH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const worldW = worldH * camera.aspect;
        view.cx = ((ar.left + ar.width / 2 - hr.left) / hr.width - 0.5) * worldW;
        view.cy = -((ar.top + ar.height / 2 - hr.top) / hr.height - 0.5) * worldH;
        view.unit = (ar.width / hr.width) * worldW;
    }
    resize();

    // ponto do cursor no plano z = 0
    function mouseWorld(mouse) {
        if (mouse.cx < -9000) return null;
        const r = hero.getBoundingClientRect();
        tmp.set(((mouse.cx - r.left) / r.width) * 2 - 1, -((mouse.cy - r.top) / r.height) * 2 + 1, 0.5).unproject(camera);
        dir.copy(tmp).sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        return { x: camera.position.x + dir.x * dist, y: camera.position.y + dir.y * dist };
    }

    let last = 0;
    function render(t, cm, mouse) {
        const dt = Math.min(0.05, last ? t - last : 0.016);
        last = t;
        const m = reduceMotion ? null : mouseWorld(mouse);
        const R = view.unit * 0.5;
        for (const it of items) {
            const [hx, hy, hz] = it.d.p;
            const float = reduceMotion ? 0 : 1;
            const depth = hz < 0 ? 0.6 : 1.4; // as da frente andam mais com o cursor
            const x = view.cx + hx * view.unit * st.spread + Math.sin(t * 0.6 + it.phase) * 0.12 * float + cm.x * depth * 0.9;
            const y = view.cy + hy * view.unit * st.spread + Math.cos(t * 0.8 + it.phase) * 0.16 * float - cm.y * depth * 0.6;
            // fogem do cursor
            let px = 0, py = 0;
            if (m) {
                const dx = x - m.x, dy = y - m.y;
                const d = Math.hypot(dx, dy) || 1;
                if (d < R) { const f = (R - d) / R; px = (dx / d) * f * R * 0.7; py = (dy / d) * f * R * 0.7; }
            }
            it.push.x += (px - it.push.x) * 0.08;
            it.push.y += (py - it.push.y) * 0.08;
            it.obj.position.set(x + it.push.x, y + it.push.y, hz);
            if (!reduceMotion) {
                it.rot.x += it.spin.x * dt;
                it.rot.y += it.spin.y * dt;
                it.rot.z += it.spin.z * dt;
            }
            it.obj.rotation.set(it.rot.x + st.twist, it.rot.y + st.twist * 1.3, it.rot.z);
            it.obj.scale.setScalar(Math.max(0.0001, it.k * view.unit * st.size));
        }
        rb.render(sb, camera);
        rf.render(sf, camera);
    }

    let tl = null;
    function switchTo(h) {
        const target = new THREE.Color(h.glow);
        if (reduceMotion || !window.gsap) { [sb, sf].forEach(s => s.userData.rim.color.copy(target)); return; }
        if (tl) tl.kill();
        tl = gsap.timeline()
            .to(st, { spread: 0.08, size: 0.4, twist: st.twist + Math.PI, duration: 0.55, ease: 'power3.in' })
            .to(st, { spread: 1, size: 1, twist: st.twist + Math.PI * 2, duration: 1.4, ease: 'back.out(1.5)' });
        [sb, sf].forEach(s => gsap.to(s.userData.rim.color, { r: target.r, g: target.g, b: target.b, duration: 1.4, ease: 'power2.inOut' }));
    }

    // entrada: as peças saem de dentro do arco, como uma obra se montando
    function burst() {
        if (reduceMotion || !window.gsap) return;
        if (tl) tl.kill();
        tl = gsap.timeline().fromTo(st, { spread: 0, size: 0, twist: -Math.PI }, { spread: 1, size: 1, twist: 0, duration: 2.2, ease: 'expo.out' });
    }

    return { render, resize, switchTo, burst };
}
