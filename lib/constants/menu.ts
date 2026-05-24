export interface CafeMenuItem {
  name: string;
  hot?: number;
  ice?: number;
  price?: number;
}

export interface CafeMenuCategory {
  category: string;
  menus: CafeMenuItem[];
}

export const cafeMenu: CafeMenuCategory[] = [
  {
    category: "전통차",
    menus: [
      { name: "대추차", hot: 5000, ice: 6000 },
      { name: "쌍화차", hot: 5000, ice: 6000 },
      { name: "생강차", hot: 5000, ice: 6000 },
      { name: "마차", ice: 5000 },
      { name: "인삼차", ice: 5000 },
      { name: "오미자차", hot: 4500, ice: 5000 },
      { name: "유자차", hot: 4500, ice: 5000 },
      { name: "레몬차", hot: 4500, ice: 5500 }
    ]
  },
  {
    category: "차",
    menus: [
      { name: "복숭아 아이스티", ice: 3000 },
      { name: "캐모마일", hot: 3000, ice: 3500 },
      { name: "페퍼민트", hot: 3000, ice: 3500 },
      { name: "얼그레이", hot: 3000, ice: 3500 },
      { name: "그린티(녹차)", hot: 3000, ice: 3500 },
      { name: "루이보스", hot: 3000, ice: 3500 },
      { name: "히비스커스", hot: 3000, ice: 3500 },
      { name: "우엉차", hot: 3000, ice: 3500 },
      { name: "둥글레차", hot: 3000, ice: 3500 }
    ]
  },
  {
    category: "주스",
    menus: [
      { name: "딸기주스", ice: 4500 },
      { name: "키위주스", ice: 4500 }
    ]
  },
  {
    category: "에이드",
    menus: [
      { name: "자몽에이드", ice: 4000 },
      { name: "레몬에이드", ice: 4000 }
    ]
  },
  {
    category: "꽃차",
    menus: [
      { name: "목련차", hot: 3000, ice: 3500 },
      { name: "국화차", hot: 3000, ice: 3500 },
      { name: "벌꿀차", hot: 3000, ice: 3500 },
      { name: "연잎차", hot: 3000, ice: 3500 }
    ]
  },
  {
    category: "커피",
    menus: [
      { name: "믹스커피", hot: 1500, ice: 2000 },
      { name: "아메리카노", hot: 2000, ice: 2500 },
      { name: "카페라떼", hot: 3500, ice: 4000 },
      { name: "디카페인라떼", hot: 3500, ice: 4000 },
      { name: "에스프레소", hot: 2000 }
    ]
  },
  {
    category: "스무디",
    menus: [
      { name: "플레인요거트스무디", ice: 4500 },
      { name: "딸기스무디", ice: 4500 },
      { name: "망고스무디", ice: 4500 }
    ]
  },
  {
    category: "라떼",
    menus: [
      { name: "홍천찰옥수수라떼", hot: 4000, ice: 4500 },
      { name: "녹차라떼", hot: 4000, ice: 4500 },
      { name: "단호박라떼", hot: 4000, ice: 4500 },
      { name: "미숫가루라떼", hot: 4000, ice: 4500 },
      { name: "검은콩라떼", hot: 4000, ice: 4500 },
      { name: "생강라떼", hot: 5000, ice: 6000 }
    ]
  },
  {
    category: "디저트",
    menus: [
      { name: "마카롱", price: 2200 },
      { name: "머핀", price: 2800 },
      { name: "조각케이크", price: 5000 }
    ]
  }
];