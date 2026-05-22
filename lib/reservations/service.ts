import { dispatchAutomationEvent } from "@/lib/automation/dispatcher";
import {
  createReservation as createReservationRecord,
  getReservationById as getReservationByIdRecord,
  listReservations as listReservationsRecord,
  updateReservationStatus as updateReservationStatusRecord,
} from "@/lib/reservations/repository";
import {
  CreateReservationInput,
  Reservation,
  ReservationListFilter,
  ReservationStatus,
} from "@/lib/reservations/types";
import { parseReservationStatus, validateCreateReservationInput } from "@/lib/reservations/validation";

export async function createReservation(rawInput: unknown): Promise<{ reservation?: Reservation; errors?: string[] }> {
  const validation = validateCreateReservationInput(rawInput);
  if (!validation.ok || !validation.data) {
    return { errors: validation.errors ?? ["유효하지 않은 요청입니다."] };
  }

  const reservation = await createReservationRecord(validation.data as CreateReservationInput);

  await dispatchAutomationEvent({
    name: "reservation.created",
    reservation,
    occurredAt: new Date().toISOString(),
  });

  return { reservation };
}

export async function listReservations(filter: ReservationListFilter = {}): Promise<Reservation[]> {
  return listReservationsRecord(filter);
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  return getReservationByIdRecord(id);
}

export async function updateReservationStatus(
  id: string,
  statusRaw: unknown,
): Promise<{ reservation?: Reservation; errors?: string[] }> {
  const status: ReservationStatus | null = parseReservationStatus(statusRaw);
  if (!status) {
    return { errors: ["상태값이 올바르지 않습니다."] };
  }

  const reservation = await updateReservationStatusRecord(id, status);
  if (!reservation) {
    return { errors: ["예약 정보를 찾을 수 없습니다."] };
  }

  await dispatchAutomationEvent({
    name: "reservation.status_changed",
    reservation,
    occurredAt: new Date().toISOString(),
  });

  return { reservation };
}
