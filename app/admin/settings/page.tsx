import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { PushNotificationControl } from "@/components/admin/push-notification-control";
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
        <AdminNav active="settings" />
      </header>

      <section className="admin-detail-card">
        <p className="admin-settings-intro">
          새 예약 접수 시 사장님에게 어떤 방식과 문구로 알릴지 관리합니다.
        </p>
        <PushNotificationControl />
        <AdminSettingsForm initialSettings={settings} mode="notification" />
      </section>
    </main>
  );
}
