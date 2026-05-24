import { db } from "./client";
import { RESERVATIONS_INDEX_SQL, RESERVATIONS_TABLE_SQL } from "./schema";

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
}

export async function ensureDatabaseSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      await db.execute(RESERVATIONS_TABLE_SQL);
      await ensureReservationColumns();
      await db.execute(RESERVATIONS_INDEX_SQL);
    })();
  }

  await initPromise;
}