/* ============================================================
   UZE Lab — prompt training
   Eight scenarios that teach one prompting skill each. Every
   attempt is scored on four stats and gets plain-English notes
   on what worked and what to try next.

   Scoring runs entirely in the browser, so nothing the reader
   types is ever sent anywhere.
   ============================================================ */

/* ---------- Icons ---------- */

const ICON = {
  target:  '<circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="3.9"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  compass: '<circle cx="12" cy="12" r="8.6"/><path d="m15.2 8.8-2.1 4.3-4.3 2.1 2.1-4.3 4.3-2.1Z"/>',
  table:   '<rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2.4"/><path d="M3.2 9.4h17.6M9.6 9.4v10.2M3.2 14.5h17.6"/>',
  person:  '<circle cx="12" cy="7.8" r="3.7"/><path d="M5.4 20.4a6.6 6.6 0 0 1 13.2 0"/>',
  copy:    '<rect x="9" y="9" width="11" height="11" rx="2.3"/><path d="M15 9V6.3A2.3 2.3 0 0 0 12.7 4H6.3A2.3 2.3 0 0 0 4 6.3v6.4A2.3 2.3 0 0 0 6.3 15H9"/>',
  shield:  '<path d="M12 2.8 4.5 5.6v5.9c0 4.3 3 8.2 7.5 9.7 4.5-1.5 7.5-5.4 7.5-9.7V5.6L12 2.8Z"/><path d="m8.9 12 2.2 2.2 4-4.3"/>',
  branch:  '<circle cx="6.4" cy="6" r="2.3"/><circle cx="6.4" cy="18" r="2.3"/><circle cx="17.6" cy="12" r="2.3"/><path d="M8.7 6h2.9a2 2 0 0 1 1.7 1l1.2 2.1M8.7 18h2.9a2 2 0 0 0 1.7-1l1.2-2.1"/>',
  crown:   '<path d="M3.4 8.2 6 15.8h12l2.6-7.6-4.7 3.1L12 5.2l-3.9 6.1L3.4 8.2Z"/><path d="M6 18.8h12"/>',

  bulb:    '<path d="M12 3.2a6 6 0 0 0-3.4 10.9c.5.4.8 1 .8 1.6h5.2c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3.2Z"/><path d="M9.4 18.4h5.2M10.4 21h3.2"/>',
  retry:   '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8M21 4v4h-4"/><path d="M21 12a9 9 0 0 1-15.3 6.4L3 16M3 20v-4h4"/>',
  arrow:   '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  check:   '<path d="m4 12.5 5 5L20 6.5"/>',
  trophy:  '<path d="M7.2 4h9.6v4.6a4.8 4.8 0 0 1-9.6 0V4Z"/><path d="M7.2 5.6H5a1.8 1.8 0 0 0-1.8 1.8A3.8 3.8 0 0 0 7 11.2M16.8 5.6H19a1.8 1.8 0 0 1 1.8 1.8 3.8 3.8 0 0 1-3.8 3.8"/><path d="M12 13.4v3.4M8.3 20.4h7.4a3.7 3.7 0 0 0-3.7-3.6 3.7 3.7 0 0 0-3.7 3.6Z"/>'
};

function svg(name, extra) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" ' +
         'stroke-linejoin="round" aria-hidden="true"' + (extra ? ' ' + extra : '') + '>' +
         ICON[name] + "</svg>";
}

/* ---------- The eight levels ---------- */

