import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  if (!publicKey) {
    return NextResponse.json(
      { ok: false, message: "VAPID 공개키가 설정되지 않았습니다." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, publicKey });
}
