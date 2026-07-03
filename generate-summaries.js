/* ============================================================
   Plain-English Summary Generator
   Fetches the latest AI news, asks Claude to explain each story
   in simple words (plus "why it matters to a small business"),
   and saves the result to summaries.json for the website to show.

   Run with:  node generate-summaries.js

   The API key is read from the ANTHROPIC_API_KEY environment
   variable, or from the .env file in the folder ABOVE this one
   (kept outside the site folder so it's never deployed).
   ============================================================ */

const fs = require("fs");
const path = require("path");

// Haiku: Anthropic's fast, low-cost model — plenty for short summaries,
// and keeps the cost to pennies per month. Swap for "claude-opus-4-8"
// if you ever want maximum quality over cost.
const MODEL = "claude-haiku-4-5";
const STORY_COUNT = 12;

const FEEDS = [
  { name: "Google News", url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en" },
  { name: "TechCrunch", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "The Verge", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml" }
];
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";

/* ---------- API key ---------- */

function getApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY.trim();
  const envPath = path.join(__dirname, "..", ".env");
  if (fs.existsSync(envPath)) {
    const match = fs.readFileSync(envPath, "utf8").match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (match) {
      const key = match[1].trim();
      if (key && !key.startsWith("PASTE")) return key;
    }
  }
  console.error(
    "\nNo API key found.\n" +
    "Open the file  ../.env  (in the 'Prompt Engineer' folder) and paste your key\n" +
    "after ANTHROPIC_API_KEY=  then run this script again.\n"
  );
  process.exit(1);
}

/* ---------- Fetch the news (same sources as the website) ---------- */

function stripHtml(html) {
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

async function fetchFeed(feed) {
  const res = await fetch(RSS2JSON + encodeURIComponent(feed.url));
  if (!res.ok) throw new Error(feed.name + " failed: HTTP " + res.status);
  const data = await res.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error(feed.name + " bad data");

  return data.items.map((item) => {
    const utc = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(item.pubDate || "");
    const date = utc ? new Date(utc[1] + "T" + utc[2] + "Z") : new Date(item.pubDate);

    let summary = stripHtml(item.description || "");
    let source = feed.name;
    let title = item.title || "";
    if (feed.name === "Google News") {
      summary = "";
      const parts = title.split(" - ");
      if (parts.length > 1) {
        source = parts.pop().trim();
        title = parts.join(" - ").trim();
      }
    }
    if (summary.length > 400) summary = summary.slice(0, 400);
    return { title, link: item.link || "", date, summary, source };
  }).filter((s) => s.title);
}

async function getTopStories() {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let stories = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);
  if (stories.length === 0) throw new Error("Could not load any news feeds.");

  stories = stories.filter((s) => s.date && !isNaN(s.date));
  stories.sort((a, b) => b.date - a.date);
  const seen = new Set();
  return stories.filter((s) => {
    const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, STORY_COUNT);
}

/* ---------- Ask Claude for plain-English summaries ---------- */

async function summarize(apiKey, stories) {
  const storyList = stories
    .map((s, i) => `${i}. HEADLINE: ${s.title}\n   SOURCE: ${s.source}${s.summary ? "\n   EXCERPT: " + s.summary : ""}`)
    .join("\n\n");

  const body = {
    model: MODEL,
    max_tokens: 4000,
    system:
      "You explain AI news to retired people and older small-business owners who are not comfortable " +
      "with technology. Write at a level a smart 12-year-old would understand. Never use jargon without " +
      "immediately explaining it in everyday words. Use short sentences. Use comparisons to everyday life " +
      "(shops, cars, recipes, letters). Never hype. Be honest when a story is mostly only relevant to " +
      "investors or engineers.",
    messages: [
      {
        role: "user",
        content:
          "Here are today's AI news headlines. For each one, write:\n" +
          "1. simple_summary: 1-2 short sentences explaining what happened, in plain everyday English.\n" +
          "2. why_it_matters: 1 short sentence on what this means for an ordinary person or small business " +
          "owner. If it genuinely doesn't affect them, say so honestly (e.g. \"This mostly matters to " +
          "investors — nothing you need to act on.\").\n\n" +
          "Base your answer only on the headline and excerpt given. If a headline is too vague to explain " +
          "confidently, keep the summary very general rather than guessing details.\n\n" +
          storyList
      }
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            summaries: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  index: { type: "integer" },
                  simple_summary: { type: "string" },
                  why_it_matters: { type: "string" }
                },
                required: ["index", "simple_summary", "why_it_matters"],
                additionalProperties: false
              }
            }
          },
          required: ["summaries"],
          additionalProperties: false
        }
      }
    }
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error("Claude API error (HTTP " + res.status + "): " + (data.error?.message || JSON.stringify(data)));
  }
  if (data.stop_reason === "refusal") {
    throw new Error("The model declined this request (stop_reason: refusal).");
  }

  const text = data.content?.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text in API response.");
  const parsed = JSON.parse(text);

  console.log(
    `Tokens used: ${data.usage.input_tokens} in / ${data.usage.output_tokens} out ` +
    `(≈ $${(data.usage.input_tokens * 1e-6 + data.usage.output_tokens * 5e-6).toFixed(4)} with ${MODEL})`
  );
  return parsed.summaries;
}

/* ---------- Main ---------- */

async function main() {
  const apiKey = getApiKey();

  console.log("Fetching the latest AI news…");
  const stories = await getTopStories();
  console.log(`Got ${stories.length} stories. Asking Claude for plain-English summaries…`);

  const summaries = await summarize(apiKey, stories);
  const byIndex = new Map(summaries.map((s) => [s.index, s]));

  const output = {
    generated_at: new Date().toISOString(),
    model: MODEL,
    stories: stories.map((s, i) => ({
      title: s.title,
      link: s.link,
      source: s.source,
      date: s.date.toISOString(),
      simple_summary: byIndex.get(i)?.simple_summary || "",
      why_it_matters: byIndex.get(i)?.why_it_matters || ""
    }))
  };

  const outPath = path.join(__dirname, "summaries.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Done! Wrote ${output.stories.length} summaries to summaries.json`);
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
