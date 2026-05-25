"use client";

import { FormEvent, useState } from "react";

import type { AdminNotificationSettings, NotificationMode } from "@/lib/admin/settings";
import { cafeMenu } from "@/lib/constants/menu";

interface AdminSettingsFormProps {
  initialSettings: AdminNotificationSettings;
  mode?: "notification" | "business" | "menu";
}

export function AdminSettingsForm({ initialSettings, mode = "notification" }: AdminSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [closedDateInput, setClosedDateInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [instantSavingKey, setInstantSavingKey] = useState("");
  const [message, setMessage] = useState("");
  const [testAlert, setTestAlert] = useState("");

  function getMenuKey(category: string, menuName: string) {
    return `${category}::${menuName}`;
  }

  async function saveSettings(nextSettings: AdminNotificationSettings, successMessage = "설정이 저장되었습니다.") {
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextSettings),
    });
    const json = (await response.json()) as {
      ok: boolean;
      settings?: AdminNotificationSettings;
      message?: string;
    };

    if (!response.ok || !json.ok || !json.settings) {
      throw new Error(json.message || "설정 저장에 실패했습니다.");
    }

    setSettings(json.settings);
    setMessage(successMessage);
  }

  async function updateMenuControl(field: "soldOutMenus" | "hiddenMenus", value: string) {
    const hasValue = settings[field].includes(value);
    const nextSettings: AdminNotificationSettings = {
      ...settings,
      [field]: hasValue ? settings[field].filter((item) => item !== value) : [...settings[field], value],
    };

    if (field === "hiddenMenus") {
      nextSettings.soldOutMenus = nextSettings.soldOutMenus.filter((item) => item !== value);
    }

    setSettings(nextSettings);
    setInstantSavingKey(`${field}:${value}`);
    setMessage("");

    try {
      await saveSettings(nextSettings, "저장됨");
    } catch (error) {
      console.error(error);
      setSettings(settings);
      setMessage(error instanceof Error ? error.message : "통신 오류가 발생했습니다.");
    } finally {
      setInstantSavingKey("");
    }
  }

  function previewAlert() {
    const modeLabel =
      settings.notificationMode === "both" ? "앱 + 문자" : settings.notificationMode === "sms" ? "문자" : "앱";
    setTestAlert(
      `[${modeLabel} 테스트] ${settings.orderSoundLabel || "새 주문이 들어왔습니다"} / 수신: ${
        settings.phone || "휴대폰 미입력"
      }`,
    );
  }

  function addClosedDate() {
    if (!closedDateInput || settings.closedDates.includes(closedDateInput)) {
      return;
    }

    setSettings((prev) => ({
      ...prev,
      closedDates: [...prev.closedDates, closedDateInput].sort(),
    }));
    setClosedDateInput("");
  }

  function removeClosedDate(date: string) {
    setSettings((prev) => ({
      ...prev,
      closedDates: prev.closedDates.filter((item) => item !== date),
    }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await saveSettings(settings);
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "통신 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-settings-form" onSubmit={onSubmit}>
      {mode === "notification" && (
        <>
          <label>
            사장님 이름
            <input
              name="ownerName"
              autoComplete="name"
              value={settings.ownerName}
              onChange={(event) => setSettings((prev) => ({ ...prev, ownerName: event.target.value }))}
              placeholder="홍길동"
            />
          </label>

          <label>
            알림 받을 휴대폰
            <input
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              value={settings.phone}
              onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="010-0000-0000"
            />
          </label>

          <label>
            알림 방식
            <select
              name="notificationMode"
              value={settings.notificationMode}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, notificationMode: event.target.value as NotificationMode }))
              }
            >
              <option value="app">사장님 알림 앱</option>
              <option value="sms">문자 SMS</option>
              <option value="both">앱 + 문자</option>
            </select>
          </label>

          <label>
            알림 문구
            <input
              name="orderSoundLabel"
              autoComplete="off"
              value={settings.orderSoundLabel}
              onChange={(event) => setSettings((prev) => ({ ...prev, orderSoundLabel: event.target.value }))}
              placeholder="새 주문이 들어왔습니다"
            />
          </label>

          <div className="admin-settings-group">
            <h2>알림 테스트</h2>
            <p className="admin-settings-muted">
              실제 발송은 아직 연결 전입니다. 저장된 알림 방식과 문구가 어떻게 보일지 미리 확인합니다.
            </p>
            <button type="button" onClick={previewAlert}>
              테스트 알림 미리보기
            </button>
            {testAlert && <p className="admin-settings-preview">{testAlert}</p>}
          </div>
        </>
      )}

      {mode === "business" && (
        <>
          <div className="admin-settings-group">
            <h2>영업시간</h2>
            <label className="admin-settings-checkbox">
              <input
                name="developerAlwaysOpen"
                type="checkbox"
                checked={settings.developerAlwaysOpen}
                onChange={(event) =>
                  setSettings((prev) => ({ ...prev, developerAlwaysOpen: event.target.checked }))
                }
              />
              <span>
                <strong>개발자 모드</strong>
                영업시간 24시간
              </span>
            </label>
            <div className="admin-settings-row">
              <label>
                평일 시작
                <input
                  name="weekdayOpen"
                  type="time"
                  step={300}
                  value={settings.weekdayOpen}
                  onChange={(event) => setSettings((prev) => ({ ...prev, weekdayOpen: event.target.value }))}
                />
              </label>
              <label>
                평일 종료
                <input
                  name="weekdayClose"
                  type="time"
                  step={300}
                  value={settings.weekdayClose}
                  onChange={(event) => setSettings((prev) => ({ ...prev, weekdayClose: event.target.value }))}
                />
              </label>
            </div>
            <div className="admin-settings-row">
              <label>
                주말 시작
                <input
                  name="weekendOpen"
                  type="time"
                  step={300}
                  value={settings.weekendOpen}
                  onChange={(event) => setSettings((prev) => ({ ...prev, weekendOpen: event.target.value }))}
                />
              </label>
              <label>
                주말 종료
                <input
                  name="weekendClose"
                  type="time"
                  step={300}
                  value={settings.weekendClose}
                  onChange={(event) => setSettings((prev) => ({ ...prev, weekendClose: event.target.value }))}
                />
              </label>
            </div>
          </div>

          <div className="admin-settings-group">
            <h2>휴무일</h2>
            <div className="closed-date-editor">
              <input
                name="closedDate"
                type="date"
                value={closedDateInput}
                onChange={(event) => setClosedDateInput(event.target.value)}
              />
              <button type="button" onClick={addClosedDate}>
                휴무일 추가
              </button>
            </div>
            {settings.closedDates.length > 0 ? (
              <div className="closed-date-list">
                {settings.closedDates.map((date) => (
                  <span key={date}>
                    {date}
                    <button type="button" onClick={() => removeClosedDate(date)} aria-label={`${date} 휴무일 삭제`}>
                      삭제
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="admin-settings-muted">등록된 휴무일이 없습니다.</p>
            )}
          </div>
        </>
      )}

      {mode === "menu" && (
        <div className="admin-settings-group">
          <h2>메뉴 운영</h2>
          <p className="admin-settings-muted">
            품절은 예약 메뉴에서 선택할 수 없게 표시하고, 숨김은 예약 메뉴에서 보이지 않게 처리합니다.
          </p>
          <div className="admin-menu-control-list">
            {cafeMenu.map((category) => (
              <section key={category.category}>
                <h3>{category.category}</h3>
                {category.menus.map((menu) => {
                  const key = getMenuKey(category.category, menu.name);
                  const hidden = settings.hiddenMenus.includes(key);
                  const soldOut = settings.soldOutMenus.includes(key);
                  const disabled = Boolean(instantSavingKey);
                  return (
                    <div className="admin-menu-control-row" key={key}>
                      <strong>{menu.name}</strong>
                      <label>
                        <input
                          type="checkbox"
                          checked={soldOut}
                          disabled={hidden || disabled}
                          onChange={() => updateMenuControl("soldOutMenus", key)}
                        />
                        품절
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          checked={hidden}
                          disabled={disabled}
                          onChange={() => updateMenuControl("hiddenMenus", key)}
                        />
                        숨김
                      </label>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        </div>
      )}

      {mode !== "menu" && (
        <button type="submit" disabled={saving}>
          {saving ? "저장 중.." : "설정 저장"}
        </button>
      )}
      {message && <p aria-live="polite">{message}</p>}
    </form>
  );
}
