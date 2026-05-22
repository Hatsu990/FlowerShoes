import type { Reservation } from "@/lib/reservations/types";

export type AutomationEventName = "reservation.created" | "reservation.status_changed";

export interface ReservationAutomationEvent {
  name: AutomationEventName;
  reservation: Reservation;
  occurredAt: string;
}

export interface AutomationProvider {
  id: string;
  dispatch: (event: ReservationAutomationEvent) => Promise<void>;
}
