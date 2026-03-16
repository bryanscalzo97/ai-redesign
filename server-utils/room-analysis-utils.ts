export function buildRoomAnalysisPrompt(
  roomType: string,
  style: string,
  guestType?: string
): string {
  const target = guestType || "general travelers";

  return `You are a short-term rental staging expert. Analyze this ${roomType} photo and evaluate it for listing on platforms like Airbnb or VRBO.

Target guest: ${target}.
Desired style: ${style}.

Provide a JSON response with:
1. "score": a number from 0 to 10 (one decimal) rating the current space for short-term rental appeal.
2. "issues": an array of objects with "label" (string) describing problems you see — things like poor lighting, clutter, dated furniture, bad layout, missing amenities, etc. Keep each label concise (under 8 words). List 3-6 issues.
3. "suggestions": an array of objects with:
   - "action": one of "add", "remove", "move", "replace"
   - "item": what to add/remove/move/replace (e.g. "warm lamp", "extra chair")
   - "detail": optional extra context (e.g. "near the window", "with a modern alternative")
   List 4-8 actionable suggestions that would improve the score. Prioritize high-impact, low-cost changes.

Be honest but constructive. Focus on what would increase perceived value and booking rates.

IMPORTANT: Respond ONLY with valid JSON, no markdown, no explanation. Example format:
{"score":6.5,"issues":[{"label":"Poor lighting"}],"suggestions":[{"action":"add","item":"warm lamp","detail":"near the bed"}]}`;
}

export const ROOM_ANALYSIS_RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    score: { type: "NUMBER" },
    issues: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          label: { type: "STRING" },
        },
        required: ["label"],
      },
    },
    suggestions: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          action: {
            type: "STRING",
            enum: ["add", "remove", "move", "replace"],
          },
          item: { type: "STRING" },
          detail: { type: "STRING" },
        },
        required: ["action", "item"],
      },
    },
  },
  required: ["score", "issues", "suggestions"],
};
