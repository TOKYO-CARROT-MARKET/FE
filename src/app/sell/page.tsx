"use client";

import { useRef, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { createItem } from "@/features/item/api";
import { uploadImage } from "@/lib/uploadImage";
import { TOKYO_WARDS } from "@/constants/region";
import { ITEMS_CATEGORY } from "@/constants/category";
import CustomLabel from "@/components/common/Label";

export default function SellPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    region: "",
    pickup_type: "pickup" as "pickup" | "delivery",
    available_from: "",
    departure_date: "",
    status: "selling" as "selling" | "reserved" | "sold",
  });

  const [wardSelect, setWardSelect] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function updateField(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      setMessage("사진은 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    setIsUploading(true);
    setMessage("");

    try {
      const urls = await Promise.all(files.map(uploadImage));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setMessage("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        images,
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
      setWardSelect("");
      setImages([]);
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
          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">
              사진 <span className="text-neutral-400">({images.length}/5)</span>
            </p>

            <div className="flex flex-wrap gap-2">
              {images.map((url, i) => (
                <div key={url} className="relative h-24 w-24">
                  <img
                    src={url}
                    alt={`업로드 이미지 ${i + 1}`}
                    className="h-full w-full rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-neutral-200 text-neutral-400 hover:border-neutral-400 disabled:opacity-50"
                >
                  {isUploading ? (
                    <span className="text-xs">업로드 중...</span>
                  ) : (
                    <>
                      <span className="text-2xl">+</span>
                      <span className="text-xs">사진 추가</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <CustomLabel id="title" label="제목" />
          <input
            id="title"
            value={form.title}
            required
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="판매할 상품명을 입력해주세요"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />

          <CustomLabel id="description" label="상품 설명" />
          <textarea
            id="description"
            value={form.description}
            required
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="상품 설명을 작성해주세요!"
            className="min-h-32 w-full rounded-xl border border-neutral-200 p-3"
          />
          <CustomLabel id="price" label="가격 (단위: 엔)" />
          <input
            type="number"
            id="price"
            required
            value={form.price}
            onChange={(e) => updateField("price", e.target.value)}
            placeholder="가격"
            className="w-full rounded-xl border border-neutral-200 p-3"
          />
          <CustomLabel id="region" label="지역" />
          <select
            id="region"
            value={wardSelect}
            required
            onChange={(e) => {
              setWardSelect(e.target.value);
              if (e.target.value !== "직접 입력") {
                updateField("region", e.target.value);
              } else {
                updateField("region", "");
              }
            }}
            className="w-full rounded-xl border border-neutral-200 p-3"
          >
            <option value="" disabled>
              지역 선택
            </option>
            {TOKYO_WARDS.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>

          {wardSelect === "직접 입력" && (
            <input
              value={form.region}
              required
              onChange={(e) => updateField("region", e.target.value)}
              placeholder="지역을 직접 입력해주세요"
              className="w-full rounded-xl border border-neutral-200 p-3"
            />
          )}

          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <CustomLabel id="category" label="카테고리" />
              <select
                id="category"
                value={form.category}
                required
                onChange={(e) => {
                  updateField("category", e.target.value);
                }}
                className="w-full rounded-xl border border-neutral-200 p-3"
              >
                <option value="" disabled>
                  카테고리
                </option>
                {ITEMS_CATEGORY.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <CustomLabel id="pickup_type" label="거래 방법" />
              <select
                id="pickup_type"
                value={form.pickup_type}
                onChange={(e) => updateField("pickup_type", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 p-3"
              >
                <option value="pickup">직접 수령</option>
                <option value="delivery">배송 가능</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex-1">
              <CustomLabel id="available_from" label="거래 시작일" />
              <input
                id="available_from"
                type="date"
                value={form.available_from}
                onChange={(e) => updateField("available_from", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 p-3"
              />
            </div>

            <div className="flex-1">
              <CustomLabel id="departure_date" label="거래 마감일" />
              <input
                id="departure_date"
                type="date"
                value={form.departure_date}
                onChange={(e) => updateField("departure_date", e.target.value)}
                className="w-full rounded-xl border border-neutral-200 p-3"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="w-full rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? "등록 중..." : "등록하기"}
          </button>

          {message && <p className="text-sm text-neutral-700">{message}</p>}
        </form>
      </section>
    </RequireAuth>
  );
}
