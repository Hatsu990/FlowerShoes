export const reservationStatuses = ["pending", "confirmed", "cancelled"] as const;
export type ReservationStatus = (typeof reservationStatuses)[number];

export interface CreateReservationInput {
  name: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  memo?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  memo: string | null;
  status: ReservationStatus;
  source: string;
  internalNote: string | null;
  automationStatus: string | null;
  lastNotifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
