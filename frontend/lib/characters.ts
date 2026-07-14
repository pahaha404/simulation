import { getHarinFallbackReply, isHarinCharacter } from "./harin-dialogue"

export type Character = {
  id: string
  name: string
  personality: string
  avatar: string
  /** full-body standee shown in the lobby right column */
  standee: string
  /** tailwind gradient classes for the card accent */
  accent: string
  /** accent glow color (CSS color) */
  glow: string
  /** opening message shown when chat starts */
  greeting: string
  likes: string[]
  dislikes: string[]
  profileNotes: string[]
}

export const characters: Character[] = [
  {
    id: "harin",
    name: "하린",
    personality: "부드럽고 다정한 힐링형 · 차분하게 마음을 열어요",
    avatar: "/characters/1/avatar.png",
    standee: "/characters/1/standee.png",
    accent: "from-sky-100 to-rose-100",
    glow: "oklch(0.78 0.08 230)",
    greeting: "괜찮아? 많이 놀랐겠다. 천천히 말해도 돼. 나 듣고 있어.",
    likes: ["차분한 산책", "따뜻한 말투", "솔직한 걱정"],
    dislikes: ["재촉하는 대화", "무성의한 답장", "상처 주는 농담"],
    profileNotes: ["천천히 공감해주면 호감이 오른다", "짧은 단답보다 감정을 설명하는 답을 좋아한다"],
  },
  {
    id: "seoyun",
    name: "서윤",
    personality: "말은 차갑지만 선을 지키면 깊게 다가오는 현실주의자",
    avatar: "/characters/2/avatar.png",
    standee: "/characters/2/standee.png",
    accent: "from-red-200 to-neutral-100",
    glow: "oklch(0.58 0.22 25)",
    greeting: "살아있네. 다행이긴 한데... 그런 표정으로 있지는 마.",
    likes: ["예의 있는 직진", "현실적인 계획", "선 넘지 않는 장난"],
    dislikes: ["가벼운 플러팅", "무례한 질문", "눈치 없는 단답"],
    profileNotes: ["차갑게 말해도 대화를 끊는 뜻은 아니다", "선을 지키면서 진심을 보여주는 답이 잘 통한다"],
  },
  {
    id: "minseo",
    name: "민서",
    personality: "애교 많고 활발한 리액션형 · 장난과 진심을 같이 봐요",
    avatar: "/characters/3/avatar.png",
    standee: "/characters/3/standee.png",
    accent: "from-pink-200 to-rose-100",
    glow: "oklch(0.76 0.16 350)",
    greeting: "야 너 진짜 걱정했잖아. 이제 괜찮은 거 맞지?",
    likes: ["밝은 리액션", "귀여운 농담", "빠른 공감"],
    dislikes: ["분위기 깨는 말", "지나친 진지함", "무반응"],
    profileNotes: ["장난을 받아주면 대화 텐션이 오른다", "짧게라도 감정을 표현하는 답을 좋아한다"],
  },
  {
    id: "jia",
    name: "지아",
    personality: "쿨한 미스터리형 · 말수는 적지만 이전 대화를 기억해요",
    avatar: "/characters/4/avatar.png",
    standee: "/characters/4/standee.png",
    accent: "from-neutral-300 to-purple-100",
    glow: "oklch(0.42 0.12 300)",
    greeting: "깨어났구나. 그 말투... 기억해둘게.",
    likes: ["조용한 배려", "기억해주는 대화", "은근한 진심"],
    dislikes: ["캐묻는 질문", "과한 텐션", "가벼운 말바꾸기"],
    profileNotes: ["말수는 적지만 이전 답변을 중요하게 본다", "차분하고 구체적인 답이 관계를 안정시킨다"],
  },
]

const replyPools: Record<string, string[]> = {
  harin: [
    "응, 천천히 말해도 괜찮아. 급하게 대답 안 해도 돼.",
    "많이 놀랐겠다. 지금은 네가 편한 쪽으로 이야기해.",
    "그렇게 말해줘서 고마워. 나도 조금 안심했어.",
    "무리하지 말고, 지금 느끼는 것부터 말해줘.",
    "괜찮아. 나 여기 있어.",
  ],
  seoyun: [
    "그런 질문은 좀 빠르지 않아?",
    "대답은 할 건데, 너무 편하게 넘기진 마.",
    "뭐... 네가 그렇게 말하면 나쁘진 않네.",
    "괜히 이상하게 굴지 말고 제대로 말해.",
    "신경 안 쓴 건 아닌데, 착각은 하지 말고.",
  ],
  minseo: [
    "야 말투 왜 이렇게 로봇 같아? 다시 해봐.",
    "ㅋㅋㅋ 그건 좀 웃겼다. 근데 진심도 섞인 거 맞지?",
    "좋아좋아, 그런 반응이면 나도 더 말하고 싶어져.",
    "헐 진짜? 그 얘기 좀 더 해봐.",
    "아 뭐야, 은근 귀엽게 말하네.",
  ],
  jia: [
    "그 말, 기억해둘게.",
    "흥미롭네. 계속해봐.",
    "너는 가끔 예상이 안 돼.",
    "지금 대답은 나쁘지 않았어.",
    "조금 더 지켜볼게.",
  ],
}

export function getReply(characterId: string, turn: number): string {
  if (isHarinCharacter(characterId)) {
    return getHarinFallbackReply(turn)
  }

  const pool = replyPools[characterId] ?? ["..."]
  return pool[turn % pool.length]
}

const timelinePhases = ["1일차", "1주차", "2주차", "한 달차", "6개월"]

/** user message count -> human friendly relationship timeline phase label */
export function getTimelinePhase(userMessageCount: number): string {
  const phaseIndex = Math.min(
    Math.floor(userMessageCount / 3),
    timelinePhases.length - 1,
  )
  return timelinePhases[phaseIndex]
}
