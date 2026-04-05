"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

const navItems = [
  { href: "/items", label: "매물 보기" },
  { href: "/sell", label: "물건 등록" },
  { href: "/my", label: "마이페이지" },
];

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  function handleLogout() {
    logout();
    clearUser();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-xl shadow-sm">
            🚚
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold text-neutral-900">귀국짐</p>
            <p className="text-xs text-neutral-500">
              도쿄 거주 한국인 귀국짐 거래
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden text-sm text-neutral-600 sm:inline">
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 text-nowrap transition hover:bg-neutral-50 "
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 text-nowrap transition hover:bg-neutral-50"
            >
              로그인
            </Link>
          )}

          {/* <Link
            href="/sell"
            className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white text-nowrap transition hover:opacity-90"
          >
            등록하기
          </Link> */}
        </div>
      </div>
    </header>
  );
}
