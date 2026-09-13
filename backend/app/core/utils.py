import re
import unicodedata

def slugify(text: str) -> str:
    """Gera um slug amigável para URLs a partir de um texto."""
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text).strip().lower()
    return re.sub(r"[-\s]+", "-", text)
