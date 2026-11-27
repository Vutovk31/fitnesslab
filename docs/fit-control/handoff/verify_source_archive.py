#!/usr/bin/env python3
"""Verify a pinned fit-control-only git archive, without executing or extracting it."""
import argparse
import hashlib
from pathlib import Path, PurePosixPath
import stat
import zipfile

SOURCE = '72f2eb710098347dbb36461fd63e03def7fbfa90'
MANIFEST_BLOB = '669f7f4b4fe1ccd822d6b8f33e0f213a447e1e71'
LIMIT = 8 * 1024 * 1024


def blob(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


def manifest():
    data = Path(__file__).with_name('source-manifest.tsv').read_bytes()
    if blob(data) != MANIFEST_BLOB:
        raise ValueError('Manifest hash mismatch')
    rows = [line.split('\t') for line in data.decode('utf-8').splitlines()]
    expected = {p: h for h, p in rows}
    if len(rows) != 99 or len(expected) != 99:
        raise ValueError('Invalid inventory')
    return expected


def verify(archive, expected):
    if archive.stat().st_size > LIMIT:
        raise ValueError('Archive byte limit exceeded')
    prefix = 'fit-control/'
    dirs = {prefix}
    for p in expected:
        dirs.update(prefix + str(parent) + '/' for parent in PurePosixPath(p).parents if str(parent) != '.')
    seen = set()
    total = 0
    with zipfile.ZipFile(archive) as z:
        for item in z.infolist():
            name = item.filename
            if name in seen:
                raise ValueError('Duplicate archive member')
            seen.add(name)
            kind = stat.S_IFMT(item.external_attr >> 16)
            if item.flag_bits & 1 or item.orig_filename != name:
                raise ValueError('Encrypted or invalid member')
            if item.is_dir():
                if name not in dirs or kind not in (0, stat.S_IFDIR) or item.file_size:
                    raise ValueError('Unexpected directory')
                continue
            if not name.startswith(prefix) or name[len(prefix):] not in expected or kind not in (0, stat.S_IFREG):
                raise ValueError('Unexpected or nonregular member: ' + name)
            total += item.file_size
            if item.file_size > 1024 * 1024 or total > LIMIT:
                raise ValueError('Expanded byte limit exceeded')
            data = z.read(item)
            if len(data) != item.file_size or blob(data) != expected[name[len(prefix):]]:
                raise ValueError('Blob mismatch: ' + name)
    missing = set(expected) - {p[len(prefix):] for p in seen if p.startswith(prefix)}
    if missing:
        raise ValueError(f'Incomplete archive: {len(expected)-len(missing)}/{len(expected)} verified, {len(missing)} missing')
    return len(expected)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('archive', type=Path)
    args = p.parse_args()
    try:
        n = verify(args.archive, manifest())
        print(f'PASS: {n} exact blobs; SOURCE={SOURCE}; archive only, tests NOT_RUN')
        return 0
    except (OSError, ValueError, RuntimeError, zipfile.BadZipFile) as e:
        print('BLOCKED: ' + str(e))
        return 2


if __name__ == '__main__':
    raise SystemExit(main())
