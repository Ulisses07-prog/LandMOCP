# imports
import os
import sys
from pathlib import Path
from PIL import Image, ImageFilter

# config
PASTA_ORIGEM = Path("Promoções")
PASTA_BANNERS = Path("frontend/public/images/banners")
PASTA_PROMOCOES = Path("frontend/public/images/promocoes")
LARGURA_DESK, ALTURA_DESK = 1920, 500

# funções
def sincronizar_imagens():
    if not PASTA_ORIGEM.exists():
        PASTA_ORIGEM.mkdir(parents=True, exist_ok=True)
        print(f"Pasta '{PASTA_ORIGEM}' criada. Coloque suas fotos nela e rode novamente.")
        return

    PASTA_BANNERS.mkdir(parents=True, exist_ok=True)
    PASTA_PROMOCOES.mkdir(parents=True, exist_ok=True)

    exts = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    arquivos = [f for f in PASTA_ORIGEM.iterdir() if f.is_file() and f.suffix.lower() in exts]

    if not arquivos:
        print(f"Nenhuma imagem encontrada em '{PASTA_ORIGEM}'.")
        return

    print(f"Encontradas {len(arquivos)} imagens. Processando...")

    for arq in arquivos:
        nome_limpo = arq.stem.lower().replace(" ", "-").replace("(", "").replace(")", "") + ".webp"
        im = Image.open(arq).convert("RGB")

        # 1. Salva cópia otimizada na pasta de promoções
        caminho_promo = PASTA_PROMOCOES / nome_limpo
        im.save(caminho_promo, "WEBP", quality=85)

        # 2. Converte para o padrão widescreen 1920x500 para a pasta de banners
        escala = ALTURA_DESK / im.height
        nova_largura = int(im.width * escala)
        im_redim = im.resize((nova_largura, ALTURA_DESK), Image.Resampling.LANCZOS)

        fundo = im.resize((LARGURA_DESK, ALTURA_DESK), Image.Resampling.BILINEAR)
        fundo = fundo.filter(ImageFilter.GaussianBlur(radius=25))

        pos_x = (LARGURA_DESK - nova_largura) // 2
        fundo.paste(im_redim, (pos_x, 0))

        caminho_banner = PASTA_BANNERS / f"banner-{nome_limpo}"
        fundo.save(caminho_banner, "WEBP", quality=90)

        print(f"[OK] Pronto: {nome_limpo} -> adicionado aos banners!")

    print("\nConcluído com sucesso! As imagens foram adicionadas ao carrossel.")

# execução
if __name__ == "__main__":
    sincronizar_imagens()