const LEVELS = [
  {
    icon: "target",
    title: "The Vague Request",
    skill: "Clarity & specificity",
    badge: "Clarity Cadet",
    story: "You run a small bakery called Golden Crust. You just pulled a new rosemary sourdough loaf out of the oven and want to promote it on Instagram before the weekend rush.",
    task: "Write the prompt you'd send an AI to draft the Instagram caption. Most people type something like <i>\"write me an instagram post about bread\"</i>. Your job is to do better.",
    hint: "Think about four things: what's the product, what exactly are you asking for, what tone, and how long should it be?",
    checks: {
      clarity: [
        { test: /sourdough|rosemary|loaf|golden crust/, tip: "Name the actual product, like 'rosemary sourdough', instead of just 'bread'. Vague nouns get vague output.", praise: "Named the specific product." },
        { test: /caption|instagram|social media post|post\b/, tip: "State the exact deliverable: 'an Instagram caption', not just 'something to promote it'.", praise: "Clearly stated the deliverable type." }
      ],
      context: [
        { test: /golden crust|bakery|my brand|my shop/, tip: "Mention your business or brand so the AI can match its voice.", praise: "Gave the AI your business context." },
        { test: /new|just baked|fresh|launch|weekend|today/, tip: "Give a reason or occasion, like a new item or a weekend special. It gives the copy an angle.", praise: "Included the occasion behind the post." }
      ],
      specificity: [
        { test: /tone|friendly|warm|casual|playful|professional|voice/, tip: "Specify a tone, such as playful, warm, or casual, so the output isn't generic.", praise: "Specified a tone or voice." },
        { test: /word|character|short|sentence|hashtag|emoji/, tip: "Add a length or format constraint: a word count, hashtags, or emoji use.", praise: "Set a length or formatting constraint." }
      ],
      structure: [
        { test: /cta|call to action|encourage|visit|order|come in|stop by|buy/, tip: "Ask explicitly for a call to action. Without one, captions tend to describe rather than invite.", praise: "Requested a call to action." },
        { test: /option|variant|\b[2-9]\b|headline|hook/, tip: "Ask for two or three options, or a specific structural element like a hook, so you get something to choose from.", praise: "Asked for options or a structural element." }
      ]
    },
    example: "Act as a social media copywriter for Golden Crust, a small neighborhood bakery with a warm, playful voice. Write an Instagram caption (under 150 characters) announcing our new rosemary sourdough loaf, fresh out of the oven today. Highlight the aroma and handmade quality, end with a friendly call to action to stop by before we sell out, and suggest 3 relevant hashtags. Give me 2 caption options to choose from."
  },
  {
    icon: "compass",
    title: "The Client Brief",
    skill: "Providing context",
    badge: "Context Commander",
    story: "Your friend just launched Aurora Audio, a startup selling noise-canceling headphones for remote workers. She needs website product description copy, but hasn't given you much to go on.",
    task: "Write the prompt. Focus on pulling in the context the AI actually needs: who it's for, where it's used, and what makes it different, instead of just asking for 'a product description'.",
    hint: "An AI with zero context guesses. Who's the audience? Where does this copy live? What makes this product different from every other headphone?",
    checks: {
      clarity: [
        { test: /product description|website copy|landing page copy|product page/, tip: "State the exact deliverable: 'a product description for the website', not just 'some copy'.", praise: "Named the exact deliverable." },
        { test: /aurora audio|headphone|noise.?cancel/, tip: "Name the product and category explicitly.", praise: "Named the product and category." }
      ],
      context: [
        { test: /remote worker|professional|target audience|who (is|will)/, tip: "Say who this is for. 'Remote workers who need focus during calls' changes everything about the copy.", praise: "Specified the target audience." },
        { test: /website|landing page|product page|purpose|where/, tip: "Say where this copy will live: a website product page, an ad, an email. Tone and length depend on it.", praise: "Specified where the copy will be used." }
      ],
      specificity: [
        { test: /battery|comfort|noise.?cancel|feature|benefit|unique|different/, tip: "List the actual differentiators, like battery life or comfort. Otherwise the AI invents generic ones.", praise: "Included specific product differentiators." },
        { test: /tone|voice|premium|professional|brand/, tip: "Describe the brand voice you want: premium, confident, playful.", praise: "Specified brand tone and voice." }
      ],
      structure: [
        { test: /word|paragraph|bullet|sentence|character/, tip: "Set a length expectation: a word count, bullet points, or a number of paragraphs.", praise: "Set a length or format expectation." },
        { test: /headline|subheading|section|structure|bullet/, tip: "Ask for a specific structure, such as a headline plus a hook plus bullet points, so it's ready to paste in.", praise: "Requested a specific output structure." }
      ]
    },
    example: "Act as a conversion-focused copywriter. Write a product description for Aurora Audio's noise-canceling headphones, aimed at remote workers who need focus during calls and deep work. This will go on the product page of our website. Highlight the key differentiators: 30-hour battery life, adaptive noise cancellation, and all-day comfort. Use a confident, premium tone. Structure it as a short headline, a 2-sentence hook, and 3 bullet points covering the top benefits."
  },
  {
    icon: "table",
    title: "The Data Table",
    skill: "Output format",
    badge: "Format Fanatic",
    story: "You have 10 messy project tasks scribbled across a notes app and a deadline creeping up. You want an AI to turn this chaos into something your team can actually use.",
    task: "Write the prompt. Focus on specifying exactly what format you want the output in, not just what you want it to contain.",
    hint: "A table? JSON? Which columns? Sorted how? And what should NOT be in the response, like extra commentary?",
    checks: {
      clarity: [
        { test: /tasks|notes|to.?do|list/, tip: "Describe the source material, such as 'my messy task list', so the AI knows what it's working with.", praise: "Described the source data." },
        { test: /organize|prioritize|turn into|convert|clean up/, tip: "State the goal verb clearly: organize, prioritize, convert.", praise: "Stated the transformation goal clearly." }
      ],
      context: [
        { test: /team|standup|share|project/, tip: "Say who this is for, like your team or a standup. It affects how formal or compact the output should be.", praise: "Gave audience and purpose context." },
        { test: /deadline|due|this week|timeline/, tip: "Mention the timeframe or deadline pressure. It can change how things get prioritized.", praise: "Included timeframe context." }
      ],
      specificity: [
        { test: /table|markdown|json|spreadsheet|column/, tip: "Name the exact format: a markdown table, a JSON array. Don't leave format to guesswork.", praise: "Specified the exact output format." },
        { test: /priority|deadline|owner|status|column|field/, tip: "List the specific columns you want: Task, Priority, Owner, Deadline.", praise: "Specified the fields wanted." }
      ],
      structure: [
        { test: /priority order|sorted|ranked|order by|highest first/, tip: "Specify the sort order, for example 'sorted by priority, highest first'.", praise: "Specified a sort order." },
        { test: /only|no extra|just the table|concise|nothing else/, tip: "Tell it to output only the table with no extra commentary. This one line saves a lot of cleanup.", praise: "Constrained the output to exclude extra commentary." }
      ]
    },
    example: "Here are 10 messy project tasks from my notes: [paste tasks]. Organize them into a markdown table for my team's Monday standup, with columns: Task, Priority (High/Medium/Low), Owner (leave blank if unclear), and Deadline. Sort rows by priority, highest first. Output only the table, with no extra commentary."
  },
  {
    icon: "person",
    title: "Expert Mode",
    skill: "Role and persona",
    badge: "Persona Pro",
    story: "You're applying for a Senior Product Manager role and want brutally honest feedback on your resume before you submit it.",
    task: "Write the prompt. Think about what kind of expert should be reviewing this, and how assigning that role changes the output.",
    hint: "Compare 'review my resume' with 'act as a senior hiring manager who has screened thousands of PM resumes'. Same task, very different output.",
    checks: {
      clarity: [
        { test: /review|feedback|critique/, tip: "State clearly that you want a review, not just a rewrite.", praise: "Clearly asked for a review." },
        { test: /product manager|senior|job|role|position/, tip: "Mention the target role and seniority you're applying for.", praise: "Mentioned the target role." }
      ],
      context: [
        { test: /applying|submit|before i|chances|interview/, tip: "Explain the stakes, like 'before I submit this'. It helps the AI judge how critical to be.", praise: "Explained the context and stakes." },
        { test: /paste|attach|here'?s my resume|resume:/, tip: "Say you'll provide the resume content. The AI needs the actual text to review.", praise: "Indicated the resume content would be provided." }
      ],
      specificity: [
        { test: /act as|you are a|as a (hiring manager|recruiter|expert)/, tip: "Explicitly assign a persona: 'Act as a senior hiring manager at a top tech company.' This is the core skill of this round.", praise: "Assigned a clear expert persona." },
        { test: /strength|weakness|gap|impact|metric|ats|red flag/, tip: "Tell it what to focus on: impact metrics, gaps, how it reads to an automated screener, red flags.", praise: "Specified what to focus the feedback on." }
      ],
      structure: [
        { test: /bullet|ranked|list|section by section|scale|score/, tip: "Ask for a specific feedback format: a ranked bullet list, section by section, or a score.", praise: "Requested a specific feedback format." },
        { test: /rewrite|suggest|actionable|next step|fix/, tip: "Ask for something actionable, like 'suggest a rewrite of my weakest bullet point', not just criticism.", praise: "Requested actionable next steps." }
      ]
    },
    example: "Act as a senior hiring manager who has reviewed thousands of product manager resumes at top tech companies. I'm applying for a Senior PM role and want brutally honest feedback before I submit. Here's my resume: [paste resume]. Review it for: (1) whether my bullet points show measurable impact, (2) clarity of scope and seniority, and (3) any red flags a hiring manager would notice in the first 10 seconds. Give feedback as a bulleted list, ranked by what would hurt me most, and suggest a rewritten version of my top 3 weakest bullet points."
  },
  {
    icon: "copy",
    title: "Teach By Example",
    skill: "Few-shot examples",
    badge: "Example Expert",
    story: "Your team's meeting notes are a wall of shorthand and half-sentences. You want an AI to turn them into clean, professional minutes. Saying 'make this professional' gives you something different every time.",
    task: "Write the prompt. Focus on showing the AI an example of what good looks like, rather than describing it.",
    hint: "Give it one input and output pair as a mini-example. Showing beats describing.",
    checks: {
      clarity: [
        { test: /meeting minutes|clean notes|formatted notes/, tip: "State the deliverable clearly: 'clean, professional meeting minutes'.", praise: "Clearly stated the deliverable." },
        { test: /notes|shorthand|raw|transcript/, tip: "Describe what the raw input looks like, such as shorthand or rough notes.", praise: "Described the raw input." }
      ],
      context: [
        { test: /team|stakeholder|share|record/, tip: "Mention who this is for: the team, stakeholders, or the record.", praise: "Gave audience context." },
        { test: /consisten|every time|template|standard|always/, tip: "Mention that you need this done the same way every time. That's exactly why examples matter here.", praise: "Flagged the need for consistency." }
      ],
      specificity: [
        { test: /example|e\.g\.|for instance|sample|input:|output:/, tip: "This is the key move for this round. Include an actual example, with 'Input:' and 'Output:', so the AI can match your exact style.", praise: "Included a concrete example, exactly the skill this round teaches." },
        { test: /turn into|convert|style like|formatted like|similar to/, tip: "Explicitly say you want future input transformed the same way as your example.", praise: "Described the transformation pattern." }
      ],
      structure: [
        { test: /attendee|decision|action item|agenda/, tip: "Specify the sections you want: Attendees, Decisions, Action Items.", praise: "Specified the sections wanted." },
        { test: /header|bullet|bold|markdown|format/, tip: "Specify the formatting style: headers, bold, bullet points.", praise: "Specified a formatting style." }
      ]
    },
    example: "Convert my raw meeting notes into clean, professional meeting minutes. I share these with the whole team after every call, so they need to come out the same way every time. Here's an example of the input and output style I want:\n\nInput: 'talked pricing, sara thinks 20 too low, mike will check comps by fri'\n\nOutput: '**Pricing discussion:** Sarah raised concerns that the proposed $20 price point may be too low. Action item: Mike to review competitor pricing by Friday.'\n\nNow do the same for these raw notes: [paste notes]. Use bold headers and bullet points, and organize the output into three sections: Attendees, Key Decisions, and Action Items, with an owner and due date wherever one is mentioned."
  },
  {
    icon: "shield",
    title: "The Boundaries",
    skill: "Constraints and guardrails",
    badge: "Boundary Boss",
    story: "You're writing a bedtime story for your 6-year-old niece. You want it charming, not something that accidentally turns dark, preachy, or three pages too long.",
    task: "Write the prompt. Focus on the boundaries and constraints that keep the output on target.",
    hint: "What's off limits? How long? What must it include? Constraints aren't limiting. They're what makes the output usable.",
    checks: {
      clarity: [
        { test: /story|bedtime/, tip: "State clearly that you want a bedtime story.", praise: "Clearly stated the deliverable." },
        { test: /6.?year.?old|kids?|young child|age/, tip: "Mention the child's age. Story complexity should scale with it.", praise: "Mentioned the target age." }
      ],
      context: [
        { test: /bedtime|niece|tonight|gift/, tip: "Give the occasion, like bedtime tonight. It shapes tone and pacing.", praise: "Gave the occasion and purpose." },
        { test: /about|featuring|involving|character|animal|fox|dragon/, tip: "Give a theme or character to start from. A blank prompt makes the AI guess at a topic.", praise: "Gave a theme or character seed." }
      ],
      specificity: [
        { test: /word|minute|short|page|under/, tip: "Set a length constraint, for example 'about 300 words', so it's actually bedtime length.", praise: "Set a length constraint." },
        { test: /no violence|avoid|nothing dark|appropriate|must not|don'?t|scary/, tip: "State explicit exclusions, such as 'no violence, nothing scary'. This is the core skill of this round.", praise: "Set explicit content guardrails." }
      ],
      structure: [
        { test: /moral|lesson|happy ending|must include/, tip: "Require a specific element, like a gentle moral or a happy ending.", praise: "Required a specific story element." },
        { test: /whimsical|gentle|playful|soothing|calm|tone/, tip: "Specify the tone you want: gentle, whimsical, calm.", praise: "Specified the desired tone." }
      ]
    },
    example: "Write a bedtime story for my 6-year-old niece, about 300 words, that she can fall asleep to. It should feature a curious fox who's afraid of the dark, with a gentle, whimsical tone throughout. Constraints: no violence or scary moments, nothing that could give her nightmares, and it must end on a calm, comforting note with a simple lesson about courage. Keep sentences short and simple for reading aloud."
  },
  {
    icon: "branch",
    title: "Show Your Work",
    skill: "Step-by-step reasoning",
    badge: "Reasoning Ranger",
    story: "You're deciding whether to price your new online course at $49, $99, or $199. You don't just want an answer. You want to understand the reasoning so you can defend the decision to your co-founder.",
    task: "Write the prompt. Focus on getting the AI to reason through the problem step by step, rather than just naming a number.",
    hint: "Ask it to think through the factors before it concludes. 'Think step by step' or 'walk me through your reasoning' changes everything.",
    checks: {
      clarity: [
        { test: /pric|which (price|option)|recommend/, tip: "State the decision clearly: 'help me decide on a price'.", praise: "Clearly stated the decision to be made." },
        { test: /49|99|199/, tip: "Give the actual options and numbers you're choosing between.", praise: "Gave the specific options being compared." }
      ],
      context: [
        { test: /online course|audience|competitor|market|cost/, tip: "Give business context: what the course is, who it's for, and what competitors charge.", praise: "Gave relevant business context." },
        { test: /defend|co.?founder|justify|explain why|convince/, tip: "Explain why the reasoning matters to you. It signals you want justification, not just a verdict.", praise: "Explained why the reasoning matters." }
      ],
      specificity: [
        { test: /perceived value|target audience|competitor|willingness to pay|position/, tip: "Name the factors to weigh: perceived value, audience, competitor pricing, positioning.", praise: "Named specific factors to weigh." },
        { test: /recommend|pick one|final answer|which one|conclusion/, tip: "Ask for a clear final recommendation. Reasoning without a conclusion leaves you stuck.", praise: "Requested a clear final recommendation." }
      ],
      structure: [
        { test: /step by step|think through|walk me through|reasoning|before (answering|concluding)/, tip: "Explicitly request step-by-step reasoning before the final answer. This is the core skill of this round.", praise: "Explicitly requested step-by-step reasoning." },
        { test: /pros and cons|tradeoff|table|then conclu/, tip: "Ask for a structured breakdown, like pros and cons for each option, before the conclusion.", praise: "Requested a structured breakdown of tradeoffs." }
      ]
    },
    example: "I'm deciding between pricing my new online course at $49, $99, or $199. Before giving a final recommendation, think through this step by step: consider perceived value, my target audience (early-career marketers), competitor pricing in this space, and how each price point positions the course as budget or premium. Lay out the pros and cons of each option, then give a final recommendation with a one-sentence justification I can use to explain the decision to my co-founder."
  },
  {
    icon: "crown",
    title: "Final Round: The Perfect Prompt",
    skill: "Everything, combined",
    badge: "Prompt Master",
    story: "Last one. You're launching Nimbus, a new project-management tool, in 3 weeks. You need an AI to draft the launch email that goes out to your 5,000-person waitlist. Everything you've learned is on the table.",
    task: "Write the prompt. Bring together role, context, specificity, format, constraints, and reasoning or examples as needed. Nobody expects perfection. Just show that you've leveled up.",
    hint: "Run the checklist. Who should the AI be? Who's the audience and what's the goal? What exact format and sections? What tone and length? Anything to avoid?",
    checks: {
      clarity: [
        { test: /launch email|announcement email|email campaign/, tip: "State the deliverable clearly: 'the launch announcement email'.", praise: "Clearly stated the deliverable." },
        { test: /nimbus|project management|saas|waitlist/, tip: "Name the product and its category: Nimbus, a project management tool.", praise: "Named the product and context." }
      ],
      context: [
        { test: /waitlist|5,?000|subscriber|audience|founders?|pms?\b/, tip: "Describe the audience in detail: who's on this waitlist and what they're expecting.", praise: "Specified the audience in detail." },
        { test: /sign.?up|conversion|goal|webinar|register|drive/, tip: "State the goal of the email, such as driving webinar sign-ups.", praise: "Specified the goal of the email." }
      ],
      specificity: [
        { test: /act as|you are a|expert|copywriter|marketer/, tip: "Assign a persona, like 'act as a senior lifecycle marketing copywriter', to set the skill level of the output.", praise: "Assigned a relevant expert persona." },
        { test: /word|tone|avoid|must not|character|don'?t/, tip: "Set explicit constraints: word count, tone, and things to avoid such as jargon or overselling.", praise: "Set explicit tone and length constraints." }
      ],
      structure: [
        { test: /subject line|section|body|bullet|structure/, tip: "Specify the exact structure you want: subject line, hook, bullets, call to action.", praise: "Specified the exact output structure." },
        { test: /example|e\.g\.|step by step|think through|option|variant/, tip: "Add an example to match, or ask for reasoning or options before the final draft. Bring in a technique from an earlier round.", praise: "Layered in examples or reasoning, combining techniques like a pro." }
      ]
    },
    example: "Act as a senior lifecycle marketing copywriter who specializes in software product launches. I'm launching Nimbus, a new project-management tool, to our 5,000-person waitlist in 3 weeks. The goal of this email is to drive sign-ups for the launch-day webinar. Audience: early-stage startup founders and product managers who joined the waitlist expecting a lighter alternative to tools like Asana or Linear. Write the launch announcement email with: (1) a subject line under 50 characters, with 2 options to test, (2) a short, punchy opening hook, (3) 3 bullet points on what makes Nimbus different, and (4) a clear call to action to register for the webinar. Tone: confident and a little irreverent. Avoid corporate jargon and don't oversell with words like 'revolutionary'. Keep the whole email under 200 words. Before writing, briefly think through what would make a busy founder stop and read this instead of archiving it, then write the email."
  }
];

const STATS = ["clarity", "context", "specificity", "structure"];
const STAT_LABELS = { clarity: "Clarity", context: "Context", specificity: "Specificity", structure: "Structure" };
const STAT_COLORS = {
  clarity: "var(--accent)",
  context: "var(--violet)",
  specificity: "var(--success)",
  structure: "var(--warn)"
};
const GROWTH_TIPS = {
  clarity: "Keep naming the exact deliverable and subject. Vague nouns produce vague output.",
  context: "Keep feeding in the audience, the purpose, and the background before asking for the output.",
  specificity: "Keep adding concrete details: tone, constraints, differentiators, exact figures.",
  structure: "Keep specifying the output shape: format, sections, length, and order."
};

/* ---------- Saved progress ---------- */

const STORAGE_KEY = "uze_lab_v1";

function freshState() {
  return {
    unlocked: 0,
    current: 0,
    bestScores: LEVELS.map(() => null),
    badges: LEVELS.map(() => false),
    screen: "start"
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.bestScores) || parsed.bestScores.length !== LEVELS.length) return freshState();
    parsed.screen = "start"; // always land on the overview; "Continue" picks progress back up
    return parsed;
  } catch {
    return freshState();
  }
}

let state = loadState();
let lastFeedback = null;
let draftText = "";

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- Scoring ---------- */

function scorePrompt(level, text) {
  const lower = text.toLowerCase();
  const stats = {};
  const feedback = { good: [], improve: [] };

  STATS.forEach((key) => {
    const items = level.checks[key];
    let passed = 0;
    items.forEach((item) => {
      if (item.test.test(lower)) {
        passed++;
        feedback.good.push(item.praise);
      } else {
        feedback.improve.push(item.tip);
      }
    });
    stats[key] = Math.round((passed / items.length) * 5 * 2) / 2;
  });

  const total = STATS.reduce((sum, key) => sum + stats[key], 0);
  return { stats, total, feedback };
}

function gradeLabel(total) {
  if (total >= 19) return { label: "Perfect prompt", color: "var(--success)" };
  if (total >= 16) return { label: "Sharp", color: "var(--success)" };
  if (total >= 12) return { label: "Solid prompt", color: "var(--accent-ink)" };
  if (total >= 8)  return { label: "Getting there", color: "var(--warn)" };
  return { label: "Rough draft", color: "var(--danger)" };
}

function totalXp() {
  return state.bestScores.reduce((sum, s) => sum + (s ? s.total : 0), 0);
}

/* ---------- Progress panel ---------- */

const hud = document.getElementById("lab-hud");
const app = document.getElementById("lab-app");

function renderHud() {
  if (state.screen === "start") {
    hud.hidden = true;
    return;
  }
  hud.hidden = false;

  const xp = totalXp();
  const max = LEVELS.length * 20;

  const dots = LEVELS.map((lvl, i) => {
    const done = !!state.bestScores[i];
    const locked = i > state.unlocked;
    const cls = ["lab-dot", locked ? "locked" : "", i === state.current ? "current" : "", done ? "done" : ""]
      .filter(Boolean).join(" ");
    return '<button type="button" class="' + cls + '" data-goto="' + i + '"' +
      (locked ? " disabled" : "") +
      ' aria-label="Round ' + (i + 1) + ': ' + lvl.title + '">' +
      (done ? svg("check") : i + 1) + "</button>";
  }).join("");

  const badges = LEVELS.map((lvl, i) =>
    '<span class="lab-badge' + (state.badges[i] ? " earned" : "") + '">' +
      svg(lvl.icon) + "<span>" + lvl.badge + "</span></span>"
  ).join("");

  hud.innerHTML =
    '<div class="hud-top">' +
      '<span class="hud-step">Round ' + Math.min(state.current + 1, LEVELS.length) + " of " + LEVELS.length + "</span>" +
      '<span class="xp-label">Points <span class="xp-value">' + xp + " / " + max + "</span></span>" +
    "</div>" +
    '<div class="xp-track"><div class="xp-fill" style="width:' + (xp / max) * 100 + '%"></div></div>' +
    '<div class="lab-dots">' + dots + "</div>" +
    '<div class="lab-badges">' + badges + "</div>";

  hud.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.current = Number(btn.dataset.goto);
      state.screen = "level";
      draftText = "";
      saveState();
      render();
    });
  });
}

