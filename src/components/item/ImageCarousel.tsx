"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  title: string;
}

export default function ImageCarousel({ images, title }: Props) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="relative aspect-[4/3] bg-neutral-100">
        <Image src="/default.png" fill alt={title} className="object-cover grayscale" />
      </div>
    );
  }

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="relative aspect-[4/3] bg-neutral-100 select-none overflow-hidden">
      <Image
        key={index}
        src={images[index]}
        alt={`${title} ${index + 1}`}
        fill
        className="object-cover animate-fade-in"
        sizes="(max-width: 768px) 100vw, 768px"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xl leading-none text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-xl leading-none text-white backdrop-blur-sm transition hover:bg-black/60"
          >
            ›
          </button>

          {/* 닷 인디케이터 */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}번째 이미지`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>

          <span className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {index + 1} / {images.length}
          </span>
        </>
      )}
    </div>
  );
}
