import Link from "next/link";

import { ReservationForm } from "@/components/reservation/reservation-form";
import { siteConfig } from "@/lib/constants/site";

export default function ReservePage() {
  return (
    <main className="reserve-page">
      <header>
        <Link href="/">홈으로</Link>
      </header>
      <section className="reserve-content">
        <div className="reserve-visual">
          <p>Reservation</p>
          <h1>{siteConfig.name} 예약</h1>
          <img
            className="reserve-photo"
            src="/images/kkotsin/hongcheon-kkotsin-05.jpg"
            width={2048}
            height={1152}
            alt="홍천 꽃신 창가 좌석"
          />
        </div>
        <ReservationForm title="예약 정보 입력" />
      </section>
    </main>
  );
}
