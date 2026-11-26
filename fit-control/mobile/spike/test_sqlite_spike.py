"""Local SQLite feasibility only. Native iOS/Android runtime is NOT_RUN."""
import json
import sqlite3
import tempfile
import unittest
from pathlib import Path

SCHEMA = Path(__file__).with_name('schema.sql').read_text(encoding='utf-8')
NOW = '2026-01-01T10:00:00.000Z'
DAY = '2026-01-01'
PAYLOAD = json.dumps({'timezone':'Europe/Moscow','food':{'kcal':None,'protein_g':0},'amount':150,'unit':'g'})
UPDATE = "UPDATE diary_entries SET revision=revision+1, payload=?, updated_at=? WHERE id=? AND revision=? AND status!='deleted' AND updated_at<=?"
DELETE = "UPDATE diary_entries SET revision=revision+1, status='deleted', updated_at=? WHERE id=? AND revision=? AND status!='deleted' AND updated_at<=?"

class SQLiteSpike(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.path = Path(self.tmp.name) / 'synthetic.db'
        self.db = self.connect()
        self.db.executescript(SCHEMA)
        self.insert('a')

    def connect(self):
        db = sqlite3.connect(self.path, timeout=1)
        self.addCleanup(db.close)
        return db

    def insert(self, key, day=DAY, status='confirmed', revision=1):
        with self.db:
            self.db.execute('INSERT INTO diary_entries VALUES (?,?,?,?,?,?,?)', (key,revision,day,status,NOW,NOW,PAYLOAD))

    def row(self):
        return self.db.execute('SELECT revision,status,payload FROM diary_entries WHERE id=?', ('a',)).fetchone()

    def test_reopen_and_unknown_not_zero(self):
        self.db.close()
        other = self.connect()
        payload = json.loads(other.execute('SELECT payload FROM diary_entries WHERE id=?', ('a',)).fetchone()[0])
        self.assertIsNone(payload['food']['kcal'])
        self.assertEqual(payload['food']['protein_g'], 0)

    def test_duplicate_no_data_loss(self):
        with self.assertRaises(sqlite3.IntegrityError): self.insert('a')
        self.assertEqual(self.row(), (1,'confirmed',PAYLOAD))

    def test_stale_revision_two_connections(self):
        other = self.connect()
        self.assertEqual(other.execute('SELECT revision FROM diary_entries WHERE id=?', ('a',)).fetchone()[0], 1)
        with self.db: self.assertEqual(self.db.execute(UPDATE, (PAYLOAD,NOW,'a',1,NOW)).rowcount, 1)
        with other: self.assertEqual(other.execute(UPDATE, (PAYLOAD,NOW,'a',1,NOW)).rowcount, 0)
        self.assertEqual(self.row()[0], 2)

    def test_rollback(self):
        with self.assertRaises(sqlite3.IntegrityError):
            with self.db:
                self.db.execute(UPDATE, (PAYLOAD,NOW,'a',1,NOW))
                self.db.execute("UPDATE diary_entries SET status='invalid' WHERE id='a'")
        self.assertEqual(self.row(), (1,'confirmed',PAYLOAD))

    def test_tombstone(self):
        with self.db:
            self.assertEqual(self.db.execute(DELETE, (NOW,'a',1,NOW)).rowcount, 1)
            self.assertEqual(self.db.execute(UPDATE, (PAYLOAD,NOW,'a',2,NOW)).rowcount, 0)
            self.assertEqual(self.db.execute(DELETE, (NOW,'a',2,NOW)).rowcount, 0)
        with self.assertRaises(sqlite3.IntegrityError): self.insert('a')
        self.assertEqual(self.row(), (2,'deleted',PAYLOAD))

    def test_date_and_status_isolation(self):
        self.insert('b','2026-01-02')
        self.insert('c',status='planned')
        self.insert('d',status='draft')
        rows = self.db.execute('SELECT id FROM diary_entries WHERE local_date=? AND status=?', (DAY,'confirmed')).fetchall()
        self.assertEqual(rows, [('a',)])

    def test_revision_bound(self):
        for value in (0, 1.5, 9007199254740992):
            with self.assertRaises(sqlite3.IntegrityError): self.insert('bad',revision=value)
        self.assertEqual(self.row()[0], 1)

    def test_timestamp_guard(self):
        early = '2026-01-01T09:00:00.000Z'
        with self.db:
            self.assertEqual(self.db.execute(UPDATE, (PAYLOAD,early,'a',1,early)).rowcount, 0)
        self.assertEqual(self.row()[0], 1)

if __name__ == '__main__':
    print('SQLite', sqlite3.sqlite_version, flush=True)
    unittest.main(verbosity=2)
