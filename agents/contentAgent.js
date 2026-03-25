import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function contentAgent(researchData) {
  // Check if insights are embedded in the research data
  const insights = researchData.insights || null;

  let insightsBlock = "";
  if (insights) {
    insightsBlock = `
Also use these performance insights from previous rounds:
${JSON.stringify(insights)}

Rules based on insights:
- ${insights.prefersShortContent ? "Keep posts SHORT (under 200 chars)" : "Longer posts are OK"}
- ${insights.usesQuestions ? "Use QUESTIONS to boost engagement" : "Statements work fine"}
- ${insights.usesStrongHooks ? "Use direct 'you' language and bold openers" : "Keep hooks varied"}
- Use ${insights.formattingStyle} formatting
`;
  }

  const prompt = `
You are a viral content strategist.

Using this research data:
${JSON.stringify(researchData)}

${insightsBlock}

Generate 5 HIGHLY VIRAL social media posts.

Each post must include:
- hook (attention-grabbing)
- body (short, valuable)
- cta (engagement-driven)
- platform ("twitter" or "linkedin")

Use these hook types:
- Curiosity ("Nobody talks about this…")
- Contrarian ("Stop doing X…")
- Pain-driven ("You're failing because…")
- Data-backed ("90% of people…")

Also include emotional triggers:
- fear
- aspiration
- urgency

Return ONLY JSON array like:
[
  {
    "hook": "...",
    "body": "...",
    "cta": "...",
    "platform": "twitter"
  }
]

Rules:
- Hooks must be aggressive and scroll-stopping
- Keep sentences short
- No fluff
- Write like a top creator
- CRITICAL: Ensure all newlines inside JSON strings are properly escaped as \\n. NEVER use unescaped literal newlines in the JSON output.
${insights ? "- IMPORTANT: Apply the performance insights to make these posts BETTER than the previous round" : ""}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
  });

  return response.choices[0].message.content;
}
