import { NextResponse } from "next/server";

import { getAdminNotificationSettings, updateAdminNotificationSettings } from "@/lib/admin/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = await getAdminNotificationSettings();
  return NextResponse.json(
    { ok: true, settings },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const settings = await updateAdminNotificationSettings(body);
  return NextResponse.json(
    { ok: true, settings },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
