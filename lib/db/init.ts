import { db } from "./client";
import { RESERVATIONS_INDEX_SQL, RESERVATIONS_TABLE_SQL } from "./schema";

let initPromise: Promise<void> | null = null;

export async function ensureDatabaseSchema() {
  if (!initPromise) {
    initPromise = (async () => {
      await db.execute(RESERVATIONS_TABLE_SQL);
      await db.execute(RESERVATIONS_INDEX_SQL);
    })();
  }

  await initPromise;
}