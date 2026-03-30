"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import ItemCard from "@/components/item/ItemCard";
import { getMyItems } from "@/features/auth/api";
import type { Item } from "@/features/item/types";

export default function MyPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchMyItems() {
      try {
        const data = await getMyItems();
        setItems(data);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "내 매물 조회 실패",
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyItems();
  }, []);

  return (
    <RequireAuth>
      <section className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">마이페이지</h1>
          <p className="mt-2 text-sm text-neutral-600">
            내가 등록한 귀국짐 매물을 확인할 수 있어요.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-neutral-500">불러오는 중...</p>
        ) : message ? (
          <p className="text-sm text-red-500">{message}</p>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-neutral-500">
            아직 등록한 매물이 없어요.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </RequireAuth>
  );
}
