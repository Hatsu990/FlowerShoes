import { db } from "./client";
import { ADMIN_SETTINGS_TABLE_SQL, RESERVATIONS_INDEX_SQL, RESERVATIONS_TABLE_SQL } from "./schema";

let initPromise: Promise<void> | null = null;

async function ensureReservationColumns() {
  const info = await db.execute("PRAGMA table_info(reservations)");
  const columns = new Set(
    info.rows.map((row) => String((row as Record<string, unknown>).name)),
  );

  if (!columns.has("people")) {
    await db.execute("ALTER TABLE reservations ADD COLUMN people INTEGER NOT NULL DEFAULT 1");
  }

  if (!columns.has("reservation_type")) {
    await db.execute("ALTER TABLE reservations ADD COLUMN reservation_type TEXT NOT NULL DEFAULT '매장'");
  }

  if (!columns.has("selected_menus")) {
    await db.execute("ALTER TABLE reservations ADD COLUMN selected_menus TEXT NOT NULL DEFAULT '[]'");
  }
}

async function ensureReservationStatusConstraint() {
  const result = await db.execute({
    sql: "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'reservations' LIMIT 1",
    args: [],
  });
  const tableSql = String(result.rows[0]?.sql ?? "");

  if (!tableSql || tableSql.includes("'completed'")) {
    return;
  }

  const legacyTableName = `reservations_legacy_${Date.now()}`;
  await db.execute("DROP INDEX IF EXISTS idx_reservations_status_created_at");
  await db.execute(`ALTER TABLE reservations RENAME TO ${legacyTableName}`);
  await db.execute(RESERVATIONS_TABLE_SQL);
  await db.execute(`
    INSERT INTO reservations (
      id, name, phone, date, time, people, reservation_type, selected_menus, memo, status, created_at
    )
    SELECT
      id,
      name,
      phone,
      date,
      time,
      people,
      reservation_type,
      selected_menus,
      memo,
      CASE WHEN status IN ('pending', 'confirmed', 'completed', 'cancelled') THEN status ELSE 'pending' END,
      created_at
    FROM ${legacyTableName}
  `);
  await db.execute(`DROP TABLE ${legacyTableName}`);
}

export async function ensureDatabaseSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      await db.execute(RESERVATIONS_TABLE_SQL);
      await db.execute(ADMIN_SETTINGS_TABLE_SQL);
      await ensureReservationColumns();
      await ensureReservationStatusConstraint();
      await db.execute(RESERVATIONS_INDEX_SQL);
    })();
  }

  await initPromise;
}
