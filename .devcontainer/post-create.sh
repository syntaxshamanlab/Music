#!/usr/bin/env bash
set -e
python -m pip install --upgrade pip
if [ -f "requirements.txt" ]; then
  pip install -r requirements.txt || true
fi
if [ -f "package.json" ]; then
  npm install || true
fi
if [ -d "src/frontend" ]; then
  (cd src/frontend && npm install) || true
fi