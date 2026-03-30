import Link from "next/link";
import type { Item, ItemStatus } from "@/features/item/types";

interface ItemCardProps {
  item: Item;
}

const statusMap: Record<ItemStatus, { label: string; className: string }> = {
  selling: {
    label: "판매중",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  reserved: {
    label: "예약중",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  sold: {
    label: "판매완료",
    className: "bg-neutral-100 text-neutral-500 border-neutral-200",
  },
};

const pickupTypeLabel: Record<Item["pickup_type"], string> = {
  pickup: "직접 수령",
  delivery: "배송 가능",
  both: "직접 수령 / 배송",
};

export default function ItemCard({ item }: ItemCardProps) {
  const status = statusMap[item.status];
  const imageUrl = item.images?.[0] || "/placeholder-item.png";

  return (
    <Link
      href={`/items/${item.id}`}
      className="group block overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div
          className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <h3 className="text-lg font-bold">{item.title}</h3>
        <p>{item.price.toLocaleString("ko-KR")}엔</p>
        <p className="text-sm text-neutral-500">{item.region}</p>
      </div>
    </Link>
  );
}
