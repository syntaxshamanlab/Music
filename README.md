# Music Indexer — Initial Setup

1. Open this repository in GitHub Codespaces (or run devcontainer locally).
2. Post-create will install Python and Node deps.
3. Build the index:
   ```
   python scripts/build_index.py
   ```
4. Start the API:
   ```
   uvicorn src.api.main:app --reload --port 8000
   ```
5. Start the frontend:
   ```
   cd src/frontend && npm start
   ```
6. Visit the frontend at http://localhost:3000 and the API at http://localhost:8000/api/index

## Auto-triggering index rebuild and dev servers

### What runs automatically in Codespace
- On container start the `post-start.sh` will:
  - Launch a file watcher (via `npm run watch`) that triggers `python scripts/build_index.py` on changes.
  - Start the API bound to `127.0.0.1:8000` (local-only) so it is not publicly exposed.

### Manual commands
- Build index once:
  ```bash
  python scripts/build_index.py
  ```
- Run watcher manually:
  ```bash
  python scripts/watch_build.py
  ```
- Start API (local-only):
  ```bash
  uvicorn src.api.main:app --host 127.0.0.1 --port 8000
  ```
- Start frontend:
  ```bash
  cd src/frontend && npm start
  ```

### Security notes
- The API is started with `--host 127.0.0.1` to avoid accidental public exposure.
- If you need remote access, use SSH port forwarding or configure a reverse proxy with TLS and firewall rules.
