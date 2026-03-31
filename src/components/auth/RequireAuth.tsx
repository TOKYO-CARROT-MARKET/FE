"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store";

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.replace(`/login?redirect_path=${pathname}`);
    }
  }, [isInitialized, isLoading, user, router, pathname]);

  if (!isInitialized || isLoading) {
    return <div className="p-8 text-sm text-neutral-500">확인 중...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
