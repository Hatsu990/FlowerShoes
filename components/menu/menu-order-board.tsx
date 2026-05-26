"use client";

import { useEffect, useState } from "react";

import type { CafeMenuCategory, CafeMenuItem } from "@/lib/constants/menu";

interface MenuOrderBoardProps {
  categories: CafeMenuCategory[];
  soldOutMenus: string[];
}

type MenuVariant = {
  label: "HOT" | "ICE" | "";
  price: number;
};

function formatPrice(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function getMenuKey(category: string, menuName: string) {
  return `${category}::${menuName}`;
}

function getMenuVariants(menu: CafeMenuItem): MenuVariant[] {
  const variants: MenuVariant[] = [];

  if (typeof menu.hot === "number") {
    variants.push({ label: "HOT", price: menu.hot });
  }
  if (typeof menu.ice === "number") {
    variants.push({ label: "ICE", price: menu.ice });
  }
  if (typeof menu.price === "number") {
    variants.push({ label: "", price: menu.price });
  }

  return variants;
}

function getSelectedMenuLabel(menu: CafeMenuItem, variant: MenuVariant) {
  return variant.label ? `${menu.name} ${variant.label}` : menu.name;
}

function addMenuToCart(label: string) {
  window.dispatchEvent(
    new CustomEvent("flower-shoes:add-menu", {
      detail: { label },
    }),
  );
}

function getSubjectParticle(value: string) {
  const lastChar = value.trim().replace(/\s+(HOT|ICE)$/i, "").at(-1);
  if (!lastChar) {
    return "가";
  }

  const code = lastChar.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) {
    return "가";
  }

  return (code - 0xac00) % 28 === 0 ? "가" : "이";
}

function MenuCategoryList({
  categories,
  selectedMenus,
  showToast,
  soldOutMenus,
}: MenuOrderBoardProps & { selectedMenus: Record<string, number>; showToast: (message: string) => void }) {
  return (
    <>
      {categories.map((category) => (
        <article className="menu-category" key={category.category}>
          <h3>{category.category}</h3>
          <ul className="menu-list">
            {category.menus.map((menu) => {
              const menuKey = getMenuKey(category.category, menu.name);
              const isSoldOut = soldOutMenus.includes(menuKey);
              const variants = getMenuVariants(menu);

              return (
                <li className={isSoldOut ? "sold-out" : ""} key={menu.name}>
                  <span>{menu.name}</span>
                  <span className="menu-price-actions">
                    {isSoldOut
                      ? "품절"
                      : variants.map((variant) => {
                          const selectedLabel = getSelectedMenuLabel(menu, variant);
                          return (
                            <button
                              type="button"
                              className="menu-add-button"
                              aria-pressed={Boolean(selectedMenus[selectedLabel])}
                              onClick={() => {
                                addMenuToCart(selectedLabel);
                                showToast(`장바구니에 ${selectedLabel}${getSubjectParticle(selectedLabel)} 추가되었습니다!`);
                              }}
                              key={selectedLabel}
                            >
                              {variant.label ? `${variant.label} ` : ""}
                              {formatPrice(variant.price)}
                            </button>
                          );
                        })}
                  </span>
                </li>
              );
            })}
          </ul>
        </article>
      ))}
    </>
  );
}

export function MenuOrderBoard({ categories, soldOutMenus }: MenuOrderBoardProps) {
  const [selectedMenus, setSelectedMenus] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState(categories[0]?.category ?? "");
  const [toast, setToast] = useState({ id: 0, message: "" });
  const columns = [
    categories.filter((_, index) => index % 2 === 0),
    categories.filter((_, index) => index % 2 === 1),
  ];
  const activeMobileCategory = categories.find((category) => category.category === activeCategory) ?? categories[0];

  useEffect(() => {
    function updateSelectedMenus(event: Event) {
      const customEvent = event as CustomEvent<{ selectedMenus?: Record<string, number> }>;
      setSelectedMenus(customEvent.detail?.selectedMenus ?? {});
    }

    window.addEventListener("flower-shoes:cart-updated", updateSelectedMenus);
    return () => window.removeEventListener("flower-shoes:cart-updated", updateSelectedMenus);
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !categories.some((category) => category.category === activeCategory)) {
      setActiveCategory(categories[0].category);
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    if (!toast.message) {
      return;
    }

    const timeout = window.setTimeout(() => setToast((prev) => ({ ...prev, message: "" })), 1800);
    return () => window.clearTimeout(timeout);
  }, [toast.id, toast.message]);

  function showToast(message: string) {
    setToast((prev) => ({ id: prev.id + 1, message }));
  }

  return (
    <>
      {toast.message && (
        <div className="menu-add-toast" role="status" aria-live="polite" key={toast.id}>
          {toast.message}
        </div>
      )}
      <div className="menu-categories-mobile">
        <div className="menu-category-tabs" aria-label="메뉴 장르 선택">
          {categories.map((category) => (
            <button
              type="button"
              className={category.category === activeMobileCategory?.category ? "selected" : ""}
              onClick={() => setActiveCategory(category.category)}
              key={category.category}
            >
              {category.category}
            </button>
          ))}
        </div>
        {activeMobileCategory && (
          <MenuCategoryList
            categories={[activeMobileCategory]}
            selectedMenus={selectedMenus}
            showToast={showToast}
            soldOutMenus={soldOutMenus}
          />
        )}
      </div>

      <div className="menu-categories">
        {columns.map((column, columnIndex) => (
          <div className="menu-category-column" key={columnIndex}>
            <MenuCategoryList
              categories={column}
              selectedMenus={selectedMenus}
              showToast={showToast}
              soldOutMenus={soldOutMenus}
            />
          </div>
        ))}
      </div>
    </>
  );
}
