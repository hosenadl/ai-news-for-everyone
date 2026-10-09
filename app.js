/* ============================================================
   AI News in Plain English
   - Fetches live AI news from public RSS feeds
   - Highlights technical jargon and explains it on click
   - Text size controls for easier reading
   ============================================================ */

/* ---------- Plain-English word guide ---------- */
/* Order matters: longer phrases are matched before shorter ones. */
const GLOSSARY = [
  {
    term: "Artificial Intelligence",
    aliases: ["artificial intelligence", "\\bAI\\b", "\\bA\\.I\\.\\B"],
    meaning: "Computer software that can do tasks which normally need a human, such as writing, answering questions, or recognizing pictures.",
    example: "Example: asking a computer \"write a birthday message for my sister\" and getting a nice message back."
  },
  {
    term: "Generative AI",
    aliases: ["generative ai", "genai", "gen ai"],
    meaning: "AI that creates brand-new text, pictures, music, or video, instead of just finding things that already exist.",
    example: "Example: typing \"draw a cat wearing a chef's hat\" and getting a brand-new picture."
  },
  {
    term: "ChatGPT",
    aliases: ["chatgpt", "chat gpt"],
    meaning: "The most popular AI chat tool, made by a company called OpenAI. You type questions in normal English and it answers.",
    example: "Example: like texting a very well-read assistant who replies instantly."
  },
  {
    term: "Chatbot",
    aliases: ["chatbots", "chatbot"],
    meaning: "A computer program you can have a typed conversation with, like texting with a helpful robot.",
    example: "Example: the little \"How can I help you?\" chat window on many shopping websites."
  },
  {
    term: "Large Language Model (LLM)",
    aliases: ["large language models", "large language model", "\\bLLMs\\b", "\\bLLM\\b", "language model"],
    meaning: "The engine inside tools like ChatGPT. It has \"read\" enormous amounts of text, which is how it learned to write and answer questions.",
    example: "Think of ChatGPT as the car and the language model as the engine under the hood."
  },
  {
    term: "Machine Learning",
    aliases: ["machine learning", "\\bML\\b"],
    meaning: "How computers get smarter. Instead of being given exact instructions, they learn from lots of examples, a bit like people learning from experience.",
    example: "Example: show a computer 10,000 photos of apples, and it learns to spot an apple in a new photo."
  },
  {
    term: "Algorithm",
    aliases: ["algorithms", "algorithm", "algorithmic"],
    meaning: "A set of step-by-step instructions a computer follows, like a recipe written for a machine.",
    example: "Example: Facebook's algorithm is the recipe that decides which posts you see first."
  },
  {
    term: "Neural Network",
    aliases: ["neural networks", "neural network", "neural net"],
    meaning: "A way of building AI that is loosely inspired by how the human brain works, with many small connected parts working together.",
    example: "When you see this word in a news story, you can safely read it as \"the AI's brain.\""
  },
  {
    term: "Hallucination",
    aliases: ["hallucinations", "hallucination", "hallucinates", "hallucinate", "hallucinating"],
    meaning: "When AI confidently states something that is simply wrong or made up. This is why you should double-check important facts.",
    example: "Example: an AI inventing a book title that sounds real but doesn't exist."
  },
  {
    term: "Prompt",
    aliases: ["prompts", "prompting", "prompt engineering", "\\bprompt\\b"],
    meaning: "The question or instruction you type into an AI tool. A clearer prompt gets a better answer.",
    example: "Example: \"Write a short, friendly holiday closing notice for my shop\" is a prompt."
  },
  {
    term: "OpenAI",
    aliases: ["openai", "open ai"],
    meaning: "The company that makes ChatGPT. One of the biggest AI companies in the world.",
    example: "Other big AI companies you'll see in the news: Anthropic (makes Claude), Google (makes Gemini), and Meta (Facebook's owner)."
  },
  {
    term: "Anthropic",
    aliases: ["anthropic"],
    meaning: "An AI company that makes a ChatGPT-like tool called Claude, with a strong focus on making AI safe and reliable.",
    example: "You can try their tool free at claude.ai. It works much like ChatGPT."
  },
  {
    term: "Claude",
    aliases: ["\\bClaude\\b"],
    meaning: "An AI chat tool made by a company called Anthropic. It works like ChatGPT: you type a question, it types back an answer.",
    example: "Example: asking Claude \"explain this insurance letter in simple terms.\""
  },
  {
    term: "Gemini",
    aliases: ["\\bGemini\\b"],
    meaning: "Google's AI chat tool, their answer to ChatGPT. It's built into Google search and Android phones.",
    example: "Those \"AI Overview\" answers at the top of Google searches come from Gemini."
  },
  {
    term: "Copilot",
    aliases: ["copilots", "copilot"],
    meaning: "Microsoft's name for its AI helpers, built into Windows and Office programs like Word and Excel.",
    example: "Example: in Word, Copilot can write a first draft of a letter for you."
  },
  {
    term: "AGI",
    aliases: ["artificial general intelligence", "\\bAGI\\b", "superintelligence", "superintelligent"],
    meaning: "A future kind of AI that could match or beat humans at almost every kind of thinking. It does not exist yet, but companies are racing to build it.",
    example: "When you see \"AGI\" in headlines, read it as \"the super-smart AI they're trying to build next.\""
  },
  {
    term: "Chip / Semiconductor",
    aliases: ["semiconductors", "semiconductor", "\\bGPUs\\b", "\\bGPU\\b", "ai chips", "ai chip", "\\bchips\\b", "\\bchipmaker\\b"],
    meaning: "The tiny electronic \"brains\" inside computers. AI needs huge numbers of very powerful chips, which is why chip companies are big news.",
    example: "Nvidia became one of the world's most valuable companies because it makes the chips AI runs on."
  },
  {
    term: "Nvidia",
    aliases: ["nvidia"],
    meaning: "The company that makes most of the powerful computer chips that AI runs on. Think of them as selling the shovels in a gold rush.",
    example: "Their chips are so in demand that Nvidia became one of the most valuable companies in the world."
  },
  {
    term: "Data Center",
    aliases: ["data centers", "data centres", "data center", "data centre"],
    meaning: "A giant building full of computers. AI tools don't actually run on your phone. They run in these buildings and send the answers to your screen.",
    example: "Companies are spending billions building data centers, which is why it's in the news so often."
  },
  {
    term: "Training",
    aliases: ["training data", "trained on", "\\btraining\\b"],
    meaning: "How an AI \"learns,\" by reading or viewing enormous amounts of text and images before it's released to the public.",
    example: "Like an apprentice studying millions of examples before starting the job."
  },
  {
    term: "Open Source",
    aliases: ["open-source", "open source", "open weights", "open-weight"],
    meaning: "Software whose recipe is shared publicly for free, so anyone can use it or improve it. Think of a community cookbook rather than a secret family recipe.",
    example: "Meta (Facebook's owner) gives away some of its AI this way."
  },
  {
    term: "Startup",
    aliases: ["startups", "startup", "start-up", "start-ups"],
    meaning: "A young company, often built around one new idea, hoping to grow fast. The AI world is full of them.",
    example: "OpenAI itself started as a small startup less than a decade ago."
  },
  {
    term: "Deepfake",
    aliases: ["deepfakes", "deepfake", "deep fake"],
    meaning: "A fake photo, video, or voice recording made with AI that looks or sounds convincingly real. A reason to be careful about what you see online.",
    example: "Example: a fake video of a celebrity \"endorsing\" a product they've never heard of. If a video seems shocking, check a trusted news source."
  },
  {
    term: "AI Agent",
    aliases: ["ai agents", "ai agent", "agentic", "\\bagents\\b"],
    meaning: "AI that doesn't just answer questions but carries out multi-step tasks on its own, such as booking an appointment or filling out a form.",
    example: "Think: an assistant who doesn't just tell you the restaurant's number but calls and makes the reservation."
  },
  {
    term: "Regulation",
    aliases: ["ai regulation", "ai act", "\\bregulators\\b", "\\bregulation\\b"],
    meaning: "Government rules about how AI can be built and used, meant to keep it safe and fair. Different countries are writing different rules.",
    example: "Similar to how governments set safety rules for cars and medicines."
  },
  {
    term: "Automation",
    aliases: ["automation", "automated", "automate"],
    meaning: "Having machines or software do tasks automatically that people used to do by hand.",
    example: "Example: an email that sends itself to every new customer, without you lifting a finger."
  },
  {
    term: "Cloud",
    aliases: ["cloud computing", "the cloud", "\\bcloud\\b"],
    meaning: "Storing files or running programs on big computers you reach through the internet, instead of on your own machine.",
    example: "Example: your photos backed up \"in the cloud\" are really sitting safely on a company's computers far away."
  },
  {
    term: "Compute",
    aliases: ["computing power", "\\bcompute\\b"],
    meaning: "Raw computer horsepower. AI needs enormous amounts of it, which costs a lot of money and electricity.",
    example: "When companies \"buy more compute,\" they're buying more computer muscle to run AI."
  },
  {
    term: "Valuation",
    aliases: ["valuations", "valuation", "\\bIPO\\b"],
    meaning: "What a company is judged to be worth in dollars. AI company valuations are in the news because the numbers are enormous.",
    example: "Example: \"a $300 billion valuation\" means investors think the whole company is worth $300 billion."
  }
];

