import webPush from "web-push";

import { deletePushSubscription, listPushSubscriptions } from "@/lib/push/subscriptions";
import { AutomationProvider } from "@/lib/automation/types";

let configured = false;

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  if (!configured) {
    webPush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:admin@flower-shoes.local", publicKey, privateKey);
    configured = true;
  }

  return true;
}

function buildReservationBody(event: Parameters<AutomationProvider["dispatch"]>[0]) {
  const menus = event.reservation.selectedMenus.length > 0 ? event.reservation.selectedMenus.join(", ") : "선택 메뉴 없음";
  return `${event.reservation.reservationType} ${event.reservation.time} / ${event.reservation.name} / ${menus}`;
}

export const webPushAutomationProvider: AutomationProvider = {
  id: "web-push",
  async dispatch(event) {
    if (event.name !== "reservation.created" || !configureWebPush()) {
      return;
    }

    const subscriptions = await listPushSubscriptions();
    if (subscriptions.length === 0) {
      return;
    }

    const payload = JSON.stringify({
      title: "꽃신 새 예약",
      body: buildReservationBody(event),
      url: "/admin/reservations",
      tag: `reservation-${event.reservation.id}`,
    });

    await Promise.all(
      subscriptions.map(async (subscription) => {
        try {
          await webPush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload,
          );
        } catch (error) {
          const statusCode = typeof error === "object" && error && "statusCode" in error ? error.statusCode : null;
          if (statusCode === 404 || statusCode === 410) {
            await deletePushSubscription(subscription.endpoint);
          } else {
            throw error;
          }
        }
      }),
    );
  },
};
