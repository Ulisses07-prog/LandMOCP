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
CATALOG_INDEX_FILE = os.path.join(DEST_DIR_BASE, "catalogo_multi_fotos.json")
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

TODAS_CATEGORIAS = [
    # SAMSUNG
    {"marca": "samsung", "categoria": "tvs", "url": "https://www.samsung.com/br/tvs/all-tvs/"},
    {"marca": "samsung", "categoria": "refrigeradores", "url": "https://www.samsung.com/br/refrigerators/all-refrigerators/"},
    {"marca": "samsung", "categoria": "fornos", "url": "https://www.samsung.com/br/cooking-appliances/ovens/"},
    {"marca": "samsung", "categoria": "cooktops", "url": "https://www.samsung.com/br/cooking-appliances/hobs/"},
    {"marca": "samsung", "categoria": "fogoes", "url": "https://www.samsung.com/br/cooking-appliances/stoves/"},
    {"marca": "samsung", "categoria": "ar-condicionado", "url": "https://www.samsung.com/br/air-conditioners/all-air-conditioners/"},

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

    # ARNO
    {"marca": "arno", "categoria": "ventilador-coluna", "url": "https://www.arno.com.br/arno/ventilacao/ventilador-de-coluna/"},
    {"marca": "arno", "categoria": "ventilador-mesa", "url": "https://www.arno.com.br/arno/ventilacao/ventilador-de-mesa/"},
    {"marca": "arno", "categoria": "ferro-passar", "url": "https://www.arno.com.br/arno/para-lavanderia/ferro-de-passar-roupa"},
    {"marca": "arno", "categoria": "airfryer", "url": "https://www.arno.com.br/arno/para-cozinha/airfryer"},
    {"marca": "arno", "categoria": "batedeira", "url": "https://www.arno.com.br/arno/para-cozinha/batedeira-e-planetaria"},
    {"marca": "arno", "categoria": "liquidificador", "url": "https://www.arno.com.br/arno/para-cozinha/liquidificador"},
    {"marca": "arno", "categoria": "sanduicheira", "url": "https://www.arno.com.br/arno/para-cozinha/sanduicheira-e-torradeira"},

    # PHILCO
    {"marca": "philco", "categoria": "tvs", "url": "https://www.philco.com.br/tvs"},
    {"marca": "philco", "categoria": "caixa-amplificada", "url": "https://www.philco.com.br/audio/caixa-de-som-amplificada"},
    {"marca": "philco", "categoria": "speaker", "url": "https://www.philco.com.br/audio/speaker"},
    {"marca": "philco", "categoria": "ferro-passar", "url": "https://www.philco.com.br/casa/ferros-de-passar"},
    {"marca": "philco", "categoria": "geladeiras", "url": "https://www.philco.com.br/refrigeracao/geladeiras"},
    {"marca": "philco", "categoria": "ventiladores", "url": "https://www.philco.com.br/climatizacao/ventiladores"},
    {"marca": "philco", "categoria": "freezers", "url": "https://www.philco.com.br/refrigeracao/freezers"},
]

# funções
def sanitizar(nome: str) -> str:
    nome = nome.lower().strip()
    nome = re.sub(r"[^\w\s-]", "", nome)
    return re.sub(r"[-\s]+", "-", nome)[:50]

def salvar_imagem_hd(img_url: str, filepath: str) -> bool:
    try:
        # Se for VTEX, converte thumbnail para original ou alta resolução
        clean_url = re.sub(r'/ids/(\d+)-\d+-[^/]+/', r'/ids/\1/', img_url)
        clean_url = re.sub(r'quality=\d+', 'quality=100', clean_url)
        clean_url = re.sub(r'width=\d+', 'width=1600', clean_url)
        if clean_url.startswith("//"):
            clean_url = "https:" + clean_url

        res = requests.get(clean_url, headers=HEADERS, timeout=20)
        res.raise_for_status()

        img = Image.open(BytesIO(res.content))
        if img.width < 150 or img.height < 150:
            return False

        if img.mode != "RGB":
            img = img.convert("RGB")

        img.save(filepath, "WEBP", quality=95)
        return True
    except Exception as e:
        return False

