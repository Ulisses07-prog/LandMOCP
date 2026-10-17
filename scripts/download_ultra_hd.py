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
TARGET_SIZE = (1200, 1200)

CATEGORIAS_CONSUL = [
    {"categoria": "geladeiras", "url": "https://www.consul.com.br/eletrodomesticos/geladeira---refrigerador?category-1=Eletrodomesticos&category-2=Geladeira---Refrigerador&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"categoria": "lavadoras", "url": "https://www.consul.com.br/eletrodomesticos/lavadora-de-roupas?category-1=Eletrodomesticos&category-2=Lavadora-de-Roupas&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"categoria": "freezers", "url": "https://www.consul.com.br/eletrodomesticos/freezer?category-1=Eletrodomesticos&category-2=Freezer&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
    {"categoria": "micro-ondas", "url": "https://www.consul.com.br/eletrodomesticos/micro-ondas?category-1=Eletrodomesticos&category-2=Micro-ondas&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"},
]

CATEGORIAS_BRITANIA = [
    {"categoria": "cozinha", "url": "https://www.britania.com.br/cozinha"},
    {"categoria": "audio", "url": "https://www.britania.com.br/audio"},
    {"categoria": "tvs", "url": "https://www.britania.com.br/tvs"},
]

# funções
def sanitizar(nome: str) -> str:
    nome = nome.lower().strip()
    nome = re.sub(r"[^\w\s-]", "", nome)
    return re.sub(r"[-\s]+", "-", nome)[:45]

def transformar_em_ultra_hd(img_url: str) -> str:
    """Substitui parâmetros de thumbnail das plataformas VTEX por Ultra HD 1600px 100% qualidade"""
    # Ex: /ids/285206-360-auto/ -> /ids/285206-1600-auto/
    hd_url = re.sub(r'/ids/(\d+)-\d+-[^/]+/', r'/ids/\1-1600-auto/', img_url)
    hd_url = re.sub(r'quality=\d+', 'quality=100', hd_url)
    # Se tiver width=... na URL, aumenta para 1600
    hd_url = re.sub(r'width=\d+', 'width=1600', hd_url)
    return hd_url

def salvar_imagem_alta_definicao(img_url: str, filepath: str) -> bool:
    try:
        url_hd = transformar_em_ultra_hd(img_url)
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        res = requests.get(url_hd, headers=headers, timeout=20)
        res.raise_for_status()

        img = Image.open(BytesIO(res.content)).convert("RGBA")
        if img.width < 250 or img.height < 250:
            return False

        # Cria canvas de alta resolução 1200x1200px com fundo branco
        max_dim = max(img.size)
        canvas = Image.new("RGBA", (max_dim, max_dim), (255, 255, 255, 255))
        offset = ((max_dim - img.width) // 2, (max_dim - img.height) // 2)
        canvas.paste(img, offset, mask=img if "A" in img.getbands() else None)

        # Salva em WebP com 95% de qualidade
        canvas.convert("RGB").resize(TARGET_SIZE, Image.LANCZOS).save(filepath, "WEBP", quality=95)
        return True
    except Exception as e:
        return False

def extrair_consul_hd():
    print("\n--- Baixando fotos CONSUL em ULTRA HD (1600px original) ---")
    dest_dir = os.path.join(DEST_DIR_BASE, "consul")
    os.makedirs(dest_dir, exist_ok=True)

    for item in CATEGORIAS_CONSUL:
        cat = item["categoria"]
        url = item["url"]
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        try:
            res = requests.get(url, headers=headers, timeout=20)
            matches = re.findall(r'(https://consul\.vtexassets\.com/arquivos/ids/\d+-[^"\'\s]+)', res.text)
            vistos = set()
            baixados = 0

            for m in matches:
                if baixados >= 6:
                    break
                # Pega ID único
                id_match = re.search(r'/ids/(\d+)-', m)
                if not id_match:
                    continue
                prod_id = id_match.group(1)
                if prod_id in vistos:
                    continue
                vistos.add(prod_id)

                nome_arquivo = f"consul-{cat}-hd-{prod_id}"
                filepath = os.path.join(dest_dir, f"{nome_arquivo}.webp")

                if salvar_imagem_alta_definicao(m, filepath):
                    print(f"[+] [Consul {cat.upper()}] Salvo em ULTRA HD: {nome_arquivo}.webp")
                    baixados += 1
        except Exception as e:
            print(f"Erro em {cat}: {e}")

def extrair_britania_hd(driver):
    print("\n--- Baixando fotos BRITÂNIA em ULTRA HD via Selenium ---")
    dest_dir = os.path.join(DEST_DIR_BASE, "britania")
    os.makedirs(dest_dir, exist_ok=True)

    for item in CATEGORIAS_BRITANIA:
        cat = item["categoria"]
        url = item["url"]
        try:
            driver.get(url)
            time.sleep(5)
            driver.execute_script("window.scrollTo(0, 1500);")
            time.sleep(2)

            imgs = driver.find_elements(By.CSS_SELECTOR, "img[src*='vtexassets'], img[src*='arquivos']")
            baixados = 0
            vistos = set()

            for img_el in imgs:
                if baixados >= 6:
                    break
                src = img_el.get_attribute("src") or ""
                if not src or "logo" in src.lower() or "icon" in src.lower() or "selo" in src.lower():
                    continue

                id_match = re.search(r'/ids/(\d+)-', src)
                if id_match:
                    prod_id = id_match.group(1)
                    if prod_id in vistos:
                        continue
                    vistos.add(prod_id)
                elif src in vistos:
                    continue
                else:
                    vistos.add(src)

                alt = img_el.get_attribute("alt") or str(baixados + 1)
                nome_slug = sanitizar(f"britania-{cat}-hd-{alt}")
                filepath = os.path.join(dest_dir, f"{nome_slug}.webp")

                if salvar_imagem_alta_definicao(src, filepath):
                    print(f"[+] [Britânia {cat.upper()}] Salvo em ULTRA HD: {nome_slug}.webp")
                    baixados += 1
        except Exception as e:
            print(f"Erro em {cat}: {e}")

# execução
if __name__ == "__main__":
    # 1. Consul em Ultra HD direto da CDN
    extrair_consul_hd()

    # 2. Britânia com navegador headless para resolver JS
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    driver = webdriver.Chrome(options=chrome_options)
    try:
        extrair_britania_hd(driver)
    finally:
        driver.quit()

    print("\n[CONCLUÍDO] Todas as imagens foram atualizadas para ULTRA HD (1200x1200px / 95% qualidade)!")
