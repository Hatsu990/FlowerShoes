"use client";

import { FormEvent, useMemo, useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const initialFormState = {
  name: "",
  phone: "",
  date: "",
  time: "",
  people: 2,
  memo: "",
};

interface ReservationFormProps {
  title?: string;
  compact?: boolean;
}

export function ReservationForm({ title = "예약 요청", compact = false }: ReservationFormProps) {
  const [form, setForm] = useState(initialFormState);
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

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setReservationId("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
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
      setForm(initialFormState);
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
        <p>필수 정보만 빠르게 남겨주세요.</p>
      </div>
      <form className="reservation-form" onSubmit={onSubmit}>
        <label>
          이름
          <input
            required
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
            type="tel"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            placeholder="010-0000-0000"
            maxLength={20}
          />
        </label>

        <div className="reservation-form-row">
          <label>
            날짜
            <input
              required
              type="date"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
            />
          </label>
          <label>
            시간
            <input
              required
              type="time"
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
            />
          </label>
        </div>

        <label>
          인원 수
          <input
            required
            type="number"
            value={form.people}
            min={1}
            max={20}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                people: Number(event.target.value),
              }))
            }
          />
        </label>

        <label>
          요청사항
          <textarea
            value={form.memo}
            onChange={(event) => setForm((prev) => ({ ...prev, memo: event.target.value }))}
            placeholder="알레르기, 좌석 요청 등"
            rows={4}
            maxLength={500}
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {buttonText}
        </button>
      </form>

      {status === "success" && (
        <p className="reservation-feedback success">
          {message}
          {reservationId ? ` (예약번호: ${reservationId})` : ""}
        </p>
      )}
      {status === "error" && <p className="reservation-feedback error">{message}</p>}
    </div>
  );
}