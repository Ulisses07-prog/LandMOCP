# Manual Operacional do Catálogo — Arruda Móveis Eletro

Guia prático para gerenciamento diário de produtos, promoções, fotos e número de WhatsApp.

---

## 1. Como Alterar o Número do WhatsApp da Loja

O número de WhatsApp é centralizado e nunca fica fixo no código.

### Opção A: Pelo arquivo `.env` (Global)
1. Abra o arquivo `.env` na raiz do projeto ou no backend:
   ```env
   WHATSAPP_NUMBER=5581999999999
   NEXT_PUBLIC_WHATSAPP_NUMBER=5581999999999
   ```
2. Salve o arquivo. *(Formato: DDI + DDD + Número sem traços ou espaços, ex: `5581987654321`)*.

---

## 2. Sincronização em Lote por Planilha Excel (Automático)

Para importar centenas ou milhares de produtos de uma vez, atualizar preços ou quantidades:

### Opção 1: Via Terminal (Script)
Coloque a planilha atualizada na pasta do projeto e execute:
```bash
python scripts/sync_excel_catalog.py "Produtos/tabela de produtos.xlsx"
```
* O script atualiza preços e quantidades dos produtos existentes sem duplicar.
* Cadastra automaticamente novos itens que entrarem na planilha.
* Classifica automaticamente:
  * **Estoque > 0**: Marca como `🟢 Pronta Entrega`.
  * **Estoque == 0**: Marca como `📦 Sob Encomenda`.

### Opção 2: Pelo Swagger da API
1. Acesse `http://localhost:8000/docs`.
2. No grupo **Produtos**, abra `POST /api/v1/products/sync-excel`.
3. Faça upload da planilha `.xlsx` e clique em **Execute**.

---

## 3. Gerenciamento Rápido via Script Python (Sem abrir o navegador)

Utilize o arquivo `scripts/manage_catalog.py` para operações automáticas.

### Cadastrar Novo Produto
```python
# No final do arquivo scripts/manage_catalog.py:
adicionar_produto(
    nome="Painel para TV até 65 Polegadas Ripado",
    slug="painel-tv-65-ripado",
    sku="ARR-PAI-006",
    cat_slug="moveis-para-sala",   # Veja a lista de departamentos abaixo
    preco=699.90,                 # Preço original
    promo=549.90,                 # Preço promocional (opcional)
    foto_url="/images/mock-sofa.webp" # Caminho da imagem
)
```
Execute no terminal:
```bash
python scripts/manage_catalog.py
```

### Alterar Preço ou Ativar Promoção
```python
# Altera preço normal e promocional pelo código SKU:
alterar_preco(sku="ARR-SOF-001", novo_preco=1799.00, novo_promo=1499.00)
```

---

## 3. Gerenciamento Visual pelo Painel Swagger da API

Acesse no navegador: **[http://localhost:8000/docs](http://localhost:8000/docs)**

### Passo 1: Autenticar
1. Clique no botão verde **Authorize** no topo direito.
2. Digite:
   * **username:** `admin@arrudamoveis.com.br`
   * **password:** `ArrudaAdmin2026!`
3. Clique em **Authorize** e feche a janela (o cadeado ficará fechado).

### Passo 2: Operações Principais

#### 📸 Enviar Nova Foto do Produto
* Rota: `POST /api/v1/media/upload`
* Selecione a imagem do seu computador.
* A API converterá automaticamente para `.webp` de alta velocidade e gerará miniaturas. Guarde a URL gerada (ex: `/media/uploads/arquivo.webp`).

#### ➕ Criar Produto
* Rota: `POST /api/v1/products`
* Exemplo de preenchimento do JSON:
  ```json
  {
    "name": "Guarda-Roupa 4 Portas",
    "slug": "guarda-roupa-4-portas",
    "sku": "ARR-GDR-010",
    "category_id": 2,
    "price": 999.00,
    "promo_price": 849.00,
    "short_description": "Guarda-roupa compacto com gavetas.",
    "description": "Estrutura resistente em MDP.",
    "brand": "Arruda Móveis",
    "availability": "Pronta Entrega",
    "is_featured": true,
    "status": "PUBLISHED"
  }
  ```

#### ✏️ Alterar Preço ou Dados de um Produto
* Rota: `PUT /api/v1/products/{id}`
* Informe o ID do produto e os novos valores de `price` e `promo_price`.

#### 🔥 Criar Promoção com Vigência
* Rota: `POST /api/v1/offers`
* Exemplo:
  ```json
  {
    "product_id": 1,
    "promo_price": 1399.00,
    "starts_at": "2026-09-01T00:00:00",
    "ends_at": "2026-10-31T23:59:59",
    "active": true
  }
  ```

---

## 4. Slugs dos 9 Departamentos Oficiais

Ao cadastrar produtos, utilize os identificadores abaixo:

| Departamento | Slug da Categoria | ID |
|---|---|:---:|
| **Móveis para Sala** | `moveis-para-sala` | 1 |
| **Móveis para Quarto** | `moveis-para-quarto` | 2 |
| **Cozinha & Sala de Jantar** | `cozinha-sala-de-jantar` | 3 |
| **Eletrodomésticos** | `eletrodomesticos` | 4 |
| **Eletroportáteis** | `eletroportateis` | 5 |
| **TV & Áudio** | `tv-e-audio` | 6 |
| **Telefonia & Informática** | `telefonia-e-informatica` | 7 |
| **Ar & Climatização** | `ar-e-climatizacao` | 8 |
| **Decoração & Utilidades** | `decoracao-e-utilidades` | 9 |

---

## 5. Rotina de Backup Recomendada

Antes de grandes alterações em massa, gere uma cópia de segurança:
```bash
python scripts/backup.py
```
O arquivo `.tar.gz` será salvo automaticamente na pasta `backups/`.
