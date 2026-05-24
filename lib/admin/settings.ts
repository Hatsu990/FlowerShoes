import { db } from "@/lib/db/client";
import { ensureDatabaseSchema } from "@/lib/db/init";

export type NotificationMode = "sms" | "app" | "both";

export interface AdminNotificationSettings {
  ownerName: string;
  phone: string;
  notificationMode: NotificationMode;
  orderSoundLabel: string;
  weekdayOpen: string;
  weekdayClose: string;
  weekendOpen: string;
  weekendClose: string;
  closedDates: string[];
}

const settingsKey = "notification";

const defaultSettings: AdminNotificationSettings = {
  ownerName: "",
  phone: "",
  notificationMode: "app",
  orderSoundLabel: "새 주문이 들어왔습니다",
  weekdayOpen: "10:00",
  weekdayClose: "20:00",
  weekendOpen: "10:00",
  weekendClose: "20:00",
  closedDates: [],
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function parseTime(value: unknown, fallback: string) {
  return typeof value === "string" && timePattern.test(value) ? value : fallback;
}

function parseClosedDates(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((date): date is string => typeof date === "string" && datePattern.test(date))
    .slice(0, 120);
}

function parseSettings(value: unknown): AdminNotificationSettings {
  if (typeof value !== "string") {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AdminNotificationSettings>;
    return {
      ownerName: typeof parsed.ownerName === "string" ? parsed.ownerName : "",
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      notificationMode:
        parsed.notificationMode === "sms" || parsed.notificationMode === "app" || parsed.notificationMode === "both"
          ? parsed.notificationMode
          : "app",
      orderSoundLabel:
        typeof parsed.orderSoundLabel === "string" && parsed.orderSoundLabel.trim()
          ? parsed.orderSoundLabel.trim()
          : defaultSettings.orderSoundLabel,
      weekdayOpen: parseTime(parsed.weekdayOpen, defaultSettings.weekdayOpen),
      weekdayClose: parseTime(parsed.weekdayClose, defaultSettings.weekdayClose),
      weekendOpen: parseTime(parsed.weekendOpen, defaultSettings.weekendOpen),
      weekendClose: parseTime(parsed.weekendClose, defaultSettings.weekendClose),
      closedDates: parseClosedDates(parsed.closedDates),
    };
  } catch {
    return defaultSettings;
  }
}

export async function getAdminNotificationSettings(): Promise<AdminNotificationSettings> {
  await ensureDatabaseSchema();

  const result = await db.execute({
    sql: "SELECT value FROM admin_settings WHERE key = ? LIMIT 1",
    args: [settingsKey],
  });

  return parseSettings(result.rows[0]?.value);
}

export async function updateAdminNotificationSettings(
  input: Partial<AdminNotificationSettings>,
): Promise<AdminNotificationSettings> {
  await ensureDatabaseSchema();

  const next: AdminNotificationSettings = {
    ownerName: String(input.ownerName ?? "").trim().slice(0, 40),
    phone: String(input.phone ?? "").trim().slice(0, 30),
    notificationMode:
      input.notificationMode === "sms" || input.notificationMode === "app" || input.notificationMode === "both"
        ? input.notificationMode
        : "app",
    orderSoundLabel: String(input.orderSoundLabel ?? defaultSettings.orderSoundLabel)
      .trim()
      .slice(0, 60),
    weekdayOpen: parseTime(input.weekdayOpen, defaultSettings.weekdayOpen),
    weekdayClose: parseTime(input.weekdayClose, defaultSettings.weekdayClose),
    weekendOpen: parseTime(input.weekendOpen, defaultSettings.weekendOpen),
    weekendClose: parseTime(input.weekendClose, defaultSettings.weekendClose),
    closedDates: parseClosedDates(input.closedDates),
  };

  await db.execute({
    sql: `
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `,
    args: [settingsKey, JSON.stringify(next), new Date().toISOString()],
  });

  return next;
}
