"use client";

import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { createItem } from "@/features/item/api";

export default function SellPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    region: "",
    pickup_type: "pickup" as "pickup" | "delivery" | "both",
    available_from: "",
    departure_date: "",
    status: "selling" as "selling" | "reserved" | "sold",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const created = await createItem({
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        region: form.region,
        pickup_type: form.pickup_type,
        available_from: form.available_from || undefined,
        departure_date: form.departure_date || undefined,
        status: form.status,
      });

      setMessage(`등록 완료: ${created.title}`);
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
        region: "",
        pickup_type: "pickup",
        available_from: "",
        departure_date: "",
        status: "selling",
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "등록 중 오류가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <RequireAuth>
      <section className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">물건 등록</h1>
          <p className="mt-2 text-sm text-neutral-600">
            귀국 전에 정리할 물건을 등록해보세요.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm"
        >
          <input
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="제목"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="설명"
            className="min-h-32 w-full rounded-xl border border-neutral-200 p-3"
          />

          <input
            type="number"
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="가격"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <input
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
            placeholder="카테고리"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <input
            value={form.region}
            onChange={(e) => updateField("region", e.target.value)}
            placeholder="지역"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <select
            value={form.pickup_type}
            onChange={(e) => updateField("pickup_type", e.target.value)}
            className="w-full rounded-xl border border-neutral-200 p-3"
          >
            <option value="pickup">직접 수령</option>
            <option value="delivery">배송 가능</option>
            <option value="both">직접 수령 / 배송</option>
          </select>

          <input
            type="date"
            value={form.available_from}
            onChange={(e) => updateField("available_from", e.target.value)}
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <input
            type="date"
            value={form.departure_date}
            onChange={(e) => updateField("departure_date", e.target.value)}
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </button>

          {message && <p className="text-sm text-neutral-700">{message}</p>}
        </form>
      </section>
    </RequireAuth>
  );
}
