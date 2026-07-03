# AI News in Plain English

A website that explains the latest AI news in simple, everyday language — made
for parents, uncles, and small business owners who find the tech world hard to
keep up with. Designed in a clean, minimal, Apple-inspired style.

## What it does

- **Today's AI News** — pulls real, up-to-the-minute AI headlines from Google
  News, TechCrunch, and The Verge. No maintenance needed; it updates itself.
- **Click-to-explain jargon** — technical words in headlines (AI, chatbot,
  Nvidia, data center…) are highlighted. One click shows a plain-English
  explanation with an everyday example.
- **AI Basics** — short, friendly answers to "What is ChatGPT?", "Is it safe?",
  "Does it cost money?", "How do I try it?"
- **AI for Your Business** — concrete ways small business owners can use AI
  today, with example prompts they can copy.
- **Word Guide** — the full glossary in one place.
- **Weekly Email Digest** (`digest.html`) — builds a ready-to-send email from
  this week's top 5 stories, plus a "word of the week" and a weekly tip. Press
  "Copy the email," paste into Gmail, and send it to the family. There's also
  an "Open in my Mail app" button.
- **Senior-friendly design** — large text, a text-size control (saved between
  visits), high contrast, and big click targets.

## How to open it

It's a plain website — no installs, accounts, or API keys.

**Easiest:** double-click `index.html`… almost. Browsers block news fetching
from files opened directly, so run the tiny included server instead:

```
node server.js
```

Then open **http://localhost:8765** in your browser.

## How to put it online (free)

The site is a handful of plain files (`index.html`, `digest.html`,
`styles.css`, `app.js`, `digest.js`), so any free static host works:

- **Netlify Drop** (easiest): go to https://app.netlify.com/drop and drag this
  whole folder onto the page. You get a public link in seconds to share with
  family.
- **GitHub Pages**: push this folder to a GitHub repository and turn on Pages
  in the repo settings.

## How the news loading works

The browser can't read news feeds from other websites directly, so the site
uses a free "translator" service (rss2json.com) to fetch them, with a second
service (allorigins.win) as backup if the first one is down. If both fail, the
site shows a friendly message and a retry button. There are no keys or costs.

To add or change news sources, edit the `FEEDS` list at the top of `app.js`.
To add glossary words, add entries to the `GLOSSARY` list in the same file.
