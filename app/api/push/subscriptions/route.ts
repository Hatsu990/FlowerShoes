import { NextResponse } from "next/server";

import { savePushSubscription } from "@/lib/push/subscriptions";

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
