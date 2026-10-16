# imports
import os
import re
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR

# config
PASTA = Path(r"D:\ACP")
KEYWORDS = [
    "ROUPEIRO", "COMODA", "CABECEIRA", "MULTIUSO", "BALCAO", "PAINEL",
    "BERCO", "ARMARIO", "SAPATEIRA", "MESA", "CAMA", "ESTANTE", "RACK"
]

# funções
def extrair_nome_produto(textos):
    texto_unido = " ".join(textos).upper()
    
    # 1. Procurar por padrão: TIPO + NOME (ex: ROUPEIRO NUBIA, COMODA DIANA)
    for kw in KEYWORDS:
        padrao = rf"{kw}\s+([A-Z0-9À-Ú\-]+(?:\s+[A-Z0-9À-Ú\-]+)?)"
        match = re.search(padrao, texto_unido)
        if match:
            complemento = match.group(1).strip()
            # filtrar palavras comuns
            ignorar = {"COM", "SEM", "DE", "DA", "DO", "PORTAS", "GAVETAS", "ACP", "MOVEIS"}
            partes = [p for p in complemento.split() if p not in ignorar]
            if partes:
                return f"{kw}_{partes[0]}"
            return f"{kw}_{complemento.split()[0]}"
            
    # 2. Se não achou com palavra-chave, procurar nomes de linhas conhecidas
    linhas_conhecidas = [
        "NUBIA", "MAYA", "DIANA", "SAMIRA", "AYLA", "DEBORA", "WANESSA",
        "IRIS", "ISABELY", "ZARA", "AGATA", "CARLA", "BELLA", "ATHENA"
    ]
    for linha in linhas_conhecidas:
        if linha in texto_unido:
            return f"PRODUTO_{linha}"

    return None

# teste inicial nas primeiras 10 imagens
if __name__ == "__main__":
    engine = RapidOCR()
    arquivos = sorted([f for f in PASTA.glob("CATALOGO ACP 2023_*.jpg")])[:10]
    
    print(f"Testando OCR em {len(arquivos)} imagens:")
    for arq in arquivos:
        res, _ = engine(str(arq))
        textos = [r[1] for r in res] if res else []
        nome_sugerido = extrair_nome_produto(textos)
        print(f"{arq.name} -> {nome_sugerido}")