def extrair_todas_fotos_produto(prod_url: str, marca: str, categoria: str):
    """Acessa a página individual do produto e baixa todos os ângulos da galeria"""
    try:
        res = requests.get(prod_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "html.parser")

        nome_produto = None
        fotos = []

        # 1. Procura JSON-LD do produto (padrão VTEX / E-commerce Oficial)
        for s in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(s.string)
                if isinstance(data, dict) and data.get("@type") == "Product":
                    nome_produto = data.get("name")
                    imgs = data.get("image", [])
                    if isinstance(imgs, list):
                        fotos.extend(imgs)
                    elif isinstance(imgs, str):
                        fotos.append(imgs)
                    break
            except:
                pass

        # 2. Fallback: procurar todas as tags img do container da galeria
        if not fotos:
            for img in soup.select("[class*='gallery'] img, [class*='carousel'] img, [class*='swiper'] img, [class*='slider'] img"):
                src = img.get("src") or img.get("data-src")
                if src and "vtex" in src and not any(ign in src.lower() for ign in ["selo", "icon", "bandeira"]):
                    fotos.append(src)

        if not nome_produto:
            t = soup.find("title")
            nome_produto = t.text.split("|")[0].split("-")[0].strip() if t else "produto"

        # Filtrar fotos duplicadas e selos do Inmetro
        fotos_unicas = []
        ids_vistos = set()
        for f in fotos:
            if any(ign in f.lower() for ign in ["inmetro", "selo", "icon", "logo"]):
                continue
            id_m = re.search(r'/ids/(\d+)', f)
            chave = id_m.group(1) if id_m else f.split("?")[0]
            if chave not in ids_vistos:
                ids_vistos.add(chave)
                fotos_unicas.append(f)

        if not fotos_unicas:
            return None

        slug = sanitizar(f"{marca}-{nome_produto}")
        pasta_produto = os.path.join(DEST_DIR_BASE, marca, slug)
        os.makedirs(pasta_produto, exist_ok=True)

        fotos_salvas = []
        for idx, f_url in enumerate(fotos_unicas[:6]): # baixa até 6 ângulos do produto
            caminho_arquivo = os.path.join(pasta_produto, f"{idx + 1}.webp")
            if salvar_imagem_hd(f_url, caminho_arquivo):
                fotos_salvas.append(f"/images/products/{marca}/{slug}/{idx + 1}.webp")

        if fotos_salvas:
            print(f"  [+] Produto: {nome_produto[:40]} -> {len(fotos_salvas)} ângulos salvos em {slug}/")
            return {
                "marca": marca,
                "categoria": categoria,
                "nome": nome_produto,
                "slug": slug,
                "url_original": prod_url,
                "imagem_principal": fotos_salvas[0],
                "galeria": fotos_salvas
            }

    except Exception as e:
        pass
    return None

def processar_catalogo_completo():
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

    driver = webdriver.Chrome(options=chrome_options)
    todos_produtos = []

    try:
        for item in TODAS_CATEGORIAS:
            marca = item["marca"]
            categoria = item["categoria"]
            url = item["url"]

            print(f"\n=======================================================")
            print(f"[*] Varrendo: {marca.upper()} - {categoria.upper()} ({url})")
            print(f"=======================================================")

            try:
                driver.get(url)
                time.sleep(4)
                driver.execute_script("window.scrollTo(0, 1500);")
                time.sleep(2)

                # Coletar links de produtos reais
                links_elementos = driver.find_elements(By.CSS_SELECTOR, "a[href*='/p'], a[href*='produto'], [class*='product'] a, a[href*='/tvs/'], a[href*='/refrigerators/']")
                prod_links = []
                for a in links_elementos:
                    href = a.get_attribute("href")
                    if href and not href.endswith("/p/") and ("/p" in href or any(k in href for k in ["/produto/", "-tv-", "geladeira", "freezer", "lavadora", "ventilador", "airfryer", "caixa-de-som", "ferro"])):
                        if href not in prod_links and "category" not in href.lower() and "filtro" not in href.lower():
                            prod_links.append(href)

                print(f"Produtos encontrados na categoria: {len(prod_links)}")

                # Processar até 4 produtos por categoria com toda a sua galeria de ângulos
                for p_url in prod_links[:4]:
                    res_prod = extrair_todas_fotos_produto(p_url, marca, categoria)
                    if res_prod:
                        todos_produtos.append(res_prod)

            except Exception as e:
                print(f"Erro ao processar {url}: {e}")

    finally:
        driver.quit()

    # Salva o arquivo de catálogo consolidado
    with open(CATALOG_INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(todos_produtos, f, indent=2, ensure_ascii=False)

    print(f"\n[SUCESSO COMPLETO] {len(todos_produtos)} produtos com galerias completas multi-ângulos salvos!")

# execução
if __name__ == "__main__":
    processar_catalogo_completo()
