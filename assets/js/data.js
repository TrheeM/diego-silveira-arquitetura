/* =========================================================
   Diego Silveira Arquitetura: conteúdo do site
   Tudo que aparece no site sai daqui. Textos e fotos vêm dos
   posts do Instagram @diegoarquitetura.
   ========================================================= */

export const INSTAGRAM = 'diegoarquitetura';

// Número do WhatsApp com DDI e DDD, só dígitos (ex.: '5535999999999').
// Vazio = o site usa só o Direct do Instagram. Preencha quando o Diego confirmar o número.
export const WHATSAPP = '';

// fotos: nome base em assets/img (gera -800.webp e, quando "big", -1600.webp), largura e altura reais
const img = (src, w, h, big = false) => ({ src, w, h, big });

export const PROJECTS = [
    {
        id: 'dp', name: 'Casa D|P', code: 'D|P', place: 'São Bento do Sapucaí, SP', tag: 'Residência · 250 m²',
        text: 'Casa sobre a pedra, aberta para o vale. Muros de pedra, laje fina em balanço e piscina de borda infinita virada para o pôr do sol.',
        photos: [img('dp-1', 1440, 1800), img('dp-2', 1205, 1800), img('dp-3', 1440, 1800), img('dp-4', 1440, 612), img('dp-5', 1440, 1800)],
        theme: ['#c9703f', '#3b2629', '#0d0f13'], glow: '#ff9b5c',
    },
    {
        id: 'ls', name: 'Casa L|S', code: 'L|S', place: 'Gonçalves, MG', tag: 'Estrutura metálica e tijolo',
        text: 'Pórtico metálico leve apoiado no declive, fechamento em tijolo e a árvore do terreno preservada ao lado da varanda. Do croqui à obra em 2025.',
        photos: [img('ls-1', 1232, 918), img('ls-3', 1420, 1596), img('ls-2', 633, 1572), img('ls-4', 1440, 1800)],
        theme: ['#2d6fd6', '#16335f', '#081122'], glow: '#ff6b3d',
    },
    {
        id: 'tg', name: 'Casa T|G', code: 'T|G', place: 'Pouso Alegre, MG', tag: 'Interiores',
        text: 'Living e suíte com painéis de madeira ripada, cortinas leves e luz natural suave e controlada.',
        photos: [img('tg-1', 2160, 2108, true), img('tg-2', 1654, 2108, true), img('tg-3', 2160, 2700, true), img('tg-4', 2160, 2700, true)],
        theme: ['#b87842', '#4a2b18', '#130b07'], glow: '#ffc78a',
    },
    {
        id: 'gh', name: 'Casa G|H', code: 'G|H', place: 'Serra Morena · Pouso Alegre, MG', tag: 'Estudo preliminar · 191 m²',
        text: 'Telhado inclinado, estante do piso ao teto e parede de quadros no living. Estudo preliminar com 191 m² construídos.',
        photos: [img('gh-1', 1856, 2305, true), img('gh-2', 1856, 2305, true), img('gh-3', 2266, 2814, true), img('gh-4', 2268, 2817, true)],
        theme: ['#b3342f', '#3e1215', '#110506'], glow: '#ff5d52',
    },
    {
        id: 'mata', name: 'Casa na mata', code: 'Mata', place: 'Ao pé da Pedra da Boa Vista', tag: 'Madeira e vidro',
        text: 'Volumes de madeira e vidro sobre pilotis, no meio da vegetação. O estudo começou pelo mapa do terreno.',
        photos: [img('mata-1', 1440, 1671), img('mata-2', 1440, 1671), img('mata-3', 1440, 1671), img('mata-4', 1440, 1671), img('mata-5', 1440, 1671), img('mata-6', 1024, 1188)],
        theme: ['#2e7a50', '#11301e', '#040d08'], glow: '#ffb24a',
    },
    {
        id: 'viga', name: 'Residência com automação', code: 'Viga', place: 'Em três níveis no declive', tag: 'Obra concluída',
        text: 'Garagem embaixo, piscina com borda de vidro no meio e volumes de madeira em cima. Áudio, vídeo, clima e persianas automatizados com o Grupo Viga.',
        photos: [img('viga-1', 1440, 1920), img('viga-2', 1440, 1920), img('viga-3', 1440, 1919), img('viga-4', 1440, 1920), img('viga-5', 1440, 1920), img('viga-6', 1440, 810)],
    },
    {
        id: 'campo', name: 'Casa de campo', code: 'Campo', place: 'Serra ao fundo', tag: 'Pedra, telha e madeira',
        text: 'Telhado de barro, paredes de pedra e caminho de lajes até a garagem, com uma araucária no meio do pátio.',
        photos: [img('campo-1', 1440, 1439), img('campo-2', 1440, 1440), img('campo-3', 1440, 1440), img('campo-5', 1440, 983), img('campo-6', 1152, 1152), img('campo-4', 640, 426)],
    },
    {
        id: 'vale', name: 'Casa no vale', code: 'Vale', place: 'Vista para as montanhas', tag: 'Concreto, madeira e vidro',
        text: 'Lajes horizontais sobre o pasto, com o vale aberto na frente. Por dentro, forro de madeira e janelas do piso ao teto.',
        photos: [img('vale-1', 1440, 1440), img('vale-2', 1440, 1440), img('vale-3', 1440, 1440), img('vale-4', 1440, 1440), img('vale-5', 1440, 1440)],
    },
];

