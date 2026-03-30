import Link from "next/link";
import ItemCard from "@/components/item/ItemCard";
import { getItems } from "@/features/item/api";
import { Item } from "@/features/item/types";

export default async function HomePage() {
  let items: Item[] = [];
  try {
    items = await getItems();
  } catch (e) {}
  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-4xl bg-white p-8 shadow-sm ring-1 ring-black/5 lg:grid-cols-2 lg:p-12">
        <div className="flex flex-col justify-center space-y-6">
          <div className="inline-flex w-fit items-center rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
            🇰🇷 일본 거주 한국인 전용 귀국짐 플랫폼
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 lg:text-5xl">
              귀국 전에 정리하고,
              <br />
              새로 시작하는 사람에게
              <br />
              자연스럽게 넘겨요
            </h1>
            <p className="max-w-xl text-base leading-7 text-neutral-600">
              귀국 직전까지 써야 하는 냉장고, 책상, 밥솥, 생활용품을 한국어로
              쉽게 올리고, 가까운 지역 사람과 편하게 거래할 수 있어요.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/items"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              매물 보러 가기
            </Link>
            <Link
              href="/sell"
              className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
            >
              내 물건 등록하기
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-[2rem] bg-[#f7f7fb] p-6">
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">
                이번 주 인기 지역
              </p>
              <p className="mt-2 text-2xl font-bold text-neutral-900">
                신주쿠 · 오쿠보 · 다카다노바바
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">
                많이 찾는 카테고리
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["가전", "가구", "주방", "생활용품", "스타터팩"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-neutral-500">서비스 톤</p>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                딱딱한 중고거래보다, 일본 생활을 정리하고 시작하는 사람을
                이어주는 가볍고 친근한 느낌으로 만들어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              최근 올라온 매물
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              지금 올라온 귀국짐
            </h2>
          </div>

          <Link
            href="/items"
            className="text-sm font-semibold text-neutral-700 underline underline-offset-4"
          >
            전체 보기
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
