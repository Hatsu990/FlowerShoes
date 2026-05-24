import Link from "next/link";

import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getAdminNotificationSettings } from "@/lib/admin/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await getAdminNotificationSettings();

  return (
    <main className="admin-detail-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>알림 설정</h1>
        </div>
        <Link href="/admin/reservations">예약 목록</Link>
      </header>

      <section className="admin-detail-card">
        <p className="admin-settings-intro">
          지금은 설정 저장 구조만 준비되어 있습니다. 이후 SMS API 또는 사장님 알림 앱 provider를 연결하면 새 예약 접수
          시 이 설정을 기준으로 알림을 보낼 수 있습니다.
        </p>
        <AdminSettingsForm initialSettings={settings} />
      </section>
    </main>
  );
}

