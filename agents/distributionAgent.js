// agents/distributionAgent.js

export function distributionAgent(contentArray) {
  console.log("\n📤 Distribution Agent — Simulating content posting...\n");

  const scheduledPosts = contentArray.map((item, index) => {
    // Format into final post: hook + body + CTA
    const post = `${item.hook}\n\n${item.body}\n\n${item.cta}`;

    const entry = {
      id: `post_${Date.now()}_${index}`,
      post,
      platform: item.platform,
      scheduledTime: generateScheduleTime(index),
      status: simulateStatus(),
    };

    const platformIcon = item.platform === "twitter" ? "🐦" : "💼";
    const statusIcon = entry.status === "posted" ? "✅" : entry.status === "scheduled" ? "🕐" : "❌";
    console.log(
      `  ${platformIcon} ${statusIcon} [${entry.platform.toUpperCase()}] ${entry.status} → ${entry.scheduledTime}`
    );
    console.log(`     📝 "${item.hook.substring(0, 60)}..."`);

    return entry;
  });

  const posted = scheduledPosts.filter(p => p.status === "posted").length;
  const scheduled = scheduledPosts.filter(p => p.status === "scheduled").length;
  const failed = scheduledPosts.filter(p => p.status === "failed").length;

  console.log(`\n📊 Summary: ${posted} posted | ${scheduled} scheduled | ${failed} failed`);
  console.log(`✅ ${scheduledPosts.length} posts processed.\n`);

  return scheduledPosts;
}

// Smart scheduling: use prime engagement hours
function generateScheduleTime(index) {
  const now = new Date();

  // Prime engagement hours per platform research
  const hours = [9, 12, 18, 20];

  now.setHours(hours[index % hours.length]);
  now.setMinutes(0);
  now.setSeconds(0);

  // If index >= hours.length, push to next day
  if (index >= hours.length) {
    now.setDate(now.getDate() + Math.floor(index / hours.length));
  }

  return now.toISOString();
}

// Simulate realistic status distribution
function simulateStatus() {
  const rand = Math.random();
  if (rand < 0.6) return "posted";
  if (rand < 0.95) return "scheduled";
  return "failed";
}
