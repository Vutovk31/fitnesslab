"""Portable browser acceptance: verify bundled bytes, run existing test runner, record result."""
import hashlib
import json
import pathlib
import platform
import re
import subprocess
import sys
from datetime import datetime, timezone

ROOT = pathlib.Path(__file__).resolve().parents[1]
FILES = ('dist/nutrition.js', 'dist/storage.js', 'tests/browser/index.html',
         'tests/browser/storage.test.mjs', 'tests/browser/run.py',
         'tests/browser/report_contract.py', 'tools/acceptance_bundle.py')


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def verify(root, manifest):
    if manifest.get('schema_version') != 1 or not re.fullmatch(r'[0-9a-f]{40}', manifest.get('source_commit', '')):
        raise ValueError('Invalid manifest version or source commit')
    hashes = manifest.get('sha256')
    if not isinstance(hashes, dict) or set(hashes) != set(FILES):
        raise ValueError('Incomplete or unexpected file manifest')
    for name in FILES:
        if digest(root / name) != hashes[name]:
            raise ValueError('Checksum mismatch: ' + name)


def evaluate(stdout, exit_code):
    if exit_code != 0:
        return 'NOT_ACCEPTED'
    try:
        from report_contract import require_complete, EXPECTED_PAGE_CASES, EXPECTED_RUNNER_CASES
        report = json.loads(stdout)
        if not isinstance(report.get('browser'), str) or not report['browser'].strip():
            return 'NOT_ACCEPTED'
        require_complete(report['tests'], EXPECTED_PAGE_CASES + EXPECTED_RUNNER_CASES)
        return 'PASS' if all(row['pass'] for row in report['tests']) else 'NOT_ACCEPTED'
    except (ValueError, KeyError, TypeError, AttributeError):
        return 'NOT_ACCEPTED'


def main():
    receipt = {'schema_version': 1, 'timestamp_utc': datetime.now(timezone.utc).isoformat(),
               'os': platform.system(), 'python': platform.python_version(), 'status': 'NOT_ACCEPTED'}
    try:
        manifest = json.loads((ROOT / 'manifest.json').read_text(encoding='utf-8'))
        verify(ROOT, manifest)
        receipt['source_commit'] = manifest['source_commit']
        receipt['sha256'] = manifest['sha256']
        sys.path.insert(0, str(ROOT / 'tests/browser'))
        result = subprocess.run([sys.executable, str(ROOT / 'tests/browser/run.py')], cwd=ROOT,
                                capture_output=True, text=True, encoding='utf-8', errors='replace', timeout=240)
        receipt.update(exit_code=result.returncode, stdout=result.stdout, stderr=result.stderr,
                       status=evaluate(result.stdout, result.returncode))
    except Exception as exc:
        receipt['error'] = f'{type(exc).__name__}: {exc}'
    output = ROOT / 'ACCEPTANCE_RESULT.json'
    output.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"{receipt['status']}: {output}")
    return 0 if receipt['status'] == 'PASS' else 1


if __name__ == '__main__':
    sys.exit(main())
