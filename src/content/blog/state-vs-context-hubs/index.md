---
title: "State vs. Context: How Hubs Makes Knowledge Compound Across Sessions"
summary: "The most important design decision in OpenCode Hubs is not how agents are orchestrated — it's how knowledge persists. The separation of state from context is the difference between a system that learns and a system that forgets everything the moment you close the terminal."
date: "Jun 20 2026"
draft: false
tags:
  - AI
  - Development
---

# State vs. Context: How Hubs Makes Knowledge Compound Across Sessions

The first time you use an AI coding assistant, it feels like magic. You ask it something, it knows the answer. You describe a problem, it produces a solution. You close the terminal feeling like you've gained a superpower.

The hundredth time, you notice the pattern. It doesn't remember what you figured out last week. It doesn't know about the architecture decision you made yesterday — the one that took three hours of deliberation and a full pot of coffee to arrive at. It doesn't know that you already tried approach X and watched it fail in a spectacularly educational way. Every session starts from zero, and every insight dies when the terminal closes.

I lived with this for about six months before it drove me insane enough to do something about it.

## The Problem: Every Session Starts from Zero

Here's the thing about context windows that nobody tells you when you start using these tools: they are working memory. RAM, not disk. They exist for the duration of a conversation and then they evaporate. Everything the model learned about your project — your conventions, your architecture, your hard-won lessons — is gone the moment you type a new prompt or close the terminal.

The industry's answer to this is usually another blog post. Another tutorial. Another "definitive guide" that is really just someone rephrasing the documentation with more ads. I have read more fluff articles about AI-assisted development than I care to admit — endless pages of "10x your productivity" that somehow never tell you what to actually do when the model forgets your project structure between sessions. I was tired of doing the research myself, tired of reading the same advice repackaged twenty different ways, tired of being my own tireless researcher when what I needed was a system that just remembered.

The insight that eventually led to the state/context split was embarrassingly simple. I was sitting in my Neovim session — Kitty split on the left, terminal on the right, the usual NixOS chaos unfolding in the background — and I realized I had been writing things down. Session after session, I was taking notes. Architecture decisions. Why I chose approach A over approach B. The exact incantation needed to get `nix build` to stop complaining about a hash mismatch. And every new session, the model would ask me the same questions, and I would give the same answers, and we would have the same conversation about why we made the same decisions.

I was Groundhog Day–ing my own development workflow.

The problem wasn't that I didn't have the information. The problem was that the information lived in my notes, and the model lived in its context window, and never the twain shall meet. I needed a way to make what I learned in one session available to the next — without building a database, without training a model, without adding another service to my already-too-long list of running daemons.

Git was right there. Git is already a versioned knowledge base. It has branching, history, diff, blame, and every tool in the ecosystem can read it. The problem wasn't the storage mechanism — it was what I was putting in it and what I was keeping out.

## The Core Distinction: State vs. Context

The separation is not technical. It is conceptual. And once you see it, you cannot unsee it.

**State is what happened.** It is the raw material of a session: the logs, the checkpoints, the half-baked ideas, the tool output, the todo lists, the session transcripts. It is write-heavy and read-rarely. It is for the machine — agents, tools, automation — not for the human. It is ephemeral by design, and it is gitignored so it never accidentally becomes permanent.

