# 📢 Guia Prático: Como Adicionar e Gerenciar Banners e Promoções

Este guia explica como adicionar, atualizar ou remover imagens do **Carrossel do Topo** e do **Carrossel de Ofertas Relâmpago** da Arruda Móveis.

---

## 🎯 1. Padrões de Imagem Recomendados

| Tipo de Imagem | Resolução Ideal | Formato | Onde Fica no Site |
| :--- | :--- | :--- | :--- |
| **Banner Topo (Computador)** | **1920 x 500 px** (ou 1920x600) | Widescreen horizontal | Banner principal do topo |
| **Banner Topo (Celular)** | **1080 x 1080 px** (ou 1080x1350) | Quadrado ou 4:5 | Banner do topo em celulares |
| **Encartes / Lâminas** | **1080 x 1920 px** | Vertical (9:16) | Carrossel de Ofertas Relâmpago |

---

## 🚀 Método 1: Adicionar Imagens sem Código (Arrastar e Soltar)

Quando você já tiver o banner no tamanho correto (widescreen ou imagem pronta):

1. Salve o arquivo em formato `.jpg`, `.png` ou `.webp`.
2. Cole o arquivo na pasta:
   ```
   frontend/public/images/banners/
   ```
3. O carrossel lê essa pasta dinamicamente e coloca o banner no ar **automaticamente**.

*Para remover um banner, basta apagar o arquivo dessa pasta.*

---

## ⚡ Método 2: Converter e Subir Fotos do WhatsApp em 1 Clique

Quando você receber encartes verticais pelo WhatsApp ou redes sociais:

1. Cole as imagens na pasta:
   ```
   Promoções/
   ```
2. Abra o terminal na raiz do projeto e execute:
   ```bash
   python sync_banners.py
   ```
3. O script realiza tudo automaticamente:
   * Otimiza a foto para `.webp` de carregamento ultra-rápido.
   * Cria a versão widescreen horizontal preenchendo as bordas com desfoque estético (sem distorcer o produto).
   * Adiciona o novo banner na pasta do carrossel.

---

## 🖥️ Como Funciona a Exibição das Ofertas no Banner

* **No Computador (Desktop):** As ofertas relâmpago são exibidas em formato de **2 colunas**:
  * **Lado Esquerdo:** Nome do produto, badge de desconto, preço De/Por em amarelo ouro gigante, parcelamento e botão direto para o WhatsApp.
  * **Lado Direito:** A imagem da lâmina em alta definição, legível e nítida.
* **No Celular (Mobile):** A imagem se ajusta para ocupar 100% da tela do smartphone de forma fluida.

---

## ☁️ Como Publicar na Nuvem (Vercel e Render)

Após colocar suas novas fotos ou rodar o script:

```bash
git add .
git commit -m "feat: novos banners promocionais"
git push origin main
```

A **Vercel** atualiza o site no ar automaticamente em menos de 1 minuto.
