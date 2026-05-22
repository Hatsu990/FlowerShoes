import { ReservationStatus as PrismaReservationStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import {
  CreateReservationInput,
  Reservation,
  ReservationListFilter,
  ReservationStatus,
} from "@/lib/reservations/types";

const toDbStatusMap: Record<ReservationStatus, PrismaReservationStatus> = {
  pending: PrismaReservationStatus.PENDING,
  confirmed: PrismaReservationStatus.CONFIRMED,
  cancelled: PrismaReservationStatus.CANCELLED,
};

const fromDbStatusMap: Record<PrismaReservationStatus, ReservationStatus> = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

function mapReservation(record: {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  partySize: number;
  memo: string | null;
  status: PrismaReservationStatus;
  source: string;
  internalNote: string | null;
  automationStatus: string | null;
  lastNotifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): Reservation {
  return {
    id: record.id,
    name: record.name,
    phone: record.phone,
    date: record.date,
    time: record.time,
    partySize: record.partySize,
    memo: record.memo,
    status: fromDbStatusMap[record.status],
    source: record.source,
    internalNote: record.internalNote,
    automationStatus: record.automationStatus,
    lastNotifiedAt: record.lastNotifiedAt ? record.lastNotifiedAt.toISOString() : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const reservation = await prisma.reservation.create({
    data: {
      name: input.name,
      phone: input.phone,
      date: input.date,
      time: input.time,
      partySize: input.partySize,
      memo: input.memo?.trim() || null,
      status: PrismaReservationStatus.PENDING,
    },
  });

  return mapReservation(reservation);
}

export async function listReservations(filter: ReservationListFilter = {}): Promise<Reservation[]> {
  const limit = filter.limit ?? 100;
  const reservations = await prisma.reservation.findMany({
    where: {
      status: filter.status ? toDbStatusMap[filter.status] : undefined,
      OR: filter.query
        ? [
            { name: { contains: filter.query } },
            { phone: { contains: filter.query } },
            { memo: { contains: filter.query } },
          ]
        : undefined,
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
  });

  return reservations.map(mapReservation);
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  const reservation = await prisma.reservation.findUnique({
    where: { id },
  });

  return reservation ? mapReservation(reservation) : null;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation | null> {
  const exists = await prisma.reservation.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) {
    return null;
  }

  const reservation = await prisma.reservation.update({
    where: { id },
    data: { status: toDbStatusMap[status] },
  });

  return mapReservation(reservation);
}
