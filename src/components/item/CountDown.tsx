"use client";

import { useEffect, useState } from "react";
import dayjs from "@/lib/dayjs";

interface CountDownProps {
  date: string;
}

/** 날짜만 넘어온 경우("2026-04-10") 해당 날 24시(= 다음날 00:00)를 마감으로 사용 */
function parseDeadline(date: string): dayjs.Dayjs {
  const d = dayjs(date);
  if (date.length === 10) {
    return d.add(1, "day").startOf("day");
  }
  return d;
}

export default function CountDown({ date }: CountDownProps) {
  const deadline = parseDeadline(date);
  const isNearDay = deadline.diff(dayjs(), "day") < 3;

  const remaining = dayjs().diff(deadline, "day");

  if (!isNearDay) return null;

  return remaining > 0 ? (
    <div className="flex justify-between bg-gray-100 text-xs  font-medium">
      <span>종료일 임박 </span>
      <span className="text-orange-700 ">{remaining}일후 마감</span>
    </div>
  ) : (
    <div className="flex  text-xs">
      <span className="text-red-700 font-medium">
        판매자가 지정한 판매날짜를 지났어요!!
      </span>
    </div>
  );
}
