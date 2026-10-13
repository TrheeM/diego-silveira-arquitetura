# Design: Diego Silveira Arquitetura

Prancheta, não vitrine de IA. Cores chapadas, cantos retos, linhas finas de grade e de curva de nível, tipografia geométrica como a placa de obra. Nenhum degradê, vidro fosco ou sombra difusa.

## Cor (papéis fixos)

| Token | Valor | Papel |
|---|---|---|
| `--brand` | `#e3323b` | Vermelho da placa: nome, display grande, barra do D\|S, faixa |
| `--red` / `--red-hi` | `#c9252f` / `#e0333d` | Botões e texto pequeno sobre claro (AA) |
| `--red-soft` | `#ff6a70` | Vermelho legível sobre escuro |
| `--ink` / `--ink-soft` | `#141618` / `#1f2226` | Grafite: cabeçalho, serviços, processo, rodapé |
| `--paper` / `--paper-2` / `--card` | `#f2efe9` / `#e6e1d7` / `#fbfaf7` | Papel de croqui para leitura |
| Tema do topo | `--bg-mid`, `--bg-outer`, `--glow` | Uma cor chapada por projeto (data.js `theme`), animada pelo GSAP |

## Tipo

- **Jost** (geométrica, parente da letra da placa) em tudo. Títulos 500 com tracking negativo; rótulos em caixa alta com tracking largo.
- Palavra gigante do topo vazada (contorno), com a barra "|" do código da casa em vermelho.

## Componentes

- **Logo D|S**: quadrado grafite, barra vermelha entre as letras (como "casa D|P" nos posts) + nome em caixa alta.
- **Moldura do topo**: quadrado com filete externo; dentro, a foto do projeto. O Diego fica na frente, recortado nos lados e no pé, com a cabeça saindo por cima.
- **Cartão do projeto**: foto 4:5 + etiqueta, nome e cidade; gira no eixo Y na troca; clique abre a galeria.
- **Seletor**: miniatura + nome + cidade, barra de tempo vermelha.
- **Projetos**: mosaico 12 colunas; legenda chapada em papel com filete vermelho (carimbo de prancha), seta em quadrado vermelho.
- **Serviços**: cartões grafite numerados (número vazado), ícone em quadrado branco, etiquetas com filete.
- **Processo**: cartões que empilham presos ao topo; o de baixo encolhe e escurece.
- **Contato**: bloco vermelho chapado com curvas de nível em linha branca.
- Raio: 0 em tudo.

## Movimento

- Entrada: curvas de nível correm, D|S se desenha a lápis, cortina sobe; título sobe palavra por palavra; moldura abre de baixo; Diego sobe do desfoque; cartão gira de -200°; peças 3D se montam a partir da moldura; palavra gigante entra letra a letra.
- Troca de projeto: cor do fundo em 1.5 s; foto da moldura abre em círculo a partir do chão; cartão 0→360 (power2.in, desfoque) → 360→720 (back.out); palavra sai e entra; peças implodem e explodem; Diego dá um passo para trás e volta. Autoplay de 6 s.
- Cursor: cartão inclina e flutua, Diego e moldura andam em camadas opostas, peças fogem do cursor, botões magnéticos.
- Rolagem: títulos por linha; fotos dos projetos abrem de baixo e deslizam por dentro; serviços fixam e correm na horizontal com medidor; foto do Sobre abre e anda devagar; processo empilha; faixas de bastidores e a faixa vermelha aceleram com a velocidade da rolagem; bloco de contato cresce e desenha as curvas.
- `prefers-reduced-motion`: tudo estático.
