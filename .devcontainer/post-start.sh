#!/usr/bin/env bash
set -e
# Start the file watcher in the background so index rebuilds on changes.
# Uses npm script "watch" which runs chokidar to trigger the build-index script.
# The watcher is started with nohup so it survives the shell exit inside the container.
if command -v npm >/dev/null 2>&1; then
  nohup npm run watch > /tmp/watch.log 2>&1 &
fi
# Optionally start API bound to localhost only for dev
if command -v uvicorn >/dev/null 2>&1; then
  nohup uvicorn src.api.main:app --host 127.0.0.1 --port 8000 > /tmp/uvicorn.log 2>&1 &
fi