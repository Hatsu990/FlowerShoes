"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import type { AdminNotificationSettings } from "@/lib/admin/settings";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import {
  ceilToStep,
  getKoreaDateString,
  getKoreaTimeString,
  isKoreaWeekend,
  minutesToTime,
  timeToMinutes,
} from "@/lib/datetime/korea";

type FormStatus = "idle" | "loading" | "success" | "error";
type SelectedMenuMap = Record<string, number>;
type MenuTemperature = "HOT" | "ICE" | "";
type ReservationSuccessSummary = {
  reservationId: string;
  reservationNumber: string;
  date: string;
  time: string;
  reservationType: "매장" | "포장";
  menus: string[];
  totalCount: number;
  totalPrice: number;
};

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

function getMenuKey(category: string, menu: CafeMenuItem) {
  return `${category}::${menu.name}`;
}

function getMenuVariants(menu: CafeMenuItem) {
  const variants: { label: MenuTemperature; price: number }[] = [];
  if (typeof menu.hot === "number") {
    variants.push({ label: "HOT", price: menu.hot });
  }
  if (typeof menu.ice === "number") {
    variants.push({ label: "ICE", price: menu.ice });
  }
  if (typeof menu.price === "number") {
    variants.push({ label: "", price: menu.price });
  }

  return variants;
}

function getSelectedMenuLabel(menu: CafeMenuItem, variant: MenuTemperature) {
  return variant ? `${menu.name} ${variant}` : menu.name;
}

function getBusinessHours(settings: AdminNotificationSettings | null, dateString: string) {
  if (settings?.developerAlwaysOpen) {
    return { open: "00:00", close: "23:50" };
  }

  if (!settings) {
    return { open: "10:00", close: "20:00" };
  }

  if (isKoreaWeekend(dateString)) {
    return { open: settings.weekendOpen, close: settings.weekendClose };
  }

  return { open: settings.weekdayOpen, close: settings.weekdayClose };
}

function getTimeOptions(settings: AdminNotificationSettings | null, dateString: string, currentTime: string) {
  const hours = getBusinessHours(settings, dateString);
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const current = timeToMinutes(currentTime);
  const start = Math.max(open, ceilToStep(current, 10));
  const options: string[] = [];
  for (let value = start; value < close; value += 10) {
    options.push(minutesToTime(value));
  }
  return options;
}

