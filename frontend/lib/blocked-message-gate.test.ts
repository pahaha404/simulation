import test from "node:test"
import assert from "node:assert/strict"
import { createBlockedMessageGate } from "./blocked-message-gate.ts"

test("blocked message gate counts only one warning while active", () => {
  const gate = createBlockedMessageGate()

  assert.equal(gate.acquire(), true)
  assert.equal(gate.acquire(), false)
  assert.equal(gate.isActive(), true)
})

test("blocked message gate can count a new warning after release", () => {
  const gate = createBlockedMessageGate()

  assert.equal(gate.acquire(), true)
  gate.release()

  assert.equal(gate.isActive(), false)
  assert.equal(gate.acquire(), true)
})
