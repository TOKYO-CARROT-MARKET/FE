import { Suspense } from "react";
import ItemFilterHeader from "@/components/item/ItemFilterHeader";
import ItemsListWithLoadMore from "@/components/item/ItemsListWithLoadMore";
import { getItems } from "@/features/item/api";
import type { Item, ItemFilter, ItemStatus } from "@/features/item/types";

const LIMIT = 100;

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  const filter: ItemFilter = {};
  if (sp.q && typeof sp.q === "string") filter.q = sp.q;
  if (sp.region && typeof sp.region === "string") filter.region = sp.region;
  if (sp.category && typeof sp.category === "string")
    filter.category = sp.category;
  if (sp.status && typeof sp.status === "string")
    filter.status = sp.status as ItemStatus;
  if (sp.priceMin && typeof sp.priceMin === "string")
    filter.priceMin = Number(sp.priceMin);
  if (sp.priceMax && typeof sp.priceMax === "string")
    filter.priceMax = Number(sp.priceMax);
  if (sp.availableDate && typeof sp.availableDate === "string")
    filter.availableDate = sp.availableDate;

  const filterKey = JSON.stringify(filter);

  let items: Item[] = [];
  try {
    items = await getItems({ ...filter, limit: LIMIT, offset: 0 });
  } catch {}

  return (
    <section className="space-y-4">
      <Suspense>
        <ItemFilterHeader />
      </Suspense>
      <ItemsListWithLoadMore
        key={filterKey}
        initialItems={items}
        filter={filter}
        limit={LIMIT}
      />
    </section>
  );
}
