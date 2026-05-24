import { randomUUID } from "node:crypto";

import { db } from "@/lib/db/client";
import { ensureDatabaseSchema } from "@/lib/db/init";
import {
  CreateReservationInput,
  Reservation,
  ReservationListFilter,
  ReservationStatus,
  ReservationVisitType,
} from "@/lib/reservations/types";

type SqlArg = string | number | null;
type DbRow = Record<string, unknown>;

function parseStatus(value: unknown): ReservationStatus {
  if (value === "pending" || value === "confirmed" || value === "cancelled") {
    return value;
  }
  return "pending";
}

function parseReservationType(value: unknown): ReservationVisitType {
  if (value === "매장" || value === "포장") {
    return value;
  }
  return "매장";
}

function rowToReservation(row: DbRow): Reservation {
  return {
    id: String(row.id),
    name: String(row.name),
    phone: String(row.phone),
    date: String(row.date),
    time: String(row.time),
    reservationType: parseReservationType(row.reservation_type),
    memo: row.memo == null ? null : String(row.memo),
    status: parseStatus(row.status),
    created_at: String(row.created_at),
  };
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  await ensureDatabaseSchema();

  const reservation: Reservation = {
    id: randomUUID(),
    name: input.name,
    phone: input.phone,
    date: input.date,
    time: input.time,
    reservationType: input.reservationType,
    memo: input.memo?.trim() || null,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  await db.execute({
    sql: `
      INSERT INTO reservations (id, name, phone, date, time, people, reservation_type, memo, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      reservation.id,
      reservation.name,
      reservation.phone,
      reservation.date,
      reservation.time,
      1,
      reservation.reservationType,
      reservation.memo,
      reservation.status,
      reservation.created_at,
    ],
  });

  return reservation;
}

export async function listReservations(filter: ReservationListFilter = {}): Promise<Reservation[]> {
  await ensureDatabaseSchema();

  const limit = Math.max(1, Math.min(filter.limit ?? 100, 500));
  const conditions: string[] = [];
  const args: SqlArg[] = [];

  if (filter.status) {
    conditions.push("status = ?");
    args.push(filter.status);
  }

  if (filter.query) {
    conditions.push("(name LIKE ? OR phone LIKE ? OR COALESCE(memo, '') LIKE ?)");
    const q = `%${filter.query}%`;
    args.push(q, q, q);
  }

  let sql = `
    SELECT id, name, phone, date, time, reservation_type, memo, status, created_at
    FROM reservations
  `;

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += " ORDER BY created_at DESC LIMIT ?";
  args.push(limit);

  const result = await db.execute({ sql, args });
  return result.rows.map((row) => rowToReservation(row as DbRow));
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  await ensureDatabaseSchema();

  const result = await db.execute({
    sql: `
      SELECT id, name, phone, date, time, reservation_type, memo, status, created_at
      FROM reservations
      WHERE id = ?
      LIMIT 1
    `,
    args: [id],
  });

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return rowToReservation(row as DbRow);
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<Reservation | null> {
  await ensureDatabaseSchema();

  const result = await db.execute({
    sql: "UPDATE reservations SET status = ? WHERE id = ?",
    args: [status, id],
  });

  if (!result.rowsAffected) {
    return null;
  }

  return getReservationById(id);
}