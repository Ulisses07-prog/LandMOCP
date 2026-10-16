# imports
import os
import sys
import re
from pathlib import Path

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

from rapidocr_onnxruntime import RapidOCR

# config
CATEGORIAS = [
    "ROUPEIRO", "COMODA", "CABECEIRA", "MULTIUSO", "BALCAO", 
    "PAINEL", "BERCO", "ARMARIO", "SAPATEIRA", "MESA", "RACK", "CAMA"
]
PALAVRAS_IGNORADAS = {
    "ACP", "MOVEIS", "COM", "SEM", "DE", "DA", "DO", "PORTAS", 
    "GAVETAS", "ESPELHO", "MEDIDAS", "PESO", "CUBAGEM", "PAGINA", "REF"
}

# funções
def detectar_especificacoes(textos):
    if not textos:
        return None
    
    cabecalho = " ".join(textos[:15]).upper()
    cabecalho_limpo = re.sub(r"[^A-ZÀ-Ú0-9\s]", " ", cabecalho)

    # 1. Categoria e Modelo
    cat_encontrada = None
    modelo_encontrado = None

    for cat in CATEGORIAS:
        match = re.search(rf"\b{cat}\s+([A-ZÀ-Ú]+)", cabecalho_limpo)
        if match:
            mod = match.group(1).strip()
            if mod not in PALAVRAS_IGNORADAS and len(mod) >= 3:
                cat_encontrada = cat
                modelo_encontrado = mod
                break

    if not cat_encontrada:
        for cat in CATEGORIAS:
            if cat in cabecalho_limpo:
                cat_encontrada = cat
                break

    # 2. Número de Portas (ex: 4 PORTAS, 6 PORTAS, 2PTS)
    m_p = re.search(r'(\d+)\s*(?:PTS|PTAS|PORTAS|P\b|PORTA)', cabecalho_limpo)
    portas = f"{m_p.group(1)}PORTAS" if m_p else None

    # 3. Número de Gavetas (ex: 5 GAVETAS, 8GAV)
    m_g = re.search(r'(\d+)\s*(?:GAV|GAVETAS)', cabecalho_limpo)
    gavetas = f"{m_g.group(1)}GAV" if m_g else None

    # Montar nome padronizado
    partes = []
    if cat_encontrada:
        partes.append(cat_encontrada)
    if modelo_encontrado:
        partes.append(modelo_encontrado)
    if portas:
        partes.append(portas)
    elif gavetas:
        partes.append(gavetas)

    return "_".join(partes) if partes else None

def processar_pasta(caminho_pasta: str):
    pasta = Path(caminho_pasta)
    if not pasta.exists():
        print(f"[ERRO] Pasta não encontrada: {pasta}")
        return

    arquivos = sorted([
        f for f in pasta.glob("*") 
        if f.is_file() and f.suffix.lower() in [".jpg", ".jpeg", ".png"]
    ])
    
    if not arquivos:
        print(f"[INFO] Nenhuma imagem JPG/PNG encontrada em {pasta}")
        return

    engine = RapidOCR()
    total = len(arquivos)
    print(f"\nIniciando renomeação automática de {total} imagens em: {pasta}\n")

    renomeados = 0
    for arq in arquivos:
        sufixo = arq.stem.split("_")[-1]
        try:
            res, _ = engine(str(arq))
            textos = [r[1] for r in res] if res else []
            nome_detectado = detectar_especificacoes(textos)

            if nome_detectado:
                novo_nome = f"{nome_detectado}_{sufixo}{arq.suffix.lower()}"
            else:
                novo_nome = f"CATALOGO_PAGINA_{sufixo}{arq.suffix.lower()}"

            destino = pasta / novo_nome
            if destino.exists() and destino != arq:
                novo_nome = f"{destino.stem}_dup{arq.suffix.lower()}"
                destino = pasta / novo_nome

            os.rename(arq, destino)
            print(f"[OK] {arq.name} -> {novo_nome}")
            renomeados += 1
        except Exception as e:
            print(f"[ERRO] {arq.name}: {e}")

    print(f"\n✔ Concluído! {renomeados} arquivos renomeados com especificações.")

# execução
if __name__ == "__main__":
    if len(sys.argv) > 1:
        caminho = sys.argv[1]
    else:
        caminho = input("Digite o caminho da pasta com as imagens (ex: D:\\NOVAS_FOTOS): ").strip()
    
    caminho = caminho.strip('"').strip("'")
    if caminho:
        processar_pasta(caminho)
