# imports
import os
import re
import shutil
from pathlib import Path
from PIL import Image

# config
BASE_DIR = Path(__file__).resolve().parent.parent
DIR_PROMOCOES_ORIGEM = BASE_DIR / "Promoções"
DIR_BANER_ORIGEM = BASE_DIR / "Promoções" / "baner"

DIR_PUBLIC_BANNERS = BASE_DIR / "frontend" / "public" / "images" / "banners"
DIR_PUBLIC_PROMOCOES = BASE_DIR / "frontend" / "public" / "images" / "promocoes"

# funções
def limpar_antigos():
    print("--- 1. REMOVENDO ARQUIVOS ANTIGOS ---")
    padroes_antigos_banners = [
        "banner-whatsapp-image-*.webp",
        "Gemini_Generated_Image_*.jfif",
        "banner-produtos*.webp"
    ]
    for p in padroes_antigos_banners:
        for f in DIR_PUBLIC_BANNERS.glob(p):
            f.unlink()
            print(f"[REMOVIDO] {f.name} de banners")

    padroes_antigos_promocoes = [
        "whatsapp-image-*.webp",
        "banner-mes-familia-*.webp",
        "capa-mes-da-familia.webp",
        "oferta-*.webp",
        "slide-*.webp",
        "produtos*.webp"
    ]
    for p in padroes_antigos_promocoes:
        for f in DIR_PUBLIC_PROMOCOES.glob(p):
            f.unlink()
            print(f"[REMOVIDO] {f.name} de promocoes")

def processar_novos():
    print("\n--- 2. PROCESSANDO NOVOS BANNERS E FLYERS ---")
    DIR_PUBLIC_BANNERS.mkdir(parents=True, exist_ok=True)
    DIR_PUBLIC_PROMOCOES.mkdir(parents=True, exist_ok=True)

    # 1. Processar os banners horizontais (1376x768)
    banners_widescreen = {
        "Arruda_Móveis_anniversary_promot…_fec36f38.jpg": "banner-01-aniversario-arruda.webp",
        "Anniversary_promotional_banner_d…_b50a9c85.jpg": "banner-02-aniversario-premios.webp",
        "PRODUTOS2AR-CONDICIONADO-ELGIN_PHILCO-9000-BTUS.png_cebc7269.jpg": "banner-ar-condicionado.webp",
        "PRODUTOSREFRIGERADOR-2-PORTAS-332L-CRD37.png_87e95269.jpg": "banner-refrigerador-consul.webp",
        "PRODUTOSTV-32''-AOC_SEMP.png_8508692a.jpg": "banner-tv-32.webp",
        "PRODUTOSFOGÃO-REALCE.png_785c9bd1.jpg": "banner-fogao-realce.webp",
        "PRODUTOSKIT-TELASUL-DIAMANTE-6-PORTAS.png_c361dc62.jpg": "banner-kit-telasul.webp",
        "PRODUTOSROUPEIRO-CAPELINHA-BS07.png_5d634816.jpg": "banner-roupeiro-capelinha.webp",
        "PRODUTOS2LAVADORA-WANKE-10KG.png_0528601c.jpg": "banner-lavadora-wanke.webp",
        "PRODUTOS2RACK-TUBOART-CAMILLE.png_5c88d581.jpg": "banner-rack-camille.webp",
        "PRODUTOS2VENTILADOR-MONDIAL-COLUNA-40CM-VSP40.png_fb614e4b.jpg": "banner-ventilador-coluna.webp",
        "PRODUTOS2VENTILADOR-MONDIAL-MESA-40CM-VSP40.png_765ca385.jpg": "banner-ventilador-mesa-40cm.webp",
        "PRODUTOS2VENTILADOR-ULTRA-MESA-30CM-V-30(1).png_7cf492b7.jpg": "banner-ventilador-mesa-30cm.webp",
    }

    for orig_name, dest_name in banners_widescreen.items():
        # Busca arquivo na pasta baner
        orig_file = None
        for f in DIR_BANER_ORIGEM.glob("*.*"):
            if orig_name.split("…")[0] in f.name:
                orig_file = f
                break

        if orig_file and orig_file.exists():
            with Image.open(orig_file) as im:
                im_rgb = im.convert("RGB")
                dest_banner = DIR_PUBLIC_BANNERS / dest_name
                im_rgb.save(dest_banner, "WEBP", quality=90)
                
                # Salva também como slide em promocoes
                dest_slide = DIR_PUBLIC_PROMOCOES / f"slide-{dest_name}"
                im_rgb.save(dest_slide, "WEBP", quality=90)
                print(f"[OK] Banner: {dest_name}")

    # 2. Processar os flyers verticais para os cards de produtos
    flyers = {
        "PRODUTOS2AR-CONDICIONADO-ELGIN_PHILCO-9000-BTUS.png": "oferta-ar-condicionado.webp",
        "PRODUTOSREFRIGERADOR-2-PORTAS-332L-CRD37.png": "oferta-refrigerador-consul.webp",
        "PRODUTOSTV-32''-AOC_SEMP.png": "oferta-tv-32.webp",
        "PRODUTOSFOGÃO-REALCE.png": "oferta-fogao-realce.webp",
        "PRODUTOSKIT-TELASUL-DIAMANTE-6-PORTAS.png": "oferta-kit-telasul.webp",
        "PRODUTOSROUPEIRO-CAPELINHA-BS07.png": "oferta-roupeiro-capelinha.webp",
        "PRODUTOS2LAVADORA-WANKE-10KG.png": "oferta-lavadora-wanke.webp",
        "PRODUTOS2RACK-TUBOART-CAMILLE.png": "oferta-rack-camille.webp",
        "PRODUTOS2VENTILADOR-MONDIAL-COLUNA-40CM-VSP40.png": "oferta-ventilador-coluna.webp",
        "PRODUTOS2VENTILADOR-MONDIAL-MESA-40CM-VSP40.png": "oferta-ventilador-mesa-40cm.webp",
        "PRODUTOS2VENTILADOR-ULTRA-MESA-30CM-V-30(1).png": "oferta-ventilador-mesa-30cm.webp",
    }

    for orig_name, dest_name in flyers.items():
        orig_file = DIR_PROMOCOES_ORIGEM / orig_name
        if orig_file.exists():
            with Image.open(orig_file) as im:
                im_rgb = im.convert("RGB")
                dest_card = DIR_PUBLIC_PROMOCOES / dest_name
                im_rgb.save(dest_card, "WEBP", quality=90)
                print(f"[OK] Flyer: {dest_name}")

# execução
if __name__ == "__main__":
    limpar_antigos()
    processar_novos()
    print("\n[SUCESSO] Imagens atualizadas com sucesso!")

