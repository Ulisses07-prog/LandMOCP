# ESPECIFICAÇÃO TÉCNICA v1.0 — ARRUDA MÓVEIS ELETRO

## 1. Objetivo
Construir uma plataforma web de catálogo digital de produtos e ofertas, com landing page pública, catálogo, categorias, ofertas, páginas de produto, painel administrativo, gerenciamento de imagens, armazenamento local ou em nuvem, analytics, SEO, compartilhamento e conversão para WhatsApp.

O MVP será **catálogo comercial**, sem checkout/pagamento. A arquitetura deverá permitir evolução futura.

Fluxo:
**Cliente → Landing Page → Catálogo/Oferta → Produto → Tenho Interesse → WhatsApp → Vendedor**

## 2. Stack recomendada
- Frontend: Next.js + React + TypeScript.
- Backend: Python + FastAPI.
- Banco: PostgreSQL.
- ORM: SQLAlchemy.
- Validação: Pydantic.
- Migrações: Alembic.
- Infra: Docker/Docker Compose + proxy reverso + HTTPS.
- Testes: Pytest + Playwright.

A IDE só poderá substituir a stack mediante justificativa técnica documentada.

## 3. Arquitetura
```text
Internet
  ↓
Next.js
  ├── Área pública
  └── Área administrativa
          ↓
       FastAPI
  ├── Auth
  ├── Products
  ├── Categories
  ├── Offers
  ├── Campaigns
  ├── Media
  ├── Analytics
  └── Settings
          ↓
      PostgreSQL
          +
     Media Storage
       ├── Local
       └── Cloud
```

Princípios: baixo acoplamento, separação de responsabilidades, segurança por padrão, mobile first, SEO, performance, testabilidade e escalabilidade.

## 4. Identidade visual
Usar a logo fornecida da Arruda Móveis Eletro.

Paleta:
- azul escuro: estrutura/header/footer;
- azul/roxo: detalhes;
- amarelo: ofertas, preços e CTAs;
- branco/off-white: contraste;
- verde: uso pontual, principalmente WhatsApp.

A interface deve ser comercial, moderna, limpa e mobile first.

## 5. Área pública

### Home `/`
Ordem:
1. Header.
2. Hero/banner.
3. Categorias.
4. Ofertas da semana.
5. Produtos em destaque.
6. CTA WhatsApp.
7. Informações da loja.
8. Footer.

Header: logo, menu, busca, ofertas e WhatsApp.

Hero: banner, título, subtítulo e CTA “VER OFERTAS”.

### Catálogo `/catalogo`
- grid responsivo;
- busca;
- categoria;
- faixa de preço;
- ofertas;
- ordenação;
- paginação ou carregamento progressivo.

Ordenação: recentes, menor preço, maior preço, mais vistos e destaque.

### Categorias
Inicialmente:
Sala, Quarto, Cozinha, Mesas e cadeiras, Racks e painéis, Armários, Escritório, Eletro e Ofertas.

Categorias serão administráveis.

### Categoria `/categoria/[slug]`
Exibir nome, descrição, imagem, produtos, filtros e ordenação.

### Ofertas `/ofertas`
Exibir somente ofertas ativas, com preço anterior, preço atual, desconto, condição e CTA.

### Produto `/produto/[slug]`
Exibir:
- breadcrumb;
- galeria;
- nome;
- SKU;
- categoria;
- preço;
- preço promocional;
- desconto;
- parcelamento;
- descrição;
- características;
- dimensões;
- material;
- cores;
- disponibilidade;
- relacionados;
- compartilhar;
- WhatsApp.

Galeria deve suportar miniaturas, navegação e swipe mobile.

### Campanha `/campanha/[slug]`
Campos: nome, descrição, banner, produtos, início, término e status.

## 6. WhatsApp
Criar `WhatsAppService`.

O número nunca deverá ficar hardcoded no frontend; ficará nas configurações.

Mensagem padrão:
“Olá! Tenho interesse no produto [NOME], código [SKU], anunciado no catálogo da Arruda Móveis.”

Com campanha:
“Olá! Vi a oferta [PRODUTO] na campanha [CAMPANHA] da Arruda Móveis e gostaria de saber mais.”

Registrar clique em WhatsApp para analytics.

## 7. Compartilhamento
Criar `ShareProduct` com:
- WhatsApp;
- Web Share API;
- copiar URL.

Implementar Open Graph por produto:
`og:title`, `og:description`, `og:image`, `og:url`, `og:type`.

