# 기술 구현 보고서

작성일: 2026-07-15
프로젝트: 연애 특훈! 까탈스러운 여자친구 채팅 시뮬레이터  
배포 URL: https://kookmin-ai-workflow-team2.vercel.app/

## 1. 프로젝트 개요

이 프로젝트는 교통사고 후 병원에서 깨어난 주인공이 네 명의 캐릭터 중 한 명을 선택하고, 금지어를 피하면서 채팅을 이어가는 연애 시뮬레이션 게임입니다. 현재 배포된 채팅 답변은 Next.js API Route에서 OpenAI Responses API를 호출해 생성합니다. 하린은 별도 페르소나 프롬프트를 적용해 더 다정하고 자연스러운 연애 대화가 나오도록 구성했고, API 실패 시에는 로컬 fallback 답변을 사용합니다.

현재 실제 배포 화면은 `frontend`의 Next.js 앱을 기준으로 동작합니다. 저장소에는 별도 `backend`와 `llm-gateway`도 포함되어 있으며, 이 둘은 더 확장된 서버형 게임 로직과 로컬 LLM 연동을 위한 구조입니다.

## 2. 전체 구성

```text
2026-kookmin-ai-workflow-team2/
├─ frontend/      # 실제 Vercel 배포에 사용되는 Next.js 프론트엔드
├─ backend/       # Express + SQLite 기반 게임 서버
├─ llm-gateway/   # Ollama 또는 Codex CLI를 감싸는 내부 LLM 게이트웨이
├─ README.md      # 제품 설명
├─ PRD.md         # 기능 요구사항 문서
└─ TECHNICAL_REPORT.md
```

## 3. 사용 기술 요약

| 구분 | 기술 | 사용 여부 | 용도 |
| --- | --- | --- | --- |
| 프론트엔드 | Next.js 16.2.6 | 사용 | 앱 라우팅, 화면 렌더링, API Route |
| UI | React 19 | 사용 | 컴포넌트 기반 화면 구성 |
| 언어 | TypeScript 5.7.3 | 사용 | 타입 안정성, 컴포넌트/서버 코드 작성 |
| 스타일 | Tailwind CSS 4.2 | 사용 | 반응형 레이아웃, 테마, 애니메이션 스타일 |
| 스타일 빌드 | PostCSS, @tailwindcss/postcss | 사용 | Tailwind CSS 처리 |
| 애니메이션 CSS | tw-animate-css | 사용 | 화면 전환/등장 애니메이션 보조 |
| 폰트 | next/font/google, Geist | 사용 | Next.js Google Font 로딩 |
| UI 시스템 | shadcn 설정, @base-ui/react | 사용 | 버튼 등 UI primitive와 디자인 토큰 기반 구성 |
| 아이콘 | lucide-react | 사용 | 홈, 전송, 하트 등 UI 아이콘 |
| UI 보조 | class-variance-authority, clsx, tailwind-merge | 사용 | 조건부 className 조합 |
| 분석 | @vercel/analytics | 사용 | 프로덕션 환경에서 Vercel Analytics 삽입 |
| AI API | OpenAI Responses API | 사용 | 하린 포함 캐릭터 답변 생성 |
| 하린 페르소나 | OpenAI prompt persona | 사용 | 하린 전용 다정한 연애 대화 톤 적용 |
| 규칙 기반 대화 | Deterministic keyword/intent matching | 보조 사용 | API 실패 시 하린 fallback 답변 |
| 배포 | Vercel | 사용 | Next.js 프론트엔드 프로덕션 배포 |
| 런타임 | Node.js | 사용 | Next API Route, Express 서버, 빌드/테스트 실행 |
| 패키지 매니저 | pnpm, npm | 사용 | `frontend`는 pnpm, `backend`와 `llm-gateway`는 npm |
| 백엔드 서버 | Express | 저장소에 포함 | 확장형 게임 서버 API |
| 백엔드 보조 | cors, dotenv, tsx | 저장소에 포함 | CORS 처리, 환경 변수 로딩, 개발 서버 실행 |
| DB | SQLite, better-sqlite3 | 저장소에 포함 | 게임 상태, 메시지, 점수, 이벤트 저장 |
| 검증 | Zod | 저장소에 포함 | backend/llm-gateway 요청 스키마 검증 |
| 테스트 | node:test, Vitest | 사용 | 프론트 유틸 테스트, 백엔드/게이트웨이 테스트 |
| 로컬 LLM | Ollama | 저장소에 포함 | `llm-gateway`의 기본 로컬 LLM provider |
| 대체 LLM | Codex CLI | 저장소에 포함 | Ollama 대신 임시 LLM provider로 사용 가능 |
| 카메라 인식 | MediaPipe | 사용 안 함 | 코드/패키지에 없음 |
| 카메라 API | getUserMedia / WebRTC | 사용 안 함 | 브라우저 카메라 권한 요청 없음 |
| 비전 AI | TensorFlow.js, OpenCV | 사용 안 함 | 이미지/영상 인식 모델 없음 |

