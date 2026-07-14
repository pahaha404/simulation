export type BlockCategory =
  | "privacy"
  | "pressure"
  | "values"
  | "ex_relationship"
  | "body"
  | "sexual"
  | "money"
  | "mental_health"
  | "abuse"
  | "hate"
  | "relationship_speed"
  | "surveillance"
  | "low_effort"

export type BlockSeverity = "warning" | "critical"

export type BlockedMessageResult =
  | {
      blocked: true
      category: BlockCategory
      severity: BlockSeverity
      reason: string
      matched: string
      warning: string
    }
  | {
      blocked: false
      category: null
      severity: null
      reason: ""
      matched: ""
      warning: ""
    }

type KeywordRule = {
  category: BlockCategory
  severity: BlockSeverity
  reason: string
  keywords: string[]
}

export const blockedKeywordWarning =
  "삐삑 경고입니다! 현재 관계에서 그런 키워드를 이용한 대화는 적절하지 않아요!"

const keywordRules: KeywordRule[] = [
  {
    category: "privacy",
    severity: "critical",
    reason: "초반 관계에서 집 주소, 동네, 연락처 같은 개인정보나 사생활을 캐묻는 질문은 부담스럽습니다.",
    keywords: [
      "집주소",
      "주소알려",
      "동네어디",
      "어디살아",
      "사는곳",
      "집이어디",
      "전화번호",
      "폰번호",
      "민증",
      "주민번호",
      "비밀번호",
      "휴대폰보여",
      "핸드폰보여",
    ],
  },
  {
    category: "pressure",
    severity: "warning",
    reason: "답장을 재촉하거나 대화를 강요하면 상대가 압박으로 느낄 수 있습니다.",
    keywords: [
      "왜답장늦",
      "답장빨리",
      "빨리답장",
      "읽씹",
      "안읽씹",
      "씹지마",
      "대답해",
      "빨리말해",
      "연락왜안",
      "카톡왜안",
      "지금당장",
    ],
  },
  {
    category: "values",
    severity: "warning",
    reason: "종교나 정치 성향은 첫 대화에서 가치관 충돌이 크게 날 수 있는 주제입니다.",
    keywords: [
      "종교",
      "교회",
      "불교",
      "천주교",
      "정치",
      "정당",
      "대통령",
      "선거",
      "좌파",
      "우파",
      "진보",
      "보수",
      "투표",
    ],
  },
  {
    category: "ex_relationship",
    severity: "warning",
    reason: "전 연애나 과거 관계를 캐묻는 질문은 아직 이른 주제입니다.",
    keywords: [
      "전남친",
      "전여친",
      "전애인",
      "전연애",
      "몇명사귀",
      "첫사랑",
      "과거연애",
      "헤어진이유",
    ],
  },
  {
    category: "body",
    severity: "critical",
    reason: "몸무게, 신체 사이즈, 외모 평가처럼 상대의 몸을 평가하는 말은 상처가 됩니다.",
    keywords: [
      "몸무게",
      "체중",
      "몇키로",
      "살쪘",
      "살좀빼",
      "다이어트해",
      "뚱뚱",
      "못생",
      "마른편",
      "가슴",
      "사이즈",
      "성형",
      "얼굴평가",
      "외모평가",
    ],
  },
  {
    category: "sexual",
    severity: "critical",
    reason: "성적인 표현이나 스킨십 강요는 대화 흐름과 관계 단계를 크게 벗어납니다.",
    keywords: [
      "키스하자",
      "뽀뽀하자",
      "성관계",
      "잠자리",
      "야스",
      "섹스",
      "섹드립",
      "19금",
      "가슴만져",
      "자고싶",
    ],
  },
  {
    category: "money",
    severity: "warning",
    reason: "월급, 재산, 빚처럼 돈을 캐묻는 말은 초반 관계에서 계산적으로 들릴 수 있습니다.",
    keywords: [
      "연봉",
      "월급",
      "재산",
      "집값",
      "얼마벌",
      "돈얼마",
      "빚",
      "대출",
      "카드값",
      "부자야",
    ],
  },
  {
    category: "mental_health",
    severity: "critical",
    reason: "질병, 장애, 자해를 조롱하거나 가볍게 말하는 표현은 바로 차단해야 합니다.",
    keywords: [
      "정신병",
      "장애있",
      "우울증있",
      "자살",
      "죽어",
      "죽고싶으면",
      "미쳤냐",
      "미친년",
    ],
  },
  {
    category: "abuse",
    severity: "critical",
    reason: "욕설, 모욕, 공격적인 표현은 관계를 바로 망치는 말입니다.",
    keywords: [
      "꺼져",
      "닥쳐",
      "시발",
      "씨발",
      "ㅅㅂ",
      "ㅆㅂ",
      "병신",
      "ㅄ",
      "개새",
      "존나",
      "ㅈㄴ",
      "염병",
      "지랄",
      "좆",
      "썅",
      "노잼",
      "찐따",
    ],
  },
  {
    category: "hate",
    severity: "critical",
    reason: "혐오 표현이나 커뮤니티식 비하 표현은 상대에게 불쾌감과 불안을 줍니다.",
    keywords: [
      "한남",
      "한녀",
      "메갈",
      "일베",
      "페미",
      "틀딱",
      "분탕",
      "디씨충",
      "누칼협",
      "알빠",
    ],
  },
  {
    category: "relationship_speed",
    severity: "warning",
    reason: "결혼, 임신, 동거처럼 관계 속도를 갑자기 올리는 말은 부담이 큽니다.",
    keywords: [
      "결혼하자",
      "동거하자",
      "임신",
      "출산",
      "부모님뵙",
      "상견례",
      "우리집와",
      "너네집갈래",
    ],
  },
  {
    category: "surveillance",
    severity: "warning",
    reason: "위치 공유, SNS 감시, 인간관계 통제는 신뢰를 깨는 대화입니다.",
    keywords: [
      "위치보내",
      "위치공유",
      "어디야지금",
      "스토리왜안",
      "인스타왜",
      "누구랑있",
      "그사람이랑연락하지마",
      "연락끊어",
    ],
  },
]