/* ---------- News sources ---------- */
const FEEDS = [
  {
    name: "Google News",
    url: "https://news.google.com/rss/search?q=artificial+intelligence&hl=en-US&gl=US&ceid=US:en"
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/"
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"
  }
];

/* Two free services let the browser read news feeds. We try the first,
   and fall back to the second if it's having a bad day. */
const RSS2JSON = "https://api.rss2json.com/v1/api.json?rss_url=";
const PROXY = "https://api.allorigins.win/raw?url=";
const MAX_STORIES = 12;

/* ---------- Helpers ---------- */

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (isNaN(seconds) || seconds < 0) return "Just in";
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 2) return "Just now";
  if (minutes < 60) return minutes + " minutes ago";
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return hours + " hours ago";
  if (days === 1) return "Yesterday";
  return days + " days ago";
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || "").replace(/\s+/g, " ").trim();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/* A stable id for a story, so duplicates, saved items and AI summaries
   can all be matched up by headline. */
function storyKey(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
}

/* "The Verge" -> "TV", "TechCrunch" -> "TC" — for the little source badge */
function initials(source) {
  const words = source.replace(/^the\s+/i, "").split(/[\s-]+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

const CATEGORY_LABELS = {
  business: "Money & Business",
  gadgets: "Gadgets & Apps",
  safety: "Safety & Rules",
  other: "AI News"
};

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19V5z" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke-linecap="round"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2.5"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="m12 4 2.5 5.1 5.6.8-4 4 .9 5.6L12 16.9 7 19.5l.9-5.6-4-4 5.6-.8L12 4z" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* Wrap known jargon in clickable buttons. Works on escaped plain text. */
function highlightJargon(plainText) {
  let html = escapeHtml(plainText);

  GLOSSARY.forEach((entry, index) => {
    entry.aliases.forEach((alias) => {
      const pattern = alias.startsWith("\\b") || alias.includes("\\")
        ? alias
        : "\\b" + alias.replace(/[.*+?^${}()|[\]]/g, "\\$&") + "\\b";
      let regex;
      try {
        regex = new RegExp(pattern, "gi");
      } catch {
        return;
      }
      html = html.replace(regex, (match, ...args) => {
        const offset = args[args.length - 2];
        // Skip if inside an already-created button tag
        const before = html.slice(0, offset);
        const lastOpen = before.lastIndexOf("<button");
        const lastClose = before.lastIndexOf("</button>");
        if (lastOpen > lastClose) return match;
        return '<button type="button" class="jargon-term" data-term="' + index + '">' + match + "</button>";
      });
    });
  });
  return html;
}

/* Sort each story into a simple category by looking for everyday keywords. */
const CATEGORY_KEYWORDS = {
  safety: /\bscam|fraud|deepfake|hack|security|privacy|lawsuit|sue[ds]?\b|court|regulat|\bban\b|banned|safety|crime|steal|phishing|police|illegal\b|pentagon|military|government|election|copyright/i,
  business: /market|stock|invest|billion|valuation|\bipo\b|revenue|funding|earnings|shares|wall street|economy|acquisition|\bdeal\b|profit|startup|forecast|venture|\bvc\b|\bceo\b|enterprise|consumer|company|business/i,
  gadgets: /\bphone|iphone|android|\bapp\b|\bapps\b|device|gadget|chatgpt|gemini|copilot|alexa|siri|laptop|browser|assistant|launches|update|feature|robot|midjourney|video generator/i
};

function categorize(story) {
  const text = story.title + " " + (story.summary || "");
  for (const [cat, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(text)) return cat;
  }
  return "other";
}

/* ---------- Fetch + parse feeds ---------- */

async function fetchFeed(feed) {
  try {
    return await fetchViaRss2Json(feed);
  } catch {
    return await fetchViaProxy(feed);
  }
}

/* Primary route: rss2json turns any news feed into easy-to-read JSON */
async function fetchViaRss2Json(feed) {
  const response = await fetch(RSS2JSON + encodeURIComponent(feed.url));
  if (!response.ok) throw new Error("rss2json failed: " + feed.name);
  const data = await response.json();
  if (data.status !== "ok" || !Array.isArray(data.items)) {
    throw new Error("rss2json bad data: " + feed.name);
  }

  return data.items.map((item) => {
    // rss2json dates look like "2026-07-01 01:13:20" and are in UTC
    const utcMatch = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})$/.exec(item.pubDate || "");
    const date = utcMatch
      ? new Date(utcMatch[1] + "T" + utcMatch[2] + "Z")
      : new Date(item.pubDate);

    let summary = stripHtml(item.description || item.content || "");
    if (feed.name === "Google News") summary = "";
    if (summary.length > 260) summary = summary.slice(0, 257).trimEnd() + "…";

    let source = feed.name;
    let cleanTitle = item.title || "";
    if (feed.name === "Google News") {
      const parts = cleanTitle.split(" - ");
      if (parts.length > 1) {
        source = parts.pop().trim();
        cleanTitle = parts.join(" - ").trim();
      }
    }
    if (summary.toLowerCase() === cleanTitle.toLowerCase()) summary = "";

    return { title: cleanTitle, link: item.link || "", date, summary, source };
  }).filter((s) => s.title);
}

