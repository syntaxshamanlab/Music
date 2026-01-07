import json
from pathlib import Path


def test_index_exists_and_has_items():
    p = Path("data/metadata/index.json")
    assert p.exists(), "index.json must exist (run scripts/build_index.py)"
    data = json.loads(p.read_text(encoding="utf-8"))
    assert "items" in data, "index.json should contain an 'items' array"
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0
