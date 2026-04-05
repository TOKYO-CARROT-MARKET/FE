"use server";

import type { Item, ItemFilter } from "./types";
import { getItems } from "./api";

export async function loadMoreItems(
  filter: ItemFilter,
  offset: number,
  limit: number,
): Promise<Item[]> {
  return getItems({ ...filter, limit, offset });
}
