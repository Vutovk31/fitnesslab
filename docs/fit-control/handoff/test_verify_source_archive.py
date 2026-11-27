import tempfile
from pathlib import Path
import stat
import unittest
import warnings
import zipfile
from verify_source_archive import verify, blob, manifest


class ArchiveTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / 'fixture.zip'
        self.expected = {'a.txt': blob(b'a'), 'src/b.txt': blob(b'b')}

    def make(self, rows):
        with warnings.catch_warnings(), zipfile.ZipFile(self.path, 'w') as z:
            warnings.simplefilter('ignore', UserWarning)
            for k, v in rows:
                z.writestr(k, v)
        return self.path

    def test_complete(self):
        self.assertEqual(verify(self.make([('fit-control/', b''), ('fit-control/a.txt', b'a'), ('fit-control/src/b.txt', b'b')]), self.expected), 2)

    def test_missing(self):
        with self.assertRaisesRegex(ValueError, 'Incomplete archive'):
            verify(self.make([('fit-control/a.txt', b'a')]), self.expected)

    def test_tampered(self):
        with self.assertRaisesRegex(ValueError, 'Blob mismatch'):
            verify(self.make([('fit-control/a.txt', b'x')]), self.expected)

    def test_duplicate(self):
        with self.assertRaisesRegex(ValueError, 'Duplicate'):
            verify(self.make([('fit-control/a.txt', b'a'), ('fit-control/a.txt', b'a')]), self.expected)

    def test_unexpected_paths(self):
        for name in ['../a.txt', 'fit-control/../a.txt', '/fit-control/a.txt', 'fit-control/.env', 'fit-control/extra/', 'fit-control\\a.txt']:
            with self.subTest(name=name), self.assertRaisesRegex(ValueError, 'Unexpected'):
                verify(self.make([(name, b'')]), self.expected)

    def test_symlink(self):
        item = zipfile.ZipInfo('fit-control/a.txt')
        item.create_system = 3
        item.external_attr = (stat.S_IFLNK | 0o777) << 16
        with self.assertRaisesRegex(ValueError, 'nonregular'):
            verify(self.make([(item, b'a')]), self.expected)

    def test_oversized(self):
        with self.assertRaisesRegex(ValueError, 'byte limit'):
            verify(self.make([('fit-control/a.txt', b'x' * (1024*1024+1))]), self.expected)

    def test_manifest(self):
        self.assertEqual(len(manifest()), 99)


if __name__ == '__main__':
    unittest.main()
