"use client";

import { FormEvent, useState } from "react";

import type { AdminNotificationSettings } from "@/lib/admin/settings";

interface OwnerPhoneFormProps {
  initialSettings: AdminNotificationSettings;
}

export function OwnerPhoneForm({ initialSettings }: OwnerPhoneFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
        throw new Error(json.message || "전화번호 저장에 실패했습니다.");
      }

      setSettings(json.settings);
      setMessage("전화문의 번호가 저장되었습니다.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "통신 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-settings-form owner-phone-form" onSubmit={onSubmit}>
      <div className="admin-settings-group">
        <h2>사장님 번호</h2>
        <p className="admin-settings-muted">
          홈페이지 상단 전화문의 버튼에 연결할 번호입니다. 휴대폰에서는 전화 앱으로 연결됩니다.
        </p>
        <label>
          전화문의 번호
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={settings.phone}
            onChange={(event) => setSettings((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="01043303764"
            maxLength={30}
          />
        </label>
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "저장 중.." : "전화번호 저장"}
      </button>
      {message && <p aria-live="polite">{message}</p>}
    </form>
  );
}
