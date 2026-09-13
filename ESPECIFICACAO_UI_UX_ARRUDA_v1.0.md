# ESPECIFICAÇÃO DE UI/UX v1.0 — ARRUDA MÓVEIS ELETRO

## 1. Identidade Visual e Aplicação da Logo
* **Marca:** Arruda Móveis Eletro.
* **Proposta de Valor:** Confiança, variedade, preços competitivos e atendimento direto via WhatsApp.
* **Aplicação da Logo:**
  * **Header:** Versão horizontal com contraste elevado (fundo escuro: logo com tipografia branca/amarela; fundo claro: versão com texto em azul marinho).
  * **Dimensões mínimas:** Altura mínima de 36px no mobile e 48px no desktop para preservar legibilidade.
  * **Favicon & PWA Icon:** Ícone do isotipo simplificado em 32x32, 192x192 e 512x512.

---

## 2. Paleta e Tokens de Cores

### 2.1 Cores Primárias e Marca
* `--color-brand-primary`: `#0b172a` (Azul escuro profundo — estrutura, header, footer e tipografia de alto contraste).
* `--color-brand-secondary`: `#1e293b` (Azul ardósia escuro — superfícies elevadas e cabeçalhos secundários).
* `--color-brand-accent`: `#2563eb` (Azul elétrico — links interativos e foco).

### 2.2 Cores Comerciais e Destaque
* `--color-accent-highlight`: `#facc15` (Amarelo vibrante — badges de oferta, destaque de preço promocional e CTAs de conversão secundários).
* `--color-accent-hover`: `#eab308` (Amarelo escuro — hover de botões de destaque).
* `--color-whatsapp`: `#22c55e` (Verde oficial WhatsApp — CTA de conversão principal).
* `--color-whatsapp-hover`: `#16a34a` (Verde escuro WhatsApp — hover do CTA).

### 2.3 Superfícies e Neutros
* `--color-bg-base`: `#f8fafc` (Off-white / Slate 50 — fundo geral da aplicação).
* `--color-bg-surface`: `#ffffff` (Branco puro — cards, modais, drawers e formulários).
* `--color-bg-muted`: `#f1f5f9` (Slate 100 — áreas de inputs e placeholders).
* `--color-border`: `#e2e8f0` (Slate 200 — divisores e bordas de cards).
* `--color-border-hover`: `#cbd5e1` (Slate 300).

### 2.4 Tipografia e Textos
* `--color-text-primary`: `#0f172a` (Slate 900 — títulos e textos com alta ênfase).
* `--color-text-secondary`: `#475569` (Slate 600 — descrições e legendas).
* `--color-text-muted`: `#94a3b8` (Slate 400 — placeholders e textos desativados).
* `--color-text-inverse`: `#ffffff` (Texto claro sobre superfícies escuras).

### 2.5 Estados Semânticos
* `--color-success`: `#16a34a` (Verde confirmação).
* `--color-warning`: `#f59e0b` (Âmbar alertas).
* `--color-error`: `#dc2626` (Vermelho erros e validações).
* `--color-info`: `#0284c7` (Azul informativo).

---

## 3. Tipografia
* **Família Principal:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `sans-serif`.
* **Família de Títulos/Destaques:** `Outfit` ou `Inter` com tracking ajustado.
* **Escala Tipográfica:**
  * `display`: 2.5rem (40px) | line-height: 1.2 | weight: 800 (Hero mobile: 2rem).
  * `h1`: 2rem (32px) | line-height: 1.25 | weight: 700.
  * `h2`: 1.5rem (24px) | line-height: 1.3 | weight: 700.
  * `h3`: 1.25rem (20px) | line-height: 1.4 | weight: 600.
  * `body-lg`: 1.125rem (18px) | line-height: 1.5 | weight: 400/500.
  * `body`: 1rem (16px) | line-height: 1.5 | weight: 400/500.
  * `body-sm`: 0.875rem (14px) | line-height: 1.4 | weight: 400/500.
  * `caption`: 0.75rem (12px) | line-height: 1.3 | weight: 500.

---

