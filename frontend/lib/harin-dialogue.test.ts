import test from "node:test"
import assert from "node:assert/strict"
import { getHarinDeterministicReply } from "./harin-dialogue.ts"

const ai = (text: string) => ({ sender: "ai" as const, text })
const user = (text: string) => ({ sender: "user" as const, text })

test("harin comforts hospital anxiety with gentle pacing", () => {
  const reply = getHarinDeterministicReply({
    text: "아직 머리가 아프고 기억이 잘 안 나",
    messages: [ai("괜찮아? 많이 놀랐겠다. 천천히 말해도 돼.")],
  })

  assert.match(reply, /천천히|급하게/)
  assert.match(reply, /병원|아프|괜찮/)
})

test("harin accepts sincere apology without becoming flirty", () => {
  const reply = getHarinDeterministicReply({
    text: "아까 말 심하게 해서 미안해 진심이야",
    messages: [user("그냥 꺼져"), ai("그런 말은 조금 아파.")],
  })

  assert.match(reply, /미안|사과|고마워/)
  assert.doesNotMatch(reply, /사랑해|키스|결혼/)
})

test("harin remembers a recent walk topic", () => {
  const reply = getHarinDeterministicReply({
    text: "그럼 나중에 같이 산책 갈까?",
    messages: [user("비 오는 날 산책 좋아해?"), ai("조용한 산책은 좋아해.")],
  })

  assert.match(reply, /산책/)
  assert.match(reply, /천천히|좋아|나중/)
})

test("harin answers preference questions with her detailed personality", () => {
  const reply = getHarinDeterministicReply({
    text: "하린이는 뭐 좋아해?",
    messages: [],
  })

  assert.match(reply, /산책|따뜻한 말|솔직/)
  assert.match(reply, /천천히|편하게|차분/)
})

test("harin fallback still sounds like harin instead of a generic rotation", () => {
  const reply = getHarinDeterministicReply({
    text: "오늘은 그냥 네 생각이 났어",
    messages: [user("안녕"), ai("안녕.")],
  })

  assert.match(reply, /듣고|말해|고마워|천천히|여기/)
})

test("harin blends gratitude and fear in one natural reply", () => {
  const reply = getHarinDeterministicReply({
    text: "옆에 있어줘서 고마워 근데 아직 너무 무서워",
    messages: [ai("나 여기 있어. 천천히 말해도 돼.")],
  })

  assert.match(reply, /고마워|고맙|그렇게 말해/)
  assert.match(reply, /무서|불안|천천히|괜찮/)
})

test("harin blends future plans with rain and walking context", () => {
  const reply = getHarinDeterministicReply({
    text: "퇴원하면 비 오는 날 같이 산책 가자",
    messages: [user("비 오는 날 좋아해?"), ai("빗소리 들으면 조금 차분해져.")],
  })

  assert.match(reply, /퇴원|회복/)
  assert.match(reply, /비|우산|빗소리/)
  assert.match(reply, /산책|걷/)
})
