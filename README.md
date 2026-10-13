# Diego Silveira Arquitetura: portfólio

Site-portfólio do arquiteto Diego Silveira (Sul de Minas / Serra da Mantiqueira). O topo segue a coreografia do Grupo Mais Saúde: os projetos passam pela moldura atrás do Diego, o cartão do projeto gira no eixo Y, o fundo troca de cor, a palavra gigante troca letra a letra e as peças 3D (pórticos de aço, ripado, tijolo, vidro, laje) implodem e se montam de novo. Dá para **arrastar o palco para o lado** ou usar as setas. Cada projeto abre uma galeria com as fotos.

**No ar:** https://trheem.github.io/diego-silveira-arquitetura/ (GitHub Pages, branch `main`)

## Editar conteúdo

Tudo fica em [`assets/js/data.js`](assets/js/data.js):

- `PROJECTS`: nome, local, etiqueta, texto, fotos e cor de cada projeto.
- `HERO`: quais projetos passam no topo, na ordem.
- `SERVICES`, `STEPS`, `BACKSTAGE`: serviços, passos do processo e faixas de bastidores.
- `INSTAGRAM`: usuário do Instagram (os botões de contato abrem o Direct).
- `WHATSAPP`: vazio por padrão. Com um número (`55` + DDD + número, só dígitos), todos os botões de contato passam a abrir o WhatsApp com mensagem pronta.

Fotos novas: exporte em WebP para `assets/img/<nome>-800.webp` (e `-1600.webp` para fotos grandes, com `big: true`). Ao trocar uma foto, prefira um nome novo para não pegar cache antigo.

## Publicar

```sh
git push   # o GitHub Pages publica a branch main em ~1 min
```

## Rodar localmente

```sh
python3 -m http.server 4410
# abra http://localhost:4410
```

Precisa de servidor (módulos ES não abrem via `file://`).

## Estrutura

| Caminho | O que é |
|---|---|
| `index.html` | Marcação, CSP, SEO, dados estruturados e sprite de ícones |
| `assets/css/main.css` | Estilos e tokens (cores chapadas, cantos retos) |
| `assets/js/boot.js` | Marca `js`/`motion` antes da pintura |
| `assets/js/main.js` | Topo (giro, arrastar, setas, troca automática), galeria, rolagens |
| `assets/js/hero3d.js` | Peças 3D do topo (Three.js, carregado depois da página) |
| `assets/fonts/` | Jost variável (SIL OFL 1.1, Fontsource `@fontsource-variable/jost` 5.3.0) |
| `assets/vendor/` | GSAP 3.15.0 (+ScrollTrigger, SplitText) e Three.js r169, servidos pelo próprio site |

## Segurança e desempenho

- Content-Security-Policy sem scripts nem estilos inline; nenhuma requisição a terceiros.
- Todo texto renderizado pelo JS sai de `data.js` e passa por escape; links externos com `rel="noopener noreferrer"`; mensagem do WhatsApp com `encodeURIComponent`; número validado (12 ou 13 dígitos).
- GitHub Pages serve com HTTPS. Ele não aceita cabeçalhos próprios, então a proteção fica na CSP via `<meta>` (sem `frame-ancestors`, que só funciona por cabeçalho).
- Sem formulários, sem backend, sem cookies, sem analytics.
- A cena 3D só carrega depois da página pronta e pausa fora da tela; a troca automática pausa no mouse, no foco e fora da tela, e para quando a pessoa assume.
- Respeita `prefers-reduced-motion` (sem cortina, sem troca automática, sem peças flutuando, cartões do processo sem empilhar).

## Origem do conteúdo

- Fotos, renders, croquis e textos: posts do Instagram @diegoarquitetura (pasta de download local). Nomes das casas, cidades, áreas (250 m², 191 m²) e "Estudo preliminar" saem das legendas e pranchas dos posts.
- Foto do Diego: quadro do vídeo em parceria com a Comap Exclusive, com o fundo removido (modelo ISNet, local).
- A placa de obra "Diego Silveira / Arquitetura contemporânea" definiu as cores (vermelho e grafite) e o logo D|S.

## Pendências para o Diego confirmar

- **WhatsApp:** a prancha da Casa G|H mostra um telefone no campo "Contato", mas ele pode ser do cliente, então não foi publicado. Confirme o número do Diego e preencha `WHATSAPP` em `data.js`.
- Cidade-base do escritório (o site diz "Sul de Minas"; os projetos com cidade são em Pouso Alegre, Gonçalves e São Bento do Sapucaí).
- Nomes dos projetos sem nome nos posts ("Casa na mata", "Residência com automação", "Casa de campo", "Casa no vale") são descritivos.
- Quais imagens são render e quais são obra pronta, se ele quiser marcar isso.
- Registro no CAU, se quiser exibir.