## 4. Espaçamentos e Grid
* **Base Unit:** 4px (Grid modular de 8pt).
* **Escala:**
  * `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 32px | `2xl`: 48px | `3xl`: 64px.
* **Contêineres:**
  * Largura máxima: `1280px` com padding horizontal de 16px (mobile) e 32px (desktop).
* **Border Radius:**
  * `radius-sm`: 4px | `radius-md`: 8px | `radius-lg`: 12px | `radius-xl`: 16px | `radius-full`: 9999px.

---

## 5. Header, Hero e Footer

### 5.1 Header
* **Comportamento:** Sticky no topo com `backdrop-filter: blur(8px)` e borda sutil inferior.
* **Elementos:**
  1. Logo Arruda Móveis Eletro (à esquerda).
  2. Barra de pesquisa com auto-complete rápido (ao centro no desktop; expansível no mobile).
  3. Navegação rápida: Categorias, Ofertas, Destaques.
  4. Botão rápido de WhatsApp com indicador de status online (pulsing badge verde).
* **Mobile:** Menu hamburguer à esquerda acionando gaveta (Drawer) lateral com categorias e canais de atendimento.

### 5.2 Hero / Banner
* **Hierarquia:**
  * H1 de impacto com promessa comercial clara (ex.: "Transforme sua casa com os melhores móveis e eletros").
  * Subtítulo dinâmico indicando condições comerciais ("Entrega rápida, condições facilitadas e ofertas semanais").
  * CTAs principais: Botão Amarelo Primário "VER OFERTAS" e Botão Secundário Transparente/Borda "FALAR NO WHATSAPP".
  * Carrossel de banners com suporte a gestos touch (swipe), paginação em bullets e setas de navegação acessíveis.

### 5.3 Footer
* **Fundo escuro (`#0b172a`)** com contraste garantido.
* **Seções:**
  * Dados institucionais, Razão Social e CNPJ.
  * Endereço físico da loja e horários de atendimento.
  * Links diretos para Categorias, Ofertas e Política de Privacidade (LGPD).
  * Canal oficial de atendimento WhatsApp e redes sociais.

---

## 6. Catálogo (`/catalogo`)
* **Layout:** Sidebar de filtros à esquerda (desktop) e botão flutuante/topo "Filtrar" abrindo Drawer (mobile).
* **Filtros Disponíveis:**
  * Categoria (checkbox / tags).
  * Faixa de preço (sliders e inputs de mínimo/máximo).
  * Apenas ofertas com desconto ativo.
  * Disponibilidade (Em estoque).
* **Ordenação:**
  * Destaques, Menor Preço, Maior Preço, Mais Recentes e Mais Vistos.
* **Grid:**
  * Mobile (360px–640px): 2 colunas compactas.
  * Tablet (641px–1024px): 3 colunas.
  * Desktop (>1024px): 4 colunas.
* **Paginação:** Carregamento progressivo com botão "Carregar mais produtos" e contagem visível ("Exibindo X de Y produtos").

---

## 7. Categorias
* **Carrossel de Categorias na Home:** Cards com ícones representativos ou fotos recortadas, rótulo em negrito e hover com elevação.
* **Página da Categoria (`/categoria/[slug]`):**
  * Banner da categoria com título H1 e descrição curta.
  * Grid filtrado automaticamente e ordenação preservada.

---

## 8. Ofertas e Campanhas
* **Badge de Desconto:** Etiqueta no canto superior esquerdo do card (`-X% OFF`) em fundo amarelo com texto escuro.
* **Preços de Oferta:**
  * Preço anterior riscado (`R$ 999,00` em cinza tachado).
  * Preço promocional em destaque (`R$ 799,00` em azul escuro ou amarelo bold).
  * Condição de pagamento em texto complementar ("ou até 10x sem juros").
* **Página de Ofertas (`/ofertas`):** Exibe exclusivamente produtos com status de oferta ativo (`ACTIVE`) dentro da data de vigência.

---

