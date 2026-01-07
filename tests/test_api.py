import sys
from pathlib import Path

# Ensure workspace root is on sys.path so `src` can be imported when pytest runs.
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.api import main as api_main


def test_get_index_endpoint():
    j = api_main.get_index()
    assert isinstance(j, dict)
    assert "items" in j
    assert isinstance(j["items"], list)


def test_search_endpoint_returns_results_structure():
    j = api_main.search(q="love")
    assert "results" in j and "query" in j and "count" in j


def test_get_item_by_id():
    idx = api_main.get_index()
    items = idx.get("items", [])
    if not items:
        return
    first_id = items[0].get("id")
    j = api_main.get_item(id=first_id)
    assert j.get("id") == first_id or j.get("title") == first_id
