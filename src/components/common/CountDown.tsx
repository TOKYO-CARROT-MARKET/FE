"use client";

import { useEffect, useRef, useState } from "react";

interface CountDownProps {
  date: string;
}

const HOUR = 60 * 60 * 1_000;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

type Remaining =
  | { type: "year"; years: number }
  | { type: "month"; months: number }
  | { type: "day"; days: number }
  | { type: "nearDay"; days: number }
  | { type: "hour"; hours: number };

/** 날짜만 넘어온 경우("2026-04-10") 해당 날 24시(= 다음날 00:00)를 마감으로 사용 */
function parseDeadline(date: string): number {
  const d = new Date(date);
  if (date.length === 10) {
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
  }
  return d.getTime();
}

function computeRemaining(diff: number): Remaining | null {
  if (diff <= 0) return null;
  if (diff >= YEAR) return { type: "year", years: Math.floor(diff / YEAR) };
  if (diff >= MONTH) return { type: "month", months: Math.floor(diff / MONTH) };
  if (diff >= 5 * DAY) return { type: "day", days: Math.floor(diff / DAY) };
  if (diff > DAY) return { type: "nearDay", days: Math.floor(diff / DAY) };
  return { type: "hour", hours: Math.floor(diff / HOUR) };
}

function format(r: Remaining): string {
  switch (r.type) {
    case "year":
      return `${r.years}년 마감`;
    case "month":
      return `${r.months}달 마감`;
    case "day":
      return `${r.days}일 마감`;
    case "nearDay":
      return `${r.days}일 마감`;
    case "hour":
      return `${r.hours}시간 마감`;
  }
}

function needsUpdate(r: Remaining): boolean {
  return r.type === "nearDay" || r.type === "hour";
}

export default function CountDown({ date }: CountDownProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(() =>
    computeRemaining(parseDeadline(date) - Date.now()),
  );
  const [tick, setTick] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function schedule() {
      const diff = parseDeadline(date) - Date.now();
      const next = computeRemaining(diff);
      setRemaining(next);
      if (next && needsUpdate(next)) {
        setTick((t) => t + 1);
        timeoutRef.current = setTimeout(schedule, HOUR);
      }
    }

    const diff = parseDeadline(date) - Date.now();
    const initial = computeRemaining(diff);
    if (initial && needsUpdate(initial)) {
      timeoutRef.current = setTimeout(schedule, HOUR);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [date]);
  if (!remaining) return null;

  return (
    <p
      key={tick}
      className="text-right text-xs font-medium"
      style={
        needsUpdate(remaining)
          ? { animation: "countdown-tick 0.25s ease-out", color: "red" }
          : undefined
      }
    >
      {format(remaining)}
    </p>
  );
}