**Context is what we learned.** It is the curated output of reflection: the architecture decisions, the framework patterns, the research, the lessons. It is write-rarely and read-often. It is for the human (and the human's future agents). It is durable by design, and it is committed to git so it compounds across sessions.

**Secrets are what we must not leak.** API keys, tokens, session transcripts with PII. They are short-lived, gitignored, and stored in a separate path so the privacy scan can catch them before they escape.

In practice, this looks like a three-way split in your `.opencode/` directory:

| Layer | Location | Git | Lifecycle | What Goes There |
|-------|----------|-----|-----------|-----------------|
| **State** | `.opencode/state/` | Gitignored | Ephemeral | Session artifacts, logs, plans, checkpoints, todos, heartbeat data |
| **Context** | `.opencode/context/` | Committed | Accumulates | ADRs, framework docs, patterns, research, decisions |
| **Secrets** | `.opencode/state/sessions/` | Gitignored | Short-lived | API keys, tokens, session transcripts with PII |

The git boundary is the forcing function. If it is committed, it is curated. If it is gitignored, it is disposable. This is not a technical constraint — it is a psychological one. The friction of committing forces you to ask: "Is this worth keeping?" And that question is the entire point.

I have a confession to make: I originally tried the opposite approach. I put everything in state and planned to promote the valuable bits to context later. You can guess what happened. Nothing ever got promoted. The state directory grew into a swamp of unorganized artifacts, and the context directory stayed empty. The git boundary was the only thing that forced me to actually curate, because the alternative was committing noise to my repository forever.

This is the same philosophy that runs through every design decision in Hubs: **files over complexity.** Files are universal. Every tool can read and write them. Every editor can edit them. Every diff tool can compare them. Git already versions them. You do not need a system to remember what you decided last week. You need a file, a commit, and the discipline to write it down.

I realize this sounds like the kind of thing someone says after reading one too many "10x your productivity" blog posts that somehow never tell you what to actually do. And look, I have definitely read those. I have read dozens of them. I have bookmarked them, saved them to Pocket, promised myself I would come back to them, and never did. The answer was not another article. The answer was a text file and the willingness to open it.

## The Manual-Only Harvest Pattern

Here is the most controversial design decision in Hubs, and the one I expect to catch the most heat in the comments: **context harvesting is manual-only.** No auto-checkpoints. No auto-saves. No auto-promotions. If you want something to survive the session, you have to explicitly save it.

I did not arrive at this decision through wisdom. I arrived at it through the slow, painful process of watching auto-generated knowledge bases rot.

The first version of Hubs had auto-harvesting. Every session end, it would scan the conversation, extract decisions, and save them to context. It sounded great in theory. In practice, it produced a graveyard of files. Half of them were wrong — the model would extract "decisions" that were actually just exploratory tangents. A quarter were duplicates of things already saved. The rest were noise that nobody would ever read. The system was producing quantity, not quality, and the signal-to-noise ratio was so bad that I stopped trusting the context directory entirely.

I deleted the whole thing and started over with a simple rule: **nothing goes to context unless a human says so.**

The harvest flow looks like this:

1. Work happens in a session. State is written automatically — logs, checkpoints, todos, heartbeat data. The machine handles this.
2. At a natural break — when I finish a feature, fix a bug, or just need to step away — I run `/harvest-context session`.
3. The system reviews the conversation and extracts decisions, patterns, and learnings.
4. Each item is classified: durable fact → context, temporary note → notepad, reusable procedure → skill, duplicate → skip.
5. I approve or reject each promotion.
6. Promoted items are written to `.opencode/context/` (committed) or `.opencode/state/` (gitignored).

The whole thing takes about 30 seconds for a typical session. And those 30 seconds are the most important 30 seconds of the workflow, because they force me to actually think about what I learned.

Before anything gets written to context, it passes through a privacy scan. The scan classifies content into four risk levels:

- **High risk** — contains API keys, tokens, credentials, or PII. Saved to state (gitignored) instead of context. The system does not trust me to remember not to commit secrets.
- **Medium risk** — might contain sensitive information. Flagged for human review. Saved to state until I look at it.
- **Low risk** — safe to commit as durable context. This is where most things land.
- **Uncertain** — the scan could not decide. Treated as medium risk.

I added this after the time I almost committed a session transcript that contained an API key I had pasted for debugging. The key was in a code block, surrounded by analysis, and I would not have caught it in a manual review because I was looking at the analysis, not the key. The scan caught it. That alone justified the entire harvest system.

The `remember` skill is the actual curation gate. It takes the raw findings from a session and decides what belongs where:

- **Project memory** (`.opencode/state/project-memory.json`) — durable team knowledge. The things you would tell a new contributor on day one.
- **Notepad** (`.opencode/state/notepad.md`) — high-signal context for the next few turns. The thing you are actively working on.
- **Wiki** (`.opencode/state/wiki/`) — persistent knowledge base articles. The things you want to reference months from now.
- **AGENTS.md updates** — conventions and instructions that belong in the project's AI-readable documentation.

The friction is the point. If it was not worth 30 seconds to harvest, it was not worth keeping. The alternative — auto-harvesting everything — is a graveyard. I have the digital tombstone to prove it.

## The Tools That Bridge the Gap

The state/context split is useless without tools that operate across the boundary. I built four of them, and each one serves a different retrieval pattern because each one has a different write/read ratio and a different durability guarantee.

### `compact` — The Save Game Button

`compact` is the most operational of the four. It takes a snapshot of the current session — work products, mode state, todo progress, recent tool calls — and saves it to `.opencode/state/sessions/{id}/compaction-{timestamp}.json`. It also updates the project CHANGELOG with a record of what files changed.

I use this when my context window is getting full, or when I am about to switch tasks and do not want to lose my place. It is the save game button. It does not commit anything to durable knowledge — it just preserves where I am so I can pick up later.

The artifact it produces is structured JSON, not markdown, because it is for the machine, not for the human. Agents read it to resume state. Humans do not need to read it — they just need to know it exists.

### `remember` — The Curation Gate

`remember` is the classification engine. It takes the raw findings from a session and decides what belongs where. It is the tool that makes the state/context boundary meaningful, because it is the tool that decides what crosses it.

The classification is not automatic. `remember` presents each finding with a recommended destination and asks for approval. This is the 30 seconds I mentioned earlier. It is the moment where you actually think about whether something is worth keeping.

I have found that the act of classification changes how I work. When I know I will have to decide whether something is worth keeping, I pay more attention during the session. I take better notes. I think about what I am learning instead of just reacting to errors. The tool changed my behavior, which is more than I can say for most software.

### `wiki` — The Persistent Knowledge Base

`wiki` is the most traditional of the four. It is a markdown knowledge base with YAML frontmatter, organized by category (architecture, decision, pattern, debugging, environment, session-log), with cross-references via `[[page-name]]` syntax and keyword-plus-tag search.

The interesting design decision here is that wiki pages live in `.opencode/state/wiki/` — which is gitignored. They are treated as state, not context. This was a deliberate choice: wiki articles are project-local and often contain rough edges that I do not want in my permanent git history. They are durable within the project but disposable in the version control sense.

This means the wiki is where half-baked ideas go to mature. I write a wiki page when I am still figuring something out. If it solidifies into a real decision, it gets promoted to an ADR in `.opencode/context/`. If it stays rough, it stays in the wiki. No pressure to commit, no guilt about deleting.

### `vectorize-context` — The One Exception

`vectorize-context` is the only tool that crosses the state/context boundary for retrieval. It indexes committed context files into a local `sqlite-vec` vector database for semantic search. Triggered via `/harvest-context search`.

The lazy-freshness model is the key design detail: every query stats all context files, re-indexes only what changed, and then searches. If nothing changed, the model is never loaded. The embedding model (`all-MiniLM-L6-v2`) only loads when there is actual work to do.

I added this because files are great for structured retrieval (I know the file I want) but terrible for fuzzy retrieval (I know the concept but not where I wrote it down). The vector index handles the fuzzy case so I do not have to remember exactly where I put something — I just need to remember what I was thinking about when I wrote it.

These four tools compose into a pipeline: `compact` saves where you are, `remember` classifies what you learned, `wiki` stores the rough edges, and `vectorize-context` finds what you forgot you knew. Each one is simple. Together, they make the system feel like it remembers.

## What Compounds, What Doesn't, and Why

After months of using this system, the proof is in what has accumulated.

In `.opencode/context/`, there are four Architecture Decision Records. ADR-001 covers the hierarchical AGENTS.md documentation system. ADR-002 covers the removal of stale assets and deploy badges. ADR-003 covers the Astro 5 migration — a six-workstream effort that touched almost every file in the project. ADR-004 covers the test foundation. Each one captures not just what was decided, but why, and what the consequences were.

There are framework docs in `.opencode/context/frameworks/` — Astro content collection patterns, pages-subdirs conventions. These are the things I had to look up three times before I wrote them down, and have not had to look up since.

There are two empty directories: `patterns/` and `research/`. They are empty not because the system failed, but because the project is still young. Every harvest is an opportunity to fill them. They will fill over time, the same way the ADRs filled — one decision at a time, one session at a time.

What does not accumulate is equally important. Session transcripts are in `.opencode/state/sessions/`, gitignored. Tool logs are in `.opencode/state/logs/`, gitignored. Checkpoints are in `.opencode/state/sessions/`, gitignored. These are the raw material of work, not the refined product. They are searchable if I need them — the `compact` skill preserves session snapshots for exactly this purpose — but they are not committed to git, because they do not represent durable knowledge.

The hockey stick of knowledge accumulation is real. In sessions 1 through 5, context is sparse. The agent works from `project-context.md` and whatever it can infer from the codebase. It asks questions it should not need to ask. It makes suggestions that contradict decisions already made.

In sessions 5 through 20, context grows. ADRs accumulate. Framework docs accumulate. The agent starts referencing past decisions. It stops asking about things it should already know.

After session 20, something shifts. The agent spends more time reading context than asking questions. It references an ADR that I had forgotten about. It corrects me on a detail I misremembered. The system has crossed a threshold where the accumulated knowledge is more valuable than the model's training data.

The first time this happened to me, I was refactoring a component and the agent said: "Per ADR-003, the client island strategy uses `client:idle` for most components. This one is currently `client:load` — should I change it?" I had written ADR-003 three weeks earlier and completely forgotten about it. The agent had not. That was the moment I knew the pattern worked.

The privacy scan is the gatekeeper that makes this safe. Before anything is written to context, it is scanned for secrets. High-risk content is redirected to state. Medium-risk content is flagged for review. Low-risk content is committed. This prevents the most common failure mode: accidentally committing an API key because it was in a code block next to the analysis you actually wanted to save.

The maintenance burden is real. Context files can go stale. ADRs can be superseded. Framework docs can become outdated as libraries evolve. But stale context is a visible problem — you can see the file, you can update it, you can delete it. Lost knowledge is an invisible problem. You do not know what you have forgotten, and neither does your AI assistant. I will take visible maintenance over invisible loss every time.

The terminal becomes a persistent place. Not because of some elaborate system or a fine-tuned model, but because of a simple file organization convention and the discipline to use it. Every session adds to a growing body of knowledge that the next session inherits. The terminal stops being a place you pass through and starts being a place you build.

The next time you close a terminal, ask yourself: what died with that session? If the answer is "everything I learned," you need a better pattern. State vs. context is that pattern. It is not glamorous. It is not AI-powered. It is not going to get a TechCrunch article written about it. But it works, it survives upgrades, and it does not require you to maintain yet another system alongside your already-too-complicated NixOS configuration.

And honestly, that is the highest compliment I can pay any piece of software.