export function ReservationForm({ title = "예약 요청", compact = false }: ReservationFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [today, setToday] = useState(getKoreaDateString);
  const [currentTime, setCurrentTime] = useState(getKoreaTimeString);
  const [adminSettings, setAdminSettings] = useState<AdminNotificationSettings | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [successSummary, setSuccessSummary] = useState<ReservationSuccessSummary | null>(null);

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
  const selectedMenuDetails = useMemo(() => {
    const priceByLabel = new Map<string, number>();

    cafeMenu.forEach((category) => {
      category.menus.forEach((menu) => {
        getMenuVariants(menu).forEach((variant) => {
          priceByLabel.set(getSelectedMenuLabel(menu, variant.label), variant.price);
        });
      });
    });

    return Object.entries(form.selectedMenus)
      .filter(([, count]) => count > 0)
      .map(([label, count]) => {
        const price = priceByLabel.get(label) ?? 0;
        return {
          label,
          count,
          price,
          total: price * count,
        };
      });
  }, [form.selectedMenus]);
  const selectedMenuTotalCount = selectedMenuDetails.reduce((sum, item) => sum + item.count, 0);
  const selectedMenuTotalPrice = selectedMenuDetails.reduce((sum, item) => sum + item.total, 0);
  const timeOptions = useMemo(() => getTimeOptions(adminSettings, today, currentTime), [adminSettings, today, currentTime]);
  const isDeveloperAlwaysOpen = adminSettings?.developerAlwaysOpen ?? false;
  const isClosedDate = !isDeveloperAlwaysOpen && (adminSettings?.closedDates.includes(today) ?? false);
  const businessHours = getBusinessHours(adminSettings, today);
  const nowMinutes = timeToMinutes(currentTime);
  const openMinutes = timeToMinutes(businessHours.open);
  const closeMinutes = timeToMinutes(businessHours.close);
  const isBusinessOpen = isDeveloperAlwaysOpen || (!isClosedDate && nowMinutes >= openMinutes && nowMinutes < closeMinutes);
  const submitDisabled = isLoading || !isBusinessOpen;
  const submitText = isBusinessOpen ? buttonText : "영업이 종료되었습니다";
  const hiddenMenus = adminSettings?.hiddenMenus ?? [];
  const soldOutMenus = adminSettings?.soldOutMenus ?? [];

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
      setToday(getKoreaDateString());
      setCurrentTime(getKoreaTimeString());
    }, 30000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (form.time && !timeOptions.includes(form.time)) {
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }, [form.time, timeOptions]);

  function updateMenuQuantity(menu: CafeMenuItem, variant: MenuTemperature, delta: number) {
    const label = getSelectedMenuLabel(menu, variant);
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
    setSuccessSummary(null);

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
        reservationNumber?: string;
        message?: string;
        errors?: string[];
      };

      if (!response.ok || !json.ok) {
        setStatus("error");
        setMessage(json.errors?.join(" / ") || json.message || "예약 전송에 실패했습니다.");
        return;
      }

      setStatus("success");
      setMessage("예약 요청이 접수되었습니다 : )");
      setSuccessSummary({
        reservationId: json.reservationId ?? "",
        reservationNumber: json.reservationNumber ?? "",
        date: today,
        time: form.time,
        reservationType: form.reservationType,
        menus: selectedMenuLabels,
        totalCount: selectedMenuTotalCount,
        totalPrice: selectedMenuTotalPrice,
      });
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

        <section className="time-picker" aria-label="시간 선택">
          <div className="time-picker-head">
            <strong>시간 선택</strong>
          </div>
          <div className="time-select-wrap">
            <select
              required
              name="time"
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            >
              <option value="">방문 시간을 선택해주세요</option>
              {timeOptions.map((time) => (
                <option value={time} key={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </section>

        <fieldset className="reservation-type-toggle">
          <legend>예약 유형</legend>
          {(["포장", "매장"] as const).map((type) => (
            <button
              type="button"
              className={form.reservationType === type ? "selected" : ""}
              aria-pressed={form.reservationType === type}
              onClick={() => setForm((prev) => ({ ...prev, reservationType: type }))}
              key={type}
            >
              {type}
            </button>
          ))}
        </fieldset>

        <section className="menu-picker" aria-label="메뉴 고르기">
          <div className="menu-picker-head">
            <strong>메뉴 고르기</strong>
            <span>{selectedMenuLabels.length > 0 ? `${selectedMenuLabels.length}종 선택` : "선택 안 함"}</span>
          </div>

          <div className="menu-picker-list">
            {cafeMenu.map((category) => (
              <div className="menu-picker-category" key={category.category}>
                <h4>{category.category}</h4>
                {category.menus.map((menu) => {
                  const menuKey = getMenuKey(category.category, menu);
                  if (hiddenMenus.includes(menuKey)) {
                    return null;
                  }

                  const variants = getMenuVariants(menu);
                  const isSoldOut = soldOutMenus.includes(menuKey);
                  return (
                    <div className={`menu-picker-item ${isSoldOut ? "sold-out" : ""}`} key={menuKey}>
                      <div className="menu-picker-info">
                        <span>{menu.name}</span>
                        <small>
                          {isSoldOut
                            ? "품절"
                            : variants.map((variant) => `${variant.label ? `${variant.label} ` : ""}${formatPrice(variant.price)}`).join(" / ")}
                        </small>
                      </div>
                      <div className="menu-variant-list">
                        {variants.map((variant) => {
                          const selectedLabel = getSelectedMenuLabel(menu, variant.label);
                          const quantity = form.selectedMenus[selectedLabel] ?? 0;
                          return (
                            <div className="menu-variant-row" key={selectedLabel}>
                              <span>{variant.label || "메뉴"}</span>
                              <div className="menu-quantity">
                                <button
                                  type="button"
                                  className="quantity-button"
                                  onClick={() => updateMenuQuantity(menu, variant.label, -1)}
                                  disabled={quantity === 0 || isSoldOut}
                                  aria-label={`${selectedLabel} 수량 줄이기`}
                                >
                                  -
                                </button>
                                <span>{quantity}</span>
                                <button
                                  type="button"
                                  className="quantity-button"
                                  onClick={() => updateMenuQuantity(menu, variant.label, 1)}
                                  disabled={isSoldOut}
                                  aria-label={`${selectedLabel} 추가`}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {selectedMenuDetails.length > 0 && (
            <div className="selected-menu-summary">
              <div className="selected-menu-total">
                <strong>총 {selectedMenuTotalCount}잔</strong>
                <span>{formatPrice(selectedMenuTotalPrice)}</span>
              </div>
              <div className="selected-menu-list">
                {selectedMenuDetails.map((menu) => (
                  <span key={menu.label}>
                    {menu.label} x {menu.count} · {formatPrice(menu.total)}
                  </span>
                ))}
              </div>
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
        <div className="reservation-success-card" aria-live="polite">
          <strong>{message}</strong>
          {successSummary && (
            <dl>
              {successSummary.reservationId && (
                <div>
                  <dt>예약번호</dt>
                  <dd>
                    {successSummary.reservationNumber ||
                      successSummary.reservationId.slice(0, 3).padStart(3, "0")}
                  </dd>
                </div>
              )}
              <div>
                <dt>방문일</dt>
                <dd>{successSummary.date}</dd>
              </div>
              <div>
                <dt>방문 시간</dt>
                <dd>{successSummary.time}</dd>
              </div>
              <div>
                <dt>예약 유형</dt>
                <dd>{successSummary.reservationType}</dd>
              </div>
              <div>
                <dt>선택 메뉴</dt>
                <dd>{successSummary.menus.length > 0 ? successSummary.menus.join(", ") : "-"}</dd>
              </div>
              <div>
                <dt>합계</dt>
                <dd>
                  총 {successSummary.totalCount}잔 · {formatPrice(successSummary.totalPrice)}
                </dd>
              </div>
            </dl>
          )}
        </div>
      )}
      {status === "error" && (
        <p className="reservation-feedback error" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
