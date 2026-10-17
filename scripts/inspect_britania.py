import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.britania.com.br/tvs', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
soup = BeautifulSoup(r.text, 'html.parser')
for img in soup.find_all('img'):
    src = img.get('src') or ''
    if any(ext in src for ext in ['.jpg', '.png', '.webp']):
        print("Britania IMG:", src)
