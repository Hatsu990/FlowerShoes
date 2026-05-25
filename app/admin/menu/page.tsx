import { AdminNav } from "@/components/admin/admin-nav";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";
import { getAdminNotificationSettings } from "@/lib/admin/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuPage() {
  const settings = await getAdminNotificationSettings();

  return (
    <main className="admin-detail-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>메뉴 운영</h1>
        </div>
        <AdminNav active="menu" />
      </header>

      <section className="admin-detail-card">
        <p className="admin-settings-intro">메뉴판에 노출할 메뉴와 품절 상태를 관리합니다.</p>
        <AdminSettingsForm initialSettings={settings} mode="menu" />
      </section>
    </main>
  );
}
