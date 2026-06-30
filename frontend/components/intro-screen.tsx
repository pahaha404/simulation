"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { INTRO_SPLASH_IMAGE, shouldStartIntroFromKey } from "@/lib/intro-flow"

type Props = {
  onStart: () => void
}

export function IntroScreen({ onStart }: Props) {
  const [exiting, setExiting] = useState(false)

  const startGame = useCallback(() => {
    if (exiting) return
    setExiting(true)
    window.setTimeout(onStart, 180)
  }, [exiting, onStart])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shouldStartIntroFromKey(event)) return
      if (event.key === " ") event.preventDefault()
      startGame()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [startGame])

  return (
    <section
      aria-label="게임 인트로"
      className={`relative min-h-dvh w-full overflow-hidden bg-black transition-opacity duration-200 motion-reduce:transition-none ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <Image
        src={INTRO_SPLASH_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <button
        type="button"
        onClick={startGame}
        aria-label="게임 시작"
        className="absolute inset-0 z-10 cursor-pointer bg-transparent focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-primary"
      />
    </section>
  )
}
