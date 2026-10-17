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
DEST_DIR_BASE = os.path.join("frontend", "public", "images", "products")
TARGET_SIZE = (800, 800)

LINKS = [
    # CONSUL
    {"marca": "consul", "categoria": "geladeiras-duplex", "url": "https://www.consul.com.br/categoria/melhores-geladeiras-duplex"},
    {"marca": "consul", "categoria": "lavadoras", "url": "https://www.consul.com.br/eletrodomesticos/lavadora-de-roupas?category-1=Eletrodomesticos&category-2=Lavadora-de-Roupas&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"marca": "consul", "categoria": "geladeiras", "url": "https://www.consul.com.br/eletrodomesticos/geladeira---refrigerador?category-1=Eletrodomesticos&category-2=Geladeira---Refrigerador&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"marca": "consul", "categoria": "freezers", "url": "https://www.consul.com.br/eletrodomesticos/freezer?category-1=Eletrodomesticos&category-2=Freezer&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"marca": "consul", "categoria": "micro-ondas", "url": "https://www.consul.com.br/eletrodomesticos/micro-ondas?category-1=Eletrodomesticos&category-2=Micro-ondas&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    # BRITÂNIA
    {"marca": "britania", "categoria": "cozinha", "url": "https://www.britania.com.br/cozinha"},
    {"marca": "britania", "categoria": "audio", "url": "https://www.britania.com.br/audio"},
    {"marca": "britania", "categoria": "tvs", "url": "https://www.britania.com.br/tvs"},
]

# funções
def sanitizar(nome: str) -> str:
    nome = nome.lower().strip()
    nome = re.sub(r"[^\w\s-]", "", nome)
    return re.sub(r"[-\s]+", "-", nome)[:45]

def salvar_imagem_enquadrada(img_url: str, filepath: str) -> bool:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        res = requests.get(img_url, headers=headers, timeout=20)
        res.raise_for_status()

        img = Image.open(BytesIO(res.content)).convert("RGBA")
        if img.width < 120 or img.height < 120:
            return False

        max_dim = max(img.size)
        canvas = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 255))
        offset = ((max_dim - img.width) // 2, (max_dim - img.height) // 2)
        canvas.paste(img, offset, mask=img if "A" in img.getbands() else None)

        canvas.convert("RGB").resize(TARGET_SIZE, Image.LANCZOS).save(filepath, "WEBP", quality=88)
        return True
    except Exception as e:
        return False

def extrair_categoria(driver, info: dict, max_por_categoria: int = 6):
    marca = info["marca"]
    categoria = info["categoria"]
    url = info["url"]
    dest_dir = os.path.join(DEST_DIR_BASE, marca)
    os.makedirs(dest_dir, exist_ok=True)

    print(f"\n==========================================")
    print(f"[*] Processando: {marca.upper()} - {categoria.upper()}")
    print(f"URL: {url}")
    print(f"==========================================")

    try:
        driver.get(url)
        time.sleep(5)

        # Scroll para carregar os produtos via VTEX / GraphQL
        driver.execute_script("window.scrollTo(0, 1000);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, 2500);")
        time.sleep(2)

        # Seletores abrangentes para VTEX / Lojas de eletrodomésticos
        elementos = driver.find_elements(By.CSS_SELECTOR, "img[src*='vteximg'], img[src*='arquivos'], img[src*='consul'], img[src*='britania'], [class*='product'] img, [class*='gallery'] img, img")
        print(f"Total de elementos <img> encontrados: {len(elementos)}")

        baixados = 0
        vistos = set()

        for el in elementos:
            if baixados >= max_por_categoria:
                break

            src = el.get_attribute("src") or el.get_attribute("data-src")
            if not src or "logo" in src.lower() or "icon" in src.lower() or "selo" in src.lower() or "banner" in src.lower() or "placehold" in src.lower():
                continue

            if src.startswith("//"):
                src = "https:" + src

            # Evita duplicados ignorando query params de redimensionamento
            src_clean = src.split("?")[0]
            if src_clean in vistos:
                continue
            vistos.add(src_clean)

            alt = el.get_attribute("alt") or ""
            # Se for imagem muito genérica de avatar ou rodapé, ignora
            if any(term in src.lower() for term in ["bandeira", "payment", "card", "avatar", "sprite"]):
                continue

            nome_arquivo = sanitizar(f"{marca}-{categoria}-{alt if alt else str(baixados + 1)}")
            filepath = os.path.join(dest_dir, f"{nome_arquivo}.webp")

            if salvar_imagem_enquadrada(src, filepath):
                print(f"[+] [{marca} - {categoria}] Salvo: {nome_arquivo}.webp")
                baixados += 1

        print(f"[OK] Concluído {marca} / {categoria}: {baixados} fotos baixadas.")

    except Exception as e:
        print(f"[-] Erro ao processar {marca}/{categoria}: {e}")

# execução
if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

    print("[*] Iniciando Chrome Headless para Consul e Britânia...")
    driver = webdriver.Chrome(options=chrome_options)

    try:
        for item in LINKS:
            extrair_categoria(driver, item, max_por_categoria=6)
    finally:
        driver.quit()
        print("\n[FINALIZADO COM SUCESSO] Todas as categorias de Consul e Britânia foram extraídas!")
