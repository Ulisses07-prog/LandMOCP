# imports
import os
import re
import json
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

# config
DEST_DIR = os.path.join("frontend", "public", "images", "products", "samsung")
TARGET_SIZE = (800, 800)
os.makedirs(DEST_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9",
}

URLS = [
    {"categoria": "tvs", "url": "https://www.samsung.com/br/tvs/all-tvs/"},
    {"categoria": "refrigeradores", "url": "https://www.samsung.com/br/refrigerators/all-refrigerators/"},
    {"categoria": "fornos", "url": "https://www.samsung.com/br/cooking-appliances/ovens/"},
    {"categoria": "cooktops", "url": "https://www.samsung.com/br/cooking-appliances/hobs/"},
    {"categoria": "fogoes", "url": "https://www.samsung.com/br/cooking-appliances/stoves/"},
    {"categoria": "ar-condicionado", "url": "https://www.samsung.com/br/air-conditioners/all-air-conditioners/"},
]

# funções
def sanitizar_nome(texto: str) -> str:
    texto = texto.lower().strip()
    texto = re.sub(r"[^\w\s-]", "", texto)
    return re.sub(r"[-\s]+", "-", texto)

def salvar_imagem_webp(img_url: str, filepath: str):
    try:
        if img_url.startswith("//"):
            img_url = "https:" + img_url
        res = requests.get(img_url, headers=HEADERS, timeout=20)
        res.raise_for_status()
        img = Image.open(BytesIO(res.content)).convert("RGBA")
        
        # Enquadra em quadrado com fundo branco
        max_dim = max(img.size)
        canvas = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 255))
        offset = ((max_dim - img.width) // 2, (max_dim - img.height) // 2)
        canvas.paste(img, offset, mask=img if "A" in img.getbands() else None)
        
        canvas.convert("RGB").resize(TARGET_SIZE, Image.LANCZOS).save(filepath, "WEBP", quality=88)
        return True
    except Exception as e:
        print(f"Erro ao salvar {img_url}: {e}")
        return False

def raspar_categoria(categoria: str, url: str, max_produtos: int = 8):
    print(f"\n--- Processando: {categoria.upper()} ({url}) ---")
    try:
        res = requests.get(url, headers=HEADERS, timeout=20)
        res.raise_for_status()
    except Exception as e:
        print(f"Erro ao acessar {url}: {e}")
        return []

    soup = BeautifulSoup(res.text, "html.parser")
    produtos = []
    
    # Selecionar imagens de produtos
    imgs = soup.find_all("img")
    vistas = set()

    for img in imgs:
        if len(produtos) >= max_produtos:
            break
            
        src = img.get("data-desktop-src") or img.get("data-src") or img.get("src")
        if not src or "placehold.co" in src:
            continue
            
        if "samsung.com" in src and any(ext in src.lower() for ext in [".jpg", ".png", ".webp"]):
            # Limpar query parameters para pegar original
            src_clean = src.split("?")[0]
            if src_clean in vistas:
                continue
            vistas.add(src_clean)
            
            alt = img.get("alt", "").strip()
            # Nome amigável
            nome_raw = alt if alt and len(alt) < 80 else src_clean.split("/")[-1].split(".")[0]
            slug = sanitizar_nome(f"samsung-{categoria}-{nome_raw[:35]}")
            
            output_file = os.path.join(DEST_DIR, f"{slug}.webp")
            print(f"[+] Baixando: {slug} ...")
            
            if salvar_imagem_webp(src, output_file):
                produtos.append({
                    "nome": f"Samsung {alt if alt else categoria.capitalize()}",
                    "slug": slug,
                    "categoria": categoria,
                    "imagem": f"/images/products/samsung/{slug}.webp",
                    "origem": src
                })
                
    return produtos

# execução
if __name__ == "__main__":
    todos = []
    for item in URLS:
        lista = raspar_categoria(item["categoria"], item["url"], max_produtos=5)
        todos.extend(lista)
        
    resultado_json = os.path.join(DEST_DIR, "catalogo_samsung.json")
    with open(resultado_json, "w", encoding="utf-8") as f:
        json.dump(todos, f, indent=2, ensure_ascii=False)
        
    print(f"\n[FINALIZADO COM SUCESSO] {len(todos)} imagens baixadas e otimizadas em WebP!")
