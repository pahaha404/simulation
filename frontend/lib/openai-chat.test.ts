import test from "node:test"
import assert from "node:assert/strict"
import { buildOpenAiChatPayload } from "./openai-chat.ts"

const ai = (text: string) => ({ sender: "ai" as const, text })
const user = (text: string) => ({ sender: "user" as const, text })

test("harin OpenAI payload includes a detailed dating persona", () => {
  const payload = buildOpenAiChatPayload({
    model: "gpt-test",
    character: {
      id: "harin",
      name: "하린",
      personality: "부드럽고 다정한 힐링형 · 차분하게 마음을 열어요",
    },
    messages: [ai("괜찮아? 많이 놀랐겠다."), user("아직 좀 무서워")],
    text: "옆에 있어줘서 고마워",
  })

  assert.equal(payload.model, "gpt-test")
  assert.match(payload.instructions, /하린/)
  assert.match(payload.instructions, /다정|차분|힐링/)
  assert.match(payload.instructions, /연애|여자친구|사귄/)
  assert.match(payload.instructions, /카카오톡|채팅/)
  assert.match(payload.instructions, /1~3문장/)
  assert.match(payload.input, /소봉이: 아직 좀 무서워/)
  assert.match(payload.input, /하린: 괜찮아\? 많이 놀랐겠다\./)
  assert.match(payload.input, /소봉이: 옆에 있어줘서 고마워/)
})

test("non-harin OpenAI payload keeps the shared character prompt", () => {
  const payload = buildOpenAiChatPayload({
    model: "gpt-test",
    character: {
      id: "seoyun",
      name: "서윤",
      personality: "말은 차갑지만 선을 지키면 깊게 다가오는 현실주의자",
    },
    messages: [],
    text: "괜찮아?",
  })

  assert.match(payload.instructions, /미소녀 연애 시뮬레이션/)
  assert.match(payload.input, /캐릭터 이름: 서윤/)
  assert.doesNotMatch(payload.instructions, /하린은/)
})
