export const MAX_LIVES = 3

export function getRemainingLives(warningCount: number) {
  return Math.max(0, MAX_LIVES - warningCount)
}

export function isGameOver(warningCount: number) {
  return getRemainingLives(warningCount) <= 0
}
