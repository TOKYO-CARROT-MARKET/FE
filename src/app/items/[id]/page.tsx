import { getItem } from "@/features/item/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItem(id);
  const imageUrl = item.images?.[0] || "/placeholder-item.png";
  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        <div className="aspect-[4/3] bg-neutral-100">
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-2">
            <p className="text-sm text-neutral-500">{item.category}</p>
            <h1 className="text-3xl font-bold text-neutral-900">
              {item.title}
            </h1>
            <p className="text-2xl font-extrabold">
              {item.price.toLocaleString("ko-KR")}엔
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
              📍 {item.region}
            </span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
              📦 {item.pickup_type}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              상태: {item.status}
            </span>
          </div>

          <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
            {item.description}
          </div>

          <div className="grid gap-3 rounded-2xl border border-neutral-200 p-4 text-sm">
            <p>
              <span className="font-semibold">수령 가능일:</span>{" "}
              {item.available_from || "-"}
            </p>
            <p>
              <span className="font-semibold">귀국 예정일:</span>{" "}
              {item.departure_date || "-"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
