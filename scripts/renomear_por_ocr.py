# imports
import os
import sys
import re
from pathlib import Path

# Configurar stdout para UTF-8 no Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from rapidocr_onnxruntime import RapidOCR

# config
PASTA = Path(r"D:\ACP")
CATEGORIAS = [
    "ROUPEIRO", "COMODA", "CABECEIRA", "MULTIUSO", "BALCAO", 
    "PAINEL", "BERCO", "ARMARIO", "SAPATEIRA", "MESA", "RACK", "CAMA"
]
PALAVRAS_IGNORADAS = {
    "ACP", "MOVEIS", "COM", "SEM", "DE", "DA", "DO", "PORTAS", 
    "GAVETAS", "ESPELHO", "MEDIDAS", "PESO", "CUBAGEM", "PAGINA", "REF"
}

# funções
def detectar_nome(textos):
    if not textos:
        return None
    
    cabecalho = " ".join(textos[:12]).upper()
    cabecalho = re.sub(r"[^A-ZÀ-Ú0-9\s]", " ", cabecalho)

    # 1. Regex dinâmica: CATEGORIA + NOME_DO_MODELO
    for cat in CATEGORIAS:
        match = re.search(rf"\b{cat}\s+([A-ZÀ-Ú]+)", cabecalho)
        if match:
            modelo = match.group(1).strip()
            if modelo not in PALAVRAS_IGNORADAS and len(modelo) >= 3:
                return f"{cat}_{modelo}"

    # 2. Busca de palavras-chave individuais de categorias
    for cat in CATEGORIAS:
        if cat in cabecalho:
            palavras = [p for p in cabecalho.split() if p not in PALAVRAS_IGNORADAS and p != cat and len(p) >= 3]
            if palavras:
                return f"{cat}_{palavras[0]}"
            return cat

    return None

def processar_catalogo():
    engine = RapidOCR()
    arquivos = sorted([f for f in PASTA.glob("CATALOGO ACP 2023_*.jpg")])
    total = len(arquivos)
    print(f"Iniciando leitura automatica de {total} imagens em {PASTA}...")

    renomeados = 0
    for arq in arquivos:
        sufixo = arq.stem.split("_")[-1]
        try:
            res, _ = engine(str(arq))
            textos = [r[1] for r in res] if res else []
            nome_detectado = detectar_nome(textos)

            if nome_detectado:
                novo_nome = f"{nome_detectado}_{sufixo}.jpg"
            else:
                novo_nome = f"CATALOGO_PAGINA_{sufixo}.jpg"

            destino = PASTA / novo_nome
            
            if destino.exists() and destino != arq:
                novo_nome = f"{destino.stem}_dup.jpg"
                destino = PASTA / novo_nome

            os.rename(arq, destino)
            print(f"[OK] [{sufixo}] {arq.name} -> {novo_nome}")
            renomeados += 1
        except Exception as e:
            print(f"[ERRO] {arq.name}: {e}")

    print(f"\nFinalizado! {renomeados} arquivos renomeados com sucesso.")

# execução
if __name__ == "__main__":
    processar_catalogo()
