type DialogueMessage = {
  sender: "user" | "ai"
  text: string
}

type HarinReplyInput = {
  text: string
  messages: DialogueMessage[]
}

type Intent = {
  id: string
  keywords: string[]
  responses: string[]
}

const harinIntents: Intent[] = [
  {
    id: "apology",
    keywords: ["미안", "사과", "잘못", "심했", "상처"],
    responses: [
      "미안하다고 말해줘서 고마워. 나도 바로 괜찮아지는 건 아니지만, 이렇게 풀어가면 된다고 생각해.",
      "괜찮아. 사과해준 건 진심으로 고마워. 다음엔 조금만 더 부드럽게 말해줘.",
      "나도 네가 일부러 그런 건 아니라고 믿고 싶어. 사과해줘서 고마워. 천천히 다시 얘기하자.",
    ],
  },
  {
    id: "hospital_pain",
    keywords: ["아프", "머리", "어지러", "병원", "기억", "다쳤", "깨어"],
    responses: [
      "아직 병원에 있으니까 급하게 괜찮은 척 안 해도 돼. 어디가 제일 불편한지 천천히 말해줘.",
      "기억이 흐릿하면 무섭지. 내가 옆에서 정리해줄게. 지금은 숨부터 천천히 쉬자.",
      "아픈데 무리해서 말하려고 하지 마. 짧게라도 괜찮으니까 지금 느낌만 알려줘.",
    ],
  },
  {
    id: "anxiety",
    keywords: ["무서", "불안", "떨려", "걱정", "겁나", "혼란", "멘붕"],
    responses: [
      "무서웠겠다. 그런 말은 숨기지 않아도 돼. 내가 듣고 있으니까 한 번에 다 말하려고 하지 말자.",
      "불안할 땐 대답을 잘하려고 애쓰는 것보다 지금 마음을 그대로 말하는 게 더 좋아.",
      "괜찮아. 지금 혼란스러운 게 이상한 게 아니야. 나랑 하나씩 확인해보자.",
    ],
  },
  {
    id: "thanks",
    keywords: ["고마워", "고맙", "덕분", "다행", "안심"],
    responses: [
      "그렇게 말해주니까 나도 조금 안심돼. 나도 네가 깨어나줘서 정말 고마워.",
      "고맙다는 말 들으려고 한 건 아닌데... 그래도 따뜻하게 말해줘서 좋아.",
      "응. 그 말 하나로 나도 마음이 좀 놓였어. 지금은 서로 너무 무리하지 말자.",
    ],
  },
  {
    id: "greeting",
    keywords: ["안녕", "하이", "왔어", "있어", "여보세요"],
    responses: [
      "응, 나 여기 있어. 아직 정신 없을 텐데 천천히 말해도 돼.",
      "안녕. 목소리 들으니까 다행이다. 지금은 몸 괜찮은지부터 알려줘.",
      "나 기다리고 있었어. 급하게 멋있는 말 안 해도 되니까 편하게 말해.",
    ],
  },
  {
    id: "self_blame",
    keywords: ["내탓", "내잘못", "바보", "한심", "민폐", "미안해서"],
    responses: [
      "그렇게까지 네 탓으로 몰아가지 않았으면 좋겠어. 지금은 자책보다 회복이 먼저야.",
      "민폐라고 생각하지 마. 걱정한 건 맞지만, 네가 깨어난 게 더 중요해.",
      "한심하다고 말하지 않았으면 해. 나한테는 지금 네가 무사한 게 제일 커.",
    ],
  },
  {
    id: "promise",
    keywords: ["약속", "앞으로", "조심", "잘할", "노력"],
    responses: [
      "그 약속은 크게 말하지 않아도 돼. 대신 천천히 지켜줘. 나는 그런 쪽이 더 믿음이 가.",
      "노력하겠다는 말은 좋아. 오늘은 무리하지 않고 쉬는 것부터 지켜보자.",
      "응, 조심해줘. 내가 잔소리하는 것 같아도 진심으로 걱정돼서 그래.",
    ],
  },
  {
    id: "likes",
    keywords: ["뭐좋아", "좋아하는", "취향", "관심사"],
    responses: [
      "나는 조용한 산책이랑 따뜻한 말투를 좋아해. 급하게 가까워지려는 것보다 편하게 오래 얘기하는 게 더 좋아.",
      "솔직하게 걱정해주는 말이 좋아. 꾸며낸 말보다 조금 서툴러도 진심이 보이는 쪽이 편해.",
      "차분한 분위기를 좋아해. 네가 천천히 말해주면 나도 더 편하게 마음을 열 수 있어.",
    ],
  },
  {
    id: "ask_harin",
    keywords: ["하린", "너는", "너도", "네가", "기분", "괜찮아"],
    responses: [
      "나는... 놀랐지. 그래도 네가 이렇게 말하고 있으니까 조금씩 괜찮아지고 있어.",
      "나도 괜찮다고만 하긴 어렵지만, 네 걱정이 먼저였어. 지금은 네 상태부터 보자.",
      "내 기분까지 물어봐주는 건 고마워. 그런 배려는 나한테 꽤 크게 와.",
    ],
  },
  {
    id: "walk",
    keywords: ["산책", "걷자", "걸을", "공원", "바람쐬"],
    responses: [
      "산책 좋지. 지금은 네 몸부터 회복하고, 괜찮아지면 조용한 곳으로 천천히 걷자.",
      "나중에 산책 가는 건 좋아. 대신 오늘은 병원에서 무리하지 않기로 약속해.",
      "같이 걷는 건 좋을 것 같아. 말이 끊겨도 어색하지 않은 산책이면 더 좋고.",
    ],
  },
  {
    id: "rain",
    keywords: ["비", "빗소리", "우산", "날씨", "흐려"],
    responses: [
      "비 오는 날은 마음이 가라앉기도 하지. 오늘은 그 소리 들으면서 조금 쉬어도 돼.",
      "빗소리 얘기하니까 이상하게 안심된다. 우리 너무 급한 이야기 말고 천천히 가자.",
      "우산 같은 말 좋다. 지금은 서로 비 피할 곳이 되어주는 정도면 충분해.",
    ],
  },
  {
    id: "sleep",
    keywords: ["졸려", "잠", "자도", "피곤", "쉬고"],
    responses: [
      "졸리면 자도 돼. 답장보다 회복이 먼저야. 일어나면 나한테 짧게라도 알려줘.",
      "피곤한데 억지로 버티지 마. 나는 여기 있을 테니까 조금 쉬어.",
      "지금은 푹 자는 게 제일 좋은 답일 수도 있어. 괜찮아, 기다릴게.",
    ],
  },
  {
    id: "food",
    keywords: ["밥", "죽", "물", "먹었", "배고", "식사"],
    responses: [
      "배고픈 걸 느낄 정도면 조금은 다행이다. 병원에서 먹어도 되는지 확인하고 천천히 먹자.",
      "지금은 자극적인 것보다 편한 게 좋을 것 같아. 물부터 조금 마셔볼래?",
      "밥 얘기할 정신이 돌아온 건 반가운데, 무리하지 말고 천천히 먹어.",
    ],
  },
  {
    id: "compliment",
    keywords: ["다정", "착해", "예쁘", "좋은사람", "상냥"],
    responses: [
      "그렇게 봐주는 건 고마워. 근데 칭찬보다 네가 편하게 말해주는 게 더 좋아.",
      "고마워. 갑자기 그런 말 들으면 조금 쑥스럽지만, 나쁘진 않아.",
      "예쁘게 말하려고 애쓴 것 같아서 고마워. 그런 말은 천천히 받아볼게.",
    ],
  },
  {
    id: "affection",
    keywords: ["보고싶", "좋아해", "설레", "마음", "소중"],
    responses: [
      "그 말은 고마운데, 오늘은 우리 둘 다 정신이 없잖아. 너무 앞서가기보다 천천히 확인하자.",
      "설렌다는 말보다 지금은 서로 무사한 게 더 크게 느껴져. 그래도 네 마음은 조심히 받을게.",
      "소중하게 말해주는 건 좋아. 대신 급하게 증명하려고 하지는 않아도 돼.",
    ],
  },
  {
    id: "meet",
    keywords: ["만나", "데이트", "보러갈", "갈게", "와줘"],
    responses: [
      "만나는 건 네가 회복한 다음에 생각하자. 지금은 병원에서 안정하는 게 먼저야.",
      "나도 보고 싶긴 한데, 무리해서 움직이는 건 싫어. 괜찮아지면 천천히 정하자.",
      "급하게 약속 잡지 않아도 돼. 오늘은 네 상태를 먼저 알려주는 게 더 좋다.",
    ],
  },
  {
    id: "joke",
    keywords: ["ㅋㅋ", "농담", "웃기", "장난", "바보같"],
    responses: [
      "농담할 힘이 생긴 건 다행인데, 너무 무리해서 밝은 척하는 건 아니지?",
      "조금 웃긴 했어. 그래도 지금은 장난 반, 진심 반 정도로만 가자.",
      "장난치는 거 보니까 안심되면서도 걱정돼. 아프면 바로 말해야 해.",
    ],
  },
  {
    id: "future",
    keywords: ["내일", "나중", "다음", "퇴원", "회복하면"],
    responses: [
      "응, 나중 얘기 좋다. 지금만 보고 있으면 무서울 수 있으니까, 회복한 뒤 일도 조금씩 생각하자.",
      "퇴원하고 나면 천천히 정하자. 오늘은 내일을 만들 수 있게 쉬는 날로 하자.",
      "다음 이야기를 할 수 있다는 게 다행이야. 그러니까 오늘은 무리하지 말기.",
    ],
  },
  {
    id: "silence",
    keywords: ["모르겠", "할말", "뭐라", "그냥", "음"],
    responses: [
      "뭐라고 해야 할지 모르겠으면 그렇게 말해도 돼. 나는 정답보다 네 상태를 알고 싶어.",
      "그냥이라는 말 뒤에 숨고 싶을 때 있지. 괜찮아, 천천히 한 단어씩만 꺼내도 돼.",
      "말이 잘 안 나오면 잠깐 쉬어도 돼. 대신 혼자 버티는 척은 하지 말자.",
    ],
  },
  {
    id: "reassurance",
    keywords: ["괜찮아질", "살아", "무사", "버틸", "나아질"],
    responses: [
      "응, 괜찮아질 거야. 지금 당장 완벽하지 않아도 조금씩 돌아오면 돼.",
      "살아있다는 말이 이렇게 크게 들릴 줄 몰랐어. 정말 다행이야.",
      "나아지는 속도가 느려도 괜찮아. 내가 재촉하지 않을게.",
    ],
  },
]

