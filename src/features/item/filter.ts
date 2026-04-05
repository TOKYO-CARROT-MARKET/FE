import type { Item, ItemFilter } from "./types";

export function applyFilters(items: Item[], filter: ItemFilter): Item[] {
  return items.filter((item) => {
    if (filter.region && item.region !== filter.region) return false;
    if (filter.category && item.category !== filter.category) return false;
    if (filter.status && item.status !== filter.status) return false;
    if (filter.priceMin !== undefined && item.price < filter.priceMin)
      return false;
    if (filter.priceMax !== undefined && item.price > filter.priceMax)
      return false;
    return true;
  });
}
