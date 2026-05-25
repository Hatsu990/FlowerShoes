"use client";

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

function MenuCategoryList({ categories, soldOutMenus }: MenuOrderBoardProps) {
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
                              onClick={() => addMenuToCart(selectedLabel)}
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
  const columns = [
    categories.filter((_, index) => index % 2 === 0),
    categories.filter((_, index) => index % 2 === 1),
  ];

  return (
    <>
      <div className="menu-categories-mobile">
        <MenuCategoryList categories={categories} soldOutMenus={soldOutMenus} />
      </div>

      <div className="menu-categories">
        {columns.map((column, columnIndex) => (
          <div className="menu-category-column" key={columnIndex}>
            <MenuCategoryList categories={column} soldOutMenus={soldOutMenus} />
          </div>
        ))}
      </div>
    </>
  );
}
