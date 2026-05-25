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

export function isKoreaWeekend(dateString: string) {
  const [year, month, day] = dateString.split("-").map(Number);
  const utcTime = Date.UTC(year, month - 1, day);
  const dayIndex = new Date(utcTime).getUTCDay();
  return dayIndex === 0 || dayIndex === 6;
}
