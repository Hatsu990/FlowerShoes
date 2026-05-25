"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ReservationCancelButton } from "@/components/admin/reservation-cancel-button";
import { ReservationDeleteButton } from "@/components/admin/reservation-delete-button";
import { StatusSelector } from "@/components/admin/status-selector";
import { Reservation, ReservationStatus, reservationStatusLabels } from "@/lib/reservations/types";

type ReservationTab = "history" | "active" | "completed" | "cancelled";

interface ReservationTabsProps {
  reservations: Reservation[];
}

const tabs: { key: ReservationTab; label: string }[] = [
  { key: "history", label: "전체 기록" },
  { key: "active", label: "진행 중" },
  { key: "completed", label: "처리 완료" },
  { key: "cancelled", label: "예약 취소" },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatSelectedMenus(menus: string[]) {
  if (menus.length === 0) {
    return "-";
  }

  return menus
    .map((menu) =>
      menu
        .replace(/\s*·\s*[\d,]+원/g, "")
        .replace(/\s*x\s*(\d+)/i, " $1개")
        .replace(/\bHOT\b/g, "HOT")
        .replace(/\bICE\b/g, "ICE"),
    )
    .join(", ");
}

function isActiveStatus(status: ReservationStatus) {
  return status === "pending" || status === "confirmed";
}

function isArchivedStatus(status: ReservationStatus) {
  return status === "completed" || status === "cancelled";
}

function ReservationActions({
  reservation,
  showManagement,
}: {
  reservation: Reservation;
  showManagement: boolean;
}) {
  if (!showManagement) {
    return null;
  }

  return isActiveStatus(reservation.status) ? (
    <ReservationCancelButton reservationId={reservation.id} />
  ) : (
    <ReservationDeleteButton reservationId={reservation.id} />
  );
}

function ReservationTable({
  emptyMessage,
  reservations,
  showManagement,
}: {
  emptyMessage: string;
  reservations: Reservation[];
  showManagement: boolean;
}) {
  return (
    <>
      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>연락처</th>
              <th>날짜</th>
              <th>방문 시간</th>
              <th>예약 유형</th>
              <th>선택 메뉴</th>
              <th>상태</th>
              <th>접수 시각</th>
              {showManagement && <th>관리</th>}
              <th>상세</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.name}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.reservationType}</td>
                <td>{formatSelectedMenus(reservation.selectedMenus)}</td>
                <td>
                  {isActiveStatus(reservation.status) ? (
                    <StatusSelector reservationId={reservation.id} currentStatus={reservation.status} />
                  ) : (
                    <span className="status-current-badge">{reservationStatusLabels[reservation.status]}</span>
                  )}
                </td>
                <td>{formatDate(reservation.created_at)}</td>
                {showManagement && (
                  <td>
                    <ReservationActions reservation={reservation} showManagement={showManagement} />
                  </td>
                )}
                <td>
                  <Link href={`/admin/reservations/${reservation.id}`}>보기</Link>
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={showManagement ? 10 : 9}>{emptyMessage}</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="admin-reservation-card-list">
        {reservations.map((reservation) => (
          <article className="admin-reservation-card" key={reservation.id}>
            <div className="admin-reservation-card-head">
              <div>
                <strong>{reservation.name}</strong>
                <span>{reservation.phone}</span>
              </div>
              <span className="admin-reservation-type">{reservation.reservationType}</span>
            </div>

            <dl>
              <div>
                <dt>방문 시간</dt>
                <dd>
                  {reservation.date} {reservation.time}
                </dd>
              </div>
              <div>
                <dt>선택 메뉴</dt>
                <dd>{formatSelectedMenus(reservation.selectedMenus)}</dd>
              </div>
              <div>
                <dt>접수 시각</dt>
                <dd>{formatDate(reservation.created_at)}</dd>
              </div>
            </dl>

            <div className="admin-reservation-card-status">
              {isActiveStatus(reservation.status) ? (
                <StatusSelector reservationId={reservation.id} currentStatus={reservation.status} />
              ) : (
                <span className="status-current-badge">{reservationStatusLabels[reservation.status]}</span>
              )}
            </div>

            <div className="admin-reservation-card-actions">
              <Link href={`/admin/reservations/${reservation.id}`}>상세 보기</Link>
              <ReservationActions reservation={reservation} showManagement={showManagement} />
            </div>
          </article>
        ))}
        {reservations.length === 0 && <p className="admin-empty-message">{emptyMessage}</p>}
      </section>
    </>
  );
}

export function ReservationTabs({ reservations }: ReservationTabsProps) {
  const [selectedTab, setSelectedTab] = useState<ReservationTab>("history");

  const groupedReservations = useMemo(
    () => ({
      active: reservations.filter((reservation) => isActiveStatus(reservation.status)),
      completed: reservations.filter((reservation) => reservation.status === "completed"),
      cancelled: reservations.filter((reservation) => reservation.status === "cancelled"),
      archived: reservations.filter((reservation) => isArchivedStatus(reservation.status)),
    }),
    [reservations],
  );

  const counts = useMemo(
    () => ({
      history: reservations.length,
      active: groupedReservations.active.length,
      completed: groupedReservations.completed.length,
      cancelled: groupedReservations.cancelled.length,
    }),
    [groupedReservations, reservations.length],
  );

  const visibleReservations = useMemo(() => {
    if (selectedTab === "active") {
      return groupedReservations.active;
    }
    if (selectedTab === "completed") {
      return groupedReservations.completed;
    }
    if (selectedTab === "cancelled") {
      return groupedReservations.cancelled;
    }
    return reservations;
  }, [groupedReservations, reservations, selectedTab]);

  const emptyMessage =
    selectedTab === "active"
      ? "진행 중인 예약이 없습니다."
      : selectedTab === "completed"
        ? "처리 완료된 예약이 없습니다."
        : selectedTab === "cancelled"
          ? "예약 취소 기록이 없습니다."
          : "표시할 예약 기록이 없습니다.";

  return (
    <section className="admin-reservation-tabs">
      <div className="admin-tab-list" role="tablist" aria-label="예약 목록 구분">
        {tabs.map((tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={selectedTab === tab.key}
            className={selectedTab === tab.key ? "selected" : ""}
            onClick={() => setSelectedTab(tab.key)}
            key={tab.key}
          >
            <span>{tab.label}</span>
            <strong>{counts[tab.key]}</strong>
          </button>
        ))}
      </div>

      {selectedTab === "history" ? (
        <div className="admin-history-groups">
          <section>
            <h2 className="admin-section-title">진행 중</h2>
            <ReservationTable
              emptyMessage="진행 중인 예약이 없습니다."
              reservations={groupedReservations.active}
              showManagement
            />
          </section>
          <section>
            <h2 className="admin-section-title">처리 기록</h2>
            <ReservationTable
              emptyMessage="처리 완료 또는 예약 취소 기록이 없습니다."
              reservations={groupedReservations.archived}
              showManagement
            />
          </section>
        </div>
      ) : (
        <ReservationTable emptyMessage={emptyMessage} reservations={visibleReservations} showManagement />
      )}
    </section>
  );
}
