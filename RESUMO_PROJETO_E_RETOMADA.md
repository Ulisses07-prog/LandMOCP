# 📋 Resumo Executivo & Guia de Retomada — Arruda Móveis

Data da última atualização: **16/10/2026**  
Status: **Ambientes de Produção Online (Render + Vercel)**

---

## 🌐 Links Ativos em Produção

* **Site Oficial / Catálogo (Vercel):** [https://arruda-moveis.vercel.app](https://arruda-moveis.vercel.app)
* **Catálogo com Filtros:** [https://arruda-moveis.vercel.app/catalogo](https://arruda-moveis.vercel.app/catalogo)
* **Backend API (Render):** [https://landmocp.onrender.com](https://landmocp.onrender.com)
* **Documentação da API (Swagger):** [https://landmocp.onrender.com/docs](https://landmocp.onrender.com/docs)
* **Repositório GitHub:** [https://github.com/Ulisses07-prog/LandMOCP](https://github.com/Ulisses07-prog/LandMOCP) (Branch: `main`)

---

## 📦 Dados & Funcionalidades Implementadas

### 1. Base de Dados
* **12.330 produtos** processados a partir das planilhas oficiais.
* **2.136 produtos com pronta entrega** (estoque físico confirmado em filiais).
* **50 subgrupos cadastrados** (Roupeiro, Rack, Fogão, Colchão, Cama Box, Painel, Bicicleta, etc.).
* Banco SQLite (`dev_database.db`) versionado no repositório para o Render.

### 2. Backend (FastAPI + SQLAlchemy)
* **Ordenação com Prioridade de Pronta Entrega:** Itens com estoque > 0 são retornados prioritariamente no topo do catálogo.
* **Endpoint de Subgrupos:** `GET /api/v1/products/subgroups?category_id=X` com contagem dinâmica de produtos.
* **Busca Textual Multi-Campo:** O parâmetro `search` pesquisa simultaneamente por Nome, Marca, SKU e Subgrupo.
* **Resolução Automática do Banco:** O backend localiza `dev_database.db` automaticamente tanto no ambiente local quanto na nuvem do Render.

### 3. Frontend & Layout (Next.js 14 + TypeScript)
* **Mosaico de Atalhos Rápidos Circular (`QuickShortcuts`):** Navegação rápida por categorias no topo inspirada nas líderes de varejo (Armazém Paraíba / Casas Bahia).
* **Carrossel Principal de Banners (`HeroBannerSlider`):**
  * Rotação automática com setas laterais e bullets.
  * Suporte a banners horizontais (widescreen 1920x500) e lâminas mobile sem cortes.
  * **Layout de 2 Colunas para Ofertas:** No desktop, exibe o produto com preço De/Por em amarelo ouro gigante à esquerda e o encarte em alta definição à direita.
  * **Leitura Automática de Banners (`/api/banners`):** Qualquer imagem colada em `frontend/public/images/banners/` entra no ar automaticamente.
* **Carrossel Interativo de Ofertas Relâmpago (`FlashOffers`):**
  * Cronômetro regressivo com contagem regressiva em tempo real.
  * Carrossel horizontal deslizante com navegação por setas (`<` e `>`) e suporte a toque/swipe em celulares.
  * Cards completos com imagens, badges de desconto e botão direto de compra no WhatsApp.
* **Filtros do Catálogo:**
  * Filtro por Departamentos/Categorias.
  * Filtro dinâmico por "Tipos de Produto" (Subgrupos).
  * Filtro de Disponibilidade (Pronta Entrega vs. Sob Encomenda).
  * Ordenação por Menor Preço, Maior Preço e Recentes.
* **Automação de Mídia (`sync_banners.py`):**
  * Script Python de 1 comando para processar encartes verticais de `Promoções/`, converter para WebP widescreen e adicioná-los aos banners.

---

## 🛠️ Como Retomar e Operar

1. **Para adicionar novas fotos ao carrossel:**
   * Cole os arquivos em `frontend/public/images/banners/` OU
   * Cole fotos brutas em `Promoções/` e execute:
     ```bash
     python sync_banners.py
     ```
2. **Para rodar o Frontend localmente:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Para rodar o Backend localmente:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```
4. **Para publicar alterações na nuvem (Vercel + Render):**
   ```bash
   git add .
   git commit -m "sua alteração"
   git push origin main
   ```

