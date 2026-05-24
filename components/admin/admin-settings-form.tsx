"use client";

import { FormEvent, useState } from "react";

import type { AdminNotificationSettings, NotificationMode } from "@/lib/admin/settings";

interface AdminSettingsFormProps {
  initialSettings: AdminNotificationSettings;
}

export function AdminSettingsForm({ initialSettings }: AdminSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [closedDateInput, setClosedDateInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const json = (await response.json()) as {
        ok: boolean;
        settings?: AdminNotificationSettings;
        message?: string;
      };

      if (!response.ok || !json.ok || !json.settings) {
        setMessage(json.message || "설정 저장에 실패했습니다.");
        return;
      }

      setSettings(json.settings);
      setMessage("설정이 저장되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage("통신 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-settings-form" onSubmit={onSubmit}>
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
        <h2>영업시간</h2>
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

      <button type="submit" disabled={saving}>
        {saving ? "저장 중..." : "설정 저장"}
      </button>
      {message && <p aria-live="polite">{message}</p>}
    </form>
  );
}
