import type { Item, ItemFilter } from "./types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

type CreateItemInput = {
  title: string;
  description: string;
  price: number;
  category: string;
  region: string;
  pickup_type: "pickup" | "delivery" | "both";
  available_from?: string;
  departure_date?: string;
  status: "selling" | "reserved" | "sold";
  images?: string[];
};

export async function getItems(filter?: ItemFilter): Promise<Item[]> {
  const params = new URLSearchParams();
  params.set("limit", String(filter?.limit ?? 20));
  params.set("offset", String(filter?.offset ?? 0));
  if (filter?.q) params.set("q", filter.q);
  if (filter?.region) params.set("region", filter.region);
  if (filter?.category) params.set("category", filter.category);
  if (filter?.status) params.set("status", filter.status);
  if (filter?.priceMin !== undefined)
    params.set("price_min", String(filter.priceMin));
  if (filter?.priceMax !== undefined)
    params.set("price_max", String(filter.priceMax));
  if (filter?.availableDate) params.set("available_date", filter.availableDate);

  const res = await fetch(`${API_URL}/api/v1/items?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("매물 목록 조회 실패");
  }

  return res.json();
}

export async function getItem(id: string | number): Promise<Item> {
  const res = await fetch(`${API_URL}/api/v1/items/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("매물 상세 조회 실패");
  }

  return res.json();
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const res = await fetchWithAuth(`${API_URL}/api/v1/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: input }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors?.join(", ") || "매물 등록 실패");
  }

  return res.json();
}
