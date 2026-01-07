import json
import os
from pathlib import Path
from docx import Document

def load_config():
    with open('config.json', 'r') as f:
        return json.load(f)

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return '\n'.join(full_text)

def build_index():
    config = load_config()
    index = []

    for category, dir_path in config['data_directories'].items():
        if not os.path.exists(dir_path):
            continue
        for file_path in Path(dir_path).rglob('*.docx'):
            title = file_path.stem  # filename without extension
            content = extract_text_from_docx(file_path)
            entry = {
                'filename': str(file_path),
                'title': title,
                'category': category,
                'content': content
            }
            index.append(entry)

    output_path = config['metadata_output']
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(index, f, indent=2)

if __name__ == '__main__':
    build_index()