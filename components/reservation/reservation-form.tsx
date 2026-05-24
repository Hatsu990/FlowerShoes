"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import type { AdminNotificationSettings } from "@/lib/admin/settings";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";

type FormStatus = "idle" | "loading" | "success" | "error";
type SelectedMenuMap = Record<string, number>;

const initialFormState = {
  name: "",
  phone: "",
  time: "",
  reservationType: "포장" as "매장" | "포장",
  selectedMenus: {} as SelectedMenuMap,
  memo: "",
};

interface ReservationFormProps {
  title?: string;
  compact?: boolean;
}

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function getMenuOptions(menu: CafeMenuItem) {
  const options: { label: string; price: number }[] = [];

  if (typeof menu.hot === "number") {
    options.push({ label: `${menu.name} HOT`, price: menu.hot });
  }
  if (typeof menu.ice === "number") {
    options.push({ label: `${menu.name} ICE`, price: menu.ice });
  }
  if (typeof menu.price === "number") {
    options.push({ label: menu.name, price: menu.price });
  }

  return options;
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTime(value: number) {
  const hour = Math.floor(value / 60);
  const minute = value % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function isWeekend(dateString: string) {
  if (!dateString) {
    return false;
  }
  const day = new Date(`${dateString}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayTimeString() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getBusinessHours(settings: AdminNotificationSettings | null, dateString: string) {
  if (!settings) {
    return { open: "10:00", close: "20:00" };
  }

  if (isWeekend(dateString)) {
    return { open: settings.weekendOpen, close: settings.weekendClose };
  }

  return { open: settings.weekdayOpen, close: settings.weekdayClose };
}

function getTimeOptions(settings: AdminNotificationSettings | null, dateString: string) {
  const hours = getBusinessHours(settings, dateString);
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const options: string[] = [];
  for (let value = open; value <= close; value += 5) {
    options.push(minutesToTime(value));
  }
  return options;
}

export function ReservationForm({ title = "예약 요청", compact = false }: ReservationFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [today, setToday] = useState(getTodayDateString);
  const [currentTime, setCurrentTime] = useState(getTodayTimeString);
  const [adminSettings, setAdminSettings] = useState<AdminNotificationSettings | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [reservationId, setReservationId] = useState("");

  const isLoading = status === "loading";
  const buttonText = useMemo(() => {
    if (isLoading) {
      return "전송 중...";
    }
    return "예약 제출";
  }, [isLoading]);

  const selectedMenuLabels = useMemo(
    () =>
      Object.entries(form.selectedMenus)
        .filter(([, count]) => count > 0)
        .map(([label, count]) => `${label} x ${count}`),
    [form.selectedMenus],
  );
  const timeOptions = useMemo(() => getTimeOptions(adminSettings, today), [adminSettings, today]);
  const isClosedDate = adminSettings?.closedDates.includes(today) ?? false;
  const businessHours = getBusinessHours(adminSettings, today);
  const nowMinutes = timeToMinutes(currentTime);
  const openMinutes = timeToMinutes(businessHours.open);
  const closeMinutes = timeToMinutes(businessHours.close);
  const isBusinessOpen = !isClosedDate && nowMinutes >= openMinutes && nowMinutes <= closeMinutes;
  const submitDisabled = isLoading || !isBusinessOpen;
  const submitText = isBusinessOpen ? buttonText : "영업이 종료되었습니다";

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings");
        const json = (await response.json()) as { ok: boolean; settings?: AdminNotificationSettings };
        if (mounted && json.ok && json.settings) {
          setAdminSettings(json.settings);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadSettings();
    const interval = window.setInterval(() => {
      setToday(getTodayDateString());
      setCurrentTime(getTodayTimeString());
    }, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  function updateMenuQuantity(label: string, delta: number) {
    setForm((prev) => {
      const current = prev.selectedMenus[label] ?? 0;
      const next = Math.max(0, Math.min(99, current + delta));
      const selectedMenus = { ...prev.selectedMenus };

      if (next === 0) {
        delete selectedMenus[label];
      } else {
        selectedMenus[label] = next;
      }

      return { ...prev, selectedMenus };
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setReservationId("");

    try {
      const payload = {
        ...form,
        date: today,
        selectedMenus: selectedMenuLabels,
      };
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as {
        ok: boolean;
        reservationId?: string;
        message?: string;
        errors?: string[];
      };

      if (!response.ok || !json.ok) {
        setStatus("error");
        setMessage(json.errors?.join(" / ") || json.message || "예약 전송에 실패했습니다.");
        return;
      }

      setStatus("success");
      setReservationId(json.reservationId ?? "");
      setMessage("예약 요청이 접수되었습니다. 확인 후 연락드리겠습니다.");
      setForm((prev) => ({ ...initialFormState, reservationType: prev.reservationType }));
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("서버 연결 중 문제가 발생했습니다.");
    }
  }

  return (
    <div className={`reservation-form-card ${compact ? "compact" : ""}`}>
      <div className="reservation-form-head">
        <h3>{title}</h3>
        <p>방문 정보와 원하는 메뉴를 함께 남겨주세요.</p>
      </div>
      <form className="reservation-form" onSubmit={onSubmit}>
        <label>
          이름
          <input
            required
            name="name"
            autoComplete="name"
            type="text"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="홍길동"
            maxLength={30}
          />
        </label>

        <label>
          연락처
          <input
            required
            name="phone"
            autoComplete="tel"
            inputMode="tel"
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="010-0000-0000"
            maxLength={20}
          />
        </label>

        <div className="reservation-today-panel">
          <span>오늘 예약</span>
          <strong>{today}</strong>
          <small>
            영업시간 {businessHours.open} - {businessHours.close}
            {isClosedDate ? " / 오늘은 휴무일입니다" : ""}
          </small>
        </div>

        <div className="reservation-form-row single">
          <label>
            시간
            <select
              required
              name="time"
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            >
              <option value="">시간 선택</option>
              {timeOptions.map((time) => (
                <option value={time} key={time}>
                  {time}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          예약 유형
          <select
            name="reservationType"
            value={form.reservationType}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                reservationType: event.target.value as "매장" | "포장",
              }))
            }
          >
            <option value="포장">포장</option>
            <option value="매장">매장</option>
          </select>
        </label>

        <section className="menu-picker" aria-label="메뉴 고르기">
          <div className="menu-picker-head">
            <strong>메뉴 고르기</strong>
            <span>{selectedMenuLabels.length > 0 ? `${selectedMenuLabels.length}종 선택` : "선택 안 함"}</span>
          </div>

          <div className="menu-picker-list">
            {cafeMenu.map((category) => (
              <div className="menu-picker-category" key={category.category}>
                <h4>{category.category}</h4>
                {category.menus.flatMap(getMenuOptions).map((option) => {
                  const quantity = form.selectedMenus[option.label] ?? 0;
                  return (
                    <div className="menu-picker-item" key={option.label}>
                      <div>
                        <span>{option.label}</span>
                        <small>{formatPrice(option.price)}</small>
                      </div>
                      <div className="menu-quantity">
                        <button
                          type="button"
                          className="quantity-button"
                          onClick={() => updateMenuQuantity(option.label, -1)}
                          disabled={quantity === 0}
                          aria-label={`${option.label} 수량 줄이기`}
                        >
                          -
                        </button>
                        <span>{quantity}</span>
                        <button
                          type="button"
                          className="quantity-button"
                          onClick={() => updateMenuQuantity(option.label, 1)}
                          aria-label={`${option.label} 추가`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {selectedMenuLabels.length > 0 && (
            <div className="selected-menu-summary">
              {selectedMenuLabels.map((menu) => (
                <span key={menu}>{menu}</span>
              ))}
            </div>
          )}
        </section>

        <label>
          요청사항
          <textarea
            name="memo"
            autoComplete="off"
            value={form.memo}
            onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))}
            placeholder="요청사항을 입력해주세요"
            rows={4}
            maxLength={500}
          />
        </label>

        <button type="submit" disabled={submitDisabled}>
          {submitText}
        </button>
      </form>

      {status === "success" && (
        <p className="reservation-feedback success" aria-live="polite">
          {message}
          {reservationId ? ` (예약번호: ${reservationId})` : ""}
        </p>
      )}
      {status === "error" && (
        <p className="reservation-feedback error" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