const contextualMemory: Intent[] = [
  {
    id: "remember_walk",
    keywords: ["산책", "공원", "걷"],
    responses: [
      "아까 산책 얘기한 거 기억나. 그런 조용한 약속은 좋아. 네가 회복하면 천천히 걷자.",
      "산책 얘기로 돌아온 거 좋다. 급한 약속보다 그런 편한 시간이 더 하린답지.",
    ],
  },
  {
    id: "remember_rain",
    keywords: ["비", "우산", "날씨"],
    responses: [
      "아까 비 얘기했지. 오늘 같은 날은 괜히 마음이 흔들리니까, 더 천천히 말해도 돼.",
      "비 얘기가 계속 남아있네. 그러면 우리도 조금 조용하게 얘기하자.",
    ],
  },
  {
    id: "remember_hospital",
    keywords: ["병원", "아프", "기억", "깨어"],
    responses: [
      "아직 병원 얘기가 마음에 걸리는구나. 당연해. 회복하는 동안은 내가 계속 확인할게.",
      "아까도 몸 상태 얘기했지. 괜찮은 척하지 말고, 달라진 느낌 있으면 바로 말해줘.",
    ],
  },
]

const harinFallbackReplies = [
  "응, 네 말 듣고 있어. 급하게 정리하지 않아도 되니까 조금 더 말해줘.",
  "그렇게 말해주는 거 좋아. 서툴러도 괜찮으니까 네 생각을 조금만 더 들려줘.",
  "나 여기 있어. 지금은 멋진 대답보다 솔직한 한마디가 더 중요해.",
  "천천히 가자. 네가 어떤 마음으로 말하는지 알고 싶어.",
  "괜찮아. 대화가 잠깐 흔들려도 다시 맞춰가면 돼.",
  "그 말은 조금 더 듣고 싶다. 네가 왜 그렇게 느꼈는지 알려줄래?",
  "나도 조심스럽게 듣고 있어. 편한 속도로 이어가자.",
  "고마워. 지금처럼 부담 주지 않고 말해주면 나도 더 편해져.",
]

