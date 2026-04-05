import type { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return Response.json({ error: "API_URL not configured" }, { status: 500 });
  }

  const sp = request.nextUrl.searchParams;
  const params = new URLSearchParams();

  // 그대로 전달
  for (const key of ["q", "region", "category", "status"]) {
    const val = sp.get(key);
    if (val) params.set(key, val);
  }
  // camelCase → snake_case
  if (sp.get("priceMin")) params.set("price_min", sp.get("priceMin")!);
  if (sp.get("priceMax")) params.set("price_max", sp.get("priceMax")!);
  if (sp.get("availableDate")) params.set("available_date", sp.get("availableDate")!);

  // 페이지네이션
  params.set("limit", sp.get("limit") ?? "20");
  params.set("offset", sp.get("offset") ?? "0");

  try {
    const res = await fetch(`${API_URL}/api/v1/items?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("upstream error");
    return Response.json(await res.json());
  } catch {
    return Response.json({ error: "매물 목록 조회 실패" }, { status: 502 });
  }
}
