---
title: "Hubs: Hub-Driven Multi-Agent Orchestration for OpenCode"
description: "How I built a multi-agent orchestration system for OpenCode organized around five discoverable hubs — init-project, ideation, orchestrate, harvest-context, and project — that puts 29 agents, 76 skills, and 14 tools behind interactive menus instead of requiring you to memorize names."
summary: "OpenCode Hubs solves the problem of scale when a configuration accumulates 29 agents, 76 skills, and 14 tools. Five hubs organized by the project development lifecycle give every capability a discoverable home through interactive menus and direct subcommand invocation."
date: "Jun 3 2026"
draft: false
tags:
- AI
- OpenCode
- Agentic AI
- Developer Tools
- Workflow
- Architecture
- Multi-Agent
- OpenCode Hubs
---

# Hubs: Hub-Driven Multi-Agent Orchestration for OpenCode

> Interactive Menus, Not Memorization.

A year ago I wrote about using OpenCode as an LLM harness for NixOS refactors — a single agent with file access, shell access, and a carefully tuned prompt. It worked well. It collapsed week-long refactors into days. I was happy.

Then I started hitting the limits.

A single agent, no matter how well prompted, has one view of the world. Asking it to plan, execute, review, and test in the same conversational context means it has to switch cognitive hats mid-stream, and the quality of each phase reflects that compromise. The planning is shallower than it could be because the agent is conserving context for execution. The review is sloppier because it's already committed to the approach it's reviewing.

You can work around this — break the task into manual stages, copy context between sessions, re-prompt — but that's friction, and friction compounds.

What I wanted was a system where every capability had a discoverable home, organized by the natural flow of project work. Where you didn't need to remember that the thing you need is called something — you could just ask the right hub and see what's available. Where planning, execution, review, and verification each got their own focused agent and the routing between them was handled not by a brittle config file but by the model's own judgment about what the task needed.

