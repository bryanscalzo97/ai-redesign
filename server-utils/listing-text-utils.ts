export function buildListingTextPrompt(
  roomType: string,
  style: string,
  guestType?: string
): string {
  const target = guestType || "general travelers";

  return `Write a compelling Airbnb/VRBO listing description for a ${roomType} styled as "${style}".
Target guest: ${target}.

Include:
1. A catchy headline (max 10 words)
2. A short description (2-3 paragraphs, inviting and warm)
3. Key highlights (3-5 bullet points about the space)
4. A "The Space" section (1 paragraph)

Tone: professional, inviting, concise. Max 300 words total.
Do NOT include any markdown formatting. Use plain text with line breaks.
Do NOT include any placeholder text like [Your Name] or [City]. Keep it generic enough to apply to any location.`;
}
