import Link from "next/link";

import { MenuBoardViewer } from "@/components/menu/menu-board-viewer";
import { ReservationForm } from "@/components/reservation/reservation-form";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import { siteConfig } from "@/lib/constants/site";

const imageBase = "/images/kkotsin";

const spacePhotos = [
  {
    src: `${imageBase}/hongcheon-kkotsin-05.jpg`,
    title: "창가 좌석",
    description: "큰 창과 식물이 보이는 밝은 실내",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-11.jpg`,
    title: "조용한 자리",
    description: "나무 톤과 낮은 채도의 편안한 좌석",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-03.jpg`,
    title: "디저트 쇼케이스",
    description: "간단한 디저트와 음료를 함께 고르는 공간",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-13.jpg`,
    title: "이름 때문에 생기는 작은 오해",
    description: "전통 꽃신도 있지만, 이름의 뜻은 꽃피는 신장대리",
  },
];

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function getMenuPriceLabel(menu: CafeMenuItem) {
  const labels: string[] = [];

  if (typeof menu.hot === "number") {
    labels.push(`HOT ${formatPrice(menu.hot)}`);
  }
  if (typeof menu.ice === "number") {
    labels.push(`ICE ${formatPrice(menu.ice)}`);
  }
  if (typeof menu.price === "number") {
    labels.push(formatPrice(menu.price));
  }

  return labels.join(" / ");
}

export default function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        본문으로 이동
      </a>
      <main id="main-content" className="landing">
      <header className="top-nav">
        <div className="brand">
          <span>{siteConfig.name}</span>
          <small>{siteConfig.subtitle}</small>
        </div>
        <div className="top-nav-actions">
          <a href="#menu-board">메뉴</a>
          <Link href="/admin/reservations">관리자</Link>
          <Link className="primary" href="/reserve">
            예약하기
          </Link>
        </div>
      </header>

      <section className="hero">
        <img
          className="hero-photo"
          src={`${imageBase}/hongcheon-kkotsin-05.jpg`}
          width={2048}
          height={1152}
          fetchPriority="high"
          alt="홍천 꽃신의 큰 창과 식물이 보이는 현대적인 실내 좌석"
        />
        <div className="hero-copy">
          <h1>
            홍천 신장대리에 핀{" "}
            <br />
            마을 카페
          </h1>
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
          <p>Space</p>
          <h2>실제 사진으로 보는 꽃신의 분위기</h2>
        </div>
        <div className="image-grid image-grid-large">
          {spacePhotos.map((photo) => (
            <article key={photo.src}>
              <img
                className="content-image"
                src={photo.src}
                width={2048}
                height={1152}
                loading="lazy"
                alt={`${siteConfig.name} ${photo.title}`}
              />
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section visit-info-section">
        <div className="section-head">
          <p>Visit</p>
          <h2>방문 전 확인할 정보</h2>
        </div>
        <div className="visit-info-grid">
          <article className="visit-info-card floor-guide-card">
            <div>
              <p>Floor Guide</p>
              <h3>층별 안내</h3>
            </div>
            <img
              src={`${imageBase}/hongcheon-kkotsin-12.jpg`}
              width={2048}
              height={1152}
              loading="lazy"
              alt="홍천 꽃신 층별 안내도"
            />
            <p>지하 1층부터 3층까지의 공간 구성을 한눈에 볼 수 있습니다.</p>
          </article>

          <article className="visit-info-card location-card">
            <div>
              <p>Location / Contact</p>
              <h3>위치 · 문의</h3>
            </div>
            <img
              src={`${imageBase}/hongcheon-kkotsin-01.jpg`}
              width={2048}
              height={1152}
              loading="lazy"
              alt="홍천 꽃신 도로명 주소 위치 안내 사진"
            />
            <div className="contact-info inline">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.businessHours}</p>
              <p>TEL. {siteConfig.phone}</p>
              <p>Kakao. {siteConfig.kakaoChannel}</p>
              <Link className="primary block" href="/reserve">
                예약하러 가기
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section id="menu-board" className="section menu-board">
        <div className="section-head">
          <p>Menu</p>
          <h2>메뉴판</h2>
        </div>

        <div className="menu-layout">
          <figure className="menu-photo-card">
            <MenuBoardViewer src={`${imageBase}/hongcheon-kkotsin-08.png`} alt="홍천 꽃신 전체 메뉴판" />
            <figcaption>매장 메뉴판 사진</figcaption>
          </figure>

          <div className="menu-categories">
            {cafeMenu.map((category) => (
              <article className="menu-category" key={category.category}>
                <h3>{category.category}</h3>
                <ul className="menu-list">
                  {category.menus.map((menu) => (
                    <li key={menu.name}>
                      <span>{menu.name}</span>
                      <span>{getMenuPriceLabel(menu)}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="reserve-cta" className="section reserve-cta">
        <div className="section-head light">
          <p>Reservation</p>
          <h2>방문 전 예약 요청</h2>
        </div>
        <div className="cta-layout">
          <div className="cta-copy">
            <h3>방문 시간과 원하는 메뉴를 함께 남겨주세요.</h3>
            <p>메뉴를 추가하고 수량을 고르면 예약 요청과 함께 전달됩니다.</p>
            <p>단체 방문이나 별도 요청은 요청사항에 적어주세요.</p>
          </div>
          <ReservationForm compact title="빠른 예약 요청" />
        </div>
      </section>

      <footer className="footer">
        <p>{siteConfig.name}</p>
        <p>꽃피는 신장대리에서 차와 디저트를 만나는 마을 카페</p>
      </footer>
    </main>
    </>
  );
}
