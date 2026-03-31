"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getGoogleOAuthStartUrl } from "@/features/auth/api";

function LoginContent() {
  const searchParams = useSearchParams();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const redirectPath = searchParams.get("redirect_path") ?? "/";
  const startUrl = getGoogleOAuthStartUrl(redirectPath);

  function handleGoogleLogin() {
    setIsRedirecting(true);
    window.location.href = startUrl;
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">로그인</h1>
        <p className="mt-2 text-sm text-neutral-600">
          귀국짐 서비스는 구글 계정으로 로그인합니다.
          <br />
          아래 버튼을 눌러 로그인 화면으로 이동해주세요.
        </p>
      </div>

      <div className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isRedirecting}
          className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isRedirecting ? "잠시만 기다려주세요..." : "구글로 로그인"}
        </button>

        <p className="text-xs text-neutral-500">
          구글 로그인 후에는 다시 본 페이지로 돌아오지 않으며, 자동으로 마이페이지로
          안내됩니다.
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-neutral-500">로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
