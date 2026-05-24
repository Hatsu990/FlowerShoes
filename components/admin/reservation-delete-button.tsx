"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface ReservationDeleteButtonProps {
  reservationId: string;
}

export function ReservationDeleteButton({ reservationId }: ReservationDeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function deleteHistory() {
    const confirmed = window.confirm("이 처리 기록을 삭제할까요? 삭제한 기록은 되돌릴 수 없습니다.");
    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });
      const json = (await response.json()) as { ok: boolean; message?: string; errors?: string[] };

      if (!response.ok || !json.ok) {
        setMessage(json.errors?.join(" / ") || json.message || "삭제 실패");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage("통신 오류");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-delete-action">
      <button type="button" className="admin-delete-button" onClick={deleteHistory} disabled={deleting}>
        {deleting ? "삭제 중" : "삭제"}
      </button>
      {message && <span>{message}</span>}
    </div>
  );
}
