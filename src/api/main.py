from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Music Indexing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

INDEX_PATH = "data/metadata/index.json"

def load_index():
    if os.path.exists(INDEX_PATH):
        with open(INDEX_PATH, 'r') as f:
            data = json.load(f)
            return data.get("items", [])
    return []

@app.get("/api/index")
def get_index():
    return {"data": load_index()}

@app.get("/api/search")
def search(q: str = Query(..., description="Search query")):
    index = load_index()
    results = [item for item in index if q.lower() in item['content'].lower() or q.lower() in item['title'].lower()]
    return {"data": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)