"use client";

import { useEffect } from "react";
import { getMe } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

export default function AuthInitializer() {
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const setIsInitialized = useAuthStore((state) => state.setIsInitialized);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    async function init() {
      setIsLoading(true);

      try {
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
  }, [setUser, setIsLoading, setIsInitialized, clearUser]);

  return null;
}
