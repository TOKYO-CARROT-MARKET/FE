"use client";

import { useState, useTransition } from "react";
import type { Item, ItemFilter } from "@/features/item/types";
import { loadMoreItems } from "@/features/item/actions";
import ItemCard from "./ItemCard";

interface Props {
  initialItems: Item[];
  filter: ItemFilter;
  limit: number;
}

export default function ItemsListWithLoadMore({
  initialItems,
  filter,
  limit,
}: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [offset, setOffset] = useState(initialItems.length);
  const [hasMore, setHasMore] = useState(initialItems.length === limit);
  const [isPending, startTransition] = useTransition();

  const loadMore = () => {
    startTransition(async () => {
      const next = await loadMoreItems(filter, offset, limit);
      setItems((prev) => [...prev, ...next]);
      setOffset((prev) => prev + next.length);
      setHasMore(next.length === limit);
    });
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-neutral-500">
        아직 등록된 매물이 없어요.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            onClick={loadMore}
            disabled={isPending}
            className="rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-900 disabled:opacity-50"
          >
            {isPending ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}
    </div>
  );
}