## 4. 프론트엔드 구현

프론트엔드는 `frontend` 디렉터리의 Next.js App Router 앱입니다.

주요 파일:

- `frontend/app/page.tsx`: 전체 게임 화면 상태 관리
- `frontend/app/layout.tsx`: 폰트, 메타데이터, Vercel Analytics 설정
- `frontend/app/api/chat/route.ts`: 금지어를 재검사하고 OpenAI API 답변을 반환하는 서버 API Route
- `frontend/lib/openai-chat.ts`: OpenAI 요청 payload와 하린 전용 페르소나 프롬프트 생성
- `frontend/components/intro-screen.tsx`: 인트로 이미지와 오프닝 시퀀스
- `frontend/components/character-selection.tsx`: 캐릭터 선택 화면
- `frontend/components/game-lobby.tsx`: 채팅방 전체 레이아웃
- `frontend/components/chat-room.tsx`: 채팅 UI, 금지어 경고, 목숨, 게임오버 처리
- `frontend/lib/characters.ts`: 캐릭터 데이터와 기본 fallback 답변
- `frontend/lib/harin-dialogue.ts`: 하린 API 실패 fallback용 규칙 기반 대화 엔진
- `frontend/lib/blocked-keywords.ts`: 금지어/저품질 답변 감지 규칙
- `frontend/lib/life-system.ts`: 목숨 시스템
- `frontend/lib/intro-flow.ts`: 인트로 키 입력 흐름
- `frontend/lib/time.ts`: 채팅 시간 표시와 가상 시간 증가

### 4.1 화면 흐름

현재 프론트 화면 흐름은 다음과 같습니다.

1. 앱 접속
2. `intro.png` 스플래시 표시
3. 아무 키나 누르거나 화면 클릭 시 오프닝 스토리 시작
4. 오프닝 장면 진행
5. 캐릭터 선택 화면 표시
6. 캐릭터 선택
7. 채팅 화면 진입
8. 사용자가 메시지 입력
9. 금지어 검사
10. 통과하면 `/api/chat`으로 답변 생성 요청
11. OpenAI API에 캐릭터 페르소나와 최근 대화를 보내 답변 생성
12. 실패하거나 API 키가 없으면 로컬 fallback 답변 표시
13. 금지어 누적 3회면 게임오버

### 4.2 상태 관리

별도 전역 상태 라이브러리는 사용하지 않습니다. `frontend/app/page.tsx`에서 React `useState`로 화면 상태와 캐릭터별 채팅 상태를 관리합니다.

주요 상태:

- `isIntroScreen`: 인트로 화면 표시 여부
- `currentScreen`: `selection` 또는 `chat`
- `selectedCharacter`: 현재 선택된 캐릭터
- `chats`: 캐릭터 ID별 메시지, 가상 시간, 경고 횟수 저장

캐릭터별 채팅 상태는 다음 구조입니다.

```ts
type ChatState = {
  messages: Message[]
  virtualTime: number
  warningCount: number
}
```

### 4.3 캐릭터 데이터

캐릭터 정보는 `frontend/lib/characters.ts`에 정적 데이터로 저장되어 있습니다.

