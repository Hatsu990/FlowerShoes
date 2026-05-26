import Link from "next/link";

import { MenuOrderBoard } from "@/components/menu/menu-order-board";
import { ReservationForm } from "@/components/reservation/reservation-form";
import { PhoneInquiryButton } from "@/components/contact/phone-inquiry-button";
import { getAdminNotificationSettings, type AdminNotificationSettings } from "@/lib/admin/settings";
import { cafeMenu } from "@/lib/constants/menu";
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
          <PhoneInquiryButton phone={adminSettings.phone} />
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

      <section className="editorial-map-section" aria-label="위치 및 공간 안내">
        <article className="map-feature location-panel">
          <img
            src={`${imageBase}/hongcheon-kkotsin-01.jpg`}
            width={2048}
            height={1152}
            loading="lazy"
            alt="홍천 꽃신 도로명 주소 위치 안내 사진"
          />
          <div>
            <h2>위치</h2>
            <p>{siteConfig.address}</p>
          </div>
        </article>

        <article className="map-feature floor-guide-panel">
          <img
            src={`${imageBase}/hongcheon-kkotsin-12.jpg`}
            width={2048}
            height={1152}
            loading="lazy"
            alt="홍천 꽃신 층별 안내도"
          />
          <div>
            <h2>층별 안내</h2>
            <p>1층 마을카페 꽃신</p>
          </div>
        </article>
      </section>

      <section id="intro" className="section story-section">
        <div className="story-layout">
          <div className="story-title">
            <h2>홍천 신장대리에 피어난 작은 쉼터</h2>
          </div>
          <div className="story-body">
            <figure className="story-photo">
              <img src={aboutPhoto} width={1536} height={2048} loading="lazy" alt="꽃신이라는 이름을 떠올리게 하는 작은 장식" />
            </figure>
            <div className="story-copy">
              <p>꽃피는 신장대리에서, 잠시 쉬어갈 수 있는 공간을 만들고 싶었습니다.</p>
              <p>꽃신은 홍천의 조용한 풍경과 따뜻한 차 한잔의 여유를 함께 담아낸 전통차 카페입니다.</p>
              <p>은은하게 퍼지는 차향, 편안한 우드톤의 공간, 그리고 천천히 머물러가기 좋은 분위기 속에서 복잡한 하루를 잠시 내려놓고 쉬어가실 수 있습니다.</p>
              <p>직접 준비한 전통차와 디저트, 그리고 홍천의 계절감을 함께 느껴보세요.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section gallery-runway">
        <div className="runway-head">
          <h2>꽃신을 소개합니다</h2>
        </div>
        <div className="runway-grid">
          {spacePhotos.map((photo, index) => (
            <article className={`runway-photo photo-${index + 1} ${photo.className}`} key={photo.src}>
              <img
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

      <section id="reserve-cta" className="section order-section">
        <div id="menu-board" className="order-anchor" />
        <div className="order-workspace">
          <div className="order-menu-panel">
            <div className="menu-board-title">
              <h2>MENU</h2>
            </div>
            <div className="menu-layout">
              <MenuOrderBoard categories={visibleMenu} soldOutMenus={adminSettings.soldOutMenus} />
            </div>
          </div>
          <div className="order-reserve-panel">
            <ReservationForm compact title="" />
          </div>
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
