import os
import time
import requests
from PIL import Image
from io import BytesIO
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

chrome_options = Options()
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

driver = webdriver.Chrome(options=chrome_options)
try:
    url = "https://www.consul.com.br/categoria/melhores-geladeiras-duplex"
    driver.get(url)
    time.sleep(4)
    driver.execute_script("window.scrollTo(0, 1500);")
    time.sleep(2)
    
    # Encontrar links de produtos reais na tela
    links = driver.find_elements(By.CSS_SELECTOR, "a[href*='/geladeira-'], a[class*='product']")
    prod_urls = []
    for l in links:
        h = l.get_attribute("href")
        if h and "/p" in h or "geladeira" in h:
            if h not in prod_urls:
                prod_urls.append(h)
                
    print("Links de produtos encontrados via Selenium:", len(prod_urls))
    for p in prod_urls[:5]:
        print("Produto:", p)
        
    if prod_urls:
        driver.get(prod_urls[0])
        time.sleep(3)
        og = driver.find_element(By.CSS_SELECTOR, "meta[property='og:image']").get_attribute("content")
        print("\nFoto Master do Produto:", og)
        res = requests.get(og)
        img = Image.open(BytesIO(res.content))
        print("Dimensões Originais da Foto Master:", img.size)
finally:
    driver.quit()
