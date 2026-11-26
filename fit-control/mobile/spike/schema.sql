-- M01 feasibility spike; not a production migration or native adapter.
CREATE TABLE diary_entries (
  id TEXT PRIMARY KEY NOT NULL,
  revision INTEGER NOT NULL CHECK(typeof(revision) = 'integer' AND revision BETWEEN 1 AND 9007199254740991),
  local_date TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('draft','planned','confirmed','deleted')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL CHECK(updated_at >= created_at),
  payload TEXT NOT NULL
);
CREATE INDEX diary_entries_date ON diary_entries(local_date);
