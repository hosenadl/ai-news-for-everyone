/* ============================================================
   Weekly Email Digest
   Builds a ready-to-send email from this week's top AI stories.
   Uses the shared helpers from app.js (window.AINews).
   ============================================================ */

/* app.js is loaded on this page too, so its GLOSSARY/FEEDS/etc. names are
   already taken — give the shared helpers local names here. */
const { GLOSSARY: WORD_GUIDE, FEEDS: NEWS_FEEDS, fetchFeed: fetchNewsFeed, escapeHtml: esc } = window.AINews;

const STORY_COUNT = 5;

/* Rotating weekly tips — one per week, in plain English */
const WEEKLY_TIPS = [
  "Open chatgpt.com or claude.ai and type: \"Explain what AI could do for a small business like mine, in simple terms.\"",
  "Ask an AI to write something for you this week — a birthday message, a thank-you note, or a short email. Just describe what you want.",
  "Paste a confusing letter or document into an AI chat and ask: \"Explain this to me in simple words.\"",
  "Ask an AI: \"Give me 5 low-cost ideas to bring in more customers this month.\" See if one sparks something.",
  "Try asking an AI to plan something — a week of dinners, a small trip, or a to-do list for a busy day.",
  "Ask an AI to explain a news headline you didn't understand. It's very good at breaking things down."
];

function weekNumber(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date - start) / (7 * 24 * 60 * 60 * 1000));
}

