---
title: "Model Tiering, Failover, and the Economics of Subagent Dispatch"
summary: "Using one model for everything is wasteful — you pay Pro prices for documentation and get Flash-quality output on architecture. Hubs solves this with three tiers, automatic failover chains, and a routing system that matches model capability to task complexity. The economics matter more than the architecture."
date: "Jun 22 2026"
draft: false
tags:
  - AI
  - Development
---

# Model Tiering, Failover, and the Economics of Subagent Dispatch

When I first started building Hubs, every subagent used the same model. It was simple. It was also stupid — I was paying for top-tier reasoning to write commit messages and getting bottom-tier quality on architecture decisions because that was the only model I had. The tiering system was born from the slow, expensive realization that using one model for everything is the worst possible strategy, and the failover chains came from the first time a provider went down mid-refactor and I watched my entire workflow grind to a halt.

## The Problem: One Model to Rule Them All Is a Terrible Idea

Models have different strengths, different speeds, and different costs. There are three axes: capability (can it do the task?), speed (how fast does it respond?), and cost (how much per token?). No model optimizes all three. The most capable models are slow and expensive. The fastest models are cheap and less capable. The trick is matching the task to the model, and most systems do not even try.

The failure mode I hit was obvious in retrospect. I would use a cheap model for architecture planning and get shallow plans — technically correct, but missing the nuance that comes from deep reasoning. Then I would use an expensive model for documentation and watch my API credits evaporate on tasks that a cheaper model could handle in a fraction of the time. I was losing on both ends: paying too much for simple work and getting too little from complex work.

I once asked a cheap model to design a database schema for a project. It suggested using a JSON file because "it's simpler." Technically correct. Absolutely the wrong answer for a project that needed to scale. That was the moment I realized model selection mattered — not as an optimization, but as a fundamental design requirement.

The industry's answer to this is usually "just use the best model for everything." This is convenient for the vendors who sell the best model, but it is bad advice for anyone who actually pays the bills. API costs are not negligible when you are running 10+ subagent calls per task, 50+ tasks per week. The costs compound, and the latency compounds worse. And "negligible" means different things to different people. I have been on the verge of being back out on the street more times than I care to count. A $50 API bill is not negligible to me. It is a week of groceries. Cost efficiency is not an optimization in this system — it is a prerequisite.

## The Three-Tier System

Three tiers is the right number. Fewer than three and you lose the ability to differentiate — everything gets the same treatment, which means nothing gets the right treatment. More than three and the routing logic becomes too complex to maintain — you end up needing a system to manage your system. Three tiers maps to the natural breakpoints in model capability.

| Tier | Primary Model | Used For |
|------|---------------|----------|
| **Pro** | `deepseek-v4-pro:cloud` | Architecture, security audits, strategic planning, complex debugging, requirements analysis |
| **Default** | `deepseek-v4-flash-free` | Code implementation, testing, code review, refactoring, debugging, UI/UX design, git operations |
| **Fast** | `deepseek-v4-flash-free` | Documentation, verification, codebase search, commit messages, external doc lookups |

The Pro tier gets the big context window — 1 million tokens — and the strongest reasoning. It is for tasks where being wrong is expensive. An architecture decision that sends you down the wrong path costs hours, sometimes days, to recover from. The Pro tier is insurance against that.

The Default tier is the workhorse. It handles about 80% of tasks. Fast enough, smart enough, cheap enough. Most code falls into this category — implementation, testing, review, refactoring. These are tasks where the model needs to be competent, but it does not need to be brilliant.

The Fast tier is for tasks where the output is disposable or easily verified. A commit message that is 90% right is fine. An architecture plan that is 90% right is not. Documentation, verification, codebase search — these are tasks where speed matters more than depth, and where the cost of a mistake is low.

The tiers are not about model quality — they are about model fit. A Fast-tier model is not a bad model. It is a model being used for what it is good at. The first time I routed a documentation task to the Fast tier and it completed in 3 seconds instead of 30, I realized I had been wasting 27 seconds per documentation task for months. The savings added up to hours over a week. I was not using a better model — I was using the wrong model for the job.

"Why not dynamically select the model per task based on complexity?" Because complexity is hard to measure programmatically. The tier system is a heuristic that works. Dynamic selection would require another model to evaluate the task, which is recursive and expensive. You end up paying for a model to decide which model to use, and at that point you have lost the plot.

## The Failover Chains

