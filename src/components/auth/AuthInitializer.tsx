"use client";

import { useEffect } from "react";
import { getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import { getRefreshToken } from "@/lib/token";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setIsInitialized = useAuthStore((state) => state.setIsInitialized);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    async function init() {
      // refresh token이 없으면 로그인 상태가 아님
      if (!getRefreshToken()) {
        setIsInitialized(true);
        return;
      }

      setIsLoading(true);

      try {
        // refresh token으로 새 access token 발급
        const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: getRefreshToken() }),
        });

        if (!refreshRes.ok) {
          clearUser();
          return;
        }

        const { access_token } = await refreshRes.json();
        setAccessToken(access_token);

        // 발급된 access token으로 유저 정보 조회
        const user = await getMe();
        setUser(user);
      } catch {
        clearUser();
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
