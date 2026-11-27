import pathlib
import tempfile
import unittest
import warnings
import zipfile
from verify_android_apk import verify

class Checks(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        root = pathlib.Path(self.temp.name)
        self.web = root / 'www'; self.web.mkdir()
        self.apk = root / 'sample.apk'
        self.files = {'AndroidManifest.xml': b'fixture', 'classes.dex': b'fixture', 'assets/public/index.html': b'html', 'assets/public/app.js': b'js'}
        for name, data in [('index.html', b'html'), ('app.js', b'js')]:
            (self.web / name).write_bytes(data)
    def build(self, extra=()):
        with zipfile.ZipFile(self.apk, 'w') as z:
            for name, data in list(self.files.items()) + list(extra):
                z.writestr(name, data)
    def test_matching(self):
        self.build(); self.assertEqual(set(verify(self.apk, self.web)), {'index.html','app.js'})
    def test_bridge(self):
        self.build([('assets/public/cordova.js', b'')]); verify(self.apk, self.web)
    def test_mismatch(self):
        self.files['assets/public/app.js'] = b'xx'; self.build()
        with self.assertRaisesRegex(ValueError, 'byte mismatch'): verify(self.apk, self.web)
    def test_missing_runtime(self):
        del self.files['classes.dex']; self.build()
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_extra_web(self):
        self.build([('assets/public/private.json', b'x')])
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_duplicate(self):
        with warnings.catch_warnings():
            warnings.simplefilter('ignore'); self.build([('classes.dex', b'x')])
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_traversal(self):
        self.build([('../x', b'x')])
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_extra_source(self):
        (self.web/'extra').touch(); self.build()
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_missing_asset(self):
        del self.files['assets/public/app.js']; self.build()
        with self.assertRaises(ValueError): verify(self.apk, self.web)
    def test_size(self):
        self.files['assets/public/app.js'] = b'longer'; self.build()
        with self.assertRaisesRegex(ValueError, 'size mismatch'): verify(self.apk, self.web)

if __name__ == '__main__': unittest.main()
