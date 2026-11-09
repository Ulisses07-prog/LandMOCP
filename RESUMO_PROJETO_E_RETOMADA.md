# 📋 Resumo Executivo & Guia de Retomada — Arruda Móveis

Data da última atualização: **09/11/2026**  
Status: **Ambientes de Produção Online (Render + Vercel) • Campanha Aniversário 33 Anos Ativa • Catálogo e Estoque Atualizados (09/11/2026) • Lotes Cavazotto, Fogões, Cooktops e Bicicletas Cairu Vinculados**

---

## 🌐 Links Ativos em Produção

* **Site Oficial / Catálogo (Vercel):** [https://arruda-moveis.vercel.app](https://arruda-moveis.vercel.app)
* **Página de Ofertas:** [https://arruda-moveis.vercel.app/ofertas](https://arruda-moveis.vercel.app/ofertas)
* **Catálogo com Filtros:** [https://arruda-moveis.vercel.app/catalogo](https://arruda-moveis.vercel.app/catalogo)
* **Backend API (Render):** [https://landmocp.onrender.com](https://landmocp.onrender.com)
* **Documentação da API (Swagger):** [https://landmocp.onrender.com/docs](https://landmocp.onrender.com/docs)
* **Repositório GitHub:** [https://github.com/Ulisses07-prog/LandMOCP](https://github.com/Ulisses07-prog/LandMOCP) (Branch: `main`)

---

## 🏢 Arquitetura Multi-Lojas (8 Cidades)

O sistema suporta oficialmente a Matriz e 7 Filiais com contatos diretos sem expor dados internos:

* **Piripiri (Matriz):** (86) 98126-8763
* **Esperantina:** (86) 98190-6694
* **São José do Divino:** (86) 98116-4886
* **Joaquim Pires:** (86) 98188-8579
* **Murici dos Portelas:** (86) 98896-1047
* **Matias Olímpio:** (86) 98834-2169
* **São João do Arraial:** (86) 98138-0724
* **Batalha:** (86) 99960-5864

### Mecanismos de Direcionamento
1. **Link de Campanha:** Parâmetro `?loja=cidade` na URL seleciona a filial automaticamente.
2. **Seletor no Topo:** Menu no Header permite trocar de loja a qualquer momento.
3. **Geolocalização GPS:** Cálculo de distância por coordenadas seleciona a filial mais próxima.
4. **Persistência:** Loja fica salva no `localStorage` do dispositivo do cliente.
5. **Conversão Dinâmica:** O botão "Comprar pelo WhatsApp" na página de cada produto e nas ofertas direciona diretamente para o número da cidade selecionada com mensagem personalizada.

---

## 📦 Base de Dados e Catálogo (Posição 09/11/2026)

* **12.415 produtos** cadastrados no banco SQLite (`dev_database.db` e `backend/dev_database.db`).
* **12.157 produtos** com preços de venda oficiais cadastrados.
* **2.025 produtos com 🟢 Pronta Entrega** (estoque físico imediato) e **10.390 📦 Sob Encomenda**.
* **Campanha de Aniversário 33 Anos (Novembro 2026):**
  * 11 produtos em oferta com preços promocionais à vista e parcelamento em 10x sem juros (ou 15% de desconto).
  * Banners desktop widescreen e artes verticais (proporção 9:16) integrados na Home e na página `/ofertas`.
* **Lotes de Imagens Vinculados:**
  * **Cavazotto (Móveis):** 103 produtos vinculados com 377 fotos WebP (visões externa e interna).
  * **Fogões & Cooktops:** 71 fotos WebP de alta qualidade vinculadas por SKU/modelo.
  * **Bicicletas Cairu:** Separação estrita com e sem marcha (21M / 18V / sem câmbio / cestão / suspensão) e fotos de catálogo oficial vinculadas diretamente por SKU.

---

## 🛠️ Comandos Mais Usados

1. **Atualizar Produtos e Quantidades de Estoque (Novas Planilhas):**
   ```bash
   python scripts/atualizar_catalogo_estoque.py
   ```
2. **Corrigir/Vincular Bicicletas Cairu:**
   ```bash
   python scripts/corrigir_bicicletas_cairu.py
   ```
3. **Vincular Lote de Fogões e Cooktops:**
   ```bash
   python scripts/import_fogoes_cooktops.py
   ```
4. **Atualizar Banners e Ofertas da Campanha:**
   ```bash
   python scripts/substituir_banners_promocoes.py
   ```
5. **Vincular Lote de Imagens Cavazotto:**
   ```bash
   python scripts/vincular_cavazotto.py
   ```
6. **Atualizar Dados das Lojas:**
   ```bash
   python scripts/cadastrar_lojas.py
   ```
7. **Deploy para Produção:**
   ```bash
   git add .
   git commit -m "suas alteracoes"
   git push origin main
   ```
