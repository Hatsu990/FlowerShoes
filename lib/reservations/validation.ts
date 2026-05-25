import type { AdminNotificationSettings } from "@/lib/admin/settings";
import { ceilToStep, getKoreaDateString, getKoreaTimeString, isKoreaWeekend, timeToMinutes } from "@/lib/datetime/korea";
import {
  CreateReservationInput,
  ReservationStatus,
  ReservationVisitType,
  ValidationResult,
  reservationStatuses,
  reservationVisitTypes,
} from "@/lib/reservations/types";

const phonePattern = /^[0-9+\-()\s]{8,20}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timeStepMinutes = 10;

function toTrimmedString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function getBusinessHours(settings: AdminNotificationSettings, dateString: string) {
  if (settings.developerAlwaysOpen) {
    return { open: "00:00", close: "23:50" };
  }

  if (isKoreaWeekend(dateString)) {
    return { open: settings.weekendOpen, close: settings.weekendClose };
  }

  return { open: settings.weekdayOpen, close: settings.weekdayClose };
}

export function validateCreateReservationInput(
  input: unknown,
  adminSettings: AdminNotificationSettings,
): ValidationResult<CreateReservationInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["요청 데이터 형식이 올바르지 않습니다."] };
  }

  const payload = input as Record<string, unknown>;
  const today = getKoreaDateString();
  const name = toTrimmedString(payload.name);
  const phone = toTrimmedString(payload.phone);
  const date = toTrimmedString(payload.date) || today;
  const time = toTrimmedString(payload.time);
  const reservationTypeRaw = toTrimmedString(payload.reservationType);
  const selectedMenusRaw = Array.isArray(payload.selectedMenus) ? payload.selectedMenus : [];
  const selectedMenus = selectedMenusRaw
    .map((menu) => toTrimmedString(menu))
    .filter(Boolean)
    .slice(0, 30);
  const memo = toTrimmedString(payload.memo);
  const errors: string[] = [];

  if (name.length < 2 || name.length > 30) {
    errors.push("이름은 2~30자로 입력해주세요.");
  }
  if (!phonePattern.test(phone)) {
    errors.push("연락처 형식이 올바르지 않습니다.");
  }
  if (!datePattern.test(date)) {
    errors.push("날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)");
  }
  if (date !== today) {
    errors.push("예약 날짜는 오늘만 선택할 수 있습니다.");
  }
  if (!timePattern.test(time)) {
    errors.push("시간 형식이 올바르지 않습니다. (HH:MM)");
  }

  if (timePattern.test(time)) {
    const minute = Number(time.split(":")[1]);
    if (minute % timeStepMinutes !== 0) {
      errors.push("시간은 10분 단위로 선택해주세요.");
    }
  }

  if (!adminSettings.developerAlwaysOpen && adminSettings.closedDates.includes(date)) {
    errors.push("오늘은 휴무일입니다.");
  }

  if (datePattern.test(date) && timePattern.test(time)) {
    const current = timeToMinutes(getKoreaTimeString());
    const requested = timeToMinutes(time);
    const hours = getBusinessHours(adminSettings, date);
    const open = timeToMinutes(hours.open);
    const close = timeToMinutes(hours.close);
    const earliestReservable = Math.max(open, ceilToStep(current, timeStepMinutes));

    if (!adminSettings.developerAlwaysOpen && (current < open || current >= close)) {
      errors.push("영업이 종료되었습니다.");
    }

    if (date === today && requested < earliestReservable) {
      errors.push("현재 시간 이후의 예약 시간만 선택해주세요.");
    }

    if (requested < open || requested >= close) {
      errors.push("영업시간 내 시간만 선택해주세요.");
    }
  }

  const reservationType = (reservationTypeRaw || "포장") as ReservationVisitType;
  if (!reservationVisitTypes.includes(reservationType)) {
    errors.push("방문 유형은 매장 또는 포장 중에서 선택해주세요.");
  }

  if (memo.length > 500) {
    errors.push("요청사항은 500자 이내로 입력해주세요.");
  }

  if (selectedMenus.some((menu) => menu.length > 80)) {
    errors.push("선택 메뉴 이름이 너무 깁니다.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      date,
      time,
      reservationType,
      selectedMenus,
      memo: memo || undefined,
    },
  };
}

export function parseReservationStatus(value: unknown): ReservationStatus | null {
  if (typeof value !== "string") {
    return null;
  }
  return reservationStatuses.includes(value as ReservationStatus) ? (value as ReservationStatus) : null;
}
