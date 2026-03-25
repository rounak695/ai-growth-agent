import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function researchAgent(startupIdea) {
  const prompt = `
You are a startup research analyst.

Analyze this idea: "${startupIdea}"

Return ONLY JSON in this format:
{
  "targetAudience": "...",
  "problems": ["...", "..."],
  "competitors": ["...", "..."],
  "contentAngles": ["...", "..."]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function safeResearchAgent(idea) {
  try {
    return await researchAgent(idea);
  } catch (err) {
    console.log("Retrying...");
    return await researchAgent(idea);
  }
}