/* Backup route: fetch the raw feed through a proxy and read the XML ourselves */
async function fetchViaProxy(feed) {
  const response = await fetch(PROXY + encodeURIComponent(feed.url));
  if (!response.ok) throw new Error("Feed failed: " + feed.name);
  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, "text/xml");

  const items = [];
  // RSS <item> and Atom <entry>
  doc.querySelectorAll("item, entry").forEach((node) => {
    const title = node.querySelector("title")?.textContent?.trim();
    if (!title) return;

    let link = node.querySelector("link")?.textContent?.trim();
    if (!link) link = node.querySelector("link")?.getAttribute("href") || "";
    const atomLink = node.querySelector("link[href]");
    if (!link && atomLink) link = atomLink.getAttribute("href");

    const dateText =
      node.querySelector("pubDate")?.textContent ||
      node.getElementsByTagName("updated")[0]?.textContent ||
      node.getElementsByTagName("published")[0]?.textContent || "";
    const date = new Date(dateText);

    let summary =
      node.querySelector("description")?.textContent ||
      node.getElementsByTagName("summary")[0]?.textContent ||
      node.getElementsByTagName("content")[0]?.textContent || "";
    summary = stripHtml(summary);
    // Google News descriptions are just link lists — not helpful, drop them
    if (feed.name === "Google News") summary = "";
    if (summary.length > 260) summary = summary.slice(0, 257).trimEnd() + "…";
    if (summary.toLowerCase() === title.toLowerCase()) summary = "";

    // Google News appends " - Source Name" to titles; turn that into the source
    let source = feed.name;
    let cleanTitle = title;
    if (feed.name === "Google News") {
      const parts = title.split(" - ");
      if (parts.length > 1) {
        source = parts.pop().trim();
        cleanTitle = parts.join(" - ").trim();
      }
    }

    items.push({ title: cleanTitle, link, date, summary, source });
  });
  return items;
}

