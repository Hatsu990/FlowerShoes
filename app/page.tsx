import Link from "next/link";

import { MenuBoardViewer } from "@/components/menu/menu-board-viewer";
import { ReservationForm } from "@/components/reservation/reservation-form";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import { siteConfig } from "@/lib/constants/site";

const imageBase = "/images/kkotsin";
const aboutPhoto = `${imageBase}/hongcheon-kkotsin-13.jpg`;

const spacePhotos = [
  {
    src: `${imageBase}/hongcheon-kkotsin-02.jpg`,
    title: "꽃피는 신장대리",
    description: "공간의 이름을 보여주는 바깥 사인",
    className: "fit-contain photo-sign",
  },
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

const menuColumns = [
  cafeMenu.filter((_, index) => index % 2 === 0),
  cafeMenu.filter((_, index) => index % 2 === 1),
];

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
            오늘은 조금 천천히
            <br />
            꽃신에서 쉬어가세요
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
          <h2>꽃신을 소개합니다</h2>
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

      <section className="section space-intro-section">
        <div className="section-head immersive">
          <p>About</p>
          <h2>홍천 신장대리에 피어난 작은 쉼터</h2>
        </div>
        <div className="space-intro-layout">
          <figure className="space-intro-photo">
            <img src={aboutPhoto} width={1536} height={2048} loading="lazy" alt="꽃신이라는 이름을 떠올리게 하는 작은 장식" />
          </figure>
          <div className="space-intro-copy">
            <p>
              꽃피는 신장대리에서,
              <br />
              잠시 쉬어갈 수 있는 공간을 만들고 싶었습니다.
            </p>
            <p>
              꽃신은 홍천의 조용한 풍경과
              <br />
              따뜻한 차 한잔의 여유를 함께 담아낸 전통차 카페입니다.
            </p>
            <p>
              은은하게 퍼지는 차향,
              <br />
              편안한 우드톤의 공간,
              <br />
              그리고 천천히 머물러가기 좋은 분위기 속에서
              <br />
              복잡한 하루를 잠시 내려놓고 쉬어가실 수 있습니다.
            </p>
            <p>
              직접 준비한 전통차와 디저트,
              <br />
              그리고 홍천의 계절감을 함께 느껴보세요.
            </p>
            <p>
              혼자 조용히 머물러도 좋고,
              <br />
              소중한 사람과 편하게 이야기를 나누기에도 좋은 공간이 되기를 바랍니다.
            </p>
          </div>
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

          <div className="menu-categories-mobile">
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

          <div className="menu-categories">
            {menuColumns.map((column, columnIndex) => (
              <div className="menu-category-column" key={columnIndex}>
                {column.map((category) => (
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
            ))}
          </div>
        </div>
      </section>

      <section id="reserve-cta" className="section reserve-cta">
        <div className="cta-layout">
          <div className="cta-copy">
            <h3>방문 시간과 원하는 메뉴를 함께 남겨주세요.</h3>
            <p>단체 방문이나 별도 요청은 요청사항에 적어주세요.</p>
          </div>
          <ReservationForm compact title="방문 예약하기" />
        </div>
      </section>

      <footer className="footer">
        <p>{siteConfig.name}</p>
        <p>홍천 신장대리에 피어난 카페</p>
      </footer>
    </main>
    </>
  );
}
