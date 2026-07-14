"use client"

import Image from "next/image"
import { Home } from "lucide-react"
import { ChatRoom } from "@/components/chat-room"
import type { Character } from "@/lib/characters"
import type { Message, TimeMode } from "@/app/page"

type Props = {
  character: Character
  messages: Message[]
  warningCount: number
  timeMode: TimeMode
  virtualTime: Date
  onBack: () => void
  onSend: (text: string) => Promise<void> | void
  onBlockedMessage: () => void
  onRetry: () => void
}

export function GameLobby({
  character,
  messages,
  warningCount,
  timeMode,
  virtualTime,
  onBack,
  onSend,
  onBlockedMessage,
  onRetry,
}: Props) {
  return (
    <div
      className="relative flex min-h-dvh w-full flex-col overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Background */}
      <Image
        src="/backgrounds/lobby.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-background/40 to-background/70 backdrop-blur-sm" />

      {/* Title */}
      <header className="relative z-10 flex items-center justify-center px-4 pt-4 pb-2">
        <h1 className="text-balance text-center text-lg font-black tracking-tight md:text-xl">
          <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ color: "#ff6eb4" }}>
            메챠 야바이!
          </span>
          <span className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {" "}금지어 러브채팅
          </span>
          <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" style={{ color: "#e879f9" }}>
            ⭐
          </span>
        </h1>
      </header>

      {/* Main — 3-column: [left] [phone] [large standee] */}
      <main className="relative z-10 flex flex-1 items-center justify-center gap-4 overflow-hidden px-4 py-3 xl:gap-6">

        {/* LEFT: 캐릭터 프로필 */}
        <aside className="hidden h-[min(76svh,43rem)] w-80 shrink-0 flex-col items-stretch lg:flex xl:w-96">
          <CharacterInfoCard character={character} />
        </aside>

        {/* CENTER: 폰 프레임 — 항상 그룹의 중심 */}
        <div
          className="relative shrink-0"
          style={{
            height: "min(calc(100svh - 8rem), calc(100vw * 19 / 8.4))",
            aspectRatio: "9 / 19",
          }}
        >
          <PhoneFrame>
            <ChatRoom
              character={character}
              messages={messages}
              warningCount={warningCount}
              timeMode={timeMode}
              virtualTime={virtualTime}
              onBack={onBack}
              onSend={onSend}
              onBlockedMessage={onBlockedMessage}
              onRetry={onRetry}
            />
          </PhoneFrame>
        </div>

        {/* RIGHT: 캐릭터 스탠디 */}
        <aside className="hidden w-72 shrink-0 flex-col items-center justify-end xl:flex 2xl:w-80">
          <CharacterStandee character={character} />
        </aside>
      </main>

      {/* 하단 — 홈 버튼만 */}
      <nav
        className="relative z-10 flex items-center justify-center border-t border-primary/20 bg-card/80 px-2 py-2 backdrop-blur-md"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={onBack}
          className="flex flex-col items-center gap-0.5 rounded-xl px-8 py-1.5 text-[11px] font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="size-5" />
          홈
        </button>
      </nav>
    </div>
  )
}

/* ─── 좌측: 캐릭터 정보 카드 ─────────────────────────── */

function CharacterInfoCard({ character }: { character: Character }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-primary/20 bg-zinc-950/75 shadow-2xl backdrop-blur-md">
      <div className="relative h-44 shrink-0 overflow-hidden border-b border-white/10">
        <Image
          src={character.standee || character.avatar || "/placeholder.svg"}
          alt=""
          fill
          sizes="384px"
          className="object-cover object-top opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/35 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-black/40 shadow-xl">
            <Image
              src={character.avatar || "/placeholder.svg"}
              alt={character.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-2xl font-black text-white">{character.name}</p>
            <p className="truncate text-sm font-bold" style={{ color: character.glow }}>
              {character.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
        <section>
          <h2 className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            Profile
          </h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-200">
            {character.personality}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <ProfileList title="좋아하는 것" items={character.likes} tone="like" />
          <ProfileList title="싫어하는 것" items={character.dislikes} tone="dislike" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
          <h3 className="text-xs font-black uppercase tracking-[0.18em] text-zinc-400">
            Talk Guide
          </h3>
          <ul className="mt-3 space-y-2">
            {character.profileNotes.map((note) => (
              <li key={note} className="rounded-xl bg-black/25 px-3 py-2 text-xs font-semibold leading-relaxed text-zinc-200">
                {note}
              </li>
            ))}
          </ul>
        </section>

        <div
          className="mt-auto rounded-2xl border px-4 py-3 text-center text-sm font-black"
          style={{
            borderColor: character.glow,
            color: character.glow,
            backgroundColor: `${character.glow}18`,
          }}
        >
          {character.aura}
        </div>
      </div>
    </div>
  )
}

function ProfileList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: "like" | "dislike"
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <h3 className="text-xs font-black text-zinc-300">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-zinc-200">
            <span
              className="mt-1 size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: tone === "like" ? "oklch(0.75 0.16 145)" : "oklch(0.68 0.2 25)" }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── 중앙: 폰 프레임 ────────────────────────────────── */

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full">
      {/* 글로우 */}
      <div className="absolute -inset-2 rounded-[2.75rem] bg-gradient-to-b from-primary/30 to-fuchsia-400/20 blur-xl" />
      <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/85 bg-foreground/90 shadow-2xl">
        {/* 노치 */}
        <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/85" />
        {/* 스크린 — pt-5 로 노치 아래부터 콘텐츠 시작 */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-background pt-5">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── 우측: 캐릭터 스탠디 ────────────────────────────── */

function CharacterStandee({ character }: { character: Character }) {
  return (
    <div className="relative flex h-[min(76svh,43rem)] w-full items-end">
      {/* 오라 글로우 */}
      <div
        className="absolute -bottom-6 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: character.glow, opacity: 0.45 }}
      />

      {/* 카드 */}
      <div
        className="relative h-full w-full overflow-hidden rounded-[1.75rem] border-2 shadow-2xl"
        style={{
          borderColor: character.glow,
          boxShadow: `0 0 42px ${character.glow}66`,
        }}
      >
        <Image
          src={character.standee || "/placeholder.svg"}
          alt={`${character.name} 캐릭터 일러스트`}
          fill
          sizes="(min-width:1536px) 20rem, 18rem"
          className="object-contain object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {/* 이름 태그 */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-card/40 bg-card/85 px-3 py-1.5 text-center shadow-lg backdrop-blur-md">
          <p className="text-sm font-black text-foreground">{character.name}</p>
          <p className="text-[10px] font-bold" style={{ color: character.glow }}>
            {character.aura}
          </p>
        </div>
      </div>
    </div>
  )
}
