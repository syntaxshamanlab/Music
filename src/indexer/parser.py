"""
Lightweight text analysis utilities used by the API and indexer.
"""
import re
from collections import Counter
from typing import List

def tokenize(text: str) -> List[str]:
    tokens = re.findall(r"[A-Za-z']{2,}", text.lower())
    return tokens

def top_terms(text: str, n: int = 10):
    tokens = tokenize(text)
    c = Counter(tokens)
    return [t for t, _ in c.most_common(n)]

def detect_themes(text: str, seed_terms=None):
    if seed_terms is None:
        seed_terms = ["love", "pain", "fate", "dark", "survival", "home", "myth", "dream", "system", "betrayal"]
    text_l = text.lower()
    found = [t for t in seed_terms if t in text_l]
    return found
