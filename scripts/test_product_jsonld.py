import requests
from bs4 import BeautifulSoup

url = "https://www.consul.com.br/geladeira-consul-biplex-334-litros-branca-crd37eb/p"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
r = requests.get(url, headers=headers)
soup = BeautifulSoup(r.text, "html.parser")

# Procurar meta tags
for meta in soup.find_all("meta"):
    if meta.get("property") == "og:image" or meta.get("name") == "image":
        print("Meta Foto:", meta.get("content"))

# Procurar JSON-LD
import json
for script in soup.find_all("script", type="application/ld+json"):
    try:
        data = json.loads(script.string)
        if isinstance(data, dict) and data.get("@type") == "Product":
            print("Nome:", data.get("name"))
            print("Imagens no JSON-LD:", data.get("image"))
    except:
        pass
