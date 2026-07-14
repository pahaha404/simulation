"use client"

import Image from "next/image"
import { Heart, Sparkles } from "lucide-react"
import { characters, type Character } from "@/lib/characters"
import { cn } from "@/lib/utils"

type Props = {
  onSelect: (character: Character) => void
}

export function CharacterSelection({ onSelect }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center px-4 py-10">
      {/* Header */}
      <header className="mb-7 flex flex-col items-center text-center">
        <div className="mb-3 flex size-14 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg shadow-primary/40">
          <Heart className="size-7 fill-current" />
        </div>
        <h1 className="text-pretty font-heading text-3xl font-black tracking-tight text-foreground [text-shadow:0_1px_10px_oklch(0.7_0.16_0/0.25)]">
          여자친구를 선택하세요
        </h1>
        <p className="mt-2 max-w-xs text-balance text-sm leading-relaxed text-muted-foreground">
          병원에서 나를 기다리던 네 명 중 한 명과 첫날의 채팅을 시작하세요
        </p>
      </header>

      {/* Character grid */}
      <section className="w-full max-w-md">
        <div className="mb-3 flex items-center gap-1.5 px-1">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">여자친구 후보</h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          {characters.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className="group overflow-hidden rounded-3xl border border-primary/30 bg-card/80 text-left shadow-lg shadow-primary/10 ring-1 ring-card/50 backdrop-blur-md transition-all hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className={cn("relative aspect-square w-full bg-gradient-to-br", c.accent)}>
                <Image
                  src={c.avatar || "/placeholder.svg"}
                  alt={`${c.name} 프로필 이미지`}
                  fill
                  sizes="(max-width: 768px) 50vw, 220px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent" />
              </div>
              <div className="p-3">
                <h3 className="font-heading text-base font-bold text-foreground">{c.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {c.personality}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-[11px] text-muted-foreground">모든 대화는 가상입니다</p>
    </div>
  )
}
