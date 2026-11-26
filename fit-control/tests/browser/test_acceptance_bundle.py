import json
import pathlib
import sys
import tempfile
import unittest
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / 'tools'))
from acceptance_bundle import FILES, digest, evaluate, verify
from report_contract import EXPECTED_PAGE_CASES, EXPECTED_RUNNER_CASES


class BundleTests(unittest.TestCase):
    def setUp(self):
        self.report = {'browser': 'test fixture', 'tests': [
            {'name': n, 'pass': True} for n in EXPECTED_PAGE_CASES + EXPECTED_RUNNER_CASES]}

    def test_complete(self):
        self.assertEqual(evaluate(json.dumps(self.report), 0), 'PASS')

    def test_failure_exit(self):
        self.assertEqual(evaluate(json.dumps(self.report), 1), 'NOT_ACCEPTED')

    def test_failed_assertion(self):
        self.report['tests'][0]['pass'] = False
        self.assertEqual(evaluate(json.dumps(self.report), 0), 'NOT_ACCEPTED')

    def test_incomplete(self):
        self.report['tests'].pop()
        self.assertEqual(evaluate(json.dumps(self.report), 0), 'NOT_ACCEPTED')

    def test_malformed(self):
        for value in ('not json', '[]', '{}', '{"browser":"","tests":[]}'):
            self.assertEqual(evaluate(value, 0), 'NOT_ACCEPTED')

    def test_manifest_and_tampering(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = pathlib.Path(tmp)
            for name in FILES:
                p = root / name
                p.parent.mkdir(parents=True, exist_ok=True)
                p.write_text(name, encoding='utf-8')
            manifest = {'schema_version': 1, 'source_commit': 'a' * 40,
                        'sha256': {name: digest(root / name) for name in FILES}}
            verify(root, manifest)
            (root / FILES[0]).write_text('tampered', encoding='utf-8')
            with self.assertRaises(ValueError):
                verify(root, manifest)

    def test_manifest_extra_path(self):
        manifest = {'schema_version': 1, 'source_commit': 'a' * 40,
                    'sha256': dict.fromkeys((*FILES, '../other'), 'x')}
        with self.assertRaises(ValueError):
            verify(pathlib.Path('.'), manifest)