/* Plain-English AI summaries, pre-written by generate-summaries.js.
   Keyed by a normalized headline so we can match them to live stories. */
async function loadSummaries() {
  try {
    const res = await fetch("summaries.json?t=" + Date.now());
    if (!res.ok) return new Map();
    const data = await res.json();
    // Ignore stale summaries (older than 2 days)
    if (Date.now() - new Date(data.generated_at).getTime() > 2 * 24 * 60 * 60 * 1000) {
      return new Map();
    }
    return new Map(data.stories.map((s) => [storyKey(s.title), s]));
  } catch {
    return new Map();
  }
}

/* Placeholder cards while the feeds load — feels much faster than a
   "loading…" line, and the page doesn't jump when the news arrives. */
function renderSkeletons(count) {
  document.getElementById("news-skeleton").innerHTML = Array.from({ length: count })
    .map(() =>
      '<div class="skeleton-card">' +
      '<span class="sk sk-chip"></span>' +
      '<span class="sk sk-title"></span><span class="sk sk-title-2"></span>' +
      '<span class="sk sk-line"></span><span class="sk sk-line sk-line-2"></span>' +
      '<span class="sk sk-line sk-line-3"></span>' +
      '<span class="sk sk-box"></span>' +
      "</div>"
    )
    .join("");
}

