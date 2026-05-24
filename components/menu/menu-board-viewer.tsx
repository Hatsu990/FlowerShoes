"use client";

import { useEffect, useState } from "react";

interface MenuBoardViewerProps {
  src: string;
  alt: string;
}

export function MenuBoardViewer({ src, alt }: MenuBoardViewerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button className="menu-board-button" type="button" onClick={() => setOpen(true)} aria-label="메뉴판 크게 보기">
        <img src={src} width={1928} height={816} loading="lazy" alt={alt} />
        <span>메뉴판 크게 보기</span>
      </button>

      {open && (
        <div className="menu-board-modal" role="dialog" aria-modal="true" aria-label="메뉴판 크게 보기">
          <button className="menu-board-close" type="button" onClick={() => setOpen(false)} aria-label="메뉴판 닫기">
            닫기
          </button>
          <div className="menu-board-zoom">
            <img src={src} width={1928} height={816} alt={alt} />
          </div>
        </div>
      )}
    </>
  );
}
