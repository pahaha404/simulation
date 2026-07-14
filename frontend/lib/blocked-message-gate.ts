export function createBlockedMessageGate() {
  let active = false

  return {
    acquire() {
      if (active) return false
      active = true
      return true
    },
    release() {
      active = false
    },
    isActive() {
      return active
    },
  }
}

export type BlockedMessageGate = ReturnType<typeof createBlockedMessageGate>
