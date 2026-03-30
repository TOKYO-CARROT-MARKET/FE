"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const user = await login({ email, password });
      setUser(user);
      router.push("/my");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "로그인에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-3xl font-bold">로그인</h1>
        <p className="mt-2 text-sm text-neutral-600">
          귀국짐 서비스를 이용하려면 로그인해주세요.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm"
      >
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 p-3"
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-neutral-200 p-3"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>

        {message && <p className="text-sm text-red-500">{message}</p>}
      </form>
    </section>
  );
}
