import Link from "next/link";

import { StatusSelector } from "@/components/admin/status-selector";
import { listReservations } from "@/lib/reservations/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ReservationAdminPage() {
  const reservations = await listReservations({ limit: 200 });

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>예약 목록</h1>
        </div>
        <Link href="/">홈으로</Link>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
              <th>날짜</th>
              <th>시간</th>
              <th>예약유형</th>
              <th>상태</th>
              <th>접수시각</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.reservationType}</td>
                <td>
                  <StatusSelector reservationId={reservation.id} currentStatus={reservation.status} />
                </td>
                <td>{formatDate(reservation.created_at)}</td>
                <td>
                  <Link href={`/admin/reservations/${reservation.id}`}>보기</Link>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={8}>등록된 예약이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}