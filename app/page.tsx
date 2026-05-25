import Link from "next/link";

import { ReservationForm } from "@/components/reservation/reservation-form";
import { getAdminNotificationSettings, type AdminNotificationSettings } from "@/lib/admin/settings";
import { cafeMenu, type CafeMenuItem } from "@/lib/constants/menu";
import { defaultAboutImage, defaultHeroImage, imageBase } from "@/lib/constants/gallery";
import { siteConfig } from "@/lib/constants/site";
import { getKoreaDateString, getKoreaTimeString, isKoreaWeekend } from "@/lib/datetime/korea";

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

function getMenuKey(category: string, menuName: string) {
  return `${category}::${menuName}`;
}

function filterVisibleMenus(settings: AdminNotificationSettings) {
  return cafeMenu
    .map((category) => ({
      ...category,
      menus: category.menus.filter((menu) => !settings.hiddenMenus.includes(getMenuKey(category.category, menu.name))),
    }))
    .filter((category) => category.menus.length > 0);
}

function isMenuSoldOut(settings: AdminNotificationSettings, category: string, menuName: string) {
  return settings.soldOutMenus.includes(getMenuKey(category, menuName));
}

function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function getBusinessStatus(settings: AdminNotificationSettings) {
  const today = getKoreaDateString();

  if (!settings.developerAlwaysOpen && settings.closedDates.includes(today)) {
    return { label: "오늘 휴무", detail: "오늘은 예약 접수가 쉬어갑니다.", open: false };
  }

  const hours = settings.developerAlwaysOpen
    ? { open: "00:00", close: "23:50" }
    : isKoreaWeekend(today)
      ? { open: settings.weekendOpen, close: settings.weekendClose }
      : { open: settings.weekdayOpen, close: settings.weekdayClose };
  const current = timeToMinutes(getKoreaTimeString());
  const open = timeToMinutes(hours.open);
  const close = timeToMinutes(hours.close);
  const isOpen = settings.developerAlwaysOpen || (current >= open && current <= close);

  return {
    label: isOpen ? "현재 영업 중" : "영업 종료",
    detail: `영업시간 ${hours.open} - ${hours.close}`,
    open: isOpen,
  };
}

export default async function HomePage() {
  const adminSettings = await getAdminNotificationSettings();
  const visibleMenu = filterVisibleMenus(adminSettings);
  const visibleMenuColumns = [
    visibleMenu.filter((_, index) => index % 2 === 0),
    visibleMenu.filter((_, index) => index % 2 === 1),
  ];
  const businessStatus = getBusinessStatus(adminSettings);
  const heroImage = adminSettings.heroImage || defaultHeroImage;
  const aboutPhoto = adminSettings.aboutImage || defaultAboutImage;

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
          <a className="primary" href="#reserve-cta">
            예약하기
          </a>
        </div>
      </header>

      <section className="hero">
        <img
          className="hero-photo"
          src={heroImage}
          width={2048}
          height={1152}
          fetchPriority="high"
          alt="홍천 꽃신의 큰 창과 식물이 보이는 현대적인 실내 좌석"
        />
        <div className="hero-copy">
          <div className={`business-status ${businessStatus.open ? "open" : "closed"}`}>
            <strong>{businessStatus.label}</strong>
            <span>{businessStatus.detail}</span>
          </div>
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
          <div className="menu-categories-mobile">
            {visibleMenu.map((category) => (
              <article className="menu-category" key={category.category}>
                <h3>{category.category}</h3>
                <ul className="menu-list">
                  {category.menus.map((menu) => (
                    <li key={menu.name}>
                      <span>{menu.name}</span>
                      <span>
                        {isMenuSoldOut(adminSettings, category.category, menu.name) ? "품절" : getMenuPriceLabel(menu)}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="menu-categories">
            {visibleMenuColumns.map((column, columnIndex) => (
              <div className="menu-category-column" key={columnIndex}>
                {column.map((category) => (
                  <article className="menu-category" key={category.category}>
                    <h3>{category.category}</h3>
                    <ul className="menu-list">
                      {category.menus.map((menu) => (
                        <li key={menu.name}>
                          <span>{menu.name}</span>
                          <span>
                            {isMenuSoldOut(adminSettings, category.category, menu.name)
                              ? "품절"
                              : getMenuPriceLabel(menu)}
                          </span>
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
          <ReservationForm compact title="방문 예약하기" />
        </div>
      </section>

      <footer className="footer">
        <p>{siteConfig.name}</p>
        <p>홍천 신장대리에 피어난 카페</p>
        <Link className="footer-admin-link" href="/admin/settings">
          관리자
        </Link>
      </footer>
      <a className="mobile-reserve-button" href="#reserve-cta">
        방문 예약하기
      </a>
    </main>
    </>
  );
}
