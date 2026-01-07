import json
from pathlib import Path


def test_index_exists_and_has_items():
    p = Path("data/metadata/index.json")
    assert p.exists(), "index.json must exist (run scripts/build_index.py)"
    raw = p.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    data = json.loads(text)
    assert "items" in data, "index.json should contain an 'items' array"
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0
