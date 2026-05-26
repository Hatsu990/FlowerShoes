import { db } from "@/lib/db/client";
import { defaultAboutImage, defaultHeroImage, galleryImages } from "@/lib/constants/gallery";
import { ADMIN_SETTINGS_TABLE_SQL } from "@/lib/db/schema";

export type NotificationMode = "sms" | "app" | "both";
export const defaultOwnerPhone = "01043303764";

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
  developerAlwaysOpen: boolean;
  soldOutMenus: string[];
  hiddenMenus: string[];
  heroImage: string;
  aboutImage: string;
}

const settingsKey = "notification";
const settingsCacheMs = 0;

let settingsInitPromise: Promise<void> | null = null;
let settingsCache: { value: AdminNotificationSettings; expiresAt: number } | null = null;

const defaultSettings: AdminNotificationSettings = {
  ownerName: "",
  phone: defaultOwnerPhone,
  notificationMode: "app",
  orderSoundLabel: "새 주문이 들어왔습니다",
  weekdayOpen: "10:00",
  weekdayClose: "20:00",
  weekendOpen: "10:00",
  weekendClose: "20:00",
  closedDates: [],
  developerAlwaysOpen: false,
  soldOutMenus: [],
  hiddenMenus: [],
  heroImage: defaultHeroImage,
  aboutImage: defaultAboutImage,
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

function parseStringList(value: unknown, limit = 200) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim().slice(0, 120))
    .slice(0, limit);
}

function parseGalleryImage(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  return galleryImages.some((image) => image.value === value) ? value : fallback;
}

function parseSettings(value: unknown): AdminNotificationSettings {
  if (typeof value !== "string") {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(value) as Partial<AdminNotificationSettings>;
    return {
      ownerName: typeof parsed.ownerName === "string" ? parsed.ownerName : "",
      phone: typeof parsed.phone === "string" && parsed.phone.trim() ? parsed.phone.trim() : defaultOwnerPhone,
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
      developerAlwaysOpen: parsed.developerAlwaysOpen === true,
      soldOutMenus: parseStringList(parsed.soldOutMenus),
      hiddenMenus: parseStringList(parsed.hiddenMenus),
      heroImage: parseGalleryImage(parsed.heroImage, defaultSettings.heroImage),
      aboutImage: parseGalleryImage(parsed.aboutImage, defaultSettings.aboutImage),
    };
  } catch {
    return defaultSettings;
  }
}

async function ensureAdminSettingsSchema() {
  if (!settingsInitPromise) {
    settingsInitPromise = db.execute(ADMIN_SETTINGS_TABLE_SQL).then(() => undefined);
  }

  await settingsInitPromise;
}

export async function getAdminNotificationSettings(): Promise<AdminNotificationSettings> {
  const now = Date.now();
  if (settingsCacheMs > 0 && settingsCache && settingsCache.expiresAt > now) {
    return settingsCache.value;
  }

  await ensureAdminSettingsSchema();

  const result = await db.execute({
    sql: "SELECT value FROM admin_settings WHERE key = ? LIMIT 1",
    args: [settingsKey],
  });

  const settings = parseSettings(result.rows[0]?.value);
  settingsCache =
    settingsCacheMs > 0
      ? {
          value: settings,
          expiresAt: now + settingsCacheMs,
        }
      : null;

  return settings;
}

export async function updateAdminNotificationSettings(
  input: Partial<AdminNotificationSettings>,
): Promise<AdminNotificationSettings> {
  await ensureAdminSettingsSchema();

  const next: AdminNotificationSettings = {
    ownerName: String(input.ownerName ?? "").trim().slice(0, 40),
    phone: String(input.phone ?? defaultOwnerPhone).trim().slice(0, 30) || defaultOwnerPhone,
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
    developerAlwaysOpen: input.developerAlwaysOpen === true,
    soldOutMenus: parseStringList(input.soldOutMenus),
    hiddenMenus: parseStringList(input.hiddenMenus),
    heroImage: parseGalleryImage(input.heroImage, defaultSettings.heroImage),
    aboutImage: parseGalleryImage(input.aboutImage, defaultSettings.aboutImage),
  };

  await db.execute({
    sql: `
      INSERT INTO admin_settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `,
    args: [settingsKey, JSON.stringify(next), new Date().toISOString()],
  });

  settingsCache =
    settingsCacheMs > 0
      ? {
          value: next,
          expiresAt: Date.now() + settingsCacheMs,
        }
      : null;

  return next;
}
