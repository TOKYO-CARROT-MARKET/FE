"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface Props {
  itemId: number;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ itemId, initialLiked, initialCount }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, setIsPending] = useState(false);

  const user = useAuthStore((s) => s.user);

  const toggle = async () => {
    if (!user) {
      alert("로그인이 필요한 기능이에요.");
      return;
    }
    if (isPending) return;

    // 낙관적 업데이트
    setLiked((v) => !v);
    setCount((v) => (liked ? v - 1 : v + 1));
    setIsPending(true);

    try {
      const res = await fetchWithAuth(`${API_URL}/api/v1/items/${itemId}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.likes_count);
      } else {
        // 롤백
        setLiked((v) => !v);
        setCount((v) => (liked ? v + 1 : v - 1));
      }
    } catch {
      setLiked((v) => !v);
      setCount((v) => (liked ? v + 1 : v - 1));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition ${
        liked
          ? "border-rose-300 bg-rose-50 text-rose-600"
          : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
      }`}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count.toLocaleString()}</span>
    </button>
  );
}
