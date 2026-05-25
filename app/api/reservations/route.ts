import { NextResponse } from "next/server";

import { createReservation, listReservations } from "@/lib/reservations/service";
import { getDailyReservationSequence } from "@/lib/reservations/repository";
import { parseReservationStatus } from "@/lib/reservations/validation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusRaw = searchParams.get("status");
  const query = searchParams.get("q")?.trim() || undefined;
  const limitRaw = searchParams.get("limit");

  const parsedStatus = statusRaw ? parseReservationStatus(statusRaw) : undefined;
  const status = parsedStatus ?? undefined;
  const limit = limitRaw ? Number(limitRaw) : undefined;

  if (statusRaw && !status) {
    return NextResponse.json(
      { ok: false, message: "status는 pending/confirmed/completed/cancelled 중 하나여야 합니다." },
      { status: 400 },
    );
  }

  const reservations = await listReservations({
    status,
    query,
    limit: Number.isFinite(limit) ? limit : undefined,
  });
  return NextResponse.json({ ok: true, reservations });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createReservation(body);

  if (!result.reservation) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.errors || ["예약 접수 중 오류가 발생했습니다."],
      },
      { status: 400 },
    );
  }

  const reservationNumber = await getDailyReservationSequence(
    result.reservation.date,
    result.reservation.created_at,
  );

  return NextResponse.json({
    ok: true,
    reservationId: result.reservation.id,
    reservationNumber: String(reservationNumber).padStart(3, "0"),
  });
}
