# Instruções de Gerenciamento do Catálogo e Planilhas Excel

Este guia orienta como sincronizar produtos, atualizar preços/quantidades e vincular fotos ao catálogo da **Arruda Móveis**.

---

## 1. Atualização Contínua de Produtos e Estoque

Sempre que a loja tiver uma nova planilha Excel (`.xlsx` ou `.xls`), você pode sincronizar tudo automaticamente sem duplicar registros.

### O que o sistema faz automaticamente:
* **Novos produtos**: São cadastrados na categoria correta.
* **Produtos já existentes**: Têm preço, estoque e especificações atualizados.
* **Classificação de Estoque**:
  * `Estoque > 0`: Marcado com **🟢 Pronta Entrega** (visível com badge verde no catálogo).
  * `Estoque == 0`: Marcado com **📦 Sob Encomenda** (visível com badge neutro no catálogo).

---

## 2. Como Executar a Sincronização

### Método A: Via Terminal (Mais rápido)
Coloque a planilha na pasta `Produtos/` (ou em qualquer local) e execute:

```bash
# Executar sincronização com a planilha padrão
python scripts/sync_excel_catalog.py

# Ou especificando outro arquivo:
python scripts/sync_excel_catalog.py "caminho/para/sua_planilha.xlsx"
```

### Método B: Pelo Swagger da API (Navegador)
1. Inicie o backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
2. Acesse: **http://localhost:8000/docs**
3. Localize a rota: `POST /api/v1/products/sync-excel`
4. Clique em **Try it out**, anexe o arquivo `.xlsx` e clique em **Execute**.

---

## 3. Como Vincular Fotos aos Produtos

Quando as fotos estiverem disponíveis:

1. **Padrão de Nomeação das Fotos:**
   * Nomeie os arquivos com o **Código/SKU** do produto (coluna `Código` da planilha).
   * Exemplo: `4400.jpg`, `4402.png`, `4409_1.jpg`.

2. **Importação Automática:**
   * Coloque as fotos dentro da pasta `media/importar/`.
   * Execute o script de importação:
     ```bash
     python scripts/import_photos.py
     ```
   * O script vincula cada foto ao produto exato correspondente no banco de dados.

---

## 4. Filtros Disponíveis no Catálogo

A landing page e a página `/catalogo` contam com:
* **Filtro por Estoque**:
  * `Todos os Produtos`: Exibe o acervo completo de 12.000+ produtos.
  * `🟢 Apenas Pronta Entrega`: Filtra apenas itens com estoque físico imediato.
  * `📦 Sob Encomenda`: Filtra itens disponíveis para pedido sob consulta.
* **Filtro por Categorias**: Mapeadas a partir da coluna `Departamento` da planilha.
* **Busca Inteligente**: Por Nome, Marca ou Código/SKU.
