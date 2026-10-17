import requests
from bs4 import BeautifulSoup

url = "https://www.consul.com.br/eletrodomesticos/geladeira---refrigerador?category-1=Eletrodomesticos&category-2=Geladeira---Refrigerador&fuzzy=0&operator=and&facets=category-1%2Ccategory-2%2Cfuzzy%2Coperator&sort=score_desc&page=0"
r = requests.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
soup = BeautifulSoup(r.text, "html.parser")
imgs = soup.find_all("img")
print("Total imgs:", len(imgs))
for img in imgs[:10]:
    src = img.get("src") or ""
    print("SRC:", src)