## 8. Produto — modelo
Campos:
- id;
- name;
- slug;
- sku;
- category;
- brand;
- short_description;
- description;
- price;
- old_price;
- promo_price;
- payment_condition;
- dimensions;
- weight;
- material;
- color;
- availability;
- stock opcional;
- tags;
- is_featured;
- status;
- published_at;
- created_at;
- updated_at;
- foto principal.

Regras:
- nome, categoria e preço obrigatórios;
- slug único;
- SKU único se informado;
- publicado precisa de imagem principal;
- draft não aparece publicamente;
- archived não aparece publicamente;
- duplicação cria novo produto em draft.

## 9. Ofertas
Oferta é propriedade comercial do produto.

Campos:
- product_id;
- promo_price;
- discount_percent;
- starts_at;
- ends_at;
- promotional_text;
- featured;
- active.

Regras:
- início não pode ser posterior ao término;
- preço promocional deve ser válido;
- preço original não é sobrescrito;
- oferta expirada deixa de aparecer como ativa;
- produto continua no catálogo;
- permitir nova oferta posteriormente.

Status:
`SCHEDULED`, `ACTIVE`, `EXPIRED`, `DISABLED`.

## 10. Imagens e mídia
O painel deverá permitir:
- seleção múltipla;
- drag and drop;
- upload por celular/computador;
- preview;
- foto principal;
- ordenação;
- exclusão.

Formatos iniciais: JPG/JPEG, PNG e WEBP.

Processamento:
```text
Upload → validação MIME/extensão/tamanho → decodificação
→ redimensionamento → compressão → WebP → thumbnail → storage → banco
```

Nunca confiar somente na extensão.

Criar `MediaStorage`:
```text
MediaStorage
├── LocalMediaStorage
└── CloudMediaStorage
```

Interface mínima:
`upload()`, `delete()`, `get_url()`, `exists()`.

Configuração:
`MEDIA_STORAGE=local` ou `MEDIA_STORAGE=cloud`.

A aplicação deverá depender da interface, não de um provedor específico.

Biblioteca `/admin/media`:
- visualizar;
- pesquisar;
- filtrar;
- identificar uso;
- excluir com segurança;
- mostrar tamanho, dimensões e tipo.

## 11. Painel administrativo
Base `/admin`, login `/admin/login`, dashboard `/admin/dashboard`.

Menu:
- Dashboard;
- Produtos;
- Categorias;
- Ofertas;
- Campanhas;
- Mídia;
- Analytics;
- Usuários;
- Configurações;
- Logs;
- Backup.

Dashboard:
- produtos publicados;
- rascunhos;
- ofertas ativas;
- visualizações;
- cliques WhatsApp;
- produtos mais vistos;
- ofertas mais acessadas;
- últimos produtos.

Períodos: hoje, 7 dias, 30 dias e personalizado.

## 12. CRUD de produtos
Rotas:
`/admin/products`
`/admin/products/new`
`/admin/products/[id]`

Formulário dividido em:
- Identificação;
- Comercial;
- Características;
- Publicação;
- Oferta;
- Mídia.

Operações:
criar, visualizar, editar, duplicar, publicar, despublicar, arquivar e excluir.

Preferir exclusão lógica para registros importantes.

## 13. Categorias
CRUD em `/admin/categories`.

Campos:
nome, slug, descrição, imagem, ordem e status.

## 14. Usuários e permissões
Papéis:
- Administrador: tudo.
- Gerente: produtos, ofertas, categorias, mídia e analytics.
- Operador: cadastro/edição de produtos e imagens.

A autorização deve ser validada no backend, não apenas no frontend.

## 15. Autenticação
Implementar:
- login/logout;
- sessão segura;
- hash forte;
- recuperação de senha;
- proteção contra tentativas excessivas;
- expiração;
- autorização.

Em produção: cookies Secure, HttpOnly e SameSite adequado.

Nunca armazenar senha em texto puro.

## 16. Configurações
Permitir:
- nome;
- logo;
- WhatsApp;
- telefone;
- endereço;
- horário;
- redes sociais;
- produtos por página;
- textos padrão;
- storage;
- qualidade de imagem;
- limites;
- SEO.

## 17. Banco de dados
Tabelas principais:
```text
users
roles
categories
products
product_images
offers
campaigns
campaign_products
media
settings
analytics_events
audit_logs
```

Relacionamentos:
```text
Category 1 ─── N Product
Product 1 ─── N ProductImage
Product 1 ─── 0..1 Offer
Campaign N ─── N Product
User 1 ─── N AuditLog
```

### users
`id, name, email, password_hash, role_id, active, created_at, updated_at, last_login_at`

### categories
`id, name, slug, description, image_id, sort_order, active, created_at, updated_at`

