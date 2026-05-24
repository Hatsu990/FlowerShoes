import Link from "next/link";

import { ReservationForm } from "@/components/reservation/reservation-form";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import { siteConfig } from "@/lib/constants/site";

const imageBase = "/images/kkotsin";

const spacePhotos = [
  {
    src: `${imageBase}/hongcheon-kkotsin-11.jpg`,
    title: "창가 좌석",
    description: "큰 창과 식물이 보이는 밝은 실내",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-05.jpg`,
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

const featurePhotos = [
  {
    src: `${imageBase}/hongcheon-kkotsin-09.jpg`,
    title: "따뜻한 차 메뉴",
    description: "쌍화차, 대추차처럼 익숙한 차 메뉴",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-10.jpg`,
    title: "디저트와 커피",
    description: "가볍게 들르기 좋은 디저트와 커피",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-12.jpg`,
    title: "층별 안내",
    description: "방문 전 공간 구성을 확인할 수 있는 안내",
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
    <main className="landing">
      <header className="top-nav">
        <div className="brand">
          <span>{siteConfig.name}</span>
          <small>{siteConfig.subtitle}</small>
        </div>
        <div className="top-nav-actions">
          <a href="#story">이름 이야기</a>
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
          src={`${imageBase}/hongcheon-kkotsin-11.jpg`}
          alt="홍천 꽃신의 큰 창과 식물이 보이는 현대적인 실내 좌석"
        />
        <div className="hero-copy">
          <p>꽃신은 꽃피는 신장대리의 줄임말입니다</p>
          <h1>
            홍천 신장대리에 핀
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

      <section id="story" className="section story-section">
        <div className="section-head">
          <p>Brand Story</p>
          <h2>전통 꽃신인 줄 알았다면, 정상입니다.</h2>
        </div>
        <div className="story-layout">
          <div className="story-copy">
            <p>
              홍천 꽃신의 이름은 신발 꽃신이 아니라, <strong>꽃피는 신장대리</strong>에서 왔습니다.
              그래서 처음 듣는 분들이 자주 착각하고, 그 작은 오해가 오히려 기억에 남는 첫인상이 됩니다.
            </p>
            <p>
              사이트의 분위기도 전통 이미지보다 실제 공간에 맞춰 정리했습니다. 밝은 창, 나무 질감, 식물,
              동네에서 편하게 들를 수 있는 세련된 카페의 인상을 중심으로 보여줍니다.
            </p>
          </div>
          <figure className="story-sign">
            <img src={`${imageBase}/hongcheon-kkotsin-02.jpg`} alt="꽃피는 신장대리 문구가 있는 꽃신 외부 간판" />
            <figcaption>꽃피는 신장대리라는 이름을 보여주는 외부 사인</figcaption>
          </figure>
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
              <img className="content-image" src={photo.src} alt={`${siteConfig.name} ${photo.title}`} />
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section feature-section">
        <div className="section-head">
          <p>Visit</p>
          <h2>차, 디저트, 그리고 잠깐 머무는 자리</h2>
        </div>
        <div className="card-row">
          {featurePhotos.map((photo) => (
            <article className="service-card" key={photo.src}>
              <img className="content-image" src={photo.src} alt={`${siteConfig.name} ${photo.title}`} />
              <h3>{photo.title}</h3>
              <p>{photo.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="menu-board" className="section menu-board">
        <div className="section-head">
          <p>Menu</p>
          <h2>메뉴판</h2>
        </div>

        <div className="menu-layout">
          <figure className="menu-photo-card">
            <img src={`${imageBase}/hongcheon-kkotsin-08.png`} alt="홍천 꽃신 전체 메뉴판" />
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
            <h3>매장 방문과 포장 요청을 빠르게 남겨주세요.</h3>
            <p>원하는 날짜, 시간, 방문 유형을 보내주시면 확인 후 연락드립니다.</p>
            <p>단체 방문이나 특별 요청은 요청사항에 함께 적어주세요.</p>
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
          <figure className="location-photo">
            <img src={`${imageBase}/hongcheon-kkotsin-01.jpg`} alt="홍천 꽃신 도로명 주소 위치 안내 사진" />
            <figcaption>도로명 주소 위치 안내</figcaption>
          </figure>
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
        <p>꽃피는 신장대리에서 차와 디저트를 만나는 마을 카페</p>
      </footer>
    </main>
  );
}