Models fail. Providers go down. Rate limits get hit. The failover chain is not a nice-to-have — it is the difference between a system that degrades gracefully and a system that stops working.

Each tier has a chain of models tried in order. If the primary errors — connection refused, 502, timeout after 60 seconds — the system tries the first fallback. If that errors, the second fallback. If all models in the chain fail, the system escalates to the user and asks what to do.

| Tier | Primary | Fallback 1 | Fallback 2 | Fallback 3 |
|------|---------|------------|------------|-------------|
| **Pro** | `ollama/deepseek-v4-pro:cloud` | `opencode-go/deepseek-v4-pro` | `opencode/deepseek-v4-flash-free` | NVIDIA NIM |
| **Default** | `opencode/deepseek-v4-flash-free` | `ollama/deepseek-v4-flash:cloud` | `opencode-go/deepseek-v4-flash` | NVIDIA NIM |
| **Fast** | `opencode/deepseek-v4-flash-free` | `ollama/glm-5.2:cloud` | `opencode-go/glm-5.2` | — |

The 60-second timeout is critical. If a model has not responded in 60 seconds, it is not going to. Fail over. I have seen models hang for minutes at a time during provider outages. Without the timeout, the entire system blocks on a dead connection.

Provider diversity is the goal. The three providers — opencode, ollama cloud, opencode-go — run on different infrastructure. When one goes down, the others usually stay up. I have seen each provider fail at least once. I have never seen all three fail simultaneously.

The NVIDIA NIM tier is optional because it requires an API key. Not everyone has one. The system works without it. But if you do have access, it provides an additional safety net at the bottom of the chain — a last resort that has saved me exactly once, when two providers went down in the same afternoon.

Task errors do NOT trigger failover. If the model responded but gave a bad answer, the problem is the prompt, not the provider. Fix the prompt, retry the same model. This distinction is important: failover is for infrastructure failures, not quality failures. Mixing them up means you never fix the actual problem.

The time ollama cloud went down for 45 minutes during a critical refactor, I did not notice. The failover chain kicked in within 60 seconds and routed to opencode-go. The work continued. I only found out about the outage when I checked my email later and saw the status notification. That was the moment I stopped worrying about provider reliability.

"Why not just use one reliable provider?" Because no provider is reliably reliable. I have seen every provider go down at least once. The question is not whether a provider will fail — it is whether your system handles the failure gracefully. Most systems do not. They throw an error and make you figure it out. The failover chain is the difference between a 60-second hiccup and a "well, I guess I am done for the day" moment.

## Task-to-Tier Routing

The routing logic is simple — a lookup table, not a model. Each agent type is assigned to a tier based on the kind of thinking its tasks require. The assignment is explicit in the agent definition, not inferred at runtime.

| Task Type | Tier |
|-----------|------|
| Architecture design, security audit, strategic planning | **Pro** |
| Code implementation, testing, code review, refactoring, debugging, UI/UX | **Default** |
| Documentation, verification, codebase search, commit messages | **Fast** |

The routing is explicit in the agent's YAML frontmatter: `model.tier: pro` or `model.tier: fast`. No inference, no magic. When you define a new agent, you pick its tier. That is the whole routing algorithm.

There is an override rule: if a user explicitly names a subagent — `@architect`, `@executor` — the system uses that agent's default tier regardless of the task type. This prevents the routing logic from second-guessing the user's explicit choice. If I ask for `@architect`, I want the architect's model, not whatever the router thinks is appropriate.

The routing is not about the model's absolute capability — it is about the model's fit for the task type. This is the same philosophy as the orchestration patterns: explicit beats implicit, configuration beats inference. The system does not try to be clever. It just follows the rules you gave it.

I learned this the hard way. I accidentally left a `@verifier` agent on the Pro tier and burned through $12 in API credits in a single session verifying documentation. The output was not better — it was just more expensive. The verifier was checking facts, not making architectural decisions. It did not need the million-token context window or the deepest reasoning. It needed to be fast and cheap. That was the moment I added the Fast tier.

"Why not let the model decide which tier to use?" Because the model is bad at estimating its own capability for a given task. It will either overestimate — wasting money on tasks it could handle with a cheaper model — or underestimate — producing poor results because it held back. The explicit assignment is more reliable because it removes the self-assessment problem entirely.

## The Economics

The tier system is not just about capability — it is about cost. The economics of multi-agent systems are different from single-agent systems because you are making many more API calls. A 10x increase in call volume means a 10x increase in cost sensitivity.