### products
`id, category_id, name, slug, sku, brand, short_description, description, price, old_price, promo_price, payment_condition, dimensions, weight, material, color, availability, stock, is_featured, status, created_at, updated_at, published_at`

### product_images
`id, product_id, storage_key, url, alt_text, sort_order, is_primary, width, height, file_size, mime_type, created_at`

### offers
`id, product_id, promo_price, discount_percent, starts_at, ends_at, promotional_text, featured, active, created_at, updated_at`

### campaigns
`id, name, slug, description, banner_media_id, starts_at, ends_at, active, created_at, updated_at`

### analytics_events
`id, event_type, product_id, category_id, campaign_id, session_hash, metadata, created_at`

### audit_logs
`id, user_id, action, entity_type, entity_id, metadata, created_at`

## 18. API
Prefixo `/api/v1`.

Auth:
```text
POST /auth/login
POST /auth/logout
GET  /auth/me
POST /auth/forgot-password
POST /auth/reset-password
```

Produtos:
```text
GET    /products
GET    /products/{slug}
GET    /products/{id}
POST   /products
PUT    /products/{id}
DELETE /products/{id}
POST   /products/{id}/publish
POST   /products/{id}/unpublish
POST   /products/{id}/duplicate
```

Categorias:
```text
GET    /categories
GET    /categories/{slug}
POST   /categories
PUT    /categories/{id}
DELETE /categories/{id}
```

Ofertas:
```text
GET    /offers
POST   /offers
GET    /offers/{id}
PUT    /offers/{id}
DELETE /offers/{id}
```

Campanhas:
```text
GET    /campaigns
POST   /campaigns
GET    /campaigns/{slug}
PUT    /campaigns/{id}
DELETE /campaigns/{id}
```

Mídia:
```text
POST   /media/upload
GET    /media
DELETE /media/{id}
POST   /media/{id}/associate
```

Analytics:
```text
POST /analytics/events
GET  /analytics/dashboard
```

Configurações:
```text
GET /settings
PUT /settings
```

Resposta:
```json
{"data": {}, "meta": {}}
```

Erro:
```json
{"error": {"code": "PRODUCT_NOT_FOUND", "message": "Produto não encontrado."}}
```

## 19. Design system
Criar tokens centralizados para:
- cores;
- tipografia;
- espaçamento;
- radius;
- sombras;
- breakpoints.

Componentes:
`Button, Input, Select, Modal, Drawer, Card, Badge, Toast, Table, Pagination, Upload, ImageGallery, Price, ProductCard, SearchBar`.

Todos devem possuir estados loading, empty, error, success e disabled quando aplicável.

## 20. Responsividade
Mobile First.

No mobile:
- menu compacto;
- cards adaptáveis;
- filtros em drawer;
- galeria com swipe;
- CTA WhatsApp sempre acessível;
- áreas de toque adequadas.

## 21. SEO
Implementar:
- metadata por página;
- metadata por produto;
- canonical;
- sitemap;
- robots;
- Open Graph;
- URLs amigáveis;
- headings semânticos;
- alt text;
- dados estruturados Product quando aplicável.

## 22. Performance
- WebP;
- thumbnails;
- lazy loading;
- cache;
- SSR/SSG quando adequado;
- paginação;
- índices no banco;
- redução de JavaScript;
- imagens otimizadas.

## 23. Analytics
Eventos:
`PAGE_VIEW`, `PRODUCT_VIEW`, `CATEGORY_VIEW`, `SEARCH`, `OFFER_VIEW`, `WHATSAPP_CLICK`, `SHARE`.

Não registrar PII desnecessária.

## 24. Segurança
- HTTPS;
- validação e sanitização;
- autorização no backend;
- rate limiting;
- headers de segurança;
- proteção contra upload malicioso;
- path traversal;
- logs;
- secrets somente em variáveis de ambiente.

Upload:
- validar MIME real;
- validar extensão;
- limitar tamanho/dimensões;
- decodificar imagem;
- renomear arquivo;
- não executar upload;
- armazenar fora de área executável quando possível.

## 25. LGPD
- coletar somente o necessário;
- política de privacidade;
- consentimento quando aplicável;
- não armazenar conversas WhatsApp sem necessidade;
- evitar dados pessoais desnecessários.

## 26. Auditoria
Registrar:
- login/logout;
- criação;
- alteração;
- exclusão;
- publicação/despublicação;
- alteração de preço;
- alteração de oferta;
- upload;
- exclusão de mídia;
- configurações críticas.

Não registrar senhas, tokens ou credenciais.

