"use client";

import type { MouseEvent } from "react";

interface PhoneInquiryButtonProps {
  phone: string;
}

function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function formatPhone(value: string) {
  const digits = normalizePhone(value);
  if (/^010\d{8}$/.test(digits)) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  return value;
}

export function PhoneInquiryButton({ phone }: PhoneInquiryButtonProps) {
  const tel = normalizePhone(phone);
  const formattedPhone = formatPhone(phone);

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(min-width: 768px)").matches) {
      event.preventDefault();
      window.alert(`전화문의\n${formattedPhone}`);
    }
  }

  return (
    <a className="phone-inquiry-button" href={`tel:${tel}`} onClick={onClick}>
      전화문의
    </a>
  );
}
