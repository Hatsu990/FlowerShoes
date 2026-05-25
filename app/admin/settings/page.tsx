import { AdminNav } from "@/components/admin/admin-nav";
import { PushNotificationControl } from "@/components/admin/push-notification-control";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
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
          새 예약이 들어왔을 때 이 기기에서 웹 푸시 알림을 받을 수 있게 설정합니다.
        </p>
        <PushNotificationControl />
      </section>
    </main>
  );
}
