"""
Watch script using watchdog:
- Watches the data/ directory for changes to .txt and .md files
- Triggers scripts/build_index.py on create/modify events
"""
import time
import subprocess
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import PatternMatchingEventHandler

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"

def on_change(event):
    print(f"[watch] Change detected: {event.src_path}")
    try:
        subprocess.run(["python", "scripts/build_index.py"], check=True)
    except subprocess.CalledProcessError as e:
        print("[watch] build_index failed:", e)

if __name__ == "__main__":
    patterns = ["*.txt", "*.md"]
    ignore_patterns = None
    ignore_directories = True
    case_sensitive = False

    event_handler = PatternMatchingEventHandler(patterns, ignore_patterns, ignore_directories, case_sensitive)
    event_handler.on_created = on_change
    event_handler.on_modified = on_change

    observer = Observer()
    observer.schedule(event_handler, path=str(DATA_DIR), recursive=True)
    observer.start()
    print(f"[watch] Watching {DATA_DIR} for changes. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()