## 9. ProductCard (Anatomia do Card de Produto)
1. **Container:** Fundo branco, borda de 1px suave, `radius-lg`, transição suave de elevação (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`).
2. **Área da Imagem:** Aspect ratio fixo 1:1 (quadrado), imagem principal em WebP com lazy loading nativo.
3. **Badges sobrepostos:** Selo "OFERTA", "DESTAQUE" ou "-XX%".
4. **Conteúdo:**
   * Categoria em caption cinza.
   * Título do produto limitado a 2 linhas (`line-clamp: 2`).
   * Bloco de preço (riscado + preço ativo).
   * Texto de parcelamento.
5. **Ação Rápida:** Botão de ação direta "Tenho Interesse" direcionando ou ao detalhe ou direto com mensagem WhatsApp gerada para o produto.

---

## 10. Página de Produto (`/produto/[slug]`)
* **Estrutura:**
  * Breadcrumb navegável: Home > Categoria > Nome do Produto.
  * Coluna Esquerda: Galeria de Imagens interativa.
  * Coluna Direita:
    * Nome completo (H1).
    * SKU e marca.
    * Bloco de preços consolidado.
    * Botão CTA Primário em destaque: **"Comprar pelo WhatsApp"** (Verde WhatsApp com ícone, largura 100%).
    * Botão Secundário: **"Compartilhar"** (Gera link ou abre Web Share).
    * Ficha técnica com dimensões (L x A x P), peso, material, cor e acabamento.
    * Bloco de descrição detalhada.
* **Mobile:** Barra de CTA flutuante fixa no rodapé da tela com preço e botão WhatsApp sempre acessível durante o scroll.

---

## 11. Galeria de Imagens
* Foto principal em alta resolução com aspect-ratio reservado (evitar layout shift - CLS).
* Miniaturas laterais (desktop) ou horizontais no rodapé (mobile).
* Suporte nativo a gestos de swipe horizontal em dispositivos móveis.
* Zoom com clique para visualização em tela cheia (Lightbox acessível com tecla `ESC` para fechar).

---

## 12. WhatsApp e Compartilhamento
* **Mensagem Contextual do WhatsApp:**
  * URL codificada no formato:
    `https://wa.me/{WHATSAPP_NUMBER}?text={TEXTO_CODIFICADO}`
  * Conteúdo padrão: *"Olá! Gostaria de mais informações sobre o produto [NOME] (SKU: [SKU]) que vi no catálogo da Arruda Móveis."*
* **Compartilhamento:**
  * Suporte à `navigator.share` (Web Share API) no celular.
  * Fallback com botão "Copiar link" que exibe Toast de feedback imediato ("Link copiado com sucesso!").
  * Open Graph completo com meta tags `og:title`, `og:image`, `og:description` e `og:url` para preview rico no WhatsApp.

---

## 13. Painel Administrativo (`/admin`)
* **Layout:**
  * Sidebar retrátil: Logo, Navegação (Dashboard, Produtos, Categorias, Ofertas, Mídia, Configurações).
  * Topbar: Nome do usuário autenticado, badge de papel (Admin/Gerente/Operador) e botão de Logout.
  * Área central com tabelas responsivas, busca rápida, paginação e ações contextuais (Editar, Duplicar, Excluir, Publicar/Despublicar).
* **Formulários:** Organizados em cards temáticos (Identificação, Comercial, Atributos Técnicos, Galeria de Fotos e Status de Publicação).

---

## 14. Upload e Gestão de Imagens
* **Área de Dropzone:** Arraste e solte com suporte a seleção múltipla.
* **Validação em Tempo Real:** Formatos permitidos (JPEG, PNG, WebP) e limite de tamanho por arquivo.
* **Pré-visualização e Reordenação:** Drag and drop para ordenar a sequência de exibição e botão de estrela para definir a "Foto Principal".
* **Feedback de Upload:** Barra de progresso individual e status de processamento (WebP/Thumbnail).

---

## 15. Estados da Interface
1. **Loading:**
   * Skeletons animados com gradiente de pulso (`skeleton shimmer`) simulando cards, títulos e imagens.
   * Botões exibindo spinner e estado desabilitado durante requisições assíncronas.
2. **Empty States:**
   * Ilustração amigável ou ícone contextualizado.
   * Texto explicativo: "Nenhum produto encontrado com estes filtros".
   * Ação de recuperação: Botão "Limpar filtros" ou "Ver todos os produtos".
3. **Error States:**
   * Feedback inline nos campos de formulário inválidos.
   * Telas de erro 404 e 500 com botão de retorno à Home.
   * Toasts com botão "Tentar novamente" em caso de falha de conexão.
4. **Success States:**
   * Toasts flutuantes com autoclose em 4 segundos para confirmações de salvamento e cópia de link.

---

## 16. Responsividade e Breakpoints
* **Mobile-First:** A interface é desenhada primeiro para 360px de largura e expande até resoluções ultrawide.
* **Breakpoints:**
  * `sm`: 640px
  * `md`: 768px
  * `lg`: 1024px
  * `xl`: 1280px
  * `2xl`: 1536px
* **Áreas de Toque:** Elementos clicáveis com no mínimo `44x44px` no mobile.

---

## 17. Acessibilidade (WCAG 2.2 AA)
* **Contraste Mínimo:** Razão de contraste de no mínimo 4.5:1 para textos normais e 3:1 para textos grandes e componentes de interface.
* **Navegação por Teclado:** Ordem lógica de tabulação, anéis de foco visíveis (`outline: 2px solid var(--color-brand-accent)`).
* **Semântica:** Uso rigoroso de tags HTML5 (`<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<aside>`).
* **Leitores de Tela:** Textos alternativos descritivos em todas as imagens (`alt`), rótulos claros em botões de ícone (`aria-label`).

---

## 18. Design System e Componentes Core
1. `Button` (variantes: `primary`, `secondary`, `whatsapp`, `outline`, `ghost`; tamanhos: `sm`, `md`, `lg`).
2. `Input` / `Select` (com label flutuante ou fixa, mensagem de erro e suporte a ícones).
3. `Badge` (variantes: `oferta`, `destaque`, `sucesso`, `neutro`).
4. `Card` / `ProductCard` (estruturado com imagem, tags, título, preços e CTA).
5. `Modal` / `Drawer` (gerenciamento de foco, fechamento por `Esc` e clique no backdrop).
6. `Toast` (notificações não intrusivas).
7. `Pagination` (navegação acessível entre páginas).
8. `ImageGallery` (slider, thumbnails e lightbox).
9. `SearchBar` (input acessível com limpeza rápida).

---

## 19. Microinterações e Transições
* Efeito hover com elevação suave (`transform: translateY(-2px)` e aumento sutil de sombra).
* Feedback de clique com efeito ripple ou escala sutil (`active: scale(0.98)`).
* Transições padronizadas de 150ms a 250ms com curva `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 20. SEO Visual e Performance
* Tags `<h1>` únicas e semânticas em cada rota.
* Atributos `width` e `height` declarados em tags `<img>` para zerar o Cumulative Layout Shift (CLS).
* Prioridade de carregamento (`priority`) na imagem principal do Hero e na primeira foto da página de produto.
* Formatos modernos de imagem com compressão WebP e thumbnails otimizadas.

---

## 21. Critérios de Aceitação de UI/UX
- [ ] Fidelidade às cores e contraste da identidade visual Arruda Móveis.
- [ ] Funcionamento completo em telas de 360px até 1920px.
- [ ] Header responsivo com menu hamburguer e busca no mobile.
- [ ] Cards de produto padronizados com cálculo visual de desconto.
- [ ] Barra fixa de conversão para WhatsApp no mobile durante o scroll da página do produto.
- [ ] Galeria de imagens fluida com suporte a gestos touch (swipe).
- [ ] Acessibilidade WCAG AA com foco visível e labels adequadas.
- [ ] Todos os estados implementados (loading, empty, error e success).

---

## 22. Ordem de Implementação UI/UX
1. Criação dos tokens CSS e variáveis globais do Design System.
2. Componentes atômicos: Button, Input, Badge, Typography, Card.
3. Componentes estruturais: Header, Hero, Footer, Drawer de navegação.
4. Componentes de domínio: ProductCard, CategoryCard, ImageGallery.
5. Montagem das telas públicas: Home, Catálogo, Detalhe do Produto, Ofertas.
6. Layout e componentes do Painel Administrativo.

---

## 23. Regras Específicas para a IDE
1. Não utilizar cores fora da paleta de tokens definida.
2. Não criar botões ou elementos de toque menores que 44px em visão mobile.
3. Não deixar imagens sem fallback de erro e sem texto alternativo (`alt`).
4. Evitar bibliotecas de componentes externas pesadas; priorizar CSS nativo limpo e modular.
5. Garantir que nenhuma quebra de layout ocorra ao redimensionar a janela entre 360px e 1440px.

---
**Fim da Especificação de UI/UX v1.0**
