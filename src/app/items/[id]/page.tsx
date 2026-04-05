import { getItem } from "@/features/item/api";
import ImageCarousel from "@/components/item/ImageCarousel";
import LikeButton from "@/components/item/LikeButton";
import CountDown from "@/components/item/CountDown";
import dayjs from "@/lib/dayjs";

const STATUS_LABEL = {
  selling: { label: "판매중", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  reserved: { label: "예약중", className: "bg-amber-50 text-amber-700 border-amber-200" },
  sold: { label: "판매완료", className: "bg-neutral-100 text-neutral-500 border-neutral-200" },
} as const;

const PICKUP_LABEL = {
  pickup: "직접 수령",
  delivery: "배송 가능",
  both: "직접 수령 / 배송",
} as const;

type PageProps = { params: Promise<{ id: string }> };

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItem(id);

  const status = STATUS_LABEL[item.status];

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {/* 이미지 캐러셀 */}
        <ImageCarousel images={item.images} title={item.title} />

        <div className="space-y-6 p-6">
          {/* 타이틀 + 상태 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-500">{item.category}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">{item.title}</h1>
            <p className="text-2xl font-extrabold">
              {item.price.toLocaleString("ko-KR")}엔
            </p>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-sky-50 px-3 py-1 text-sky-700">
              📍 {item.region}
            </span>
            <span className="rounded-full bg-violet-50 px-3 py-1 text-violet-700">
              📦 {PICKUP_LABEL[item.pickup_type]}
            </span>
          </div>

          {/* 거래 일정 */}
          <div className="grid gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">거래 시작일</span>
              <span className="font-medium">
                {item.available_from
                  ? dayjs(item.available_from).format("YYYY년 M월 D일")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">귀국 예정일</span>
              <span className="font-medium">
                {item.departure_date ? (
                  <span className="flex items-center gap-2">
                    {dayjs(item.departure_date).format("YYYY년 M월 D일")}
                    <CountDown date={item.departure_date} />
                  </span>
                ) : "-"}
              </span>
            </div>
          </div>

          {/* 설명 */}
          <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-7 text-neutral-700 whitespace-pre-wrap">
            {item.description}
          </div>

          {/* 조회수 + 좋아요 + 수정시간 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <span>👁 {item.views_count.toLocaleString()}</span>
              <span>·</span>
              <span>{dayjs(item.updated_at).fromNow()} 수정됨</span>
            </div>
            <LikeButton
              itemId={item.id}
              initialLiked={item.liked_by_current_user}
              initialCount={item.likes_count}
            />
          </div>
        </div>
      </div>

      {/* 채팅 버튼 */}
      <div className="sticky bottom-4">
        <button
          disabled
          className="w-full rounded-2xl bg-neutral-900 py-4 text-base font-semibold text-white opacity-60"
        >
          💬 채팅하기 (준비 중)
        </button>
      </div>
    </section>
  );
}