현재 캐릭터:

- 하린
- 서윤
- 민서
- 지아

각 캐릭터는 다음 정보를 가집니다.

- `id`
- `name`
- `personality`
- `avatar`
- `standee`
- `accent`
- `glow`
- `greeting`
- `likes`
- `dislikes`
- `profileNotes`

캐릭터별 기본 fallback 답변도 같은 파일의 `replyPools`에 있습니다. OpenAI API 호출이 실패하거나 API 키가 없을 때 이 답변이 사용됩니다. 하린은 별도 `frontend/lib/harin-dialogue.ts`의 전용 fallback과 intent 기반 응답을 사용합니다.

### 4.4 하린 OpenAI 페르소나와 fallback

하린 캐릭터는 기본적으로 OpenAI API를 사용합니다. `frontend/lib/openai-chat.ts`에서 하린 전용 페르소나 지시문을 생성해 API 요청에 포함합니다.

하린 페르소나 핵심:

- 부드럽고 다정한 힐링형 여자친구
- 병원, 통증, 기억 혼란, 불안이 나오면 먼저 안심시키고 천천히 말하게 함
- 연애 첫날의 조심스러운 설렘과 거리감 유지
- 조용한 산책, 따뜻한 말투, 솔직한 걱정을 좋아함
- 재촉, 무성의한 단답, 상처 주는 농담을 싫어함
- 이전 대화의 감정이나 약속을 자연스럽게 이어받음

API 실패 시에는 `frontend/lib/harin-dialogue.ts`의 deterministic 대화 엔진을 fallback으로 사용합니다.

fallback 구현 방식:

- 입력 문장을 `trim`, 소문자 변환, 공백 제거 방식으로 정규화
- 키워드 묶음을 intent로 분류
- 최근 대화 6개를 함께 확인해 반복 주제는 context memory 응답으로 처리
- 같은 문장에도 메시지 길이와 대화 길이를 salt로 사용해 후보 답변 중 하나를 deterministic하게 선택
- 매칭되는 intent가 없으면 하린 성격에 맞는 fallback 답변 반환

하린 intent 예시:

- 사과: `미안`, `사과`, `잘못`, `상처`
- 병원/통증: `아프`, `병원`, `기억`, `깨어`
- 불안: `무서`, `불안`, `걱정`, `혼란`
- 감사: `고마워`, `덕분`, `다행`, `안심`
- 취향 질문: `좋아하는`, `취향`, `관심사`
- 산책/날씨/수면/식사/칭찬/애정/미래 약속 등

fallback은 네트워크, API 키, 토큰 비용에 영향을 받지 않습니다. 대신 응답 범위는 미리 작성된 키워드와 답변 후보 안에서 결정됩니다.

### 4.5 인트로 구현

인트로는 `frontend/components/intro-screen.tsx`와 `frontend/lib/intro-flow.ts`로 구현되어 있습니다.

구현 방식:

- 첫 화면은 `/backgrounds/intro.png`
- 아무 키나 누르면 `splash` 단계에서 `story` 단계로 전환
- 스토리 단계에서는 장면 배열 `openingScenes`를 순서대로 표시
- 글자는 타이핑 효과로 출력
- 장면별 `durationMs`가 지나면 자동으로 다음 장면으로 이동
- 화면 클릭 또는 키 입력으로 다음 대사/장면으로 넘길 수 있음
- `prefers-reduced-motion` 사용자는 타이핑 애니메이션을 줄임

### 4.6 채팅 구현

채팅 UI는 `frontend/components/chat-room.tsx`에 있습니다.

구현 요소:

- 캐릭터 프로필 이미지
- 관계 단계 표시
- 남은 목숨 하트 표시
- 메시지 목록
- 사용자/AI 말풍선 구분
- 카카오톡 스타일 시간 표시
- 입력창과 전송 버튼
- 금지어 경고 오버레이
- 게임오버 오버레이
- 관계 단계 변경 오버레이

메시지 전송 흐름:

