"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ItemStatus } from "@/features/item/types";
import { ITEMS_CATEGORY } from "@/constants/category";
import { TOKYO_WARDS } from "@/constants/region";

const STATUS_OPTIONS: { value: ItemStatus | ""; label: string }[] = [
  { value: "", label: "전체" },
  { value: "selling", label: "판매중" },
  { value: "reserved", label: "예약중" },
  { value: "sold", label: "판매완료" },
];

export default function ItemFilterHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const region = searchParams.get("region") ?? "";
  const category = searchParams.get("category") ?? "";
  const status = (searchParams.get("status") ?? "") as ItemStatus | "";
  const priceMin = searchParams.get("priceMin") ?? "";
  const priceMax = searchParams.get("priceMax") ?? "";
  const availableDate = searchParams.get("availableDate") ?? "";

  const [searchInput, setSearchInput] = useState(q);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, searchParams],
  );

  const reset = useCallback(() => {
    setSearchInput("");
    router.push(pathname);
  }, [router, pathname]);

  const submitSearch = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      update("q", searchInput.trim());
    },
    [searchInput, update],
  );

  const hasFilter =
    q || region || category || status || priceMin || priceMax || availableDate;

  return (
    <div className="sticky top-16 z-10 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 space-y-4">
      {/* 검색 + 필터 토글 */}
      <div className="flex gap-2">
        <form onSubmit={submitSearch} className="flex flex-1 gap-2">
          <input
            type="text"
            placeholder="상품명 또는 내용으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            검색
          </button>
        </form>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
            open || (hasFilter && !q)
              ? "border-neutral-900 bg-neutral-900 text-white"
              : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          필터 {open ? "▲" : "▼"}
        </button>
      </div>

      {/* 접히는 필터 영역 */}
      {open && (
        <div className="space-y-3 border-t border-neutral-100 pt-3">
          {/* 판매 상태 */}
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update("status", opt.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                  status === opt.value
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 지역 / 카테고리 / 가격대 */}
          <div className="flex flex-wrap gap-3">
            <select
              value={region}
              onChange={(e) => update("region", e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">지역 전체</option>
              {TOKYO_WARDS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => update("category", e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            >
              <option value="">카테고리 전체</option>
              {ITEMS_CATEGORY.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                placeholder="최소 가격"
                value={priceMin}
                onChange={(e) => update("priceMin", e.target.value)}
                className="w-28 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-400">~</span>
              <input
                type="number"
                min={0}
                placeholder="최대 가격"
                value={priceMax}
                onChange={(e) => update("priceMax", e.target.value)}
                className="w-28 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <span className="text-sm text-neutral-500">엔</span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-neutral-500">거래 희망일</label>
              <input
                type="date"
                value={availableDate}
                onChange={(e) => update("availableDate", e.target.value)}
                className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            {hasFilter && (
              <button
                onClick={reset}
                className="rounded-xl border border-neutral-200 px-3 py-2 text-sm text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