/* ---------- Screens ---------- */

function renderStart() {
  const hasProgress = state.unlocked > 0 || state.bestScores.some(Boolean);
  const xp = totalXp();

  const path = LEVELS.map((lvl, i) =>
    '<span class="path-node" title="' + lvl.title + '">' + svg(lvl.icon) + "</span>" +
    (i < LEVELS.length - 1 ? '<span class="path-line"></span>' : "")
  ).join("");

  app.innerHTML =
    '<div class="lab-card lab-start">' +
      '<div class="lab-path" aria-hidden="true">' + path + "</div>" +
      '<div class="intro-stats">' +
        "<div class=\"intro-stat\"><b>8</b><span>Rounds</span></div>" +
        "<div class=\"intro-stat\"><b>15</b><span>Minutes</span></div>" +
        "<div class=\"intro-stat\"><b>" + (hasProgress ? xp : 160) + "</b><span>" + (hasProgress ? "Points so far" : "Points to earn") + "</span></div>" +
      "</div>" +
      '<p class="task">Each round gives you a real situation and asks you to write the prompt you would actually send. You get a score out of 20, notes on what worked, and an expert version to compare against.</p>' +
      '<div class="lab-row center">' +
        '<button type="button" class="btn" id="lab-begin">' +
          (hasProgress ? "Continue from round " + (state.current + 1) : "Start round 1") + svg("arrow") +
        "</button>" +
        (hasProgress ? '<button type="button" class="btn btn-secondary" id="lab-reset">Start over</button>' : "") +
      "</div>" +
      '<p class="lab-meta">Nothing you type leaves your browser. Your progress saves on this device.</p>' +
    "</div>";

  document.getElementById("lab-begin").addEventListener("click", () => {
    state.screen = "level";
    if (!hasProgress) state.current = 0;
    saveState();
    render();
  });

  document.getElementById("lab-reset")?.addEventListener("click", () => {
    if (confirm("Clear your progress, scores and badges?")) {
      state = freshState();
      saveState();
      render();
    }
  });
}

