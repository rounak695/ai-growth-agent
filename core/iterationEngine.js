// core/iterationEngine.js

export function iterationEngine(feedbackData) {
  console.log("\n🔁 Iteration Engine — Extracting learning signals...\n");

  const bestPosts = feedbackData.filter(
    (item) => item.engagementScore > 75
  );

  const insights = extractInsights(bestPosts);

  console.log(`  📊 Analyzed ${feedbackData.length} posts`);
  console.log(`  🏆 High performers: ${bestPosts.length}`);
  console.log(`  📝 Insights:`);
  console.log(`     Short content preferred: ${insights.prefersShortContent}`);
  console.log(`     Uses questions: ${insights.usesQuestions}`);
  console.log(`     Strong hooks: ${insights.usesStrongHooks}`);
  console.log(`     Format: ${insights.formattingStyle}\n`);

  return insights;
}

// Extract patterns from best-performing posts
function extractInsights(posts) {
  if (posts.length === 0) {
    return {
      prefersShortContent: true,
      usesQuestions: true,
      usesStrongHooks: true,
      formattingStyle: "multi-line",
    };
  }

  return {
    prefersShortContent: posts.every((p) => p.post.length < 200),
    usesQuestions: posts.some((p) => p.post.includes("?")),
    usesStrongHooks: posts.some(
      (p) =>
        p.post.toLowerCase().includes("you") ||
        p.post.toLowerCase().includes("stop")
    ),
    formattingStyle: "multi-line",
  };
}
