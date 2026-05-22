import Link from "next/link";

import { ReservationForm } from "@/components/reservation/reservation-form";
import { siteConfig } from "@/lib/constants/site";

export default function HomePage() {
  return (
    <main className="landing">
      <header className="top-nav">
        <div className="brand">
          <span>{siteConfig.name}</span>
          <small>{siteConfig.subtitle}</small>
        </div>
        <div className="top-nav-actions">
          <a href="#reserve-cta">예약</a>
          <Link href="/admin/reservations">관리자</Link>
          <Link className="primary" href="/reserve">
            예약하기
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-visual" aria-hidden />
        <div className="hero-copy">
          <p>홍천의 풍경 속, 고요한 차 한 잔</p>
          <h1>홍천 꽃신</h1>
          <div className="hero-actions">
            <Link className="primary" href="/reserve">
              지금 예약
            </Link>
            <a href="#intro">공간 보기</a>
          </div>
        </div>
      </section>

      <section id="intro" className="section with-grid">
        <div className="section-head">
          <p>소개</p>
          <h2>이미지 중심 공간 경험</h2>
        </div>
        <div className="image-grid image-grid-large">
          <article>
            <div className="placeholder-image placeholder-a" />
            <h3>홍천 풍경</h3>
          </article>
          <article>
            <div className="placeholder-image placeholder-b" />
            <h3>따뜻한 찻자리</h3>
          </article>
          <article>
            <div className="placeholder-image placeholder-c" />
            <h3>차분한 실내 무드</h3>
          </article>
          <article>
            <div className="placeholder-image placeholder-d" />
            <h3>은은한 자연광</h3>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p>서비스</p>
          <h2>전통차와 공간 큐레이션</h2>
        </div>
        <div className="card-row">
          <article className="service-card">
            <div className="placeholder-image placeholder-e" />
            <h3>시그니처 전통차</h3>
          </article>
          <article className="service-card">
            <div className="placeholder-image placeholder-f" />
            <h3>계절 추천 티 코스</h3>
          </article>
          <article className="service-card">
            <div className="placeholder-image placeholder-g" />
            <h3>조용한 예약 좌석</h3>
          </article>
        </div>
      </section>

      <section id="reserve-cta" className="section reserve-cta">
        <div className="section-head light">
          <p>Reservation</p>
          <h2>예약 CTA</h2>
        </div>
        <div className="cta-layout">
          <div className="cta-copy">
            <h3>짧은 입력으로 예약 요청 완료</h3>
            <p>원하는 날짜와 시간, 인원 정보만 남겨주세요.</p>
            <p>접수 후 확인 연락을 드립니다.</p>
          </div>
          <ReservationForm compact title="빠른 예약 요청" />
        </div>
      </section>

      <section className="section contact">
        <div className="section-head">
          <p>Location / Contact</p>
          <h2>위치 · 문의</h2>
        </div>
        <div className="contact-grid">
          <div className="placeholder-image placeholder-map" />
          <div className="contact-info">
            <p>{siteConfig.address}</p>
            <p>{siteConfig.businessHours}</p>
            <p>TEL. {siteConfig.phone}</p>
            <p>Kakao. {siteConfig.kakaoChannel}</p>
            <Link className="primary block" href="/reserve">
              예약하러 가기
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>{siteConfig.name}</p>
        <p>고요한 풍경과 전통차를 경험하는 공간</p>
      </footer>
    </main>
  );
}
