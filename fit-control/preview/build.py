"""Build a single-file preview from the compiled canonical domain modules."""
import base64
import pathlib
import re
import sys
from functools import lru_cache

ROOT = pathlib.Path(__file__).resolve().parents[1]
ALLOWED = {ROOT / p for p in ('dist/nutrition.js', 'dist/storage.js', 'dist/diary-view.js', 'dist/diary-editor.js', 'preview/diary-preview.mjs', 'preview/daily-report.mjs', 'preview/voice.mjs', 'preview/transcript.mjs', 'preview/training.mjs')}
PATTERN = re.compile(r"(\bfrom\s+)(['\"])(\.{1,2}/[^'\"]+)\2")

@lru_cache(maxsize=None)
def module_url(path):
    path = path.resolve()
    if path not in ALLOWED:
        raise ValueError(f'Unexpected module {path}')
    code = rewrite(path.read_text(encoding='utf-8'), path.parent)
    return 'data:text/javascript;base64,' + base64.b64encode(code.encode()).decode('ascii')

def rewrite(text, directory):
    return PATTERN.sub(lambda m: m[1] + m[2] + module_url(directory / m[3]) + m[2], text)

if __name__ == '__main__':
    template = ROOT / 'preview/index.html'
    out = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'preview/FIT_CONTROL.html'
    html = rewrite(template.read_text(encoding='utf-8'), template.parent)
    out.write_text(html, encoding='utf-8')
    print(f'{out}: {out.stat().st_size} bytes')
