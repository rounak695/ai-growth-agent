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