1. 입력값 trim
2. 빈 문자열이면 전송 차단
3. 금지어 검사
4. 금지어면 `onBlockedMessage()` 호출 후 경고 오버레이 표시
5. 정상 메시지면 `onSend(text)` 호출
6. 부모 컴포넌트에서 `/api/chat` 호출
7. API 응답 또는 fallback 답변을 메시지 목록에 추가

### 4.7 금지어 시스템

금지어 검사는 `frontend/lib/blocked-keywords.ts`에 있습니다.

방식:

- 입력 문자열을 trim
- 소문자 변환
- 공백 제거
- 카테고리별 금지어 규칙 포함 여부 검사
- 저품질 단답 정규식 검사
- 길이 1 이하 입력 차단
- 차단 시 `category`, `severity`, `reason`, `matched`, `warning`을 반환

예시 금지어 범주:

- 개인정보/사생활
- 답장 재촉/압박
- 정치/종교 가치관
- 전 연애/과거 관계
- 외모/신체 평가
- 성적 표현
- 돈/재산 질문
- 질병/장애/자해 조롱
- 욕설
- 혐오 표현
- 갑작스러운 관계 진전
- 집착성 표현
- 의미 없는 단답

AI에게만 맡기지 않고 프론트/서버 API Route 양쪽에서 동일한 금지어 검사를 수행합니다. 프론트에서는 경고 오버레이에 상세 사유를 보여주고, 서버 API Route는 차단 응답에 `warning`, `reason`, `category`를 포함합니다.

### 4.8 목숨 시스템

목숨 시스템은 `frontend/lib/life-system.ts`에 분리되어 있습니다.

```ts
export const MAX_LIVES = 3

export function getRemainingLives(warningCount: number) {
  return Math.max(0, MAX_LIVES - warningCount)
}

export function isGameOver(warningCount: number) {
  return getRemainingLives(warningCount) <= 0
}
```

동작:

- 시작 목숨은 3개
- 금지어 입력 1회마다 경고 횟수 증가
- 남은 목숨은 `3 - warningCount`
- 남은 목숨이 0이면 게임오버
- 다시 도전 버튼을 누르면 해당 캐릭터 채팅과 경고 횟수 초기화

### 4.9 시간 처리

시간 처리는 `frontend/lib/time.ts`에서 담당합니다.

현재 화면에서 모드 선택 UI는 제거되어 있지만, 내부적으로는 답장마다 가상 시간이 20~30분 증가합니다.

```ts
export function demoJumpMinutes(): number {
  return 20 + Math.floor(Math.random() * 11)
}
```

메시지 시간 표시는 `오전/오후 h:mm` 형태의 한국어 라벨로 출력됩니다.

## 5. 답변 생성 구현

현재 배포된 프론트엔드는 `frontend/app/api/chat/route.ts`의 Next.js API Route에서 답변을 생성합니다.

- 하린: OpenAI Responses API + 하린 전용 페르소나 프롬프트 사용
- 서윤/민서/지아: OpenAI Responses API + 공통 캐릭터 프롬프트 사용
- OpenAI API 키가 없거나 호출 실패 시: `frontend/lib/characters.ts`의 fallback 답변 사용

### 5.1 Node.js 사용 여부

Node.js는 사용합니다.

근거:

- `frontend/app/api/chat/route.ts`에 `export const runtime = "nodejs"`가 명시되어 있습니다.
- Next.js API Route는 서버 측 Node.js 런타임에서 실행됩니다.
- `backend`와 `llm-gateway`도 Express 기반 Node.js 서버입니다.
- 빌드/테스트 도구도 Node.js 생태계를 사용합니다.

### 5.2 하린 OpenAI 페르소나 응답

하린은 OpenAI API를 사용합니다. API Route는 `buildOpenAiChatPayload()`로 OpenAI 요청 payload를 만들고, 하린인 경우 하린 전용 페르소나 지시문을 `instructions`에 추가합니다.

요청 payload 구조:

```ts
{
  model,
  instructions,
  input,
  max_output_tokens,
}
```

장점:

