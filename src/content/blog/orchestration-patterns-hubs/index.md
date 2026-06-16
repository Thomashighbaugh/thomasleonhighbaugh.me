---
title: "Orchestration Patterns & Subagents: Why One Pattern to Rule Them All Would Be Terrible"
description: "A deep dive into the 32 orchestration patterns in OpenCode Hubs — when each works, when each fails, and how a menu system plus a routing default agent lets you use natural language to invoke the right one without memorizing a thing."
summary: "No single orchestration pattern is universal, and if one were, it would be suboptimal for most tasks by definition. Here is the full catalog of 32 patterns in OpenCode Hubs, when to use each, and how the menu system plus a routing default agent makes natural-language pattern selection possible."
date: "Jun 16 2026"
draft: false
tags:
- AI
- OpenCode
- OpenCode Hubs
- Agentic AI
- Multi-Agent
- Workflow
- Architecture
---

# Orchestration Patterns & Subagents: Why One Pattern to Rule Them All Would Be Terrible

A single agent, no matter how well prompted, has one view of the world. Asking it to plan, execute, review, and test in the same conversational context means every phase is a compromise. The planner conserves context for execution. The reviewer is already committed to the approach it is reviewing. The tester skips edge cases because it is tired of its own output.

You can work around this — break the task into manual stages, copy context between sessions, re-prompt — but that is friction, and friction compounds. The obvious answer is specialist agents: one to plan, one to execute, one to review, one to test. But then you need a way to route between them, and that routing is itself a problem.

The `/orchestrate` hub in OpenCode Hubs has 32 subcommands, each implementing a different execution pattern. They fall into five families. No family is universally optimal — each exists because the others are worse for specific situations. If a single pattern worked for everything, it would by definition be suboptimal for most things. Optimization requires specialization. A universal pattern would be the average of all tasks — good at none.

This post covers the full catalog, when each pattern works, when it does not, and how the menu system plus a routing default agent lets me use natural language to invoke the right one without memorizing 32 subcommand names.

---

## The Pattern Catalog

The 32 subcommands of `/orchestrate` fall into five families: iterative loops, parallel bursts, coordinated teams, pipelines, and specialized patterns.

### Iterative Loops — When the Answer Is Not Right Yet

| Pattern | What It Does | When To Use | When Not To |
|---------|-------------|-------------|-------------|
| `ralph` | Execute → review → loop until reviewer signs off | Debugging, prompt tuning, prose refinement, any task needing multiple passes | Simple edits, tasks with clear single-pass solutions |
| `react` | Observe → diagnose → fix → verify | Runtime error debugging, regression hunting | Greenfield development |
| `evolutionary` | Tournament selection across competing implementations | Optimization problems, finding the best of many approaches | Tasks with one obvious correct answer |
| `self-assess` | Self-evaluation without external reviewer | When you trust the model's self-judgment | High-stakes changes needing independent review |

`ralph` is the workhorse of this family. Named for a certain *Simpsons* character who is notably not a Greco-Roman demigod, it runs a loop: execute the task, hand the result to a reviewer agent, and if the reviewer rejects it, feed the rejection back to the executor and loop. Configurable max iterations prevent infinite loops. The reviewer is a separate agent with its own prompt — it does not know what the executor was thinking, only what the output is and what the requirements were. This separation is the whole point. I have used `ralph` to debug a NixOS infinite recursion that took six passes to resolve, each iteration narrowing the search space because the reviewer caught something the executor missed.

`react` is narrower — it follows an observe-diagnose-fix-verify cycle designed for runtime errors and regression bugs. Where `ralph` is general-purpose refinement, `react` assumes something is broken and you need to find out what.

`evolutionary` runs tournament selection across competing implementations. Generate N approaches, evaluate each against criteria, keep the best, mutate, repeat. Useful when you genuinely do not know which approach will work best and want the model to explore the space.

`self-assess` skips the external reviewer and trusts the model's own judgment. Faster, but you lose the independent perspective. I use this for low-stakes tasks where the cost of a bad outcome is low.

### Parallel Bursts — When Speed Matters

| Pattern | What It Does | When To Use | When Not To |
|---------|-------------|-------------|-------------|
| `ultrawork` | Throw multiple executors at independent subtasks | Blog post generation, module refactors, batch operations | Tasks with sequential dependencies |
| `gastown` | High-throughput task parallelization | Large-scale batch processing | Small task sets |
| `sciomc` | Parallel scientist agents for comprehensive analysis | Research, codebase analysis, security audits | Simple questions |

