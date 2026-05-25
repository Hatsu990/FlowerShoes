import type { ReactNode } from "react";

import { completeExpiredReservations } from "@/lib/reservations/repository";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  await completeExpiredReservations();

  return children;
}