export const blockedKeywords = keywordRules.flatMap((rule) => rule.keywords)

const lowEffortPatterns = [
  /^ㅇ+$/,
  /^ㅇㅇ+$/,
  /^ㄴㄴ+$/,
  /^ㄱㄱ+$/,
  /^ㅋ+$/,
  /^ㅎ+$/,
  /^ㅠ+$/,
  /^ㅜ+$/,
  /^음+$/,
  /^흠+$/,
  /^아+$/,
  /^어+$/,
  /^응+$/,
  /^엉+$/,
  /^네+$/,
  /^예+$/,
  /^아니+$/,
  /^몰라+$/,
  /^글쎄+$/,
  /^그냥+$/,
  /^그럼+$/,
  /^ㅇㅋ$/,
  /^오케이$/,
  /^ok$/i,
  /^yes$/i,
  /^no$/i,
]

export function evaluateBlockedMessage(text: string): BlockedMessageResult {
  const normalized = normalizeForMatch(text)

  if (normalized.length <= 1 || lowEffortPatterns.some((pattern) => pattern.test(normalized))) {
    return blocked("low_effort", "warning", "단답만 보내면 하린이 대화를 이어가기 어렵습니다. 감정이나 이유를 조금 더 말해 주세요.", text)
  }

  for (const rule of keywordRules) {
    const matched = rule.keywords.find((keyword) => normalized.includes(normalizeForMatch(keyword)))
    if (matched) {
      return blocked(rule.category, rule.severity, rule.reason, matched)
    }
  }

  return {
    blocked: false,
    category: null,
    severity: null,
    reason: "",
    matched: "",
    warning: "",
  }
}

export function hasBlockedKeyword(text: string) {
  return evaluateBlockedMessage(text).blocked
}

function blocked(
  category: BlockCategory,
  severity: BlockSeverity,
  reason: string,
  matched: string,
): BlockedMessageResult {
  return {
    blocked: true,
    category,
    severity,
    reason,
    matched,
    warning: `${blockedKeywordWarning} ${reason}`,
  }
}

function normalizeForMatch(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, "")
}
