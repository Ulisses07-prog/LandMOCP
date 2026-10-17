# imports
import os
import re
import time
import requests
from io import BytesIO
from PIL import Image
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# config
DEST_DIR = os.path.join("frontend", "public", "images", "products", "samsung")
TARGET_SIZE = (800, 800)
os.makedirs(DEST_DIR, exist_ok=True)

CATEGORIAS = [
    {"slug_cat": "tvs", "url": "https://www.samsung.com/br/tvs/all-tvs/"},
    {"slug_cat": "refrigeradores", "url": "https://www.samsung.com/br/refrigerators/all-refrigerators/"},
    {"slug_cat": "fornos", "url": "https://www.samsung.com/br/cooking-appliances/ovens/"},
    {"slug_cat": "cooktops", "url": "https://www.samsung.com/br/cooking-appliances/hobs/"},
    {"slug_cat": "fogoes", "url": "https://www.samsung.com/br/cooking-appliances/stoves/"},
    {"slug_cat": "ar-condicionado", "url": "https://www.samsung.com/br/air-conditioners/all-air-conditioners/"},
]

# funções
def sanitizar(nome: str) -> str:
    nome = nome.lower().strip()
    nome = re.sub(r"[^\w\s-]", "", nome)
    return re.sub(r"[-\s]+", "-", nome)[:45]

def salvar_imagem_enquadrada(img_url: str, filepath: str) -> bool:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        res = requests.get(img_url, headers=headers, timeout=15)
        res.raise_for_status()

        img = Image.open(BytesIO(res.content)).convert("RGBA")
        if img.width < 100 or img.height < 100:
            return False

        # Cria canvas quadrado branco
        max_dim = max(img.size)
        canvas = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 255))
        offset = ((max_dim - img.width) // 2, (max_dim - img.height) // 2)
        canvas.paste(img, offset, mask=img if "A" in img.getbands() else None)

        canvas.convert("RGB").resize(TARGET_SIZE, Image.LANCZOS).save(filepath, "WEBP", quality=88)
        return True
    except Exception as e:
        return False

def extrair_categoria(driver, cat_info: dict, max_por_categoria: int = 6):
    slug_cat = cat_info["slug_cat"]
    url = cat_info["url"]
    print(f"\n==========================================")
    print(f"[*] Acessando categoria: {slug_cat.upper()} ({url})")
    print(f"==========================================")

    try:
        driver.get(url)
        time.sleep(4)

        # Rola a página para acionar o lazy loading dos produtos
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 2200);")
        time.sleep(2)

        # Procura seletores de imagens de produtos
        elementos = driver.find_elements(By.CSS_SELECTOR, "img[data-desktop-src], img[data-src], img[src*='images.samsung.com']")
        print(f"Total de elementos de imagem encontrados: {len(elementos)}")

        baixados = 0
        vistos = set()

        for el in elementos:
            if baixados >= max_por_categoria:
                break

            src = el.get_attribute("data-desktop-src") or el.get_attribute("src") or el.get_attribute("data-src")
            if not src or "placehold" in src or "icon" in src.lower() or "banner" in src.lower() or "gnb" in src.lower():
                continue

            if src.startswith("//"):
                src = "https:" + src

            # Limpa parâmetros para evitar duplicados
            src_clean = src.split("?")[0]
            if src_clean in vistos:
                continue
            vistos.add(src_clean)

            alt = el.get_attribute("alt") or ""
            nome_arquivo = sanitizar(f"samsung-{slug_cat}-{alt if alt else str(baixados + 1)}")
            filepath = os.path.join(DEST_DIR, f"{nome_arquivo}.webp")

            if salvar_imagem_enquadrada(src, filepath):
                print(f"[+] [{slug_cat}] Salvo com sucesso: {nome_arquivo}.webp")
                baixados += 1

        print(f"[OK] Concluído para {slug_cat}: {baixados} fotos baixadas.")

    except Exception as e:
        print(f"[-] Erro ao processar categoria {slug_cat}: {e}")

# execução
if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    print("[*] Iniciando Chrome em modo headless...")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        for cat in CATEGORIAS:
            extrair_categoria(driver, cat, max_por_categoria=5)
    finally:
        driver.quit()
        print("\n[FINALIZADO] Todas as categorias foram processadas!")
