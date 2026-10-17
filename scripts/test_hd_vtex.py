import re

url_thumbnail = "https://consul.vtexassets.com/arquivos/ids/285206-360-auto/01_Consul_Geladeira_CRM50MB_Frontal.webp?v=639120295869870000&quality=80"

# O padrão da VTEX entrega a resolução original ou Ultra HD trocando '-360-auto' por '-1200-auto' ou sem limitador
url_hd = re.sub(r'/ids/(\d+)-\d+-[^/]+/', r'/ids/\1-1600-auto/', url_thumbnail)
# Tirar quality=80 para 100%
url_hd = re.sub(r'quality=\d+', 'quality=100', url_hd)

print("Thumbnail (Baixa):", url_thumbnail)
print("HD (Ultra Resolução):", url_hd)
