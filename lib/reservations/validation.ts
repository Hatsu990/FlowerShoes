import {
  CreateReservationInput,
  ReservationStatus,
  ValidationResult,
  reservationStatuses,
} from "@/lib/reservations/types";

const phonePattern = /^[0-9+\-()\s]{8,20}$/;
const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function toTrimmedString(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function validateCreateReservationInput(input: unknown): ValidationResult<CreateReservationInput> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: ["요청 데이터 형식이 올바르지 않습니다."] };
  }

  const payload = input as Record<string, unknown>;
  const name = toTrimmedString(payload.name);
  const phone = toTrimmedString(payload.phone);
  const date = toTrimmedString(payload.date);
  const time = toTrimmedString(payload.time);
  const peopleRaw = payload.people ?? payload.partySize;
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
  if (!timePattern.test(time)) {
    errors.push("시간 형식이 올바르지 않습니다. (HH:MM)");
  }

  const people = Number(peopleRaw);
  if (!Number.isInteger(people) || people < 1 || people > 20) {
    errors.push("인원 수는 1~20명 사이로 입력해주세요.");
  }
  if (memo.length > 500) {
    errors.push("요청사항은 500자 이내로 입력해주세요.");
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
      people,
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