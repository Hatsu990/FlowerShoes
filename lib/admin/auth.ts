export const adminAuthCookieName = "flower_shoes_admin";
export const adminAuthCookieValue = "authenticated";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "1234";
}

export function getSafeAdminRedirectPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== "string") {
    return "/admin/reservations";
  }

  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) {
    return "/admin/reservations";
  }

  return value;
}
