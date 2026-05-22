export const reservationStatuses = ["pending", "confirmed", "cancelled"] as const;
export type ReservationStatus = (typeof reservationStatuses)[number];

export interface CreateReservationInput {
  name: string;
  phone: string;
  date: string;
  time: string;
  people: number;
  memo?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  people: number;
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