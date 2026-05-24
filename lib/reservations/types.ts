export const reservationStatuses = ["pending", "confirmed", "completed", "cancelled"] as const;
export type ReservationStatus = (typeof reservationStatuses)[number];

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: "접수 대기",
  confirmed: "확인 완료",
  completed: "처리 완료",
  cancelled: "취소",
};

export const reservationVisitTypes = ["매장", "포장"] as const;
export type ReservationVisitType = (typeof reservationVisitTypes)[number];

export interface CreateReservationInput {
  name: string;
  phone: string;
  date: string;
  time: string;
  reservationType: ReservationVisitType;
  selectedMenus: string[];
  memo?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  reservationType: ReservationVisitType;
  selectedMenus: string[];
  memo: string | null;
  status: ReservationStatus;
  created_at: string;
}

export interface ReservationListFilter {
  status?: ReservationStatus;
  query?: string;
  limit?: number;
}

export interface ValidationResult<T> {
  ok: boolean;
  data?: T;
  errors?: string[];
}
