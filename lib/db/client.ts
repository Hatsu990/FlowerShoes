import { createClient } from "@libsql/client";

function getRequiredEnv(name: "TURSO_DATABASE_URL" | "TURSO_AUTH_TOKEN") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

export const db = createClient({
  url: getRequiredEnv("TURSO_DATABASE_URL"),
  authToken: getRequiredEnv("TURSO_AUTH_TOKEN"),
});