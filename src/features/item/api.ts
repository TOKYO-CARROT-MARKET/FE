import type { Item } from "./types";

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
};

export async function getItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/api/v1/items`, {
    cache: "no-store",
    credentials: "include",
  });
  console.log(res);
  if (!res.ok) {
    throw new Error("매물 목록 조회 실패");
  }

  return res.json();
}

export async function getItem(id: string | number): Promise<Item> {
  const res = await fetch(`${API_URL}/api/v1/items/${id}`, {
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("매물 상세 조회 실패");
  }

  return res.json();
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const res = await fetch(`${API_URL}/api/v1/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      item: input,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors?.join(", ") || "매물 등록 실패");
  }

  return res.json();
}
