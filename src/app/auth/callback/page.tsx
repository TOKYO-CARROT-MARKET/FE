"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setRefreshToken } from "@/lib/token";
import { getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsInitialized = useAuthStore((state) => state.setIsInitialized);

  useEffect(() => {
    async function handleCallback() {
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const redirectPath = searchParams.get("redirect_path") ?? "/";

      if (!accessToken || !refreshToken) {
        router.replace("/login?error=auth_failed");
        return;
      }

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      try {
        const user = await getMe();
        setUser(user);
        setIsInitialized(true);
      } catch {
        // 토큰은 저장했으니 다음 페이지에서 AuthInitializer가 처리
      }

      router.replace(redirectPath);
    }

    handleCallback();
  }, [searchParams, router, setUser, setAccessToken, setIsInitialized]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-neutral-500">로그인 처리 중...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-neutral-500">로딩 중...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
