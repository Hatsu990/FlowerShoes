import { NextResponse } from "next/server";

import { deletePushSubscription, savePushSubscription } from "@/lib/push/subscriptions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  const body = await request.json();
  const result = await savePushSubscription(body, request.headers.get("user-agent"));

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { endpoint?: unknown } | null;
  const endpoint = body?.endpoint;

  if (typeof endpoint !== "string" || !endpoint.startsWith("https://")) {
    return NextResponse.json({ ok: false, message: "유효하지 않은 알림 구독 정보입니다." }, { status: 400 });
  }

  await deletePushSubscription(endpoint);
  return NextResponse.json({ ok: true });
}