// projetos que passam no topo, na ordem
export const HERO = ['dp', 'ls', 'tg', 'gh', 'mata'];

export const SERVICES = [
    { n: '01', icon: 'house', title: 'Projeto arquitetônico', text: 'Casas de campo, de condomínio e em terreno inclinado. Plantas, cortes e fachadas desenhados a partir do lugar.', tags: ['Residencial', 'Implantação', 'Fachadas'] },
    { n: '02', icon: 'terrain', title: 'Estudo do terreno', text: 'Antes do primeiro traço: sol, vista, acessos e declive. Uso foto aérea para decidir onde fica cada área da casa.', tags: ['Orientação solar', 'Foto aérea', 'Zoneamento'] },
    { n: '03', icon: 'pencil', title: 'Croqui e estudo preliminar', text: 'A ideia nasce à mão, no papel. No croqui a gente acerta volumes, vistas e a relação com a paisagem.', tags: ['Croqui', 'Estudo preliminar', 'Revisões'] },
    { n: '04', icon: 'cube', title: 'Maquete e imagens 3D', text: 'Maquete física e imagens realistas, de dia e à noite, para você ver a casa antes de a obra começar.', tags: ['Maquete', 'Render', 'Luz do dia e noturna'] },
    { n: '05', icon: 'sofa', title: 'Interiores e marcenaria', text: 'Living, suítes, cozinha e home theater: marcenaria, iluminação indireta e materiais escolhidos junto com a arquitetura.', tags: ['Marcenaria', 'Iluminação', 'Materiais'] },
    { n: '06', icon: 'helmet', title: 'Acompanhamento de obra', text: 'Visitas para conferir estrutura, detalhes e acabamentos, do pórtico metálico ao corte da última peça da escada.', tags: ['Visitas', 'Detalhamento', 'Acabamentos'] },
];

export const STEPS = [
    { title: 'Conversa e terreno', text: 'Você me conta como vive e o que quer. Eu estudo o terreno: sol, vista, acessos e declive.', photo: img('mata-6', 1024, 1188), label: 'Terreno' },
    { title: 'Croqui', text: 'Os primeiros traços à mão: volumes, vistas e onde fica cada ambiente.', photo: img('proc-1', 1440, 1288), label: 'Croqui' },
    { title: 'Projeto, maquete e 3D', text: 'O croqui vira projeto, maquete e imagens realistas para decidir junto antes da obra.', photo: img('proc-2', 964, 691), label: 'Maquete' },
    { title: 'Obra acompanhada', text: 'Acompanho a obra para que o que foi desenhado seja o que fica de pé.', photo: img('proc-4', 1440, 1080), label: 'Obra' },
];

// fotos de bastidores (croquis, maquetes, obra, materiais) para as faixas que correm
export const BACKSTAGE = [
    [img('bts-1', 1440, 1800), img('bts-7', 1440, 1080), img('bts-2', 1440, 1440), img('bts-10', 1440, 1920), img('bts-5', 964, 692), img('bts-13', 725, 416), img('bts-12', 1440, 1757)],
    [img('bts-4', 2268, 2817, true), img('bts-8', 1440, 1085), img('bts-6', 1440, 1440), img('bts-11', 1440, 1920), img('bts-9', 1440, 1800), img('bts-14', 735, 527)],
];
