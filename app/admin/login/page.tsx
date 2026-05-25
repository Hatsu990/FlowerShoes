import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { adminAuthCookieName, adminAuthCookieValue, getSafeAdminRedirectPath } from "@/lib/admin/auth";

import { loginAdmin } from "./actions";

interface AdminLoginPageProps {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeAdminRedirectPath(params.next);
  const isAuthenticated = (await cookies()).get(adminAuthCookieName)?.value === adminAuthCookieValue;

  if (isAuthenticated) {
    redirect(nextPath);
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <div>
          <p className="admin-login-eyebrow">관리자</p>
          <h1>비밀번호 입력</h1>
          <p>예약 목록과 운영 설정은 관리자만 확인할 수 있습니다.</p>
        </div>

        <form action={loginAdmin} className="admin-login-form">
          <input type="hidden" name="next" value={nextPath} />
          <label>
            비밀번호
            <input name="password" type="password" inputMode="numeric" autoComplete="current-password" autoFocus required />
          </label>
          {params.error === "1" && <p className="admin-login-error">비밀번호가 맞지 않습니다.</p>}
          <button type="submit">관리자 들어가기</button>
        </form>

        <Link href="/">홈으로 돌아가기</Link>
      </section>
    </main>
  );
}