- 하린의 다정하고 차분한 성격을 프롬프트로 강하게 고정
- 최근 대화 12개를 함께 보내 문맥을 이어받음
- 사귄 첫날, 병원에서 깨어난 상황, 관계 거리감을 함께 반영
- 규칙 기반 fallback보다 자유롭고 자연스러운 연애 대화 가능

보조 안전 장치:

- API 키가 없거나 OpenAI 호출이 실패하면 하린 fallback 답변을 반환
- 금지어 입력은 OpenAI 호출 전에 차단
- 시스템 프롬프트, API 정보, AI라는 사실 언급 금지 지시 포함

### 5.3 OpenAI API 호출

모든 캐릭터 답변 생성은 OpenAI Responses API를 사용합니다. 하린은 추가 페르소나 지시문이 붙고, 나머지 캐릭터는 공통 캐릭터 프롬프트를 사용합니다.

환경 변수:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

기본 모델:

```ts
const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
```

요청 대상:

```text
POST https://api.openai.com/v1/responses
```

프롬프트 구성:

- 캐릭터 이름
- 캐릭터 성격
- 병원에서 깨어난 상황
- 사귄 첫날이라는 관계 설정
- 최근 대화 12개
- 다음 답장만 작성하라는 지시

안전 장치:

- API 키가 없으면 HTTP 503과 함께 fallback 답변 반환
- API 실패 또는 응답 파싱 실패 시 fallback 답변 반환
- 금지어 입력은 OpenAI 호출 전에 차단
- 시스템 프롬프트, 서버 규칙, API 정보 언급 금지 지시 포함

## 6. 백엔드 구현

`backend`는 Express + TypeScript 기반의 별도 게임 서버입니다. 현재 Vercel 배포 프론트가 직접 호출하는 기본 경로는 Next API Route이지만, 저장소에는 더 확장된 서버 구현이 포함되어 있습니다.

주요 기술:

- Node.js
- Express
- TypeScript
- better-sqlite3
- SQLite
- Zod
- Vitest
- dotenv
- cors

주요 책임:

- 게임방 생성
- 메시지 저장
- 캐릭터 목록 제공
- 관계 점수 관리
- 금지어/민감 주제 판정
- 이벤트 트리거
- FAST/REALTIME 모드 처리
- 쿨다운 처리
- 광고/결제 mock unlock 처리
- LLM Gateway 호출

주요 API 예시:

- `GET /health`
- `GET /api/girlfriends`
- `POST /api/rooms`
- `GET /api/rooms/:roomId/messages`
- `POST /api/rooms/:roomId/messages`
- `POST /api/rooms/:roomId/unlock/ad-complete`
- `POST /api/rooms/:roomId/unlock/payment-complete`

### 6.1 SQLite 저장 구조

`backend/src/db/schema.sql`에 SQLite 스키마가 정의되어 있습니다.

주요 테이블:

- `girlfriends`
- `chat_rooms`
- `relationship_scores`
- `messages`
- `forbidden_rules`
- `sensitive_topic_events`
- `violation_events`
- `event_templates`
- `room_events`
- `user_reply_timing_events`
- `pending_reply_jobs`

설정 JSON:

- `backend/src/config/girlfriends.json`
- `backend/src/config/forbidden-rules.json`
- `backend/src/config/sensitive-topics.json`
- `backend/src/config/events.json`

### 6.2 FAST / REALTIME 구조

백엔드에는 두 가지 시간 흐름 설계가 있습니다.

FAST 모드:

- 해커톤 데모용 빠른 진행
- `NOW`, `AFTER_30_MIN`, `AFTER_NEXT_DAY` 같은 가상 답장 지연 선택 지원
- 10번의 사용자 턴 후 하루 종료 처리

REALTIME 모드:

- 실제 연락 텀 기반 확장 설계
- pending reply job을 만들어 답장 예정 시각 저장
- `pending-reply.worker`가 예정 답장을 처리하는 구조

## 7. LLM Gateway 구현

`llm-gateway`는 게임 서버와 LLM provider 사이의 내부 HTTP 서비스입니다.

주요 기술:

- Node.js
- Express
- TypeScript
- Zod
- Vitest
- Ollama
- Codex CLI provider