function newsCard(story, ai, isFeatured) {
  const key = storyKey(story.title);
  const cat = categorize(story);
  const dateLabel = story.date && !isNaN(story.date) ? timeAgo(story.date) : "Recently";
  // Prefer our plain-English summary over the feed's technical one
  const summaryText = ai?.simple_summary || story.summary;
  const canSpeak = "speechSynthesis" in window;
  const isSaved = savedKeys.has(key);
  const link = escapeHtml(story.link);

  return (
    '<article class="news-item' + (isFeatured ? " is-featured" : "") + '"' +
      ' data-cat="' + cat + '" data-key="' + key + '">' +

      '<div class="news-top">' +
        '<span class="source-chip">' +
          '<span class="source-avatar" aria-hidden="true">' + escapeHtml(initials(story.source)) + "</span>" +
          escapeHtml(story.source) +
        "</span>" +
        '<span class="news-sep" aria-hidden="true">·</span>' +
        "<span>" + dateLabel + "</span>" +
        '<span class="cat-badge cat-' + cat + '">' + CATEGORY_LABELS[cat] + "</span>" +
      "</div>" +

      '<h3><a href="' + link + '" target="_blank" rel="noopener">' +
        highlightJargon(story.title) + "</a></h3>" +

      (summaryText ? '<p class="news-summary">' + highlightJargon(summaryText) + "</p>" : "") +

      (ai?.why_it_matters
        ? '<div class="why-matters">' +
            '<span class="why-label">' + ICONS.bulb + "What this means for you</span>" +
            "<p>" + highlightJargon(ai.why_it_matters) + "</p>" +
          "</div>"
        : "") +

      '<div class="news-actions">' +
        '<a class="news-readmore" href="' + link + '" target="_blank" rel="noopener">' +
          "Read the full story" + ICONS.arrow + "</a>" +
        (canSpeak
          ? '<button type="button" class="chip-btn listen-btn">' + ICONS.speaker + "Listen</button>"
          : "") +
        '<button type="button" class="chip-btn save-btn' + (isSaved ? " saved" : "") + '"' +
          ' aria-pressed="' + isSaved + '">' + ICONS.star +
          "<span>" + (isSaved ? "Saved" : "Save") + "</span></button>" +
      "</div>" +
    "</article>"
  );
}