`ultrawork` is the fastest pattern when the work is parallelizable. Each subtask gets its own executor with its own context. Results are collected and assembled. The bottleneck is not the model — it is how fast you can define independent subtasks. I have used this to refactor fifteen files across a module tree in under a minute and to generate three blog posts simultaneously, each with its own research context and tone instructions.

`sciomc` is a specialized variant that spawns parallel "scientist" agents for comprehensive analysis — each agent examines the same subject from a different angle, and the results are synthesized. I reach for this when I need a security audit or a deep codebase analysis and want multiple perspectives before making a decision.

### Coordinated Teams — When Work Needs to Be Shared

| Pattern | What It Does | When To Use | When Not To |
|---------|-------------|-------------|-------------|
| `team` | N agents on a shared task list, each pulls and completes | Large feature work, multi-file refactors | Small tasks, single-file changes |
| `swarm` | Multi-agent gated pipeline with coordinated handoffs | Complex workflows with stage gates | Simple linear work |
| `hive` | Structured multi-agent coordination (7 principles) | Formalized team workflows | Ad-hoc collaboration |
| `metaswarm` | Meta-orchestration layer coordinating sub-swarms | Very large projects with sub-teams | Most projects |

`team` is the one that feels closest to having real colleagues. Each agent pulls from a shared worklist, completes its item, marks it done, and picks the next. You watch items disappear in real time. The worklist is a markdown file in `.opencode/state/` — you can inspect it, reorder it, add items mid-flight. I have used this to restructure a NixOS flake configuration across thirty-plus files, watching each module get transformed and checked off the list.

`swarm` adds gates between stages — work does not flow to the next phase until the previous one passes review. Useful when mistakes in early stages would cascade.

### Pipelines — When Order Matters

| Pattern | What It Does | When To Use | When Not To |
|---------|-------------|-------------|-------------|
| `pipeline` | Deploy validated changes through staged pipeline | CI/CD, release workflows | Development work |
| `state-machine` | Phase-gated execution with checkpoints | Multi-phase projects with rollback needs | Simple linear tasks |
| `plan-execute` | Two-phase: generate a plan, then execute against it | Complex features needing upfront design | Well-understood tasks |
| `spec-driven` | Execute against a formal specification with validation gates | Compliance, contract work | Exploratory work |

`plan-execute` is the one I use most from this family. It forces a planning phase before any code is written. The plan is reviewed and approved before execution begins. This is overkill for a bug fix but essential for anything where the cost of going in the wrong direction is high.

`state-machine` adds checkpoints at each phase transition, which means you can roll back to a known good state if a later phase goes wrong. I use this for multi-day refactors where I want to be able to revert to "everything compiled and tests passed" without losing all the work.

### Specialized — When the Task Has Its Own Shape

| Pattern | What It Does | When To Use | When Not To |
|---------|-------------|-------------|-------------|
| `tdd` | Write failing test → implement → verify | Test-first development | Existing code without tests |
| `pair` | Collaborative pair programming with role rotation | Code review + implementation together | Solo work |
| `devin` | Autonomous issue-to-PR pipeline | Full feature delivery from issue | Exploratory or vague tasks |
| `maestro` | Strict role-separated factory with specialized workers | Production-grade code generation | Quick prototypes |
| `brownfield` | Legacy codebase analysis and incremental improvement | Working with old code | Greenfield projects |
| `vibe-code` | Conversational prototyping with rapid iteration | Early exploration, idea validation | Production work |

`brownfield` deserves special mention because it is the hardest pattern to get right. Working with legacy code means the model needs to understand what exists before it can change it. The pattern runs an analysis phase first — map the module structure, identify dead code, document implicit contracts — then proposes incremental changes rather than rewrites. I have used this to modernize Python scripts that predated type hints without breaking anything.

`vibe-code` is the opposite end of the spectrum — no analysis, no planning, just rapid conversational iteration. Useful when you are exploring an idea and do not yet know what you want. The output is throwaway by design.

---

## No Universal Pattern

If a single pattern worked for everything, it would by definition be suboptimal for most things. Optimization requires specialization. A universal pattern would be the average of all tasks — good at none.

