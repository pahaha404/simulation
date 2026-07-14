"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, Send, Heart } from "lucide-react"
import type { Character } from "@/lib/characters"
import { getTimelinePhase } from "@/lib/characters"
import { blockedKeywordWarning, hasBlockedKeyword } from "@/lib/blocked-keywords"
import { getRemainingLives, isGameOver, MAX_LIVES } from "@/lib/life-system"
import { formatKoreanTime } from "@/lib/time"
import type { Message } from "@/app/page"
import { cn } from "@/lib/utils"

type Props = {
  character: Character
  messages: Message[]
  warningCount: number
  virtualTime: Date
  onBack: () => void
  onSend: (text: string) => Promise<void> | void
  onBlockedMessage: () => void
  onRetry: () => void
}

export function ChatRoom({
  character,
  messages,
  warningCount,
  virtualTime,
  onBack,
  onSend,
  onBlockedMessage,
  onRetry,
}: Props) {
  const [draft, setDraft] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const [phaseEvent, setPhaseEvent] = useState<string | null>(null)
  const composingRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const previousPhaseRef = useRef<string | null>(null)

  const userMessageCount = messages.filter((message) => message.sender === "user").length
  const phase = getTimelinePhase(userMessageCount)
  const remainingLives = getRemainingLives(warningCount)
  const gameOver = isGameOver(warningCount)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, isTyping])

  useEffect(() => {
    const previousPhase = previousPhaseRef.current
    previousPhaseRef.current = phase

    if (!previousPhase || previousPhase === phase || userMessageCount === 0) {
      return undefined
    }

    setPhaseEvent(phase)
    const timeoutId = window.setTimeout(() => setPhaseEvent(null), 2600)
    return () => window.clearTimeout(timeoutId)
  }, [phase, userMessageCount])

  async function handleSend() {
    const text = draft.trim()
    if (!text || isTyping || gameOver) return
    if (hasBlockedKeyword(text)) {
      onBlockedMessage()
      setWarning(blockedKeywordWarning)
      window.setTimeout(() => setWarning(null), 3200)
      return
    }
    setDraft("")
    setWarning(null)
    setIsTyping(true)
    try {
      await onSend(text)
    } finally {
      setIsTyping(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !composingRef.current &&
      e.nativeEvent.isComposing !== true &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-card/60">
      {warning && (
        <div
          role="alert"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm animate-warning-overlay"
        >
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border-4 border-red-500 bg-red-950/95 px-6 py-8 text-center shadow-[0_0_60px_rgba(239,68,68,0.75)] animate-warning-card md:px-10 md:py-12">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.12)_48%,transparent_52%)] bg-[length:100%_14px] opacity-30 animate-warning-scan" />
            <div className="relative">
              <p className="mb-4 text-3xl font-black text-red-200 drop-shadow-[0_0_16px_rgba(248,113,113,0.95)] md:text-6xl">
                삐삑 경고입니다!
              </p>
              <p className="text-pretty text-xl font-black leading-relaxed text-white md:text-4xl">
                현재 관계에서 그런 키워드를 이용한 대화는 적절하지 않아요!
              </p>
              <p className="mt-5 text-2xl font-black text-yellow-200 md:text-5xl">
                반성하세요!
              </p>
            </div>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md animate-warning-overlay">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border-4 border-red-500 bg-zinc-950 px-7 py-10 text-center shadow-[0_0_90px_rgba(239,68,68,0.9)] animate-warning-card md:px-12 md:py-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.28),transparent_58%)]" />
            <div className="relative">
              <p className="mb-5 text-4xl font-black text-red-300 drop-shadow-[0_0_18px_rgba(248,113,113,0.95)] md:text-7xl">
                GAME OVER
              </p>
              <p className="text-pretty text-2xl font-black leading-relaxed text-white md:text-5xl">
                당신은 커플이 될 자격이 없습니다....
              </p>
              <p className="mt-6 text-xl font-black leading-relaxed text-yellow-200 md:text-4xl">
                다시 플레이 해보세요! 커플이 되는 그 날 까지 파이팅!!
              </p>
              <button
                type="button"
                onClick={() => {
                  setWarning(null)
                  onRetry()
                }}
                className="mt-8 rounded-full bg-red-500 px-8 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(239,68,68,0.55)] transition-colors hover:bg-red-400"
              >
                다시 도전하기
              </button>
            </div>
          </div>
        </div>
      )}
      {phaseEvent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-6 backdrop-blur-md animate-warning-overlay">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-primary/60 bg-card/95 px-8 py-10 text-center shadow-[0_0_70px_oklch(0.7_0.16_0/0.6)] animate-phase-card md:px-12 md:py-14">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-primary">
              Relationship Updated
            </p>
            <p className="mt-5 text-6xl font-black text-foreground drop-shadow-[0_0_24px_oklch(0.7_0.16_0/0.65)] md:text-8xl">
              {phaseEvent}
            </p>
            <p className="mt-5 text-lg font-bold text-muted-foreground md:text-2xl">
              두 사람의 관계가 다음 단계로 넘어갔습니다.
            </p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-primary/20 bg-card/85 px-3 py-2.5 backdrop-blur-md">
        <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-black text-primary-foreground shadow-md">
          {phase}
        </span>
        <button
          type="button"
          onClick={onBack}
          aria-label="로비로 나가기"
          className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-2.5 py-1.5 text-[11px] font-bold text-secondary-foreground transition-colors hover:bg-primary/15"
        >
          <ArrowLeft className="size-3.5" />
          나가기
        </button>
        <div className="relative size-10 overflow-hidden rounded-full ring-2 ring-primary/20">
          <Image
            src={character.avatar || "/placeholder.svg"}
            alt={`${character.name} 프로필 이미지`}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-foreground">{character.name}</h2>
        </div>
        <div
          aria-label={`남은 목숨 ${remainingLives}개`}
          className="ml-1 flex shrink-0 items-center gap-1 rounded-full border border-red-300/30 bg-black/45 px-2.5 py-1.5 shadow-lg"
        >
          <span className="mr-0.5 text-[10px] font-black text-red-100">목숨</span>
          {Array.from({ length: MAX_LIVES }).map((_, index) => {
            const active = index < remainingLives
            return (
              <Heart
                key={index}
                aria-hidden
                className={cn(
                  "size-4 drop-shadow-[0_0_8px_rgba(248,113,113,0.75)]",
                  active ? "fill-red-400 text-red-400" : "fill-transparent text-red-900",
                )}
              />
            )
          })}
        </div>
      </header>

      {/* Virtual time banner */}
      <div className="flex items-center justify-center gap-1.5 border-b border-border bg-secondary/60 px-3 py-1.5 text-[11px] font-medium text-muted-foreground">
        <span>{formatVirtual(virtualTime)}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        <Image
          src="/backgrounds/classroom.png"
          alt=""
          fill
          sizes="448px"
          className="pointer-events-none object-cover opacity-30"
        />
        <div className="pointer-events-none absolute inset-0 bg-background/40" />
        <div className="relative space-y-3 px-3 py-4">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} character={character} />
          ))}
          {isTyping && <TypingBubble character={character} />}
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-primary/20 bg-card/85 px-3 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => (composingRef.current = true)}
            onCompositionEnd={() => (composingRef.current = false)}
            placeholder={`${character.name}에게 메시지 보내기...`}
            aria-label="메시지 입력"
            disabled={gameOver}
            className="h-11 flex-1 rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!draft.trim() || isTyping || gameOver}
            aria-label="전송"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-all hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, character }: { message: Message; character: Character }) {
  const isUser = message.sender === "user"
  return (
    <div className={cn("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
          <Image
            src={character.avatar || "/placeholder.svg"}
            alt=""
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
      )}
      <div className={cn("flex max-w-[75%] items-end gap-1.5", isUser && "flex-row-reverse")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-sm",
            isUser
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-card text-card-foreground",
          )}
        >
          {message.text}
        </div>
        <time className="mb-0.5 shrink-0 text-[10px] text-muted-foreground">
          {formatKoreanTime(new Date(message.timestamp))}
        </time>
      </div>
    </div>
  )
}

function TypingBubble({ character }: { character: Character }) {
  return (
    <div className="flex items-end gap-2">
      <div className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
        <Image src={character.avatar || "/placeholder.svg"} alt="" fill sizes="32px" className="object-cover" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-card px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </div>
    </div>
  )
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60"
      style={{ animationDelay: delay }}
    />
  )
}

function formatVirtual(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}월 ${day}일 ${formatKoreanTime(date)}`
}