async function loadNews() {
  const statusEl = document.getElementById("news-status");
  const listEl = document.getElementById("news-list");
  const skeletonEl = document.getElementById("news-skeleton");
  const refreshBtn = document.getElementById("refresh-btn");

  stopSpeaking();
  statusEl.hidden = true;
  statusEl.classList.remove("is-error");
  listEl.innerHTML = "";
  renderSkeletons(6);
  skeletonEl.hidden = false;
  refreshBtn.classList.add("is-busy");
  refreshBtn.disabled = true;

  const summariesPromise = loadSummaries();
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let stories = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  skeletonEl.hidden = true;
  skeletonEl.innerHTML = "";
  refreshBtn.classList.remove("is-busy");
  refreshBtn.disabled = false;

  if (stories.length === 0) {
    statusEl.hidden = false;
    statusEl.classList.add("is-error");
    statusEl.textContent =
      "We couldn't load the news just now. Please check your internet connection, then press \"Refresh\" to try again.";
    return;
  }

  // Newest first, drop near-duplicate headlines
  stories.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  const seen = new Set();
  stories = stories.filter((s) => {
    const key = storyKey(s.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, MAX_STORIES);

  const summaries = await summariesPromise;

  // The newest story gets a wide card — gives the page a clear starting point
  listEl.innerHTML = stories
    .map((s, i) => newsCard(s, summaries.get(storyKey(s.title)), i === 0))
    .join("");

  document.getElementById("category-filters").hidden = false;
  document.getElementById("stat-stories").textContent = stories.length;
  updateFilterCounts();
  applyFilters(); // keep the current topic and search when refreshing
}

/* ---------- Filtering: topic + search + saved ---------- */

let activeCategory = "all";
let searchQuery = "";

function applyFilters() {
  const items = document.querySelectorAll(".news-item");
  const query = searchQuery.trim().toLowerCase();
  let visible = 0;

  items.forEach((item) => {
    const matchesCat =
      activeCategory === "all" ||
      (activeCategory === "saved" ? savedKeys.has(item.dataset.key)
                                  : item.dataset.cat === activeCategory);
    const matchesSearch = !query || item.textContent.toLowerCase().includes(query);
    const show = matchesCat && matchesSearch;
    item.hidden = !show;
    if (show) visible++;
  });

  // A filtered list of one shouldn't keep the full-width "featured" treatment
  const firstVisible = [...items].find((i) => !i.hidden);
  items.forEach((i) => i.classList.toggle("is-featured", i === firstVisible && !query && activeCategory === "all"));

  document.getElementById("filter-empty").hidden = visible > 0 || items.length === 0;
}

function updateFilterCounts() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const cat = btn.dataset.cat;
    if (cat === "all") return;
    const n = cat === "saved"
      ? [...document.querySelectorAll(".news-item")].filter((i) => savedKeys.has(i.dataset.key)).length
      : document.querySelectorAll('.news-item[data-cat="' + cat + '"]').length;
    let countEl = btn.querySelector(".count");
    if (!countEl) {
      countEl = document.createElement("span");
      countEl.className = "count";
      btn.appendChild(countEl);
    }
    countEl.textContent = n || "";
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      document.querySelectorAll(".filter-btn").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      stopSpeaking();
      applyFilters();
    })
  );
}

