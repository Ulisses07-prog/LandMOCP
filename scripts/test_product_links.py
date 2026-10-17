import os
import requests
from bs4 import BeautifulSoup
from PIL import Image
from io import BytesIO

url = "https://www.consul.com.br/categoria/melhores-geladeiras-duplex"
r = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
soup = BeautifulSoup(r.text, "html.parser")

# Procurar links de produtos reais (/geladeira-...)
links_produtos = set()
for a in soup.find_all("a", href=True):
    href = a["href"]
    if "/p" in href or "geladeira-" in href:
        if not href.startswith("http"):
            href = "https://www.consul.com.br" + href
        links_produtos.add(href)

print("Links de produtos Consul encontrados:", len(links_produtos))
for l in list(links_produtos)[:5]:
    print("Produto Link:", l)

# Testar pegar og:image de um produto específico
if links_produtos:
    test_link = list(links_produtos)[0]
    r_prod = requests.get(test_link, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    soup_prod = BeautifulSoup(r_prod.text, "html.parser")
    og_img = soup_prod.find("meta", property="og:image")
    print("\nOG:IMAGE do produto:", og_img.get("content") if og_img else "Nao achou")
    if og_img:
        img_res = requests.get(og_img["content"])
        img = Image.open(BytesIO(img_res.content))
        print("Dimensões da imagem original do produto:", img.size)
