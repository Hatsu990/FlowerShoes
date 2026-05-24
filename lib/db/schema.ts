export const RESERVATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  people INTEGER NOT NULL DEFAULT 1 CHECK (people >= 1),
  reservation_type TEXT NOT NULL DEFAULT '매장' CHECK (reservation_type IN ('매장', '포장')),
  memo TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
`;

export const RESERVATIONS_INDEX_SQL = `
CREATE INDEX IF NOT EXISTS idx_reservations_status_created_at
ON reservations (status, created_at DESC);
`;