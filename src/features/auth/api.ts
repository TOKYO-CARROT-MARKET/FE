import type { AuthUser } from "./types";
import type { Item } from "@/features/item/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function signup(input: {
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ user: input }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.errors?.join(", ") || "회원가입 실패");
  }

  return res.json();
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || "로그인 실패");
  }

  return res.json();
}

export async function getMe(): Promise<AuthUser> {
  const res = await fetch(`${API_URL}/api/v1/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("인증되지 않은 사용자");
  }

  return res.json();
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/logout`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("로그아웃 실패");
  }
}

export async function getMyItems(): Promise<Item[]> {
  const res = await fetch(`${API_URL}/api/v1/my/items`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("내 매물 조회 실패");
  }

  return res.json();
}
