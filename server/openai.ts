import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

let client: OpenAI | null = null;
function getClient() {
  if (!apiKey) return null;
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

export function isAiAvailable() {
  return Boolean(apiKey);
}

export async function generateStoryContent(prompt: string, context?: string): Promise<string> {
  const c = getClient();
  if (!c) {
    return `AI is not configured. Add OPENAI_API_KEY to enable suggestions.\n\nPrompt was: ${prompt}`;
  }
  const response = await c.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a creative writing collaborator helping authors craft interactive stories. Write evocative, vivid prose in 1-3 short paragraphs.",
      },
      ...(context ? [{ role: "user" as const, content: `Context so far:\n${context}` }] : []),
      { role: "user", content: prompt },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}

export async function analyzeSentiment(text: string): Promise<{
  mood: string;
  score: number;
}> {
  const c = getClient();
  if (!c) return { mood: "neutral", score: 0 };
  const response = await c.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Analyze the mood of the text. Respond as JSON: {"mood": "<one word: joyful|melancholic|tense|hopeful|mysterious|romantic|neutral>", "score": <-1..1 number>}',
      },
      { role: "user", content: text },
    ],
  });
  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    return {
      mood: typeof parsed.mood === "string" ? parsed.mood : "neutral",
      score: typeof parsed.score === "number" ? parsed.score : 0,
    };
  } catch {
    return { mood: "neutral", score: 0 };
  }
}

export async function generateChoices(context: string): Promise<string[]> {
  const c = getClient();
  if (!c) return ["Continue forward", "Pause and consider", "Take an unexpected turn"];
  const response = await c.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          'Generate exactly 3 short branching choice labels for an interactive story. Respond as JSON: {"choices": ["...", "...", "..."]}',
      },
      { role: "user", content: context },
    ],
  });
  try {
    const parsed = JSON.parse(response.choices[0]?.message?.content ?? "{}");
    if (Array.isArray(parsed.choices)) {
      return parsed.choices.slice(0, 3).map((c: unknown) => String(c));
    }
  } catch {}
  return ["Continue forward", "Pause and consider", "Take an unexpected turn"];
}

export async function improveWriting(text: string): Promise<string> {
  const c = getClient();
  if (!c) return text;
  const response = await c.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Improve the following passage for clarity, rhythm, and vivid imagery. Keep the author's voice. Return only the revised passage.",
      },
      { role: "user", content: text },
    ],
  });
  return response.choices[0]?.message?.content ?? text;
}