function setupSearch() {
  const input = document.getElementById("news-search");
  const clear = document.getElementById("search-clear");
  if (!input) return;

  input.addEventListener("input", () => {
    searchQuery = input.value;
    clear.hidden = !searchQuery;
    applyFilters();
  });
  clear.addEventListener("click", () => {
    input.value = "";
    searchQuery = "";
    clear.hidden = true;
    applyFilters();
    input.focus();
  });
}

/* ---------- Saved stories ---------- */

let savedKeys = new Set(JSON.parse(localStorage.getItem("savedStories") || "[]"));

function setupSave() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".save-btn");
    if (!btn) return;
    const key = btn.closest(".news-item").dataset.key;

    if (savedKeys.has(key)) savedKeys.delete(key);
    else savedKeys.add(key);

    const isSaved = savedKeys.has(key);
    btn.classList.toggle("saved", isSaved);
    btn.setAttribute("aria-pressed", String(isSaved));
    btn.querySelector("span").textContent = isSaved ? "Saved" : "Save";

    localStorage.setItem("savedStories", JSON.stringify([...savedKeys]));
    updateFilterCounts();
    if (activeCategory === "saved") applyFilters();
  });
}

/* ---------- Listen buttons (read a story aloud) ---------- */

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".listen-btn.speaking").forEach((b) => {
    b.classList.remove("speaking");
    b.innerHTML = ICONS.speaker + "Listen";
  });
}

function setupListen() {
  if (!("speechSynthesis" in window)) return;

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".listen-btn");
    if (!btn) return;

    // Pressing the button of the story already playing stops it
    if (btn.classList.contains("speaking")) {
      stopSpeaking();
      return;
    }
    stopSpeaking();

    const item = btn.closest(".news-item");
    const text = [
      item.querySelector("h3")?.textContent,
      item.querySelector(".news-summary")?.textContent,
      item.querySelector(".why-matters")?.textContent
    ].filter(Boolean).join(". ");

    // Queue one short utterance per sentence — Chrome cuts off long single
    // utterances after ~15 seconds, and short chunks avoid that entirely.
    const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
    btn.classList.add("speaking");
    btn.innerHTML = ICONS.stop + "Stop";
    sentences.forEach((sentence, i) => {
      const utterance = new SpeechSynthesisUtterance(sentence.trim());
      utterance.rate = 0.95; // slightly slower — easier to follow
      utterance.onerror = stopSpeaking;
      if (i === sentences.length - 1) utterance.onend = stopSpeaking;
      speechSynthesis.speak(utterance);
    });
  });

  // Don't keep talking if the reader leaves the page
  window.addEventListener("beforeunload", () => speechSynthesis.cancel());
}

/* ---------- Glossary section ---------- */

function renderGlossary(query = "") {
  const listEl = document.getElementById("glossary-list");
  const q = query.trim().toLowerCase();
  const sorted = [...GLOSSARY]
    .sort((a, b) => a.term.localeCompare(b.term))
    .filter((g) => !q || (g.term + " " + g.meaning).toLowerCase().includes(q));

  listEl.innerHTML = sorted
    .map(
      (g) =>
        '<article class="glossary-item">' +
        "<h3>" + escapeHtml(g.term) + "</h3>" +
        "<p>" + escapeHtml(g.meaning) + "</p>" +
        '<p class="glossary-example">' + escapeHtml(g.example) + "</p>" +
        "</article>"
    )
    .join("");

  document.getElementById("glossary-empty").hidden = sorted.length > 0;
  document.getElementById("stat-words").textContent = GLOSSARY.length;
}

function setupGlossarySearch() {
  const input = document.getElementById("glossary-search");
  const clear = document.getElementById("glossary-clear");
  if (!input) return;

  input.addEventListener("input", () => {
    clear.hidden = !input.value;
    renderGlossary(input.value);
  });
  clear.addEventListener("click", () => {
    input.value = "";
    clear.hidden = true;
    renderGlossary();
    input.focus();
  });
}

/* ---------- Jargon popup ---------- */