function renderLevel() {
  const lvl = LEVELS[state.current];

  app.innerHTML =
    '<div class="lab-card">' +
      '<span class="skill-tag">' + lvl.skill + "</span>" +
      '<div class="lab-title">' +
        '<span class="level-icon" aria-hidden="true">' + svg(lvl.icon) + "</span>" +
        "<h2>" + lvl.title + "</h2>" +
      "</div>" +
      '<div class="story">' + lvl.story + "</div>" +
      '<p class="task">' + lvl.task + "</p>" +
      '<label class="visually-hidden" for="lab-input">Your prompt</label>' +
      '<textarea class="lab-textarea" id="lab-input" placeholder="Type the prompt you would actually send…"></textarea>' +
      '<div class="char-count" id="lab-count">0 characters</div>' +
      '<div class="lab-row">' +
        '<button type="button" class="btn" id="lab-submit">Score my prompt</button>' +
        '<button type="button" class="btn btn-secondary" id="lab-hint" aria-expanded="false" aria-controls="lab-hint-box">' +
          svg("bulb") + "Give me a hint</button>" +
      "</div>" +
      '<div class="hint-box" id="lab-hint-box" hidden>' + lvl.hint + "</div>" +
    "</div>";

  const input = document.getElementById("lab-input");
  const count = document.getElementById("lab-count");
  const hintBtn = document.getElementById("lab-hint");
  const hintBox = document.getElementById("lab-hint-box");

  // Set as a value rather than in the template above, so a prompt containing
  // markup can never break out of the textarea.
  input.value = draftText;
  count.textContent = input.value.length + " characters";

  input.addEventListener("input", () => {
    draftText = input.value;
    count.textContent = input.value.length + " characters";
    count.classList.remove("is-error");
  });

  hintBtn.addEventListener("click", () => {
    hintBox.hidden = !hintBox.hidden;
    hintBtn.setAttribute("aria-expanded", String(!hintBox.hidden));
  });

  document.getElementById("lab-submit").addEventListener("click", () => {
    const text = input.value.trim();
    if (text.length < 15) {
      count.textContent = "Write a real attempt first, at least a full sentence.";
      count.classList.add("is-error");
      input.focus();
      return;
    }

    const result = scorePrompt(lvl, text);
    lastFeedback = result;
    draftText = "";

    const best = state.bestScores[state.current];
    if (!best || result.total > best.total) state.bestScores[state.current] = result;
    if (result.total >= 14) state.badges[state.current] = true;

    state.screen = "feedback";
    saveState();
    render();

    if (result.total >= 16) spawnConfetti(result.total >= 19 ? 40 : 20);
  });
}

