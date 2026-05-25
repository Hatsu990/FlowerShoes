import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getAdminNotificationSettings } from "@/lib/admin/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBusinessPage() {
  const settings = await getAdminNotificationSettings();

  return (
    <main className="admin-detail-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>영업/휴무 설정</h1>
        </div>
        <AdminNav active="business" />
      </header>

      <section className="admin-detail-card">
        <p className="admin-settings-intro">예약 가능 시간과 휴무일을 관리합니다.</p>
        <AdminSettingsForm initialSettings={settings} mode="business" />
      </section>
    </main>
  );
}
