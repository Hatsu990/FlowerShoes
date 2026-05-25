import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "홍천 꽃신 관리자",
    short_name: "꽃신",
    description: "홍천 꽃신 예약 관리와 알림",
    start_url: "/admin/reservations",
    scope: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#315f49",
    icons: [
      {
        src: "/images/kkotsin/hongcheon-kkotsin-08.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
