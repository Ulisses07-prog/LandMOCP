import requests
from bs4 import BeautifulSoup
import json

url = "https://www.consul.com.br/geladeira-consul-biplex-334-litros-branca-crd37eb/p"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
r = requests.get(url, headers=headers)
soup = BeautifulSoup(r.text, "html.parser")

for s in soup.find_all("script", type="application/ld+json"):
    try:
        data = json.loads(s.string)
        if isinstance(data, dict) and data.get("@type") == "Product":
            imgs = data.get("image", [])
            print(f"Total de fotos no carrossel de {data.get('name')}: {len(imgs)}")
            for idx, img_url in enumerate(imgs):
                print(f"  [Foto {idx+1}]: {img_url}")
    except:
        pass
