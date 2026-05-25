import Link from "next/link";

import { logoutAdmin } from "@/app/admin/login/actions";

type AdminNavKey = "reservations" | "settings" | "business" | "menu";

interface AdminNavProps {
  active: AdminNavKey;
}

const adminNavItems: { key: AdminNavKey; href: string; label: string }[] = [
  { key: "reservations", href: "/admin/reservations", label: "예약 목록" },
  { key: "settings", href: "/admin/settings", label: "알림 설정" },
  { key: "business", href: "/admin/business", label: "영업/휴무" },
  { key: "menu", href: "/admin/menu", label: "메뉴 운영" },
];

export function AdminNav({ active }: AdminNavProps) {
  return (
    <div className="admin-header-actions">
      {adminNavItems.map((item) => (
        <Link className={active === item.key ? "active" : undefined} href={item.href} key={item.key}>
          {item.label}
        </Link>
      ))}
      <Link className="home-link" href="/">
        홈으로
      </Link>
      <form action={logoutAdmin}>
        <button type="submit">로그아웃</button>
      </form>
    </div>
  );
}