Pro tier calls cost roughly 10x more than Fast tier calls per token. Default tier calls cost about 3x more than Fast tier calls. A typical orchestration run might make 5 to 10 subagent calls. If all of them are Pro tier, that is expensive. If one is Pro, five are Default, and two are Fast, the cost is dramatically lower.

The savings compound because 80% of tasks are Default or Fast tier. Only about 20% genuinely need Pro. The latency savings are even more important than the cost savings. Fast tier responses come back in seconds. Pro tier responses can take 30 seconds or more. When you are running a multi-agent pipeline, those seconds add up fast.

I ran a month-long experiment to measure the difference. One week with tiering, one week without. The tiered week cost 68% less in API fees and completed tasks 40% faster. The output quality was indistinguishable because the Pro tier was still used for the tasks that needed it. The only difference was that I was not wasting money on tasks that did not need the expensive model.

The real economics are simple. I subscribe to Ollama Cloud and OpenCode Go. Two modest subscriptions. No $200/month enterprise plans, no usage-based billing that spikes when you are not looking. Just predictable costs that fit a budget that does not have much room to spare. I have been on the verge of being back out on the street more times than I care to count. A surprise $50 API bill is not an inconvenience to me — it is a week of groceries. Cost efficiency is not an optimization in this system. It is a prerequisite. The tiering system exists because I could not afford to run Hubs without it.

"API costs are dropping. This will not matter in a year." They are, but call volume is increasing. The ratio matters more than the absolute cost. Even if all models become 10x cheaper, the tiering still saves 70% relative to using one model for everything. The savings are structural, not temporary.

## What This Means for Reliability

The failover chains make the system resilient to provider outages, rate limits, and transient errors. The system degrades gracefully instead of failing. This is the difference between a tool you can rely on and a tool that lets you down at the worst moment.

Provider diversity is the key insight. Three providers with different infrastructure means no single point of failure. The 60-second timeout prevents hanging on a dead provider. The escalation gate — asking the user what to do when all models fail — prevents silent failures. Per-subagent isolation means one failed agent does not block others.

The system has never been completely down since the failover chains were implemented. Individual providers have gone down, but the system has always found a working model.

The failure modes that are handled:
- **Provider outage** — failover to next provider within 60 seconds
- **Rate limit** — failover to next provider (different rate limit bucket)
- **Model deprecation** — failover to next model in chain
- **Context overflow** — failover to model with larger context window

The failure mode that is not handled: all providers down simultaneously. This has never happened. If it does, the system escalates to the user with a clear message about what failed and why.

I was demoing Hubs to a friend once, typing commands and explaining how the system worked, and the primary provider returned 503 errors for about two minutes. I did not notice. The failover chain kicked in, routed to the next provider, and the commands kept working. My friend did not notice anything was wrong. That was the best possible outcome of a provider failure — it was invisible.

"Failover adds latency. The 60-second timeout means you wait a minute before trying the next provider." The timeout is configurable. For most tasks, 60 seconds is generous. The alternative is a hard failure, which is worse than a 60-second delay. I will take a 60-second hiccup over a "sorry, cannot do that right now" error any day.

## The System That Keeps Working

The highest compliment I can pay the tiering system is that I forget it exists. I do not think about which model is running. I do not check provider status before starting a task. I just type what I want and the system figures out the rest. When a provider goes down, I find out later — from a notification, not from a failed task. That is the goal. A system that keeps working is a system you stop noticing.

None of this works without the providers who give away compute. OpenCode Zen puts `deepseek-v4-flash-free` in the Default and Fast tiers — the workhorse of the entire system, and it costs me nothing. NVIDIA NIM sits at the bottom of the Pro and Default failover chains as the last resort, ready to catch anything the paid providers cannot handle. They are the safety net, and they are free. I subscribe to Ollama Cloud and OpenCode Go for the Pro tier — two modest subscriptions that fit a budget without much room to spare. I do not take any of this for granted. This system exists because someone else decided to make powerful models accessible to people who cannot afford $200/month enterprise plans. That is worth saying out loud.

The next time your AI assistant fails with a "provider unavailable" error, ask yourself: why did it not try another provider? The answer is usually that it was not designed to. The failover chain is not a feature — it is a fundamental reliability requirement that most systems skip. And the next time you see a $200/month AI subscription, ask yourself: who is this for? Because it is not for the person on the verge of being back out on the street who just needs a tool that works.
