// agents/feedbackAgent.js

export function feedbackAgent(distributedPosts) {
  console.log("\n📊 Feedback Agent — Analyzing engagement...\n");

  const analyzed = distributedPosts.map((item) => {
    const score = calculateScore(item.post);

    const entry = {
      ...item,
      engagementScore: score,
      likes: Math.floor(score * 2),
      impressions: Math.floor(score * 20),
      feedback: generateFeedback(score),
      status: "analyzed",
    };

    const icon = score > 80 ? "🔥" : score > 60 ? "👍" : "📉";
    console.log(
      `  ${icon} [${item.platform.toUpperCase()}] Score: ${score} | ❤️ ${entry.likes} | 👁 ${entry.impressions} — ${entry.feedback}`
    );

    return entry;
  });

  // Learning signal: extract best-performing posts
  const bestPosts = analyzed.filter((p) => p.engagementScore > 75);
  const avgScore =
    analyzed.reduce((sum, p) => sum + p.engagementScore, 0) / analyzed.length;

  console.log(`\n📈 Summary:`);
  console.log(`   Avg Score: ${avgScore.toFixed(1)}`);
  console.log(`   🏆 High Performers: ${bestPosts.length}/${analyzed.length}`);

  if (bestPosts.length > 0) {
    console.log(`   📝 Best hooks:`);
    bestPosts.forEach((p) => {
      const hook = p.post.split("\n")[0].substring(0, 60);
      console.log(`      → "${hook}..."`);
    });
  }

  console.log("");

  return { analyzed, bestPosts, avgScore };
}

// Deterministic scoring based on post quality signals
function calculateScore(post) {
  let score = 50;

  if (post.length < 200) score += 10;       // concise = better
  if (post.includes("you")) score += 5;      // direct address
  if (post.includes("?")) score += 5;        // questions engage
  if (post.includes("!")) score += 5;        // energy
  if (post.split("\n").length > 2) score += 10; // formatting
  if (/\d+%/.test(post)) score += 5;         // data-backed
  if (post.toLowerCase().includes("free")) score += 3;
  if (post.toLowerCase().includes("secret")) score += 3;
  if (post.length > 300) score -= 10;        // too long penalty

  return Math.min(score, 100);
}

// Rule-based feedback generation
function generateFeedback(score) {
  if (score > 80) return "High engagement potential";
  if (score > 60) return "Moderate engagement";
  return "Needs improvement";
}

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function aiFeedback(postText) {
  const prompt = `
You are an AI system evaluator designed to simulate real-world content performance without using external APIs.

Your task is to analyze a given social media post and generate a realistic engagement evaluation using internal heuristics.

IMPORTANT CONTEXT:
- Do NOT assume real user data
- Do NOT reference actual platform analytics
- This is a simulated evaluation system
- You must behave like a growth engineer designing a feedback loop

EVALUATION CRITERIA (use these explicitly):
1. Hook Strength (Does it grab attention immediately?)
2. Readability (Short sentences, clarity, flow)
3. Emotional Trigger (Curiosity, fear, aspiration, urgency)
4. Structure (Formatting, line breaks, scannability)
5. Call-to-Action (Does it drive engagement?)

TASK:
For the given post:
1. Assign an engagement score (0–100)
2. Simulate:
   - likes
   - impressions
3. Provide a short explanation of WHY it performed that way
4. Clearly state that this is a simulated evaluation based on heuristics
5. Classify the post style: curiosity, contrarian, motivational, data-driven

OUTPUT FORMAT (STRICT JSON):

{
  "engagementScore": 0,
  "likes": 0,
  "impressions": 0,
  "analysis": {
    "hookStrength": "...",
    "readability": "...",
    "emotionalTrigger": "...",
    "structure": "...",
    "ctaEffectiveness": "..."
  },
  "postStyle": "...",
  "finalFeedback": "...",
  "note": "This evaluation is simulated using engagement heuristics and does not rely on real-world API data."
}

POST:
"""
${postText}
"""
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const match = response.choices[0].message.content.match(/[\[{][\s\S]*[\]}]/);
    return match ? JSON.parse(match[0]) : null;
  } catch (err) {
    console.error("AI Feedback Error:", err);
    return null;
  }
}

