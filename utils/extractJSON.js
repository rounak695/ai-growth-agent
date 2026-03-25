export function extractJSON(text) {
  try {
    // Match JSON objects or arrays
    const match = text.match(/[\[{][\s\S]*[\]}]/);
    return match ? JSON.parse(match[0]) : null;
  } catch (error) {
    console.error("JSON parsing failed:", error);
    return null;
  }
}