function renderFeedback() {
  const lvl = LEVELS[state.current];
  const result = lastFeedback;
  const grade = gradeLabel(result.total);
  const isLast = state.current === LEVELS.length - 1;

  const statRows = STATS.map((key) => {
    const val = result.stats[key];
    return '<div class="stat-row">' +
      '<span class="stat-name">' + STAT_LABELS[key] + "</span>" +
      '<span class="stat-track"><span class="stat-fill" style="background:' + STAT_COLORS[key] +
        ";width:" + (val / 5) * 100 + '%"></span></span>' +
      '<span class="stat-val">' + val + "/5</span>" +
    "</div>";
  }).join("");

  const good = result.feedback.good.length
    ? "<ul>" + result.feedback.good.map((x) => "<li>" + x + "</li>").join("") + "</ul>"
    : '<p class="fb-empty">Nothing landed yet. Have a look at the tips.</p>';

  const improve = result.feedback.improve.length
    ? "<ul>" + result.feedback.improve.slice(0, 5).map((x) => "<li>" + x + "</li>").join("") + "</ul>"
    : '<p class="fb-empty">Nothing left to improve. Clean sweep.</p>';

  app.innerHTML =
    '<div class="lab-card">' +
      '<span class="skill-tag">' + lvl.skill + "</span>" +
      '<div class="grade-banner">' +
        '<div class="grade-title">Your score</div>' +
        '<div class="grade-score">' + result.total + "<span>/20</span></div>" +
        '<div class="grade-label" style="color:' + grade.color + '">' + grade.label + "</div>" +
      "</div>" +
      '<div class="lab-stats">' + statRows + "</div>" +
      '<div class="fb-cols">' +
        '<div class="fb-col good"><h3>What worked</h3>' + good + "</div>" +
        '<div class="fb-col improve"><h3>Try next time</h3>' + improve + "</div>" +
      "</div>" +
      '<div class="example-toggle">' +
        '<button type="button" class="example-header" id="lab-example" aria-expanded="false" aria-controls="lab-example-body">' +
          "<span>See how an expert would write it</span>" + svg("chevron") +
        "</button>" +
        '<div class="example-body" id="lab-example-body" hidden>' + lvl.example + "</div>" +
      "</div>" +
      '<div class="lab-row">' +
        '<button type="button" class="btn btn-secondary" id="lab-retry">' + svg("retry") + "Try this round again</button>" +
        '<button type="button" class="btn" id="lab-next">' +
          (isLast ? "See my results" : "Next round") + svg("arrow") +
        "</button>" +
      "</div>" +
    "</div>";

  const exBtn = document.getElementById("lab-example");
  const exBody = document.getElementById("lab-example-body");
  exBtn.addEventListener("click", () => {
    exBody.hidden = !exBody.hidden;
    exBtn.setAttribute("aria-expanded", String(!exBody.hidden));
  });

  document.getElementById("lab-retry").addEventListener("click", () => {
    state.screen = "level";
    saveState();
    render();
  });

  document.getElementById("lab-next").addEventListener("click", () => {
    if (isLast) {
      state.screen = "cert";
      saveState();
      render();
      spawnConfetti(60);
      return;
    }
    state.current = Math.min(state.current + 1, LEVELS.length - 1);
    state.unlocked = Math.max(state.unlocked, state.current);
    state.screen = "level";
    saveState();
    render();
  });
}

