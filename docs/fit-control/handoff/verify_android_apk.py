"""Offline APK/web payload correspondence check; not a signature or device test."""
import hashlib
import json
import pathlib
import sys
import zipfile

MAX_ENTRY = 64 * 1024 * 1024

def verify(apk, web):
    web = pathlib.Path(web)
    expected = {'index.html', 'app.js'}
    if {p.name for p in web.iterdir()} != expected:
        raise ValueError('unexpected web inventory')
    with zipfile.ZipFile(apk) as z:
        names = z.namelist()
        if len(names) != len(set(names)):
            raise ValueError('duplicate ZIP members')
        for n in names:
            if n.startswith('/') or '\\' in n or '..' in n.split('/'):
                raise ValueError('unsafe ZIP member')
        if not {'AndroidManifest.xml', 'classes.dex'} <= set(names):
            raise ValueError('missing Android runtime entries')
        actual = {n.removeprefix('assets/public/') for n in names if n.startswith('assets/public/') and not n.endswith('/')}
        # Capacitor sync may add these generated bridge files.
        if not expected <= actual or actual - expected - {'cordova.js', 'cordova_plugins.js'}:
            raise ValueError('unexpected embedded web inventory')
        result = {}
        for name in sorted(expected):
            p = web / name
            if p.is_symlink() or not p.is_file() or not 0 < p.stat().st_size <= MAX_ENTRY:
                raise ValueError('invalid source asset')
            info = z.getinfo('assets/public/' + name)
            if info.file_size != p.stat().st_size:
                raise ValueError('asset size mismatch')
            data = p.read_bytes()
            if z.read(info) != data:
                raise ValueError('asset byte mismatch')
            result[name] = hashlib.sha256(data).hexdigest()
        return result

if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('usage: verify_android_apk.py APK WWW_DIRECTORY')
    print(json.dumps({'web_payload': verify(sys.argv[1], sys.argv[2]), 'scope': 'payload correspondence only'}, sort_keys=True))
