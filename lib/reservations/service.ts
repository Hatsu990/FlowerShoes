import { dispatchAutomationEvent } from "@/lib/automation/dispatcher";
import { getAdminNotificationSettings } from "@/lib/admin/settings";
import {
  createReservation as createReservationRecord,
  deleteReservation as deleteReservationRecord,
  getReservationById as getReservationByIdRecord,
  listReservations as listReservationsRecord,
  updateReservationStatus as updateReservationStatusRecord,
} from "@/lib/reservations/repository";
import { Reservation, ReservationListFilter, ReservationStatus } from "@/lib/reservations/types";
import { parseReservationStatus, validateCreateReservationInput } from "@/lib/reservations/validation";

export async function createReservation(rawInput: unknown): Promise<{ reservation?: Reservation; errors?: string[] }> {
  const adminSettings = await getAdminNotificationSettings();
  const validation = validateCreateReservationInput(rawInput, adminSettings);
  if (!validation.ok || !validation.data) {
    return { errors: validation.errors ?? ["유효하지 않은 요청입니다."] };
  }

  const reservation = await createReservationRecord(validation.data);

  await dispatchAutomationEvent({
    name: "reservation.created",
    reservation,
    adminSettings,
    occurredAt: new Date().toISOString(),
  });

  return { reservation };
}

export async function deleteReservation(id: string): Promise<{ ok?: true; errors?: string[] }> {
  const reservation = await getReservationByIdRecord(id);
  if (!reservation) {
    return { errors: ["예약 정보를 찾을 수 없습니다."] };
  }

  if (reservation.status !== "completed" && reservation.status !== "cancelled") {
    return { errors: ["처리 완료 또는 취소된 예약만 삭제할 수 있습니다."] };
  }

  const deleted = await deleteReservationRecord(id);
  if (!deleted) {
    return { errors: ["예약 기록 삭제에 실패했습니다."] };
  }

  return { ok: true };
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

  const adminSettings = await getAdminNotificationSettings();

  await dispatchAutomationEvent({
    name: "reservation.status_changed",
    reservation,
    adminSettings,
    occurredAt: new Date().toISOString(),
  });

  return { reservation };
}