function renderCert() {
  const xp = totalXp();
  const max = LEVELS.length * 20;
  const pct = Math.round((xp / max) * 100);

  const totals = { clarity: 0, context: 0, specificity: 0, structure: 0 };
  let counted = 0;
  state.bestScores.forEach((s) => {
    if (!s) return;
    STATS.forEach((key) => { totals[key] += s.stats[key]; });
    counted++;
  });
  const lowest = counted ? STATS.reduce((a, b) => (totals[a] <= totals[b] ? a : b)) : null;
  // Naming a weak spot only makes sense if one exists; a clean sweep gets praise.
  const weakest = lowest && totals[lowest] < counted * 5 ? lowest : null;

  const badges = LEVELS.map((lvl, i) =>
    '<span class="lab-badge' + (state.badges[i] ? " earned" : "") + '">' +
      svg(lvl.icon) + "<span>" + lvl.badge + "</span></span>"
  ).join("");

  app.innerHTML =
    '<div class="lab-card cert">' +
      '<span class="cert-icon" aria-hidden="true">' + svg("trophy") + "</span>" +
      "<h2>" + (pct >= 90 ? "Prompt master" : pct >= 70 ? "Well played" : "Course complete") + "</h2>" +
      '<p class="cert-score">Final score: <b>' + xp + " / " + max + "</b> (" + pct + "%)</p>" +
      '<div class="lab-badges">' + badges + "</div>" +
      (weakest
        ? '<p class="principle-note"><strong>Where to focus next: ' + STAT_LABELS[weakest] + ".</strong> " + GROWTH_TIPS[weakest] + "</p>"
        : '<p class="principle-note"><strong>Full marks on every skill.</strong> Clarity, context, specificity and structure are all landing. Take these habits into the real prompts you write this week.</p>') +
      '<div class="lab-row center">' +
        '<button type="button" class="btn btn-secondary" id="lab-review">Review the rounds</button>' +
        '<a class="btn" href="index.html#news">Back to the news' + svg("arrow") + "</a>" +
      "</div>" +
    "</div>";

  document.getElementById("lab-review").addEventListener("click", () => {
    state.current = 0;
    state.screen = "level";
    saveState();
    render();
  });
}

function render() {
  renderHud();
  if (state.screen === "level") renderLevel();
  else if (state.screen === "feedback") renderFeedback();
  else if (state.screen === "cert") renderCert();
  else renderStart();
}

/* ---------- Confetti ---------- */

function spawnConfetti(count) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#0071e3", "#6a5cff", "#1d8a3e", "#ff9f0a"];
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.left = Math.random() * 100 + "vw";
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDuration = 2 + Math.random() * 1.5 + "s";
    const size = 5 + Math.random() * 6;
    bit.style.width = size + "px";
    bit.style.height = size + "px";
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 3600);
  }
}

render();