기본 포트:

```text
8080
```

기본 provider:

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Codex CLI로 전환할 수 있는 설정:

```env
LLM_PROVIDER=codex-cli
CODEX_CLI_COMMAND=codex
CODEX_CLI_TIMEOUT_MS=60000
```

주요 API:

- `GET /health`
- `POST /v1/model/preload`
- `GET /v1/model/status`
- `POST /v1/chat/generate`
- `POST /v1/classify/intent`
- `POST /v1/feedback/daily`

특징:

- `/v1` 라우트는 `X-Internal-Api-Key` 헤더 필요
- Ollama 상태 확인 가능
- Codex CLI 실행 가능 여부 확인 가능
- LLM 실패 시 deterministic fallback 응답 반환
- 응답 필터링과 출력 길이 제한 포함

## 8. 카메라 인식 / MediaPipe 사용 여부

이 프로젝트는 카메라 인식을 사용하지 않습니다.

확인 결과:

- `MediaPipe` 패키지 없음
- `@mediapipe/*` 의존성 없음
- `navigator.mediaDevices.getUserMedia` 호출 없음
- WebRTC 카메라 권한 요청 없음
- `<video>` 기반 카메라 스트림 처리 없음
- TensorFlow.js / OpenCV / tfjs 의존성 없음
- 얼굴/손/포즈 인식 모델 없음

따라서 발표 또는 보고서에서 “MediaPipe로 카메라 인식을 구현했다”고 말하면 안 됩니다.

정확한 표현:

```text
현재 버전은 카메라 기반 인식 기능을 사용하지 않고, 정적 캐릭터 이미지와 채팅 입력 기반 규칙/AI 응답으로 게임을 진행한다.
```

## 9. 이미지와 시각 자료 처리

캐릭터와 배경은 정적 이미지 asset으로 처리합니다.

사용 방식:

- Next.js `Image` 컴포넌트 사용
- 캐릭터 이미지: `/characters/...`
- 배경 이미지: `/backgrounds/...`
- 인트로 첫 화면: `/backgrounds/intro.png`
- 오프닝 배경: dark, rain, truck, hospital 등
- 채팅방 배경: classroom
- 로비 배경: lobby

`frontend/next.config.mjs`에서 이미지 최적화는 비활성화되어 있습니다.

```js
images: {
  unoptimized: true,
}
```

## 10. 배포와 운영

현재 프론트엔드는 Vercel에 배포되어 있습니다.

프로덕션 URL:

```text
https://kookmin-ai-workflow-team2.vercel.app/
```

Vercel에서 필요한 환경 변수:

- `OPENAI_API_KEY`
- `OPENAI_MODEL`

빌드 명령:

```bash
cd frontend
corepack pnpm build
```

실행 명령:

```bash
cd frontend
corepack pnpm dev
```

배포 명령:

```bash
cd frontend
vercel deploy --prod --yes
```

## 11. 테스트와 검증

프론트엔드 유틸 테스트:

```bash
node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types --test frontend/lib/harin-dialogue.test.ts frontend/lib/blocked-keywords.test.ts frontend/lib/life-system.test.ts frontend/lib/intro-flow.test.ts
```

검증 대상:

- 하린 OpenAI payload에 상세 페르소나가 포함되는지
- 하린 fallback이 intent 기반 deterministic 답변을 반환하는지
- 하린 fallback이 최근 대화 주제를 기억한 것처럼 context memory 응답을 반환하는지
- 금지어가 카테고리, 심각도, 상세 사유와 함께 차단되는지
- 인트로가 `intro.png`에서 시작하는지
- 아무 키 입력으로 스토리가 시작되는지
- 스토리 도중 키 입력으로 오프닝이 진행되는지
- 목숨이 3개로 시작하는지
- 경고마다 목숨이 1개씩 줄어드는지
- 경고 3회 후 게임오버가 되는지

백엔드 테스트:

```bash
cd backend
npm test
```

LLM Gateway 테스트:

```bash
cd llm-gateway
npm test
```

빌드 검증:

