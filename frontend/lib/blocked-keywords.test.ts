import test from "node:test"
import assert from "node:assert/strict"
import { evaluateBlockedMessage, hasBlockedKeyword } from "./blocked-keywords.ts"

test("detailed block detects private address probing", () => {
  const result = evaluateBlockedMessage("너 집 주소랑 동네 어디야?")

  assert.equal(result.blocked, true)
  assert.equal(result.category, "privacy")
  assert.equal(result.severity, "critical")
  assert.match(result.reason, /개인정보|사생활/)
})

test("detailed block detects reply pressure", () => {
  const result = evaluateBlockedMessage("왜 답장 늦어 빨리 답장해")

  assert.equal(result.blocked, true)
  assert.equal(result.category, "pressure")
  assert.match(result.reason, /재촉|압박/)
})

test("detailed block detects low effort replies", () => {
  const result = evaluateBlockedMessage("ㅇㅇ")

  assert.equal(result.blocked, true)
  assert.equal(result.category, "low_effort")
})

test("detailed block detects politics and religion as value conflict", () => {
  const result = evaluateBlockedMessage("종교랑 정치 성향 알려줘")

  assert.equal(result.blocked, true)
  assert.equal(result.category, "values")
})

test("natural concern is not blocked", () => {
  assert.equal(hasBlockedKeyword("오늘 많이 걱정됐어. 몸은 좀 괜찮아?"), false)
})
