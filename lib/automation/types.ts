import type { Reservation } from "@/lib/reservations/types";
import type { AdminNotificationSettings } from "@/lib/admin/settings";

export type AutomationEventName = "reservation.created" | "reservation.status_changed";

export interface ReservationAutomationEvent {
  name: AutomationEventName;
  reservation: Reservation;
  adminSettings?: AdminNotificationSettings;
  occurredAt: string;
}

export interface AutomationProvider {
  id: string;
  dispatch: (event: ReservationAutomationEvent) => Promise<void>;
}
