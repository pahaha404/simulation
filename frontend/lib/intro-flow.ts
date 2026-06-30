export const INTRO_SPLASH_IMAGE = "/backgrounds/intro.png"

export type IntroPhase = "splash" | "story"
export type IntroKeyAction = "start-story" | "advance-story"

export function shouldStartIntroFromKey(_event: Pick<KeyboardEvent, "key">) {
  return true
}

export function getIntroKeyAction(phase: IntroPhase): IntroKeyAction {
  return phase === "splash" ? "start-story" : "advance-story"
}