```bash
cd frontend
corepack pnpm build
```

주의:

- Next.js 빌드는 Google Fonts를 다운로드하므로 네트워크가 차단된 환경에서는 실패할 수 있습니다.
- 네트워크가 허용된 환경에서는 빌드가 정상 통과했습니다.

## 12. 개발에 사용된 도구

개발/운영에 사용된 도구:

- Git
- GitHub
- Codex
- Vercel CLI
- Node.js
- npm
- pnpm
- TypeScript compiler
- Next.js build
- Vitest
- node:test
- ripgrep
- PowerShell
- OpenAI API

UI/프로토타입 관련 흔적:

- `frontend/app/layout.tsx`의 metadata에 `generator: 'v0.app'`가 남아 있어 v0 기반 프로토타이핑 흔적이 있습니다.
- 실제 구현은 저장소의 React/Next 코드로 관리됩니다.

## 13. 현재 구현된 기능과 미구현 기능

### 구현됨

- 인트로 스플래시
- 오프닝 스토리 시퀀스
- 캐릭터 선택
- 채팅 UI
- 캐릭터별 기본 대사
- 하린 전용 OpenAI 페르소나 답변 생성
- 전체 캐릭터 OpenAI 기반 AI 답변 생성
- API 실패 fallback 답변
- 카테고리/심각도/상세 사유가 있는 금지어 감지
- 저품질 단답 감지
- 목숨 3개 시스템
- 경고/게임오버
- 다시 도전
- 관계 단계 표시
- 가상 시간 증가
- Vercel 배포

### 저장소에는 있으나 현재 프론트 기본 흐름과 분리된 기능

- Express 백엔드의 방/메시지/점수/쿨다운 API
- SQLite 영속 저장
- FAST/REALTIME 모드 서버 설계
- LLM Gateway
- Ollama provider
- Codex CLI provider
- backend unlock mock API

### 미구현 또는 미사용

- MediaPipe
- 카메라 인식
- 얼굴 인식
- 손/포즈 인식
- TensorFlow.js
- OpenCV
- WebRTC 카메라 스트림
- 실제 결제 연동
- 실제 광고 SDK
- 실제 푸시 알림
- 사용자 계정/Auth

## 14. 발표용 기술 설명 요약

짧게 설명할 때:

```text
프론트엔드는 Next.js와 React, TypeScript, Tailwind CSS로 만들었고 Vercel에 배포했습니다.
Node.js는 Next.js API Route, Express 서버, 빌드/테스트 실행에 사용했습니다.
하린 캐릭터는 Next.js API Route가 OpenAI Responses API를 호출할 때 하린 전용 페르소나 프롬프트를 함께 보내 자연스러운 연애 대화가 나오도록 했습니다.
서윤, 민서, 지아도 Next.js API Route가 Node.js 런타임에서 OpenAI Responses API를 호출해 답변을 생성합니다.
금지어와 목숨 시스템은 프론트 로컬 규칙으로 먼저 검사하고, API Route에서도 한 번 더 차단합니다. 금지어는 카테고리와 상세 사유를 함께 반환합니다.
저장소에는 Express + SQLite 기반 백엔드와 Ollama/Codex CLI를 감싸는 LLM Gateway도 포함되어 있어 확장형 서버 구조를 갖고 있습니다.
카메라 인식이나 MediaPipe는 사용하지 않았고, 캐릭터와 배경은 정적 이미지 asset으로 처리했습니다.
```

## 15. 핵심 결론

이 프로젝트의 핵심 기술은 카메라 인식이 아니라 채팅 기반 미연시 게임 구조입니다.

핵심 구현 축:

1. Next.js/React 기반 게임 UI
2. OpenAI Responses API 기반 캐릭터 답변 생성
3. 하린 전용 페르소나 프롬프트
4. 규칙 기반 금지어/목숨/게임오버 시스템
5. 정적 이미지 기반 미연시 화면 연출
6. Express/SQLite/LLM Gateway로 확장 가능한 서버 아키텍처

MediaPipe, 카메라 인식, 비전 AI는 현재 사용되지 않았습니다.
