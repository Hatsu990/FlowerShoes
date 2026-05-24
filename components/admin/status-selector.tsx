"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ReservationStatus, reservationStatusLabels } from "@/lib/reservations/types";

const editableStatuses: ReservationStatus[] = ["pending", "confirmed", "completed"];

interface StatusSelectorProps {
  reservationId: string;
  currentStatus: ReservationStatus;
}

export function StatusSelector({ reservationId, currentStatus }: StatusSelectorProps) {
  const [status, setStatus] = useState<ReservationStatus>(currentStatus);
  const [savedStatus, setSavedStatus] = useState<ReservationStatus>(currentStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const statusOptions = editableStatuses.includes(savedStatus) ? editableStatuses : [savedStatus];
  const canEdit = editableStatuses.includes(savedStatus);

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
      setSavedStatus(status);
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("통신 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="status-editor">
      <strong className="status-current-badge">{reservationStatusLabels[savedStatus]}</strong>
      <select
        aria-label="예약 상태"
        value={status}
        onChange={(event) => setStatus(event.target.value as ReservationStatus)}
        disabled={saving || !canEdit}
      >
        {statusOptions.map((value) => (
          <option value={value} key={value}>
            {reservationStatusLabels[value]}
          </option>
        ))}
      </select>
      <button type="button" onClick={updateStatus} disabled={saving || !canEdit} aria-label="예약 상태 저장">
        {saving ? "저장 중..." : "저장"}
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}
