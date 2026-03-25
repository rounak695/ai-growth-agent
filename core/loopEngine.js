import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function loopEngine(feedbackReport, previousPosts, researchData, startupIdea) {
  console.log("\n🔁 Iteration Engine — Refining content based on feedback...\n");

  const topPost = feedbackReport.topPerformer;
  const worstPost = feedbackReport.worstPerformer;

  const prompt = `
You are a growth optimization strategist.

A startup idea: "${startupIdea}"

Here is the engagement feedback from the last batch of social media posts:
- Average engagement: ${feedbackReport.averageEngagement}%
- Top performing post (${topPost.platform}): "${topPost.hook}" — Score: ${topPost.score}%
- Worst performing post (${worstPost.platform}): "${worstPost.hook}" — Score: ${worstPost.score}%

Research context:
${JSON.stringify(researchData, null, 2)}

Based on this, generate 5 IMPROVED social media posts that:
1. Mirror the style/tone of the top performer
2. Avoid the patterns of the worst performer
3. Push engagement even higher

Return ONLY JSON in this format:
{
  "improvements": ["what you changed and why"],
  "posts": [
    {
      "id": 1,
      "hook": "...",
      "body": "...",
      "cta": "...",
      "platform": "twitter or linkedin",
      "hashtags": ["#tag"]
    }
  ]
}
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
  });

  return response.choices[0].message.content;
}
