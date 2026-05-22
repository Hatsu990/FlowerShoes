import "dotenv/config";

import { ensureDatabaseSchema } from "../lib/db/init";

async function main() {
  await ensureDatabaseSchema();
  console.info("[db:init] reservations 테이블 준비 완료");
}

main().catch((error) => {
  console.error("[db:init] 실패", error);
  process.exit(1);
});