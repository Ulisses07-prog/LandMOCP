"""Importa imagens de refrigeradores e as vincula aos produtos correspondentes."""

import hashlib
import re
import shutil
import sqlite3
import sys
import unicodedata
from pathlib import Path

from PIL import Image


BASE_DIR = Path(__file__).resolve().parent.parent
SOURCE_DIR = Path(r"C:\Users\USUARIO\Downloads\Refrigeradores")
FRONTEND_DIR = BASE_DIR / "frontend" / "public" / "produtos" / "refrigeradores"
MEDIA_DIR = BASE_DIR / "media" / "uploads" / "refrigeradores"
DATABASES = (BASE_DIR / "dev_database.db", BASE_DIR / "backend" / "dev_database.db")
IMAGE_EXTENSIONS = {".avif", ".jpeg", ".jpg", ".png", ".webp"}

# Each entry maps one physical refrigerator variant to the matching catalog entries.
# Rules are ordered: the specific variants must precede their more generic model rules.
PRODUCT_GROUPS = (
    ("CONSUL_CRA30FBBNA", ("CRA30FBBNA",), "%CRA30FBBNA%"),
    ("CONSUL_CRA30MBBNA", ("CRA30MBBNA",), "%CRA30MBBNA%"),
    ("CONSUL_CRB39ABBNA", ("CRB39ABBNA",), "%CRB39ABBNA%"),
    ("CONSUL_CRD37MBBNA", ("CRD37MBBNA",), "%CRD37MBBNA%"),
    ("CONSUL_CRD37EBBNA", ("CRD37EBBNA",), "%CRD37EBBNA%"),
    ("CONSUL_CRM40MBBNA", ("CRM40MBBNA",), "%CRM40MBBNA%"),
    ("CONSUL_CRB36", ("CONSUL1PT", "CRB36"), "%CRB36%"),
    ("ELECTROLUX_RE31", ("ELECTROLUX", "RE31"), "%RE31%"),
    ("ELECTROLUX_DC35A", ("ELECTROLUX", "DC35A"), "%DC35A%"),
    ("EOS_B199230", ("EOS", "B199230"), "%B199230%"),
    ("ESMALTEC_RCD34", ("RCD34",), "%RCD34%"),
    ("ESMALTEC_RCD38_276", ("RCD38", "276L"), "%276%RCD38%"),
    ("ESMALTEC_RCD38_306", ("RCD38", "306L"), "%306%RCD38%"),
    ("ESMALTEC_ROC31_PRO", ("ROC31", "PRO"), "%ROC31%PRO%"),
    ("HQ_230_BR", ("HQ", "230L", "BR", "HQ-230RDF"), "%HQ%230L%BR%HQ%230RDF%"),
    ("HQ_230_CZ", ("HQ", "230L", "CZ", "HQ-230RDF"), "%HQ%230L%CZ%HQ%230RDF%"),
    ("HQ_290_BR", ("HQ", "290L", "BR", "HQ-290RDF"), "%HQ%290L%BR%HQ%290RDF%"),
    ("HQ_290_CZ", ("HQ", "290L", "CZ", "HQ-290RDF"), "%HQ%290L%CZ%HQ%290RDF%"),
    ("LG_GN_B372PFM2", ("LG", "B372PFM2"), "%B372PFM2%"),
    ("MIDEA_RT411FGF012", ("MIDEA", "RT411FGF012"), "%RT411FGF012%"),
    ("MIDEA_RT468MTA012", ("MIDEA", "RT468MTA012"), "%RT468MTA012%"),
    ("PHILCO_PRF380I", ("PHILCO", "PRF380I"), "%PRF380I%"),
    ("PHILCO_PRF506TI", ("PHILCO", "PRF506TI"), "%PRF506TI%"),
    ("PHILCO_PRF535ID", ("PHILCO", "PRF535ID"), "%PRF535ID%"),
)


def normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_value = "".join(char for char in decomposed if not unicodedata.combining(char))
    return ascii_value.upper()


