"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = `${base64String}${padding}`.replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

function isPushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function PushNotificationControl() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [message, setMessage] = useState("이 기기에서 예약 알림을 받을 수 있습니다.");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false);
      setMessage("이 브라우저는 웹 푸시 알림을 지원하지 않습니다.");
      return;
    }

    setSupported(true);
    setPermission(Notification.permission);
  }, []);

  async function enableNotifications() {
    if (!isPushSupported()) {
      setMessage("이 브라우저는 웹 푸시 알림을 지원하지 않습니다.");
      return;
    }

    setSaving(true);
    setMessage("알림 설정을 준비하고 있습니다.");

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== "granted") {
        setMessage("알림 권한이 허용되지 않았습니다. 브라우저 설정에서 알림을 허용해주세요.");
        return;
      }

      const publicKeyResponse = await fetch("/api/push/public-key");
      const publicKeyJson = (await publicKeyResponse.json()) as {
        ok: boolean;
        publicKey?: string;
        message?: string;
      };

      if (!publicKeyResponse.ok || !publicKeyJson.ok || !publicKeyJson.publicKey) {
        setMessage(publicKeyJson.message || "알림 공개키가 아직 설정되지 않았습니다.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKeyJson.publicKey),
        }));

      const saveResponse = await fetch("/api/push/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      const saveJson = (await saveResponse.json()) as { ok: boolean; message?: string };

      if (!saveResponse.ok || !saveJson.ok) {
        setMessage(saveJson.message || "알림 기기 등록에 실패했습니다.");
        return;
      }

      setMessage("이 기기에서 새 예약 알림을 받을 준비가 됐습니다.");
    } catch (error) {
      console.error(error);
      setMessage("알림 설정 중 문제가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="admin-settings-group push-control">
      <h2>웹 푸시 알림</h2>
      <p className="admin-settings-muted">
        사장님 휴대폰에서 이 사이트를 홈 화면에 추가한 뒤 알림을 허용하면, 새 예약이 들어올 때 알림을 받을 수 있습니다.
      </p>
      <button type="button" onClick={enableNotifications} disabled={!supported || saving || permission === "denied"}>
        {saving ? "설정 중.." : "이 기기에서 알림 받기"}
      </button>
      <p className="push-control-message" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
