# 📋 Resumo Executivo & Guia de Retomada — Arruda Móveis

Data da última atualização: **19/10/2026**  
Status: **Ambientes de Produção Online (Render + Vercel) • Multi-Lojas Operacional • Lote Cavazotto Vinculado**

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

## 📦 Base de Dados e Fotos de Produtos

* **12.330 produtos** processados no banco SQLite (`dev_database.db`).
* **9 Categorias Oficiais:** Sala, Quarto, Cozinha, Eletrodomésticos, Eletroportáteis, TV & Áudio, Telefonia, Climatização e Utilidades.
* **Lote de Imagens Cavazotto:**
  * **103 produtos** vinculados com **377 fotos de alta resolução** em formato WebP.
  * Mapeamento estrito relacionando cada item à sua referência (Roupeiros Berlim 3/4/5 Pts, Brasil 3/4 Pts, Grécia 3/4 Pts, Santiago Capelinha, Cozinha 3 Portas, Multiuso 2 Portas, Cômodas 4 e 6 Gavetas, Cômoda Sapateira e Camas Solteiro/Casal).
  * Vínculo duplo: Imagem externa/ambiente como foto principal (`is_primary = 1`) e imagem de espaço interno aberto como foto secundária (`is_primary = 0`).

---

## 🛠️ Comandos Mais Usados

1. **Vincular Lote de Imagens Cavazotto:**
   ```bash
   python scripts/vincular_cavazotto.py
   ```
2. **Atualizar Dados das Lojas:**
   ```bash
   python scripts/cadastrar_lojas.py
   ```
3. **Sincronizar Banners de Promoções:**
   ```bash
   python sync_banners.py
   ```
4. **Sincronizar Catálogo com Nova Planilha:**
   ```bash
   python scripts/sync_excel_catalog.py "Produtos/tabela de produtos.xlsx"
   ```
5. **Deploy para Produção:**
   ```bash
   git add .
   git commit -m "suas alteracoes"
   git push origin main
   ```
