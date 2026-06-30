import test from "node:test"
import assert from "node:assert/strict"
import { getIntroKeyAction, INTRO_SPLASH_IMAGE, shouldStartIntroFromKey } from "./intro-flow.ts"

test("intro starts on the requested splash image", () => {
  assert.equal(INTRO_SPLASH_IMAGE, "/backgrounds/intro.png")
})

test("any key starts the intro", () => {
  assert.equal(shouldStartIntroFromKey({ key: "a" }), true)
  assert.equal(shouldStartIntroFromKey({ key: "Enter" }), true)
  assert.equal(shouldStartIntroFromKey({ key: "Escape" }), true)
})

test("a key press on the splash starts the story sequence", () => {
  assert.equal(getIntroKeyAction("splash"), "start-story")
})

test("a key press during the story advances the opening sequence", () => {
  assert.equal(getIntroKeyAction("story"), "advance-story")
})
