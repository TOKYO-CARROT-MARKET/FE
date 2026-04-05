export const ITEMS_CATEGORY = ["가전", "가구", "침대", "생활용품"] as const;

export type Category = (typeof ITEMS_CATEGORY)[number];