function friendlyDate(date) {
  return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

async function buildDigest() {
  const statusEl = document.getElementById("digest-status");
  const previewEl = document.getElementById("email-preview");
  statusEl.hidden = false;
  statusEl.textContent = "Building this week's email from the latest news… (a few seconds)";
  previewEl.hidden = true;

  const results = await Promise.allSettled(NEWS_FEEDS.map(fetchNewsFeed));
  let stories = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value);

  if (stories.length === 0) {
    statusEl.textContent =
      "Sorry — we couldn't load this week's news right now. Please check your internet connection and reload this page.";
    return;
  }

  // Keep the last 7 days, newest first, no near-duplicates
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  stories = stories.filter((s) => s.date && !isNaN(s.date) && s.date.getTime() > weekAgo);
  stories.sort((a, b) => b.date.getTime() - a.date.getTime());
  const seen = new Set();
  stories = stories.filter((s) => {
    const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, STORY_COUNT);

  const now = new Date();
  const week = weekNumber(now);
  const word = WORD_GUIDE[week % WORD_GUIDE.length];
  const tip = WEEKLY_TIPS[week % WEEKLY_TIPS.length];
  const subject = "This week in AI, explained simply — " +
    now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  renderPreview(subject, stories, word, tip, now);
  setupButtons(subject, stories, word, tip, now);

  statusEl.hidden = true;
  previewEl.hidden = false;
}

/* ---------- Email content, in two flavors ---------- */

/* Rich version — shown in the preview and copied for Gmail (inline styles
   because email programs ignore stylesheets). */
function emailHtml(stories, word, tip, now) {
  const base = 'font-family:-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;font-size:17px;line-height:1.6;color:#1d1d1f;';
  const muted = 'color:#6e6e73;font-size:14px;';

  const storyBlocks = stories.map((s) =>
    '<div style="margin:0 0 22px;">' +
      '<div style="' + base + 'font-weight:600;">' +
        '<a href="' + esc(s.link) + '" style="color:#0071e3;text-decoration:none;">' + esc(s.title) + "</a>" +
      "</div>" +
      '<div style="' + base + muted + '">From ' + esc(s.source) + " — " + friendlyDate(s.date) + "</div>" +
      (s.summary ? '<div style="' + base + 'margin-top:4px;">' + esc(s.summary) + "</div>" : "") +
    "</div>"
  ).join("");

  return (
    '<div style="' + base + 'max-width:600px;">' +
      '<p style="' + base + '">Hello!</p>' +
      '<p style="' + base + '">Here\'s what happened in the world of AI this week, in plain English. Click any headline to read the full story.</p>' +
      '<hr style="border:none;border-top:1px solid #d2d2d7;margin:22px 0;">' +
      storyBlocks +
      '<hr style="border:none;border-top:1px solid #d2d2d7;margin:22px 0;">' +
      '<p style="' + base + 'font-weight:600;margin-bottom:4px;">📖 Word of the week: ' + esc(word.term) + "</p>" +
      '<p style="' + base + 'margin-top:0;">' + esc(word.meaning) + "<br>" +
      '<span style="' + muted + '">' + esc(word.example) + "</span></p>" +
      '<p style="' + base + 'font-weight:600;margin-bottom:4px;">💡 Try this week</p>' +
      '<p style="' + base + 'margin-top:0;">' + esc(tip) + "</p>" +
      '<p style="' + base + muted + 'margin-top:26px;">Sent with love, so we all keep up with AI together. Questions? Just reply — I\'m happy to explain anything.</p>' +
    "</div>"
  );
}

/* Plain-text version — used for the Mail-app button and as a paste fallback. */
function emailText(stories, word, tip, now) {
  const lines = [
    "Hello!",
    "",
    "Here's what happened in the world of AI this week, in plain English.",
    ""
  ];
  stories.forEach((s, i) => {
    lines.push((i + 1) + ". " + s.title);
    lines.push("   From " + s.source + " — " + friendlyDate(s.date));
    lines.push("   Read more: " + s.link);
    lines.push("");
  });
  lines.push("--- Word of the week: " + word.term + " ---");
  lines.push(word.meaning);
  lines.push(word.example);
  lines.push("");
  lines.push("--- Try this week ---");
  lines.push(tip);
  lines.push("");
  lines.push("Sent with love, so we all keep up with AI together.");
  lines.push("Questions? Just reply — I'm happy to explain anything.");
  return lines.join("\n");
}

/* ---------- Preview + buttons ---------- */

function renderPreview(subject, stories, word, tip, now) {
  document.getElementById("email-subject").textContent = subject;
  document.getElementById("email-body").innerHTML = emailHtml(stories, word, tip, now);
}

function setupButtons(subject, stories, word, tip, now) {
  const copyBtn = document.getElementById("copy-email-btn");
  const mailtoBtn = document.getElementById("mailto-btn");
  const confirmEl = document.getElementById("copy-confirm");

  // Some browsers leave a clipboard request waiting forever on a permission
  // prompt — give each attempt 1.5 seconds, then move on to the next method.
  const withTimeout = (promise) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 1500))
    ]);

  copyBtn.onclick = async () => {
    const html = emailHtml(stories, word, tip, now);
    const text = emailText(stories, word, tip, now);
    let copied = false;
    try {
      // Copy as rich text so Gmail keeps the nice formatting
      await withTimeout(navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" })
        })
      ]));
      copied = true;
    } catch {
      try {
        await withTimeout(navigator.clipboard.writeText(text));
        copied = true;
      } catch {
        // Last resort: select the preview so the user can press Cmd/Ctrl+C
        const range = document.createRange();
        range.selectNodeContents(document.getElementById("email-body"));
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        copied = document.execCommand("copy");
      }
    }
    confirmEl.textContent = copied
      ? "Copied! Now paste it into a new email."
      : "Your browser blocked copying — please select the email below and copy it yourself (Ctrl+C or Cmd+C).";
    confirmEl.hidden = false;
    setTimeout(() => { confirmEl.hidden = true; }, 8000);
  };

  mailtoBtn.onclick = () => {
    // Mail apps only accept plain text, and links have length limits — trim if needed
    let text = emailText(stories, word, tip, now);
    if (text.length > 1800) text = emailText(stories.slice(0, 3), word, tip, now);
    location.href = "mailto:?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
  };
}

document.addEventListener("DOMContentLoaded", buildDigest);
