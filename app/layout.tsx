import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "홍천 꽃신 | 꽃피는 신장대리 마을 카페",
  description: "꽃피는 신장대리, 홍천 꽃신 카페 예약 및 안내",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