function setupJargonPopup() {
  const popup = document.getElementById("jargon-popup");
  const termEl = document.getElementById("jargon-popup-term");
  const meaningEl = document.getElementById("jargon-popup-meaning");
  const exampleEl = document.getElementById("jargon-popup-example");
  let openedAt = 0;

  document.addEventListener("click", (event) => {
    const btn = event.target.closest(".jargon-term, .jargon-demo");
    if (btn) {
      event.preventDefault();
      event.stopPropagation();
      const entry = GLOSSARY[Number(btn.dataset.term)] || {
        term: "Technical term",
        meaning: "A word from the tech world. Check the Word Guide below for an explanation.",
        example: ""
      };
      termEl.textContent = entry.term;
      meaningEl.textContent = entry.meaning;
      exampleEl.textContent = entry.example;
      popup.hidden = false;
      openedAt = Date.now();
      popup.querySelector(".jargon-popup-close").focus();
      return;
    }
    if (popup.hidden) return;
    if (event.target.closest(".jargon-popup-close")) {
      popup.hidden = true;
      return;
    }
    // Clicking the dark background closes the popup — but ignore clicks in the
    // first half-second so a double-click doesn't open and instantly close it.
    if (event.target === popup && Date.now() - openedAt > 500) {
      popup.hidden = true;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") popup.hidden = true;
  });
}

/* ---------- Text size ---------- */

function setupTextSize() {
  const buttons = document.querySelectorAll(".size-btn");
  const saved = localStorage.getItem("textSize") || "normal";
  applySize(saved);

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      applySize(btn.dataset.size);
      localStorage.setItem("textSize", btn.dataset.size);
    })
  );

  function applySize(size) {
    document.documentElement.dataset.size = size;
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.size === size));
  }
}

/* ---------- Light / dark mode ---------- */

function setupTheme() {
  const btn = document.getElementById("theme-toggle");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!btn) return;

  apply(document.documentElement.dataset.theme || "light");

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem("theme", next);
  });

  // Follow the system setting until the reader picks a side themselves
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) apply(e.matches ? "dark" : "light");
  });

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    if (meta) meta.content = theme === "dark" ? "#000000" : "#ffffff";
  }
}

/* ---------- Mobile menu ---------- */

function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close the menu" : "Open the menu");
  });

  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  function close() {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open the menu");
  }
}

/* ---------- Reading progress, active link, back to top ---------- */

function setupScrollUi() {
  const bar = document.getElementById("scroll-bar");
  const toTop = document.getElementById("to-top");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  let queued = false;

  const update = () => {
    queued = false;
    const scrolled = window.scrollY;
    const height = document.documentElement.scrollHeight - innerHeight;

    if (bar) bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", scrolled > 700);

    // Highlight whichever section is sitting under the top of the window
    const probe = scrolled + innerHeight * 0.3;
    let current = "";
    sections.forEach((s) => {
      if (s.offsetTop <= probe) current = s.id;
    });
    navLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + current));
  };

  addEventListener("scroll", () => {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();

  toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- Fade sections in as they come into view ---------- */

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) ||
      matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  // Stagger siblings slightly so grids cascade instead of popping in at once
  items.forEach((el) => {
    const siblings = [...(el.parentElement?.children || [])].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 60 + "ms";
    observer.observe(el);
  });
}

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setupTextSize();
  setupTheme();
  setupNav();
  setupScrollUi();
  setupReveal();

  // The news list and glossary only exist on the home page — the digest page
  // loads this file too, just for the shared helpers below.
  if (document.getElementById("news-list")) {
    renderGlossary();
    setupGlossarySearch();
    setupJargonPopup();
    setupFilters();
    setupSearch();
    setupSave();
    setupListen();
    loadNews();
    document.getElementById("refresh-btn").addEventListener("click", loadNews);
  }
});

/* Shared with digest.js */
window.AINews = { GLOSSARY, FEEDS, fetchFeed, timeAgo, stripHtml, escapeHtml };