## 27. Backup
Backup de:
- banco;
- imagens.

Deve possuir:
- frequência;
- retenção;
- verificação;
- procedimento de restauração;
- teste periódico de restauração.

## 28. Ambientes
`development`, `staging`, `production`.

`.env.example`:
```text
APP_ENV=
DATABASE_URL=
SECRET_KEY=
MEDIA_STORAGE=
MEDIA_LOCAL_PATH=
CLOUD_PROVIDER=
CLOUD_BUCKET=
CLOUD_ACCESS_KEY=
CLOUD_SECRET_KEY=
WHATSAPP_NUMBER=
```

Nenhuma credencial real no repositório.

## 29. Estrutura do projeto
```text
arruda-catalogo/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   └── styles/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── repositories/
│   │   ├── services/
│   │   ├── integrations/
│   │   └── main.py
│   ├── migrations/
│   └── tests/
├── media/
├── docs/
├── scripts/
├── .env.example
├── docker-compose.yml
└── README.md
```

## 30. Testes
Unitários:
- regras de oferta;
- desconto;
- slug;
- validações;
- permissões;
- storage;
- WhatsApp.

Integração:
- banco;
- API;
- upload;
- autenticação;
- publicação.

E2E:
```text
Login → categoria → produto → fotos → oferta → publicar
→ catálogo → produto → WhatsApp
```

## 31. Observabilidade
Preparar:
- logs estruturados;
- `/health`;
- `/ready`;
- monitoramento de erros.

## 32. Acessibilidade
- HTML semântico;
- labels;
- foco visível;
- teclado;
- contraste;
- alt text;
- erros acessíveis.

## 33. PWA
Preparar manifest, ícones, service worker e estratégia de cache. Ativação completa fica fora do MVP.

## 34. Fases
1. Fundação: Git, Docker, frontend, backend, banco, lint e testes.
2. Banco/API: models, migrations, schemas, services e endpoints.
3. Auth: usuários, papéis e sessões.
4. Produtos e categorias.
5. Mídia e storage.
6. Ofertas e campanhas.
7. Landing page e catálogo.
8. Produto, compartilhamento e WhatsApp.
9. Dashboard e analytics.
10. SEO, performance e acessibilidade.
11. Segurança, auditoria e backup.
12. E2E, homologação e deploy.

## 35. Critérios de aceitação
- [ ] Build de produção.
- [ ] Migrations funcionando.
- [ ] Login seguro.
- [ ] Permissões no backend.
- [ ] CRUD de categorias.
- [ ] CRUD de produtos.
- [ ] Upload múltiplo.
- [ ] Foto principal.
- [ ] Ordenação de fotos.
- [ ] Otimização/WebP.
- [ ] Storage local.
- [ ] Abstração cloud.
- [ ] Ofertas.
- [ ] Expiração automática.
- [ ] Catálogo.
- [ ] Busca/filtros.
- [ ] Página de produto.
- [ ] WhatsApp.
- [ ] Compartilhamento/Open Graph.
- [ ] SEO.
- [ ] Analytics.
- [ ] Responsividade.
- [ ] Segurança.
- [ ] Logs.
- [ ] Backup.
- [ ] Testes críticos.

## 36. Regras para a IDE
1. Ler esta especificação inteira antes de programar.
2. Não alterar arquitetura sem justificativa.
3. Não remover funcionalidades sem autorização.
4. Não colocar credenciais no código.
5. Não armazenar senhas em texto puro.
6. Validar todos os uploads.
7. Não acoplar o sistema a um único storage.
8. Separar UI, API, serviços e persistência.
9. Criar testes para funcionalidades críticas.
10. Manter `.env.example`.
11. Usar migrations.
12. Nunca apagar dados reais em scripts de desenvolvimento.
13. Usar dados fictícios no desenvolvimento.
14. Garantir mobile.
15. Documentar decisões relevantes.
16. Após cada fase, executar testes, corrigir erros e informar arquivos, funcionalidades, testes, pendências e próximos passos.
17. Não considerar uma fase concluída sem validação.

## 37. Fora do MVP, mas preparado
- múltiplos vendedores;
- distribuição de leads;
- carrinho;
- checkout;
- pagamentos;
- estoque/ERP;
- CRM;
- cupons;
- favoritos;
- comparação;
- importação Excel/CSV;
- redes sociais;
- PWA;
- aplicativo;
- notificações;
- campanhas avançadas.

## 38. Definição de pronto
Uma funcionalidade só estará concluída quando houver:
**Código + validação + teste + tratamento de erro + responsividade + segurança + documentação.**

**Fim da Especificação Técnica v1.0**
