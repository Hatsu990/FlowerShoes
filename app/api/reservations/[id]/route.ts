import { NextResponse } from "next/server";

import { deleteReservation, getReservationById } from "@/lib/reservations/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const reservation = await getReservationById(id);

  if (!reservation) {
    return NextResponse.json({ ok: false, message: "예약 정보를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, reservation });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const result = await deleteReservation(id);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, errors: result.errors || ["예약 기록 삭제 중 오류가 발생했습니다."] },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
