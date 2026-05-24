import Link from "next/link";

import { MenuBoardViewer } from "@/components/menu/menu-board-viewer";
import { ReservationForm } from "@/components/reservation/reservation-form";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import { siteConfig } from "@/lib/constants/site";

const imageBase = "/images/kkotsin";

const spacePhotos = [
  {
    src: `${imageBase}/hongcheon-kkotsin-04.jpg`,
    title: "창가 좌석",
    description: "식물과 액자가 놓인 차분한 실내",
    className: "fit-contain",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-06.jpg`,
    title: "햇빛과 식물",
    description: "캔버스와 나무톤이 만드는 조용한 분위기",
    className: "",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-03.jpg`,
    title: "디저트 쇼케이스",
    description: "차와 함께 고르는 작은 디저트",
    className: "",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-07.jpg`,
    title: "공간의 작은 장식",
    description: "곳곳에 놓인 오브제로 채워지는 분위기",
    className: "fit-contain",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-13.jpg`,
    title: "꽃신이라는 이름",
    description: "꽃피는 신장대리에서 시작된 작은 이야기",
    className: "fit-contain",
  },
  {
    src: `${imageBase}/hongcheon-kkotsin-02.jpg`,
    title: "꽃피는 신장대리",
    description: "공간의 이름을 보여주는 바깥 사인",
    className: "fit-contain photo-sign",
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
        </div>
        <div className="top-nav-actions">
          <a href="#menu-board">메뉴</a>
          <Link href="/admin/reservations">관리자</Link>
          <a className="primary" href="#reserve-cta">
            예약하기
          </a>
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
        </div>
      </section>

      <section className="section visit-info-section">
        <div className="visit-photo-grid">
          <article className="visit-photo-panel location-panel">
            <img
              src={`${imageBase}/hongcheon-kkotsin-01.jpg`}
              width={2048}
              height={1152}
              loading="lazy"
              alt="홍천 꽃신 도로명 주소 위치 안내 사진"
            />
            <div className="visit-photo-copy">
              <h3>위치</h3>
              <p>{siteConfig.address}</p>
            </div>
          </article>

          <article className="visit-photo-panel floor-guide-panel">
            <img
              src={`${imageBase}/hongcheon-kkotsin-12.jpg`}
              width={2048}
              height={1152}
              loading="lazy"
              alt="홍천 꽃신 층별 안내도"
            />
            <div className="visit-photo-copy">
              <h3>층별 안내</h3>
            </div>
          </article>
        </div>
      </section>

      <section id="intro" className="section with-grid">
        <div className="section-head immersive">
          <p>Space</p>
          <h2>사진으로 꽃신의 분위기를 먼저 느껴보세요.</h2>
        </div>
        <div className="image-grid image-grid-large visual-mosaic">
          {spacePhotos.map((photo) => (
            <article className={photo.className} key={photo.src}>
              <img
                className="content-image"
                src={photo.src}
                width={2048}
                height={1152}
                loading="lazy"
                alt={`${siteConfig.name} ${photo.title}`}
              />
            </article>
          ))}
        </div>
      </section>

      <section id="menu-board" className="section menu-board">
        <div className="section-head immersive">
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
        <div className="section-head light immersive">
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
