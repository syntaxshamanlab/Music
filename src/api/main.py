from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[2]
INDEX_PATH = ROOT / "data" / "metadata" / "index.json"

app = FastAPI(title="Music Indexer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

def load_index():
    if not INDEX_PATH.exists():
        raise FileNotFoundError("Index not found. Run scripts/build_index.py")
    # Read as bytes and try UTF-8, fall back to latin-1 if file contains non-UTF8 bytes.
    raw = INDEX_PATH.read_bytes()
    try:
        text = raw.decode("utf-8")
    except UnicodeDecodeError:
        text = raw.decode("latin-1")
    return json.loads(text)

@app.get("/api/index")
def get_index():
    try:
        return load_index()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/search")
def search(q: str = Query(..., min_length=1), limit: int = 20):
    idx = load_index()
    results = []
    ql = q.lower()
    for item in idx.get("items", []):
        if ql in item.get("title", "").lower() or ql in item.get("id", "").lower():
            results.append(item)
        else:
            for s in item.get("sections", {}).values():
                if ql in s.lower():
                    results.append(item)
                    break
        if len(results) >= limit:
            break
    return {"query": q, "count": len(results), "results": results}

@app.get("/api/item")
def get_item(id: str):
    idx = load_index()
    for item in idx.get("items", []):
        if item.get("id") == id or item.get("title") == id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

@app.post("/api/errors")
def log_errors(error_data: dict):
    # Simple logging to console; in production, save to file or database
    print("Received JavaScript errors:", json.dumps(error_data, indent=2))
    return {"status": "logged"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)