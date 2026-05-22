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
          <div className="placeholder-image placeholder-h tall" />
        </div>
        <ReservationForm title="예약 정보 입력" />
      </section>
    </main>
  );
}