def safe_filename(value: str) -> str:
    value = normalize(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "imagem"


def output_filename(source_file: Path) -> str:
    source_hash = hashlib.sha1(
        str(source_file.relative_to(SOURCE_DIR)).encode("utf-8")
    ).hexdigest()[:8]
    return f"{safe_filename(source_file.stem)}-{source_hash}.webp"


def group_for_filename(filename: str) -> str | None:
    normalized_name = normalize(filename)
    for group_name, terms, _ in PRODUCT_GROUPS:
        if all(term in normalized_name for term in terms):
            return group_name
    return None


def image_priority(filename: str) -> tuple[int, str]:
    name = normalize(filename)
    words = re.sub(r"[^A-Z0-9]+", " ", name)
    is_open = any(term in words for term in ("ABERTA", "ABERTO", "SEMIABERTA", "VAZIA"))
    is_lifestyle = any(term in words for term in ("FRUTAS", "ALIMENTOS", "PRODUZIDA"))
    has_clean_front = re.search(r"\b(FRENTE|FRONTE|FRONTAL)\b", words) is not None
    has_front = has_clean_front or "FRONTA" in words

    # A closed front view is the requested cover image.
    if has_clean_front and not is_open and not is_lifestyle:
        return (0, name)
    if has_front and not is_open and not is_lifestyle:
        return (1, name)
    if "CAPA" in name:
        return (2, name)
    if not is_open and not any(term in name for term in ("LATERAL", "PAINEL", "DIMENS", "MEDID", "TAMANHO")):
        return (10, name)
    if "LATERAL" in name:
        return (20, name)
    if is_open:
        return (30, name)
    return (40, name)


def optimize_to_webp(source: Path, destination: Path) -> tuple[int, int, int]:
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", quality=86, optimize=True)
        width, height = image.size
    return width, height, destination.stat().st_size


def load_product_ids(connection: sqlite3.Connection) -> dict[str, list[tuple[int, str]]]:
    groups: dict[str, list[tuple[int, str]]] = {}
    cursor = connection.cursor()
    for group_name, _, product_pattern in PRODUCT_GROUPS:
        rows = cursor.execute(
            "SELECT id, name FROM products WHERE UPPER(name) LIKE ?",
            (product_pattern,),
        ).fetchall()
        groups[group_name] = rows
    return groups


def main() -> int:
    if not SOURCE_DIR.is_dir():
        print(f"[ERRO] Pasta de imagens não encontrada: {SOURCE_DIR}")
        return 1

    source_files = sorted(
        file for file in SOURCE_DIR.rglob("*")
        if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS
    )
    grouped_files: dict[str, list[Path]] = {}
    unmatched_files: list[Path] = []
    for source_file in source_files:
        group_name = group_for_filename(source_file.name)
        if group_name is None:
            unmatched_files.append(source_file)
        else:
            grouped_files.setdefault(group_name, []).append(source_file)

    if unmatched_files:
        print("[ERRO] Arquivos sem produto correspondente:")
        for source_file in unmatched_files:
            print(f"  - {source_file.name}")
        return 1

    with sqlite3.connect(DATABASES[0]) as connection:
        product_groups = load_product_ids(connection)

    groups_without_products = [
        group_name for group_name in grouped_files if not product_groups[group_name]
    ]
    if groups_without_products:
        print("[ERRO] Grupos sem produto correspondente no catálogo:")
        for group_name in groups_without_products:
            print(f"  - {group_name}")
        return 1

    expected_output_names = {output_filename(source_file) for source_file in source_files}
    for destination_dir in (FRONTEND_DIR, MEDIA_DIR):
        if destination_dir.exists():
            for existing_file in destination_dir.glob("*.webp"):
                if existing_file.name not in expected_output_names:
                    existing_file.unlink()

    image_metadata: dict[Path, tuple[str, int, int, int]] = {}
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)
    for group_name, files in grouped_files.items():
        for source_file in files:
            output_name = output_filename(source_file)
            frontend_file = FRONTEND_DIR / output_name
            width, height, file_size = optimize_to_webp(source_file, frontend_file)
            shutil.copy2(frontend_file, MEDIA_DIR / output_name)
            image_metadata[source_file] = (
                f"/produtos/refrigeradores/{output_name}",
                width,
                height,
                file_size,
            )

    inserted = 0
    for database in DATABASES:
        if not database.exists():
            print(f"[ERRO] Banco não encontrado: {database}")
            return 1

        with sqlite3.connect(database) as connection:
            cursor = connection.cursor()
            for group_name, files in grouped_files.items():
                sorted_files = sorted(files, key=lambda source_file: image_priority(source_file.name))
                for product_id, product_name in product_groups[group_name]:
                    cursor.execute(
                        "UPDATE product_images SET is_primary = 0 WHERE product_id = ?",
                        (product_id,),
                    )
                    cursor.execute(
                        "DELETE FROM product_images WHERE product_id = ? AND storage_key LIKE ?",
                        (product_id, "produtos/refrigeradores/%"),
                    )
                    for sort_order, source_file in enumerate(sorted_files):
                        url, width, height, file_size = image_metadata[source_file]
                        storage_key = url.removeprefix("/")
                        cursor.execute(
                            """
                            INSERT INTO product_images (
                                product_id, storage_key, url, alt_text, sort_order,
                                is_primary, width, height, file_size, mime_type, created_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
                            """,
                            (
                                product_id,
                                storage_key,
                                url,
                                f"{product_name} - {source_file.stem}",
                                sort_order,
                                sort_order == 0,
                                width,
                                height,
                                file_size,
                                "image/webp",
                            ),
                        )
                        inserted += 1

    product_count = sum(len(product_groups[group_name]) for group_name in grouped_files)
    print(
        f"[OK] {len(source_files)} imagens vinculadas a {product_count} produtos "
        f"em {len(DATABASES)} bancos ({inserted} vínculos gravados)."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
