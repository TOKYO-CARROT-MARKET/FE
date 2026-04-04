import type { AuthUser } from "./types";
import type { Item } from "@/features/item/types";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { removeRefreshToken } from "@/lib/token";
import { useAuthStore } from "./store";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export function getGoogleOAuthStartUrl(redirectPath?: string) {
  const query = redirectPath
    ? `?redirect_path=${encodeURIComponent(redirectPath)}`
    : "";

  return `${API_URL}/auth/google${query}`;
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetchWithAuth(`${API_URL}/api/v1/me`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("인증되지 않은 사용자");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  removeRefreshToken();
  useAuthStore.getState().clearUser();
}

export async function getMyItems(): Promise<Item[]> {
  const res = await fetchWithAuth(`${API_URL}/api/v1/my/items`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("내 매물 조회 실패");
  }

  return res.json();
}
