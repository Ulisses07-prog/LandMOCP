# imports
import os
import re
import json
import time
import requests
from io import BytesIO
from PIL import Image
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

# config
DEST_DIR_BASE = os.path.join("frontend", "public", "images", "products")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

CATEGORIAS = [
    # CONSUL
    {"marca": "consul", "categoria": "geladeiras", "url": "https://www.consul.com.br/categoria/melhores-geladeiras-duplex"},
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
    return re.sub(r"[-\s]+", "-", nome)[:55]

def salvar_foto_master(img_url: str, filepath: str) -> bool:
    try:
        # Remover parâmetros de corte ou thumbnail se existirem
        clean_url = re.sub(r'/ids/(\d+)-\d+-[^/]+/', r'/ids/\1/', img_url)
        res = requests.get(clean_url, headers=HEADERS, timeout=25)
        res.raise_for_status()

        img = Image.open(BytesIO(res.content))
        # Se for JPEG/PNG, mantem a nitidez cristalina original em 1000px ou 1500px
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Salva em WebP de alta qualidade (sem compressão agressiva)
        img.save(filepath, "WEBP", quality=96)
        print(f"    -> Dimensões salvas: {img.size} ({os.path.basename(filepath)})")
        return True
    except Exception as e:
        print(f"    [-] Erro ao salvar {img_url}: {e}")
        return False

def extrair_fotos_master_de_categoria(driver, info: dict, max_produtos: int = 5):
    marca = info["marca"]
    categoria = info["categoria"]
    url = info["url"]
    dest_dir = os.path.join(DEST_DIR_BASE, marca)
    os.makedirs(dest_dir, exist_ok=True)

    print(f"\n=======================================================")
    print(f"[*] Acessando categoria: {marca.upper()} - {categoria.upper()}")
    print(f"URL: {url}")
    print(f"=======================================================")

    try:
        driver.get(url)
        time.sleep(5)
        driver.execute_script("window.scrollTo(0, 1500);")
        time.sleep(2)

        # Encontrar links de produtos individuais na página
        elementos_links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/p'], a[href*='geladeira-'], a[href*='lavadora-'], a[href*='micro-ondas-'], a[href*='smart-tv-'], a[href*='caixa-de-som-']")
        
        links_produtos = []
        for el in elementos_links:
            href = el.get_attribute("href")
            if href and ("/p" in href or any(p in href for p in ["geladeira", "lavadora", "freezer", "micro-ondas", "smart-tv", "caixa-de-som", "batedeira", "cafeteira"])):
                if href not in links_produtos and not href.endswith("/p/"):
                    links_produtos.append(href)

        print(f"Total de produtos individuais encontrados: {len(links_produtos)}")

        baixados = 0
        for prod_url in links_produtos:
            if baixados >= max_produtos:
                break

            try:
                # Faz requisição direta na página do produto para ler os dados mestres (JSON-LD)
                res_prod = requests.get(prod_url, headers=HEADERS, timeout=15)
                soup_prod = BeautifulSoup(res_prod.text, "html.parser")

                nome_produto = None
                img_master = None

                # 1. Tenta extrair via Schema.org Product (onde a foto oficial de estúdio sempre fica)
                for script in soup_prod.find_all("script", type="application/ld+json"):
                    try:
                        dados = json.loads(script.string)
                        if isinstance(dados, dict) and dados.get("@type") == "Product":
                            nome_produto = dados.get("name")
                            imagens = dados.get("image", [])
                            if isinstance(imagens, list) and len(imagens) > 0:
                                # Filtra para pegar foto frontal do produto (ignora selos do inmetro)
                                for f in imagens:
                                    if "inmetro" not in f.lower() and "selo" not in f.lower():
                                        img_master = f
                                        break
                                if not img_master:
                                    img_master = imagens[0]
                            elif isinstance(imagens, str):
                                img_master = imagens
                            break
                    except:
                        pass

                # 2. Fallback para og:image
                if not img_master:
                    og = soup_prod.find("meta", property="og:image")
                    if og and og.get("content"):
                        img_master = og["content"]
                        nome_produto = soup_prod.find("title").text if soup_prod.find("title") else "produto"

                if img_master and "inmetro" not in img_master.lower():
                    slug_prod = sanitizar(f"{marca}-{nome_produto if nome_produto else str(baixados + 1)}")
                    filepath = os.path.join(dest_dir, f"{slug_prod}.webp")

                    print(f"[+] Baixando Foto Master 1500px: {nome_produto[:45]}...")
                    if salvar_foto_master(img_master, filepath):
                        baixados += 1

            except Exception as e:
                pass

        print(f"[OK] Concluído: {baixados} fotos em alta resolução salvas para {marca} - {categoria}.")

    except Exception as e:
        print(f"[-] Erro na categoria {categoria}: {e}")

# execução
if __name__ == "__main__":
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    print("[*] Iniciando Robô de Alta Resolução (1500x1500px Master)...")
    driver = webdriver.Chrome(options=chrome_options)
    try:
        for cat in CATEGORIAS:
            extrair_fotos_master_de_categoria(driver, cat, max_produtos=5)
    finally:
        driver.quit()
        print("\n[FINALIZADO COM SUCESSO] Todas as fotos de produtos foram baixadas na resolução máxima!")
