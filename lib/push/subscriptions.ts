import { db } from "@/lib/db/client";

export interface StoredPushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PushSubscriptionInput {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

const PUSH_SUBSCRIPTIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS push_subscriptions (
  endpoint TEXT PRIMARY KEY,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
`;

let pushInitPromise: Promise<void> | null = null;

async function ensurePushSubscriptionSchema() {
  if (!pushInitPromise) {
    pushInitPromise = db.execute(PUSH_SUBSCRIPTIONS_TABLE_SQL).then(() => undefined);
  }

  await pushInitPromise;
}

function isValidSubscription(input: unknown): input is PushSubscriptionInput {
  if (!input || typeof input !== "object") {
    return false;
  }

  const subscription = input as Partial<PushSubscriptionInput>;
  return (
    typeof subscription.endpoint === "string" &&
    subscription.endpoint.startsWith("https://") &&
    typeof subscription.keys?.p256dh === "string" &&
    subscription.keys.p256dh.length > 0 &&
    typeof subscription.keys?.auth === "string" &&
    subscription.keys.auth.length > 0
  );
}

export async function savePushSubscription(input: unknown, userAgent: string | null) {
  if (!isValidSubscription(input)) {
    return { ok: false, message: "유효하지 않은 알림 구독 정보입니다." };
  }

  await ensurePushSubscriptionSchema();
  const now = new Date().toISOString();

  await db.execute({
    sql: `
      INSERT INTO push_subscriptions (endpoint, p256dh, auth, user_agent, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(endpoint) DO UPDATE SET
        p256dh = excluded.p256dh,
        auth = excluded.auth,
        user_agent = excluded.user_agent,
        updated_at = excluded.updated_at
    `,
    args: [input.endpoint, input.keys.p256dh, input.keys.auth, userAgent, now, now],
  });

  return { ok: true };
}

export async function listPushSubscriptions(): Promise<StoredPushSubscription[]> {
  await ensurePushSubscriptionSchema();

  const result = await db.execute(`
    SELECT endpoint, p256dh, auth, user_agent, created_at, updated_at
    FROM push_subscriptions
    ORDER BY updated_at DESC
  `);

  return result.rows.map((row) => ({
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
    userAgent: row.user_agent == null ? null : String(row.user_agent),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  }));
}

export async function deletePushSubscription(endpoint: string) {
  await ensurePushSubscriptionSchema();

  await db.execute({
    sql: "DELETE FROM push_subscriptions WHERE endpoint = ?",
    args: [endpoint],
  });

  return { ok: true };
}
