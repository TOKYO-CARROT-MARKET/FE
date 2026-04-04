import { useAuthStore } from "@/features/auth/store";
import { getRefreshToken, removeRefreshToken } from "@/lib/token";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    removeRefreshToken();
    useAuthStore.getState().clearUser();
    return null;
  }

  const { access_token } = await res.json();
  useAuthStore.getState().setAccessToken(access_token);
  return access_token;
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const accessToken = useAuthStore.getState().accessToken;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken ?? ""}`,
    },
  });

  if (res.status !== 401) return res;

  // access token 만료 → refresh 시도
  const newToken = await refreshAccessToken();
  if (!newToken) return res;

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${newToken}`,
    },
  });
}
