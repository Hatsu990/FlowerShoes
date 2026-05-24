"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReservationCancelButtonProps {
  reservationId: string;
}

export function ReservationCancelButton({ reservationId }: ReservationCancelButtonProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function cancelReservation() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`/api/reservations/${reservationId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });
      const json = (await response.json()) as { ok: boolean; message?: string; errors?: string[] };

      if (!response.ok || !json.ok) {
        setMessage(json.errors?.join(" / ") || json.message || "취소 처리 실패");
        return;
      }

      setMessage("예약 취소");
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("통신 오류");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-cancel-action">
      <button type="button" className="admin-cancel-button" onClick={cancelReservation} disabled={saving}>
        {saving ? "처리 중" : "취소"}
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}
