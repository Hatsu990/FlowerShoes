import { AdminNav } from "@/components/admin/admin-nav";
import { ReservationTabs } from "@/components/admin/reservation-tabs";
import { listReservations } from "@/lib/reservations/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReservationAdminPage() {
  const reservations = await listReservations({ limit: 200 });

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>예약 목록</h1>
        </div>
        <AdminNav active="reservations" />
      </header>

      <ReservationTabs reservations={reservations} />
    </main>
  );
}