That system is [OpenCode Hubs](https://github.com/Thomashighbaugh/opencode).

## What Hubs Is

Hubs is a hub-and-spoke orchestration layer for OpenCode — a set of configuration files, agent definitions, workflow skills, TypeScript tools, and plugin code that lives in `~/.config/opencode/` and extends OpenCode with multi-agent orchestration capabilities. The name comes from the central operations hub concept: a hub that coordinates specialized units rather than trying to do everything itself.

The system is organized around **five hubs**, each corresponding to a phase of the project development lifecycle:

| Hub | Subcommands | Purpose |
|-----|-------------|---------|
| `/init-project` | 10 | Project initialization, detection, validation, and diagnostics |
| `/ideation` | 26 | Planning, research, and structured thinking — 24 methodologies |
| `/orchestrate` | 32 | Execution patterns — from persistent loops to multi-stage pipelines |
| `/harvest-context` | 18 | Knowledge extraction and artifact management |
| `/project` | 20 | Git operations, code quality, release management, file organization |

Invoke any hub without arguments and it shows you an interactive menu — every subcommand listed with a plain-language description. Supply a subcommand directly and it skips the menu: `/orchestrate ralph fix all TypeScript errors`, `/project commit`, `/harvest-context session`.

Behind these five entry points are **29 agents**, **76 skills**, **14 TypeScript tools**, and **6 commands** — all discoverable through the hub menus, none requiring you to remember an exact name.

## The Agent Catalog

The agents are organized by capability, and they are named by what they do:

| Category | Agents |
|----------|--------|
| Implementation | `@executor`, `@code-simplifier`, `@refactoring`, `@frontend-design` |
| Architecture | `@architect`, `@planner`, `@analyst`, `@deep-thinker`, `@designer` |
| Review | `@code-reviewer`, `@security-reviewer`, `@critic`, `@verifier`, `@qa-tester`, `@test-engineer` |
| Research | `@scientist`, `@explore`, `@writer`, `@document-specialist` |
| Workflow | `@tracer`, `@git-master`, `@debugger`, `@config-orchestrator` |
| Specialized | `@effort-estimator`, `@prompt-simplifier`, `@skill-creator`, `@requirements-analyzer`, `@commit-drafter` |

There is also a default agent — uncreatively called `hubs` — that acts as a generalist triage point. You tell it what you want done, and it decides whether to do the work itself or hand off to a specialist subagent. The routing logic lives in its system prompt: thirty lines about when to delegate and when not to, a catalog of specialists with clear capability descriptions, and a workflow pattern for how to propose, get approval, and execute. Everything else is emergent — the model figures out the right sequence of specialists for a given task because the prompt gives it the tools to reason about it and the freedom to choose.

## Execution Patterns

The `/orchestrate` hub has 32 subcommands covering different execution patterns. The ones I reach for most:

**`ralph`** — A self-referential loop: execute, verify, repeat until a reviewer says it's done. Named for a certain *Simpsons* character who is notably not a Greco-Roman demigod. Useful for iterative refinement — tuning a prompt, debugging a tricky error, polishing prose.

**`ultrawork`** — Maximum parallel execution. Throws multiple executors at independent subtasks simultaneously. I have used this to generate three blog posts in parallel, to refactor a module tree across fifteen files in under a minute, and to run security reviews, style linting, and test execution as a pre-commit gauntlet.

**`team`** — N coordinated agents on a shared task list. Each agent pulls from the list, completes its work, marks it done, picks the next item. This feels closest to having a real team — you watch work items disappear in real time, each handled by a different specialist.

**`autopilot`** — Full autonomous execution from idea to working code. You describe what you want, the system plans, implements, reviews, and delivers.

**`consensus`** — Multi-agent voting to reach agreement on design decisions. Useful when there are genuine tradeoffs and you want perspectives from multiple specializations before committing.

There are also patterns for test-driven development, pair programming, evolutionary optimization, swarm coordination, legacy codebase remediation, and a dozen more scenarios. Each is a skill file in `~/.config/opencode/skills/` — markdown with embedded workflows, loaded at runtime and routed through the hub.

## Project-Scoped Configuration

The agents and skills live in your global `~/.config/opencode/` directory, but they are not forced onto every project. When you initialize Hubs in a new project via `/init-project setup`, it detects the project's stack — language, framework, package manager, build system — and auto-generates project-specific agents, skills, and rules that live in that project's `.opencode/` directory.

This means I can have a NixOS-specific flake architect agent in my dotfiles repo, an Astro review agent in my portfolio project, and a prose-editing specialist in a writing project — and Hubs knows to use each only in its own context. No single bloated global configuration trying to be everything to every project. No namespace collisions. No "I guess this agent technically works here even though it was written for something completely different."

The provisioning system is codebase-aware: it scans the project's actual file structure, detects the frameworks and tools in use, and generates agent prompts, skill files, and routing rules that reference the project's actual conventions, path aliases, and dependency graph. The generated agents know your import paths without being told.

## The OpenCode Plugin Ecosystem Problem

I should say something about plugins, because it's relevant to why Hubs exists as a configuration set rather than a plugin.

OpenCode has a plugin system, and people have built genuinely useful things with it. The `opencode-btw` plugin deserves special mention — it is the cleanest example I have seen of working with the OpenCode SDK, and its implementation quality is top-tier even if the features it provides do not fit my particular workflow. It set the bar for what a well-crafted plugin looks like and gave me a working model for how to interact with the SDK's hooks, tools, and state management APIs. If you are building anything on top of OpenCode, read the opencode-btw source. It will teach you more than the documentation will.

But the ecosystem as a whole has a pattern problem. Plugins appear, get attention for about a week, and then the maintainer moves on. The model providers change their APIs. The hooks system gets an update. The plugin breaks. Nobody fixes it. Five minutes of fame, archive, done.

This is not unique to OpenCode — it happens in every plugin ecosystem — but it is pronounced here because the tool itself is still evolving rapidly and the surface area a plugin has to cover is large and shifting. Maintaining a plugin that hooks into multiple lifecycles, handles session state, manages tool permissions, and stays compatible across releases is real work. Most people who build one do not sign up for that.

Hubs takes a different approach. It is not a plugin. It is a set of markdown agent definitions, skill files, TypeScript tools, and configuration that use OpenCode's native extensibility points — the configuration system, the project-scoped `.opencode/` directory, custom commands, tool definitions — without requiring a plugin to bundle, ship, and maintain against a moving target. The skills are files in `~/.config/opencode/skills/`. The agents are files in `~/.config/opencode/agents/`. The tools are TypeScript files in `~/.config/opencode/tools/`. They do not compile. They do not version-lock. They work across releases because they depend on interfaces that are more stable than the plugin API.

Is it as tight as a proper plugin? No. Does it survive upgrades without breaking? Yes. That tradeoff is worth it.

## The Naming Thing

Every agentic AI framework goes through a naming phase where they have to call their components something.

Oh-My-OpenCode went through a phase that I can only describe as Greco-Roman cosplay — every agent had a classical name meant to evoke wisdom or strategy or authority. It felt like naming your D&D character something cool and edgy and then realizing you have to introduce yourself with that name in every professional conversation. The kitsch was distracting.

Anthropic's naming scheme for MCP and Claude Code tooling operates in a different register entirely — a thesaurus of pseudo-heroic compound words, as if someone generated a list of vaguely epic-sounding portmanteaus, crossed out the ones that were not trademarkable, and called it a day. The names convey nothing about what the things actually do. You need a glossary to navigate the system.

Hubs takes the opposite approach. The agents are named by function: `@planner`, `@executor`, `@code-reviewer`, `@test-engineer`, `@debugger`, `@security-reviewer`. When I need to think through a complex problem, I call `@deep-thinker`. When I need code reviewed for quality, I call `@code-reviewer`. The name tells you what the agent does. No mythology required. No glossary needed.

The orchestration patterns follow the same logic: `ralph` (self-referential loop), `team` (coordinated multi-agent), `ultrawork` (parallel burst), `consensus` (multi-model vote). The name maps to the behavior in one or two syllables.

This is a deliberate choice. When you are juggling ten agents across three execution patterns in a single session, you do not have the mental bandwidth to remember that "Nestor" is the reviewer and "Cassandra" handles error checking. Call it what it is.

## What Hubs Replaced

Before Hubs, I had a project called `fiction-fabricator` — a standalone application for generating and editing prose with AI assistance. It had its own CLI, its own configuration format, its own prompt templates, its own output management. It worked. It was also a separate codebase I had to maintain, with its own dependency tree and its own bugs and its own drift from whatever model I was using at the time.

Hubs replaced it. Not as a direct port, but by providing the same capabilities as composable skills that run inside OpenCode. I have a writer agent tuned for prose, a document-specialist agent for research, skills for tracking narrative structure across sessions. They live in my global config and activate in any project where I am writing. No separate application. No duplicate configuration. No dependency tree to rot.

The same pattern applies to code projects. I do not maintain per-project agent configs anymore — Hubs provisions them from the detection of what is in the project. Run `/init-project setup` against an Astro site and you get agents tuned for Astro, SolidJS, and Tailwind. Run it against a Rust crate and you get agents that know about cargo, clippy, and the borrow checker. The agents are specific to the project without being manually configured for it.

## How It Actually Works

The core flow is simple. You tell the `hubs` default agent what you want. It assesses the task: can I do this directly, or would a specialist produce better results?

If the answer is no — it is a simple edit, a quick question, a file read — it handles it. One agent, one step, done.

If the answer is yes — this needs planning, execution, and review; or this has parallelizable subtasks; or this needs a specialist — it proposes a pattern. "I think this would benefit from a planner to scope the work, then an executor to implement, then a code-reviewer to catch regressions. Shall I proceed?" You say yes or no. If no, it does it anyway, just less optimally.

Over time, the model gets better at this assessment. It learns which tasks benefit from orchestration and which ones do not. The proposal step becomes faster. The approvals become more routine. The whole thing starts feeling like working with someone who knows when to ask for help and when to just get on with it.

Magic keywords provide shortcuts for when you do know what you want. Type "ralph" or "don't stop" and it routes to `/orchestrate ralph`. Type "autopilot" or "build me" and it routes to `/orchestrate autopilot`. Type "cancel" or "stop" and it kills whatever is running. These are useful when you know the pattern; potentially surprising when "don't stop" slips into casual conversation.

## The Uncomfortable Admission

The reason Hubs works is not that I am a genius orchestration designer. It is that the model itself is good at routing. The `hubs` agent's core competency is not writing code or reviewing prose — it is *deciding who should do what*. That is a metacognitive skill that LLMs are surprisingly good at, especially when you give them a structured catalog of available specialists and a clear decision framework.

Most of the routing logic is in the system prompt. A catalog of agents with clear capability descriptions. A workflow pattern for how to propose, get approval, and execute. A set of rules about when to delegate and when to do it yourself. Everything else — the actual orchestration — is emergent. The model figures out the right sequence of specialists for a given task because the prompt gives it the tools to reason about it and the freedom to choose.

This is the opposite of the rigid workflow-engineering approach that most "AI orchestration frameworks" take. Those systems try to encode the routing logic in YAML pipelines or DAG definitions or state machines. You end up maintaining two things — your application logic and your orchestration configuration — and neither one can be updated without checking whether the other still works.

Hubs puts the routing where it belongs: in the model's reasoning. The prompt is the pipeline. The catalog is the config. The assessment is the routing algorithm. The approval gate is the safety catch. Everything else is emergent behavior from a sufficiently good system prompt.

## Configuration, Not Plugin

You will not find Hubs on NPM. It is not a plugin. It is a configuration — a directory of markdown files, TypeScript tools, skill definitions, and agent prompts that lives in `~/.config/opencode/` and is backed up to a public GitHub repository for anyone to use, fork, or ignore.

This is a deliberate choice, and the reasoning is straightforward.

A configuration is expected to iterate rapidly because it reflects one person's evolving workflow. I change things in Hubs almost daily — add an agent, tweak a prompt, replace a pattern that did not work with one that does. The people who adopt a configuration do so knowing it is someone else's setup. They are not going to be offended by churn because they are not relying on it as a stable dependency. They are going to fork it, tinker with it, and make it their own. That is the point. A configuration is a starting point, not a contract.

A plugin is the opposite. A plugin is, in theory, relied upon to provide consistent functionality to people who did not write it. If you publish something as a plugin, you are signaling that it will work the same way tomorrow as it does today. Radical changes every few days are counter-indicated when you are developing a group of users who depend on your interface not shifting under them. That is a reasonable expectation, and it is one I do not want to be bound by.

Hubs changes every time I use it. I do not want to version-lock that process or pretend it is stable enough for someone else to depend on. Publishing it as a configuration — freely available, freely forkable, explicitly unstable — is honest about what it is. If it works for you, great. If it does not, change it. That is what configurations are for.

There are several other facets of this setup — the plugin system architecture, the state-versus-context storage model, the model tiering and routing, the codebase-aware provisioning system — each worth its own post. Coming soon.
