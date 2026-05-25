const koreaTimeZone = "Asia/Seoul";

function getKoreaDateParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: koreaTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(formatter.formatToParts(date).map((part) => [part.type, part.value]));

  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour === "24" ? "00" : parts.hour,
    minute: parts.minute,
  };
}

export function getKoreaDateString(date = new Date()) {
  const parts = getKoreaDateParts(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function getKoreaTimeString(date = new Date()) {
  const parts = getKoreaDateParts(date);
  return `${parts.hour}:${parts.minute}`;
}

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function minutesToTime(value: number) {
  const normalized = Math.max(0, Math.min(value, 23 * 60 + 59));
  const hour = Math.floor(normalized / 60);
  const minute = normalized % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function ceilToStep(value: number, step: number) {
  return Math.ceil(value / step) * step;
}

export function isKoreaWeekend(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const utcTime = Date.UTC(year, month - 1, day);
  const dayIndex = new Date(utcTime).getUTCDay();
  return dayIndex === 0 || dayIndex === 6;
}
