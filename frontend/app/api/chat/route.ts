import { getReply } from "@/lib/characters"
import { evaluateBlockedMessage } from "@/lib/blocked-keywords"
import { buildOpenAiChatPayload, type ChatCharacter, type ChatMessage } from "@/lib/openai-chat"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = (await request.json()) as {
    character?: ChatCharacter
    messages?: ChatMessage[]
    text?: string
  }

  const character = body.character
  const text = body.text?.trim() ?? ""
  const messages = body.messages ?? []

  if (!character || !text) {
    return Response.json({ error: "Invalid chat request." }, { status: 400 })
  }

  const blockedMessage = evaluateBlockedMessage(text)
  if (blockedMessage.blocked) {
    return Response.json(
      {
        blocked: true,
        warning: blockedMessage.warning,
        reason: blockedMessage.reason,
        category: blockedMessage.category,
      },
      { status: 400 },
    )
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return Response.json(
      {
        error: "OPENAI_API_KEY is not set.",
        reply: getReply(character.id, countUserTurns(messages)),
      },
      { status: 503 },
    )
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"
  const openAiPayload = buildOpenAiChatPayload({ model, character, messages, text })

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openAiPayload),
    })

    const payload = (await response.json()) as {
      output_text?: string
      output?: Array<{ content?: Array<{ text?: string }> }>
      error?: { message?: string }
    }

    const reply = extractOutputText(payload)
    if (!response.ok || !reply) {
      return Response.json({
        reply: getReply(character.id, countUserTurns(messages)),
        fallback: true,
        error: payload.error?.message ?? "OpenAI response failed.",
      })
    }

    return Response.json({ reply })
  } catch {
    return Response.json({
      reply: getReply(character.id, countUserTurns(messages)),
      fallback: true,
    })
  }
}

function countUserTurns(messages: ChatMessage[]) {
  return messages.filter((message) => message.sender === "user").length
}

function extractOutputText(payload: {
  output_text?: string
  output?: Array<{ content?: Array<{ text?: string }> }>
}) {
  if (payload.output_text?.trim()) {
    return payload.output_text.trim()
  }

  return payload.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .find((text) => text?.trim())
    ?.trim()
}
