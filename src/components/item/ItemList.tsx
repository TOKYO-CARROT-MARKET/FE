import { Item } from "@/features/item/types";
import ItemCard from "@/components/item/ItemCard";

interface ItemListProps {
  items: Item[];
}

export default function ItemsList({ items }: ItemListProps) {
  return (
    <section className="space-y-8">
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-neutral-500">
          아직 등록된 매물이 없어요.
        </div>
      ) : (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
