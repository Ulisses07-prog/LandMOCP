# Manual Operacional do Catálogo — Arruda Móveis Eletro

Guia prático para gerenciamento diário de lojas, WhatsApp, produtos, promoções, imagens e banners.

---

## 1. Atendimento Multi-Lojas e WhatsApp das 8 Cidades

O catálogo atende de forma unificada à Matriz e a todas as 7 Filiais da Arruda Móveis no Piauí. Cada loja possui seu próprio número de WhatsApp oficial e nenhum cargo interno (como gerente) é exposto ao cliente.

### Tabela Oficial de Contatos das Lojas

| Cidade / Filial | Tipo | WhatsApp Oficial | Link Direto para Campanhas |
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

### Como Funciona o Direcionamento do Cliente

1. **Por Link de Divulgação / Redes Sociais:**
   Ao divulgar no WhatsApp ou Instagram de uma filial, utilize o link com o parâmetro `?loja=nomedacidade` (ex: `arruda-moveis.vercel.app/?loja=batalha`). O site já abrirá com a loja configurada.
2. **Pelo Seletor no Topo (Header):**
   No topo do site, o cliente vê o botão com a cidade ativa (ex: `[📍 Esperantina ▼]`). Clicando em **"Trocar loja"**, abre uma lista para escolha manual entre as 8 cidades.
3. **Por Geolocalização GPS Automática:**
   O cliente pode clicar em *"Detectar automaticamente por GPS"* para o sistema identificar a loja mais próxima por distância em quilômetros.
4. **Em Todos os Botões:**
   O botão flutuante, o banner de ofertas, os cards da vitrine e o botão **"Comprar pelo WhatsApp"** na tela de detalhes do produto direcionam automaticamente para a loja escolhida, com mensagem personalizada contendo o nome da cidade.

---

### Como Atualizar o Número de uma Loja
Caso algum número de WhatsApp mude, edite o arquivo `scripts/cadastrar_lojas.py` e execute:
```bash
python scripts/cadastrar_lojas.py
```
Em seguida, envie as alterações para o GitHub:
```bash
git add dev_database.db backend/dev_database.db scripts/cadastrar_lojas.py frontend/contexts/StoreContext.tsx
git commit -m "fix: atualiza numero de whatsapp da filial"
git push origin main
```

---

## 2. Departamentos e Categorias Oficiais

O catálogo conta com 9 categorias oficiais mapeadas:

| ID | Departamento | Slug |
| :---: | :--- | :--- |
| **1** | Móveis para Sala | `moveis-para-sala` |
| **2** | Móveis para Quarto | `moveis-para-quarto` |
| **3** | Cozinha & Sala de Jantar | `cozinha-sala-de-jantar` |
| **4** | Eletrodomésticos | `eletrodomesticos` |
| **5** | Eletroportáteis | `eletroportateis` |
| **6** | TV & Áudio | `tv-e-audio` |
| **7** | Telefonia & Informática | `telefonia-e-informatica` |
| **8** | Ar & Climatização | `ar-e-climatizacao` |
| **9** | Decoração & Utilidades | `decoracao-e-utilidades` |

---

## 3. Gestão e Vínculo de Imagens por Fabricante

As fotos de produtos são organizadas em pastas separadas por fabricante dentro de:
```
frontend/public/images/products/<nome_do_fabricante>/
```

### Exemplo: Pasta `cavazotto/`
A pasta `frontend/public/images/products/cavazotto/` armazena as fotos em alta resolução da marca Cavazotto.

#### Como Executar a Vinculação Estrita:
Execute no terminal:
```bash
python scripts/vincular_cavazotto.py
```

#### O que o Script Faz:
1. **Conversão WebP:** Converte e otimiza imagens JPG/PNG para WebP com 90% de qualidade.
2. **Classificação Estrita:**
   * **Tipo do Móvel:** Roupeiro, Cômoda, Cama, Armário de Cozinha, Multiuso.
   * **Modelo:** Berlin/Berlim, Brasil, Grécia, Santiago, etc.
   * **Portas & Gavetas:** Mapeia exatamente a quantidade (ex: 3 portas, 4 portas, 4 gavetas, 6 gavetas).
   * **Subtipo Sapateira:** Separa estritamente Cômoda Sapateira de Cômodas comuns.
   * **Ângulo da Foto:** Imagens de ambiente/externo são definidas como foto principal (`is_primary = 1`), e imagens de fundo interno (aberto) são adicionadas ao carrossel secundário (`is_primary = 0`).
3. **Gravação:** Atualiza as tabelas `product_images` no SQLite (`dev_database.db` e `backend/dev_database.db`).

---

## 4. Gerenciamento de Banners e Ofertas Relâmpago

### Tamanhos Padrão Recomendados

| Posição | Resolução Ideal | Formato |
| :--- | :--- | :--- |
| **Banner Topo (Desktop)** | **1920 x 500 px** | Widescreen horizontal |
| **Banner Topo (Mobile)** | **1080 x 1080 px** | Quadrado |
| **Lâminas de Ofertas Relâmpago** | **1080 x 1920 px** | Vertical (9:16) |

### Como Adicionar Banners no Topo:
1. Coloque a imagem em:
   ```
   frontend/public/images/banners/
   ```
2. O carrossel lerá o novo arquivo automaticamente sem necessidade de reiniciar.

### Sincronizar Encartes da Semana em 1 Comando:
1. Cole as imagens na pasta `Promoções/`.
2. Execute no terminal:
   ```bash
   python sync_banners.py
   ```

---

## 5. Sincronização e Manutenção do Catálogo por Excel

Para atualizar preços e estoque a partir da planilha oficial:
```bash
python scripts/sync_excel_catalog.py "Produtos/tabela de produtos.xlsx"
```
* **Estoque > 0**: Marca como `🟢 Pronta Entrega`.
* **Estoque == 0**: Marca como `📦 Sob Encomenda`.

---

## 6. Publicação em Produção

Sempre que fizer alterações no banco ou código:
```bash
git add .
git commit -m "descricao das alteracoes"
git push origin main
```
O Render (backend) e a Vercel (frontend) atualizarão o sistema automaticamente em menos de 2 minutos.
