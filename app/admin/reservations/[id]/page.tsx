import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusSelector } from "@/components/admin/status-selector";
import { getReservationById } from "@/lib/reservations/service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

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

export default async function ReservationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const reservation = await getReservationById(id);

  if (!reservation) {
    notFound();
  }

  return (
    <main className="admin-detail-page">
      <header className="admin-header">
        <div>
          <p>Admin</p>
          <h1>예약 상세</h1>
        </div>
        <Link href="/admin/reservations">목록으로</Link>
      </header>

      <section className="admin-detail-card">
        <dl>
          <div>
            <dt>예약번호</dt>
            <dd>{reservation.id}</dd>
          </div>
          <div>
            <dt>이름</dt>
            <dd>{reservation.name}</dd>
          </div>
          <div>
            <dt>연락처</dt>
            <dd>{reservation.phone}</dd>
          </div>
          <div>
            <dt>예약일</dt>
            <dd>{reservation.date}</dd>
          </div>
          <div>
            <dt>예약시간</dt>
            <dd>{reservation.time}</dd>
          </div>
          <div>
            <dt>예약유형</dt>
            <dd>{reservation.reservationType}</dd>
          </div>
          <div>
            <dt>요청사항</dt>
            <dd>{reservation.memo || "-"}</dd>
          </div>
          <div>
            <dt>상태</dt>
            <dd>
              <StatusSelector reservationId={reservation.id} currentStatus={reservation.status} />
            </dd>
          </div>
          <div>
            <dt>생성시각</dt>
            <dd>{formatDate(reservation.created_at)}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}