import Link from "next/link";

import { ReservationCancelButton } from "@/components/admin/reservation-cancel-button";
import { ReservationDeleteButton } from "@/components/admin/reservation-delete-button";
import { StatusSelector } from "@/components/admin/status-selector";
import { listReservations } from "@/lib/reservations/service";
import { reservationStatusLabels } from "@/lib/reservations/types";

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

function formatSelectedMenus(menus: string[]) {
  if (menus.length === 0) {
    return "-";
  }

  return menus
    .map((menu) =>
      menu
        .replace(/\s*[·ㆍ]\s*[\d,]+원/g, "")
        .replace(/\s*x\s*(\d+)/i, " $1개")
        .replace(/\bHOT\b/g, "HOT")
        .replace(/\bICE\b/g, "ICE"),
    )
    .join(", ");
}

export default async function ReservationAdminPage() {
  const reservations = await listReservations({ limit: 200 });
  const activeReservations = reservations.filter(
    (reservation) => reservation.status === "pending" || reservation.status === "confirmed",
  );
  const historyReservations = reservations.filter(
    (reservation) => reservation.status === "completed" || reservation.status === "cancelled",
  );

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>예약 목록</h1>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/settings">알림 설정</Link>
          <Link href="/">홈으로</Link>
        </div>
      </header>

      <h2 className="admin-section-title">예약 목록</h2>
      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
              <th>날짜</th>
              <th>방문 시간</th>
              <th>예약유형</th>
              <th>선택메뉴</th>
              <th>상태</th>
              <th>접수시각</th>
              <th>취소</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {activeReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.reservationType}</td>
                <td>{formatSelectedMenus(reservation.selectedMenus)}</td>
                <td>
                  <StatusSelector reservationId={reservation.id} currentStatus={reservation.status} />
                </td>
                <td>{formatDate(reservation.created_at)}</td>
                <td>
                  <ReservationCancelButton reservationId={reservation.id} />
                </td>
                <td>
                  <Link href={`/admin/reservations/${reservation.id}`}>보기</Link>
                </td>
              </tr>
            ))}
            {activeReservations.length === 0 && (
              <tr>
                <td colSpan={10}>처리할 예약이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <h2 className="admin-section-title">처리 기록</h2>
      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
              <th>날짜</th>
              <th>방문 시간</th>
              <th>예약유형</th>
              <th>선택메뉴</th>
              <th>상태</th>
              <th>접수시각</th>
              <th>삭제</th>
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {historyReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.reservationType}</td>
                <td>{formatSelectedMenus(reservation.selectedMenus)}</td>
                <td>{reservationStatusLabels[reservation.status]}</td>
                <td>{formatDate(reservation.created_at)}</td>
                <td>
                  <ReservationDeleteButton reservationId={reservation.id} />
                </td>
                <td>
                  <Link href={`/admin/reservations/${reservation.id}`}>보기</Link>
                </td>
              </tr>
            ))}
            {historyReservations.length === 0 && (
              <tr>
                <td colSpan={10}>처리 기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
