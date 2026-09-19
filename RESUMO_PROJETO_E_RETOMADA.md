# 📋 Resumo Executivo & Guia de Retomada — Arruda Móveis

Data da última atualização: **19/09/2026**  
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

### 3. Frontend (Next.js 14 + TypeScript)
* **Landing Page de Alta Conversão:** Hero section com destaques, pilares da marca, categorias oficiais e botão WhatsApp flutuante.
* **Filtros do Catálogo:**
  * Filtro por Departamentos/Categorias.
  * Filtro dinâmico por "Tipos de Produto" (Subgrupos).
  * Filtro de Disponibilidade (Pronta Entrega vs. Sob Encomenda).
  * Ordenação por Menor Preço, Maior Preço e Recentes.
* **Geração de Mensagem para WhatsApp:** Link direto para negociar o produto específico com o vendedor.
* **Deploy Automatizado na Vercel:** Integrado ao branch `main` do GitHub.

---

## 🛠️ Como Retomar na Próxima Sessão

1. **Para rodar o Backend localmente:**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```
2. **Para rodar o Frontend localmente:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Para enviar novas alterações para a nuvem:**
   ```bash
   git add .
   git commit -m "sua alteração"
   git push origin main
   ```
   *(A Vercel e o Render atualizam sozinhos a cada push).*

---

## 📌 Próximos Passos Sugeridos
1. Configurar imagens reais dos produtos nos uploads de mídia.
2. Inserir o número oficial de WhatsApp da Arruda Móveis na variável `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. Adicionar domínio personalizado (ex: `arudamoveis.com.br`) na Vercel.
