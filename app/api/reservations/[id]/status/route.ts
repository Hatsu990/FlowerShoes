import { NextResponse } from "next/server";

import { updateReservationStatus } from "@/lib/reservations/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = await request.json();
  const result = await updateReservationStatus(id, body.status);

  if (!result.reservation) {
    return NextResponse.json(
      { ok: false, errors: result.errors || ["상태 변경 중 오류가 발생했습니다."] },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    reservation: result.reservation,
  });
}