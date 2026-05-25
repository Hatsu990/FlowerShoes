"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { adminAuthCookieName, adminAuthCookieValue, getAdminPassword, getSafeAdminRedirectPath } from "@/lib/admin/auth";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nextPath = getSafeAdminRedirectPath(formData.get("next"));

  if (password !== getAdminPassword()) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(adminAuthCookieName, adminAuthCookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 12,
  });

  redirect(nextPath);
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(adminAuthCookieName);
  redirect("/admin/login");
}
