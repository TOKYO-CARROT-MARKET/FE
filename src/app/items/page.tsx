import ItemCard from "@/components/item/ItemCard";
import { getItems } from "@/features/item/api";
import { Item } from "@/features/item/types";

export default async function ItemsPage() {
  let items: Item[] = [];
  try {
    items = await getItems();
  } catch (e) {}

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">
          귀국짐 둘러보기
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          일본에서 쓰던 생활용품, 한국어로 편하게 거래해요
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-neutral-600">
          신주쿠, 오쿠보, 다카다노바바처럼 한국인 수요가 많은 지역 중심으로 귀국
          전 정리 매물을 한눈에 볼 수 있어요.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-neutral-500">
          아직 등록된 매물이 없어요.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
