import { researchAgent } from "./agents/researchAgent.js";
import { contentAgent } from "./agents/contentAgent.js";
import { distributionAgent } from "./agents/distributionAgent.js";
import { feedbackAgent } from "./agents/feedbackAgent.js";
import { iterationEngine } from "./core/iterationEngine.js";
import { extractJSON } from "./utils/extractJSON.js";
import fs from "fs";

async function main() {
  const idea = "AI fitness app for Indian college students";

  console.log("═══════════════════════════════════════════════");
  console.log("🚀 AUTONOMOUS AI GROWTH AGENT");
  console.log("═══════════════════════════════════════════════");
  console.log(`\n💡 Startup Idea: "${idea}"\n`);

  // ─── Step 1: Research ─────────────────────────────────────
  console.log("━━━ STEP 1: Research Agent ━━━");
  const researchRaw = await researchAgent(idea);
  const researchData = extractJSON(researchRaw);

  if (!researchData) {
    console.error("❌ Research Agent failed. Aborting.");
    process.exit(1);
  }
  console.log("✅ Research complete.\n");

  // ═══════════════════════════════════════════════════════════
  // ROUND 1
  // ═══════════════════════════════════════════════════════════
  console.log("╔═══════════════════════════════════════╗");
  console.log("║          === ROUND 1 ===              ║");
  console.log("╚═══════════════════════════════════════╝\n");

  console.log("━━━ Content Generation ━━━");
  const contentRaw = await contentAgent(researchData);
  const content = extractJSON(contentRaw);

  if (!content || content.length === 0) {
    console.error("❌ Content Agent failed. Aborting.");
    process.exit(1);
  }

  // Add IDs
  content.forEach((post, i) => { if (!post.id) post.id = i + 1; });
  console.log(`✅ Generated ${content.length} posts.\n`);

  console.log("━━━ Distribution ━━━");
  const distributed = distributionAgent(content);

  console.log("━━━ Feedback ━━━");
  const { analyzed, bestPosts, avgScore } = feedbackAgent(distributed);

  console.log(`\n📊 Round 1 Avg Score: ${avgScore.toFixed(1)}`);

  // ═══════════════════════════════════════════════════════════
  // LEARNING PHASE
  // ═══════════════════════════════════════════════════════════
  console.log("\n╔═══════════════════════════════════════╗");
  console.log("║        === LEARNING ===               ║");
  console.log("╚═══════════════════════════════════════╝");

  const insights = iterationEngine(analyzed);

  // ═══════════════════════════════════════════════════════════
  // ROUND 2 (Improved)
  // ═══════════════════════════════════════════════════════════
  console.log("╔═══════════════════════════════════════╗");
  console.log("║      === ROUND 2 (Improved) ===       ║");
  console.log("╚═══════════════════════════════════════╝\n");

  console.log("━━━ Content Generation (with insights) ━━━");
  const improvedContentRaw = await contentAgent({
    ...researchData,
    insights,
  });
  const improvedContent = extractJSON(improvedContentRaw);

  let round2AvgScore = 0;

  if (!improvedContent || improvedContent.length === 0) {
    console.log("⚠️ Round 2 content generation failed.");
  } else {
    improvedContent.forEach((post, i) => { if (!post.id) post.id = i + 1; });
    console.log(`✅ Generated ${improvedContent.length} improved posts.\n`);

    console.log("━━━ Distribution (Round 2) ━━━");
    const distributed2 = distributionAgent(improvedContent);

    console.log("━━━ Feedback (Round 2) ━━━");
    const round2 = feedbackAgent(distributed2);
    round2AvgScore = round2.avgScore;

    console.log(`\n📊 Round 2 Avg Score: ${round2AvgScore.toFixed(1)}`);

    const improvement = round2AvgScore - avgScore;
    const arrow = improvement > 0 ? "📈" : improvement < 0 ? "📉" : "➡️";
    console.log(`${arrow} Change: ${improvement > 0 ? "+" : ""}${improvement.toFixed(1)} points`);
  }

  // ─── Save outputs ─────────────────────────────────────────
  const finalOutput = {
    idea,
    research: researchData,
    round1: { posts: content, avgScore },
    insights,
    round2: { posts: improvedContent || [], avgScore: round2AvgScore },
  };
  fs.writeFileSync("data/outputs.json", JSON.stringify(finalOutput, null, 2));

  console.log("\n═══════════════════════════════════════════════");
  console.log("✅ PIPELINE COMPLETE — 2 rounds executed");
  console.log("═══════════════════════════════════════════════\n");
}

main();
