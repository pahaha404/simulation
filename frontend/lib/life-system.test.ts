import test from "node:test"
import assert from "node:assert/strict"
import { getRemainingLives, isGameOver, MAX_LIVES } from "./life-system.ts"

test("life system starts with three lives", () => {
  assert.equal(MAX_LIVES, 3)
  assert.equal(getRemainingLives(0), 3)
})

test("life system loses one life per warning", () => {
  assert.equal(getRemainingLives(1), 2)
  assert.equal(getRemainingLives(2), 1)
})

test("life system reaches game over after three warnings", () => {
  assert.equal(getRemainingLives(3), 0)
  assert.equal(isGameOver(2), false)
  assert.equal(isGameOver(3), true)
})
