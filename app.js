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
    meaning: "Computer software that can do tasks that normally need a human — like writing, answering questions, or recognizing pictures.",
    example: "Example: asking a computer \"write a birthday message for my sister\" and getting a nice message back."
  },
  {
    term: "Generative AI",
    aliases: ["generative ai", "genai", "gen ai"],
    meaning: "AI that creates brand-new things — text, pictures, music, or video — instead of just finding existing ones.",
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
    example: "Think of it as the engine under the hood — ChatGPT is the car, the language model is the engine."
  },
  {
    term: "Machine Learning",
    aliases: ["machine learning", "\\bML\\b"],
    meaning: "How computers get smarter: instead of being given exact instructions, they learn from lots of examples — a bit like how people learn from experience.",
    example: "Example: show a computer 10,000 photos of apples, and it learns to spot an apple in a new photo."
  },
  {
    term: "Algorithm",
    aliases: ["algorithms", "algorithm", "algorithmic"],
    meaning: "A set of step-by-step instructions a computer follows — like a recipe, but for computers.",
    example: "Example: Facebook's algorithm is the recipe that decides which posts you see first."
  },
  {
    term: "Neural Network",
    aliases: ["neural networks", "neural network", "neural net"],
    meaning: "A way of building AI that is loosely inspired by how the human brain works, with many small connected parts working together.",
    example: "You'll see this word in news stories — you can safely read it as \"the AI's brain.\""
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
    example: "You can try their tool free at claude.ai — it works just like ChatGPT."
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
    meaning: "Google's AI chat tool — their version of ChatGPT. It's built into Google search and Android phones.",
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
    meaning: "A future kind of AI that could match or beat humans at almost every kind of thinking. It does not exist yet — companies are racing to build it.",
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
    meaning: "A giant building full of computers. AI tools don't run on your phone — they run in these buildings and send answers to your screen.",
    example: "Companies are spending billions building data centers, which is why it's in the news so often."
  },
  {
    term: "Training",
    aliases: ["training data", "trained on", "\\btraining\\b"],
    meaning: "How an AI \"learns\" — by reading or viewing enormous amounts of text and images before it's released to the public.",
    example: "Like an apprentice studying millions of examples before starting the job."
  },
  {
    term: "Open Source",
    aliases: ["open-source", "open source", "open weights", "open-weight"],
    meaning: "Software whose recipe is shared publicly for free, so anyone can use it or improve it — like a community cookbook instead of a secret family recipe.",
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
    meaning: "AI that doesn't just answer questions but can actually do multi-step tasks — like booking an appointment or filling out forms — with less hand-holding.",
    example: "Think: an assistant who doesn't just tell you the restaurant's number but calls and makes the reservation."
  },
  {
    term: "Regulation",
    aliases: ["ai regulation", "ai act", "\\bregulators\\b", "\\bregulation\\b"],
    meaning: "Government rules about how AI can be built and used — meant to keep it safe and fair. Different countries are writing different rules.",
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

/* Wrap known jargon in clickable buttons. Works on escaped plain text. */
function highlightJargon(plainText) {
  let html = escapeHtml(plainText);
  const claimed = []; // avoid double-wrapping overlapping terms

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
    return new Map(
      data.stories.map((s) => [
        s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60),
        s
      ])
    );
  } catch {
    return new Map();
  }
}

async function loadNews() {
  const statusEl = document.getElementById("news-status");
  const listEl = document.getElementById("news-list");
  statusEl.hidden = false;
  statusEl.textContent = "Loading the latest news for you… (this takes a few seconds)";
  listEl.innerHTML = "";

  const summariesPromise = loadSummaries();
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));
  let stories = results
    .filter((r) => r.status === "fulfilled")
    .flatMap((r) => r.value);

  if (stories.length === 0) {
    statusEl.textContent =
      "Sorry — we couldn't load the news right now. Please check your internet connection, then press the \"Get the latest news\" button to try again.";
    return;
  }

  // Newest first, drop near-duplicate headlines
  stories.sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  const seen = new Set();
  stories = stories.filter((s) => {
    const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, MAX_STORIES);

  const summaries = await summariesPromise;
  const canSpeak = "speechSynthesis" in window;

  statusEl.hidden = true;
  listEl.innerHTML = stories
    .map((s) => {
      const dateLabel = s.date && !isNaN(s.date) ? timeAgo(s.date) : "Recently";
      const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
      const ai = summaries.get(key);
      // Prefer our plain-English summary over the feed's technical one
      const summaryText = ai?.simple_summary || s.summary;
      return (
        '<article class="news-item" data-cat="' + categorize(s) + '">' +
        '<h3><a href="' + escapeHtml(s.link) + '" target="_blank" rel="noopener">' +
        highlightJargon(s.title) + "</a></h3>" +
        '<p class="news-meta">' + dateLabel + " · From " + escapeHtml(s.source) + "</p>" +
        (summaryText ? '<p class="news-summary">' + highlightJargon(summaryText) + "</p>" : "") +
        (ai?.why_it_matters
          ? '<p class="why-matters"><strong>What this means for you:</strong> ' + highlightJargon(ai.why_it_matters) + "</p>"
          : "") +
        '<div class="news-actions">' +
        '<a class="news-readmore" href="' + escapeHtml(s.link) + '" target="_blank" rel="noopener">Read the full story →</a>' +
        (canSpeak ? '<button type="button" class="listen-btn">🔊 Listen</button>' : "") +
        "</div>" +
        "</article>"
      );
    })
    .join("");

  document.getElementById("category-filters").hidden = false;
  applyCategoryFilter(); // keep the current filter when refreshing
}

/* ---------- Category filters ---------- */

let activeCategory = "all";

function applyCategoryFilter() {
  const items = document.querySelectorAll(".news-item");
  let visible = 0;
  items.forEach((item) => {
    const show = activeCategory === "all" || item.dataset.cat === activeCategory;
    item.style.display = show ? "" : "none";
    if (show) visible++;
  });
  document.getElementById("filter-empty").hidden = visible > 0 || items.length === 0;
}

function setupFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      document.querySelectorAll(".filter-btn").forEach((b) =>
        b.classList.toggle("active", b === btn)
      );
      stopSpeaking();
      applyCategoryFilter();
    })
  );
}

/* ---------- Listen buttons (read a story aloud) ---------- */

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  document.querySelectorAll(".listen-btn.speaking").forEach((b) => {
    b.classList.remove("speaking");
    b.textContent = "🔊 Listen";
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
    btn.textContent = "⏹ Stop";
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

function renderGlossary() {
  const listEl = document.getElementById("glossary-list");
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
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
        meaning: "A word from the tech world — check our Word Guide below for explanations.",
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

/* ---------- Start ---------- */

document.addEventListener("DOMContentLoaded", () => {
  setupTextSize();
  // The news list and glossary only exist on the home page — the digest page
  // loads this file too, just for the shared helpers below.
  if (document.getElementById("news-list")) {
    renderGlossary();
    setupJargonPopup();
    setupFilters();
    setupListen();
    loadNews();
    document.getElementById("refresh-btn").addEventListener("click", loadNews);
  }
});

/* Shared with digest.js */
window.AINews = { GLOSSARY, FEEDS, fetchFeed, timeAgo, stripHtml, escapeHtml };