- `ralph` is terrible for parallelizable work. Its sequential loop wastes the parallelism that `ultrawork` exploits.
- `ultrawork` is terrible for tasks needing iteration. It has no built-in review cycle — each subtask runs once and the results are assembled.
- `team` is terrible for single-file edits. The overhead of coordinating a shared worklist exceeds the work itself.
- `pipeline` is terrible for exploratory work. Its gates block the iteration speed you need when you do not know what you are building.
- `vibe-code` is terrible for production work. It does not plan, does not review, and does not test.

The value is not in any one pattern. It is in having all of them available and a mechanism to choose.

---

## The Menu System — Discovery Without Memorization

A configuration with 32 orchestration patterns, 29 agents, 76 skills, and 14 tools is useless if you have to remember every name. The natural response — "I hope what I need exists somewhere" — is not a workflow.

Every hub in OpenCode Hubs shows an interactive menu when invoked without arguments. Type `/orchestrate` with no subcommand and you get a list of all 32 patterns with plain-language descriptions. You do not need to remember that `ralph` is the iterative loop — you type `/orchestrate`, see the list, and pick the one that matches your task.

The menu is not a crutch for beginners. It is a reference I use daily, because I do not use every pattern every day. `ralph` and `ultrawork` I use weekly. `evolutionary` and `metaswarm` I use monthly. The menu means I do not have to keep the full catalog in my head — I just need to know which hub to ask.

The descriptions in the menu are the same descriptions the `hubs` default agent uses to route tasks. There is consistency between what the human sees and what the model uses, which means the model's proposals make sense in terms the human already understands.

---

## The Default Agent as Router

Menus solve discovery, but they still require you to know *that* you need a pattern. If you are deep in a task and just say "fix this," you are not going to stop and browse the orchestrate menu.

The `hubs` default agent has routing instructions in its system prompt. When you give it a task in natural language, it assesses whether a specialist pattern would produce better results than doing the work itself.

The routing works like this:

1. The agent receives your prompt.
2. It checks against a set of heuristics: is this parallelizable? Does it need iteration? Does it need a reviewer? Is it a simple edit?
3. If a pattern fits, it proposes it: "This looks like a task for `ralph` — iterative refinement with a reviewer. Shall I proceed?"
4. You approve or decline. If you decline, it does the work directly.

The routing instructions are explicit about what cues map to which patterns. The agent does not need to guess — it has a decision tree. The proposal gate means you always have veto power. Over time, the model gets better at the assessment because the feedback loop — propose, approve or reject — is consistent and immediate.

The catch is that the routing is only as good as the instructions. Vague instructions produce vague routing. The heuristics need to be concrete: "If the task has multiple independent subtasks, propose `ultrawork`. If the task needs refinement against a quality bar, propose `ralph`." The model cannot read tea leaves. It needs a map.

---

## Natural Language as the Invocation Mechanism

Because the default agent has routing instructions, I can use natural language and unintentionally cue the correct pattern. "Fix all the TypeScript errors in this project" triggers the assessment: multiple files, independent fixes, needs review — proposes `ultrawork` with a `code-reviewer` gate. "Make this paragraph read better" triggers: single item, needs refinement — proposes `ralph`.

I do not need to remember the pattern name. I just describe the work. The catchall routing instructions catch cases I did not explicitly think about. Magic keywords — `"ralph"`, `"don't stop"`, `"autopilot"`, `"build me"` — provide shortcuts when I do know what I want.

The system works at two levels:

- **Explicit**: I know the pattern, I name it. `/orchestrate ralph fix this bug` or just `"ralph fix this bug"`.
- **Implicit**: I describe the work, the model routes it. "I need to refactor this module tree and make sure nothing breaks" — the model proposes `team` with a `code-reviewer` gate.

Natural language routing is probabilistic. It will guess wrong sometimes. The proposal gate catches those cases. The alternative — no routing, one pattern for everything — is worse in every scenario except the one where you guessed right.

---

## Patterns as Tools, Not Dogma

The patterns are not a framework. They are a toolbox. The menu makes the toolbox discoverable. The default agent makes it reachable from natural language. No pattern is universal, and the system is not trying to find one — it is trying to make the right pattern for the moment as easy to reach as typing what you want.

The next post in this series covers how H persists what it learns across sessions — the context and state management system that makes knowledge compound instead of resetting to zero every time you close the terminal.
