"use client";

import { useState } from "react";

import { ReservationStatus } from "@/lib/reservations/types";

interface StatusSelectorProps {
  reservationId: string;
  currentStatus: ReservationStatus;
}

const statusLabelMap: Record<ReservationStatus, string> = {
  pending: "pending",
  confirmed: "confirmed",
  cancelled: "cancelled",
};

export function StatusSelector({ reservationId, currentStatus }: StatusSelectorProps) {
  const [status, setStatus] = useState<ReservationStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function updateStatus() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/reservations/${reservationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const json = (await response.json()) as { ok: boolean; message?: string; errors?: string[] };

      if (!response.ok || !json.ok) {
        setMessage(json.errors?.join(" / ") || json.message || "상태 업데이트 실패");
        return;
      }

      setMessage("저장됨");
    } catch (error) {
      console.error(error);
      setMessage("통신 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="status-editor">
      <select
        value={status}
        onChange={(event) => setStatus(event.target.value as ReservationStatus)}
        disabled={saving}
      >
        {Object.entries(statusLabelMap).map(([value, label]) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
      <button type="button" onClick={updateStatus} disabled={saving}>
        {saving ? "저장 중..." : "저장"}
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}