export function getHarinDeterministicReply(input: HarinReplyInput): string {
  const text = input.text.trim()
  const recentText = input.messages
    .slice(-6)
    .map((message) => message.text)
    .join(" ")

  const rememberedIntent = contextualMemory.find(
    (intent) => includesAny(recentText, intent.keywords) && includesAny(text, intent.keywords),
  )
  if (rememberedIntent) {
    return pickResponse(rememberedIntent.responses, text, input.messages.length)
  }

  const intent = harinIntents.find((candidate) => includesAny(text, candidate.keywords))
  if (intent) {
    return pickResponse(intent.responses, text, input.messages.length)
  }

  return getHarinFallbackReply(input.messages.filter((message) => message.sender === "user").length + text.length)
}

export function getHarinFallbackReply(turn: number): string {
  return harinFallbackReplies[Math.abs(turn) % harinFallbackReplies.length]
}

export function isHarinCharacter(characterId: string) {
  return characterId === "harin"
}

function includesAny(text: string, keywords: string[]) {
  const normalized = normalizeForMatch(text)
  return keywords.some((keyword) => normalized.includes(normalizeForMatch(keyword)))
}

function pickResponse(responses: string[], text: string, salt: number) {
  const index = Math.abs(normalizeForMatch(text).length + salt) % responses.length
  return responses[index]
}

function normalizeForMatch(text: string) {
  return text.toLowerCase().replace(/\s+/g, "")
}
