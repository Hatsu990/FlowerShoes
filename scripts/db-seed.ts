import "dotenv/config";
import { randomUUID } from "node:crypto";

import { db } from "../lib/db/client";
import { ensureDatabaseSchema } from "../lib/db/init";

async function main() {
  await ensureDatabaseSchema();

  const countResult = await db.execute("SELECT COUNT(*) AS count FROM reservations");
  const count = Number(countResult.rows[0]?.count ?? 0);
  if (count > 0) {
    console.info("[db:seed] 기존 데이터가 있어 시드를 건너뜁니다.");
    return;
  }

  const now = new Date().toISOString();
  await db.batch(
    [
      {
        sql: "INSERT INTO reservations (id, name, phone, date, time, people, memo, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          randomUUID(),
          "김다은",
          "010-1234-5678",
          "2026-05-25",
          "14:00",
          2,
          "창가 자리 요청",
          "pending",
          now,
        ],
      },
      {
        sql: "INSERT INTO reservations (id, name, phone, date, time, people, memo, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        args: [
          randomUUID(),
          "박선우",
          "010-8765-4321",
          "2026-05-26",
          "11:30",
          3,
          "알레르기 재료 안내 필요",
          "confirmed",
          now,
        ],
      },
    ],
    "write",
  );

  console.info("[db:seed] 샘플 예약 데이터 2건 생성 완료");
}

main().catch((error) => {
  console.error("[db:seed] 실패", error);
  process.exit(1);
});