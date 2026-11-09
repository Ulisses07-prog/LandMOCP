# Arruda Móveis Eletro — Catálogo Digital & Multi-Lojas

Plataforma integrada de catálogo digital, ofertas e atendimento multi-lojas via WhatsApp para as 8 unidades da Arruda Móveis no Piauí (Piripiri Matriz e 7 Filiais).

---

## 🌐 Ambientes e Links Oficiais

* **Site Oficial / Catálogo (Frontend Vercel):** [https://arruda-moveis.vercel.app](https://arruda-moveis.vercel.app)
* **Página de Ofertas:** [https://arruda-moveis.vercel.app/ofertas](https://arruda-moveis.vercel.app/ofertas)
* **Backend API (Render):** [https://landmocp.onrender.com](https://landmocp.onrender.com)
* **Documentação Swagger:** [https://landmocp.onrender.com/docs](https://landmocp.onrender.com/docs)
* **Repositório GitHub:** [https://github.com/Ulisses07-prog/LandMOCP](https://github.com/Ulisses07-prog/LandMOCP)

---

## 🏢 Arquitetura Multi-Lojas (8 Unidades)

O sistema roteia os pedidos diretamente para o WhatsApp oficial da filial selecionada, sem expor cargos internos:

| Cidade / Unidade | Tipo | WhatsApp Oficial | Link Direto de Campanha |
| :--- | :--- | :--- | :--- |
| **Piripiri** | Matriz | **(86) 98126-8763** | `https://arruda-moveis.vercel.app/?loja=piripiri` |
| **Esperantina** | Filial | **(86) 98190-6694** | `https://arruda-moveis.vercel.app/?loja=esperantina` |
| **São José do Divino** | Filial | **(86) 98116-4886** | `https://arruda-moveis.vercel.app/?loja=sao-jose-do-divino` |
| **Joaquim Pires** | Filial | **(86) 98188-8579** | `https://arruda-moveis.vercel.app/?loja=joaquim-pires` |
| **Murici dos Portelas** | Filial | **(86) 98896-1047** | `https://arruda-moveis.vercel.app/?loja=murici-dos-portelas` |
| **Matias Olímpio** | Filial | **(86) 98834-2169** | `https://arruda-moveis.vercel.app/?loja=matias-olimpio` |
| **São João do Arraial** | Filial | **(86) 98138-0724** | `https://arruda-moveis.vercel.app/?loja=sao-joao-do-arraial` |
| **Batalha** | Filial | **(86) 99960-5864** | `https://arruda-moveis.vercel.app/?loja=batalha` |

---

## 📁 Estrutura de Pastas de Imagens

As imagens de produtos e campanhas ficam organizadas em `frontend/public/images/`:

* `banners/`: Banners do topo e encartes semanais para desktop e mobile.
* `products/`: Imagens dos produtos divididas por marca/fornecedor:
  * `cavazotto/`: Imagens de alta resolução (camas, cômodas, roupeiros, armários de cozinha, multiuso).
  * Outros fabricantes e categorias conforme adicionados.

---

## ⚙️ Scripts de Automação em Python

Todos os scripts encontram-se na pasta `scripts/`:

1. **Atualizar Catálogo e Estoque (Novas Planilhas):**
   ```bash
   python scripts/atualizar_catalogo_estoque.py
   ```
   * Processa os arquivos mais recentes das pastas `Produtos/` e `Quantidades/`.
   * Atualiza preços, estoques e insere novos itens sem remover referências existentes.

2. **Vincular Bicicletas Cairu (Separação Estrita de Câmbio):**
   ```bash
   python scripts/corrigir_bicicletas_cairu.py
   ```
   * Isola modelos com 21M/18V de modelos sem marcha e vincula fotos oficiais do catálogo por SKU.

3. **Vincular Lote Fogões e Cooktops:**
   ```bash
   python scripts/import_fogoes_cooktops.py
   ```

4. **Vincular Lote de Imagens Cavazotto:**
   ```bash
   python scripts/vincular_cavazotto.py
   ```

5. **Sincronizar Banners e Promoções:**
   ```bash
   python scripts/substituir_banners_promocoes.py
   ```

6. **Atualizar Dados das Lojas:**
   ```bash
   python scripts/cadastrar_lojas.py
   ```

---

## 💻 Execução Local

### Backend (FastAPI / Python)
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Acesse em: `http://localhost:3000`

---

## 🚀 Publicação em Produção

```bash
git add .
git commit -m "feat: descricao das melhorias"
git push origin main
```
Deploy automático via Vercel (Frontend) e Render (Backend).