"""
Build index script:
- Scans data/lyrics and data/documents
- Extracts basic metadata and sections
- Writes data/metadata/index.json
"""
import os
import json
import re
from pathlib import Path
from datetime import datetime
import orjson
from docx import Document

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
LYRICS_DIR = DATA_DIR / "lyrics"
DOCS_DIR = DATA_DIR / "documents"
META_DIR = DATA_DIR / "metadata"
INDEX_FILE = META_DIR / "index.json"

META_DIR.mkdir(parents=True, exist_ok=True)

def read_text_file(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception:
        return ""

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

def extract_title(text: str, fallback: str) -> str:
    for line in text.splitlines():
        s = line.strip()
        if s:
            return s[:100]
    return fallback

def extract_collaborators(text: str):
    collab = set()
    for m in re.finditer(r"\bwith[:\s]+([A-Z][a-zA-Z0-9 &]+)", text):
        collab.add(m.group(1).strip())
    # also look for "with Emily" lowercase variants
    for m in re.finditer(r"\bwith[:\s]+([A-Za-z][a-zA-Z0-9 &]+)", text, re.I):
        collab.add(m.group(1).strip())
    return list(collab)

def extract_sections(text: str):
    sections = {}
    current = "body"
    buffer = []
    for line in text.splitlines():
        h = line.strip()
        if re.match(r"^(Verse|Hook|Chorus|Bridge|Poem|Background|Intro|Outro|Spoken Word|Final Song|Track):?", h, re.I):
            if buffer:
                sections[current] = "\n".join(buffer).strip()
                buffer = []
            current = re.sub(r"[^a-z0-9_]+", "_", h.lower())[:40]
        else:
            buffer.append(line)
    if buffer:
        sections[current] = "\n".join(buffer).strip()
    return sections

def get_text(p: Path) -> str:
    if p.suffix == '.docx':
        return extract_text_from_docx(p)
    else:
        return read_text_file(p)

def build_index():
    index = []
    # scan lyrics
    if LYRICS_DIR.exists():
        for p in sorted(LYRICS_DIR.glob("**/*")):
            if p.suffix not in ['.txt', '.docx']:
                continue
            text = get_text(p)
            if not text.strip():
                continue
            sections = extract_sections(text)
            item = {
                "id": str(p.relative_to(ROOT)),
                "title": extract_title(text, p.stem),
                "source": "lyrics",
                "path": str(p),
                "collaborators": extract_collaborators(text),
                "sections": sections,
                "content": sections.get("body", ""),
                "themes": [],
                "created_at": datetime.fromtimestamp(p.stat().st_mtime).isoformat()
            }
            index.append(item)
    # scan documents
    if DOCS_DIR.exists():
        for p in sorted(DOCS_DIR.glob("**/*")):
            if p.suffix not in ['.txt', '.docx']:
                continue
            text = get_text(p)
            if not text.strip():
                continue
            sections = extract_sections(text)
            item = {
                "id": str(p.relative_to(ROOT)),
                "title": extract_title(text, p.stem),
                "source": "document",
                "path": str(p),
                "collaborators": extract_collaborators(text),
                "sections": sections,
                "content": sections.get("body", ""),
                "themes": [],
                "created_at": datetime.fromtimestamp(p.stat().st_mtime).isoformat()
            }
            index.append(item)
    with open(INDEX_FILE, "wb") as f:
        f.write(orjson.dumps({"generated_at": datetime.utcnow().isoformat(), "items": index}, option=orjson.OPT_INDENT_2))
    print(f"Index built: {INDEX_FILE} ({len(index)} items)")

if __name__ == "__main__":
    build_index()
