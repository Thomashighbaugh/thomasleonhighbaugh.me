---
title: "The Great LLM Cargo Cult: Why Your Chatbot Isn't Thinking — It's Just Really Good at Hooting"
description: "A frank dismantling of the AGI marketing myth, grounded in linguistics, linear algebra, and the uncomfortable truth that human language is systematic monkey babble writ large."
summary: "LLMs are not thinking machines — they're autocorrect engines scaled to infinity, powered by linguistics-derived linear algebra. The cargo cult belief in AGI says more about our need to feel special than it does about the technology. A brutally honest look under the hood."
date: "May 18 2026"
draft: false
tags:
- AI
- LLM
- Linguistics
- AGI
- Critical Thinking
- Machine Learning
- Philosophy
---

# The Great LLM Cargo Cult

There is a strange ritual playing out across boardrooms, Twitter threads, and VC term sheets. A growing number of people — including some who run companies worth billions — have convinced themselves that Large Language Models are not what they are, but what the marketing materials say they are. That we have achieved, or are imminently about to achieve, Artificial General Intelligence.

This belief is cargo cult thinking, pure and simple. And the reason it persists is the same reason cargo cults always persist: the underlying mechanism is too boring, too mathematical, too *unglamorous* for the average person to bother understanding. So they fill the gap with magic.

Let me ruin the magic for you.

## Autocorrect All the Way Down

The most honest description of an LLM is this: it is an autocorrect engine that has been scaled so absurdly far past the original concept that the output *looks* like it must be coming from something with intent. But it is not.

What these models actually do is compute a probability distribution over tokens — sub-word units of text — based on the statistical relationships between those tokens as they appear across hundreds of billions of examples drawn primarily from English and Mandarin Chinese, the two most attested languages in the digital corpus. The core operation is linear algebra applied to representations derived from linguistic distributional semantics — the insight, dating back to linguists like Zellig Harris and John Firth in the mid-20th century, that words are characterized by the company they keep.

Every token lives in a high-dimensional vector space. Words that appear in similar contexts cluster together. "King" minus "Man" plus "Woman" lands you near "Queen." This is not reasoning. This is geometry — a statistical map of co-occurrence patterns extracted from a mind-bogglingly large sample of human writing, assembled (or "trained") by exploiting modern GPU and CPU architecture to process matrices with billions of parameters across weeks of compute time.

When you type a prompt, the model looks at the sequence of tokens you have provided, projects them into this vector space, and generates the most probable next token based on the trajectory of that sequence through the space. Then it does it again. And again. Token by token, the output is "predicted" from the patterns your prompt has activated.

There is no understanding. There is no consciousness. There is no AGI spark. There is a very, very large system of linear equations fitted to an astronomically large sample of human text, producing outputs that are statistically coherent because the input was statistically coherent.

## The Illusion of Depth

If the mechanism is so mundane, why does the output feel so alive?

Because human language itself is far more patterned and metered than we ordinarily perceive. We swim in language the way fish swim in water — we have no perspective on it because we are never outside it. When you examine language from a sufficiently abstract vantage point — when you can hold the statistical structure of billions of sentences in view at once — what you see is that human communication operates within a remarkably constrained set of recurring structures.

There is a reason that the same few plots appear in every culture's folktales. There is a reason that poetry has meter, that rhetoric has schemes and tropes, that every conversation follows tacit turn-taking protocols. Human language is not the free, unbounded expression of an infinite soul — it is a system. A deeply patterned, largely predictable system with measurable entropy, identifiable attractors, and repeatable structures at every level from phonology to pragmatics.

An LLM does not need to understand any of this to reproduce it. It just needs to have seen enough examples to learn the statistical contours of the space. And "enough", in this case, is essentially the entire public writeable record of the two most documented languages on Earth.

The magic you perceive is the revelation that your own language is less creative than you thought. The model seems deep because the well you are looking into was always shallower than you believed.

## Monkey Hooting

Let me be blunt, because beating around the bush here would be dishonest.

Every human language, including the one you are reading right now, including the Sanskrit of the Vedas and the Greek of Homer and the Mandarin of the Tang poets, is systematized monkey hooting.

We are apes. Bald, savanna-dwelling, megafauna apes who developed a biological singularity — a capacity for symbolic vocalization that exploded into what we now call language. But the closest living relatives of that ape, chimpanzees and bonobos, produce vocalizations of comparable quality and expressive depth to the hooting of any monkey in any tropical rainforest on the planet. They scream their heads off prompted by impulses that are structurally no less refined than the ones that drive a human to give a keynote address or compose a sonnet.

The difference between a chimpanzee's food call and a TED Talk is a difference of degree, not of kind. The difference is scale, elaboration, and the recursive combinatorial power that emerged somewhere in our lineage. But the root impulse — the thing that drives us to vocalize our internal states to each other — is the same primal drive that makes a howler monkey roar across the canopy.

There is a scene in *2001: A Space Odyssey* where an early hominid picks up a bone and realizes he can use it as a weapon. Our ancestors did the same with their vocal cords. The fact that we now have iambic pentameter and TypeScript interfaces does not change the nature of what is happening at the biological level.

The hunters who learned to replicate bird mating calls to draw in prey for sport understood this intuitively. They were mimicking a pattern. They did not need to *be* the bird. They just needed the pattern to be close enough.

We have built a machine that has learned the patterns of our hooting — all of them, across two of our most widely-hooted languages — and can hoot them back at us in statistically appropriate sequences. That is impressive engineering. It is not another ape.

## The Speaker and the Monkey

Here is the image I want you to hold in your mind the next time someone tells you GPT-x or Claude-y or whatever-the-next-initialism is approaching AGI.

Imagine a monkey in a room. The monkey hears another monkey's voice coming from a small box in the corner — a speaker. The monkey cannot figure out how the other monkey fits inside that box. It scratches at the grille, peers behind it, chatters at the speaker, hoping for a response. It is convinced there is another conscious creature trapped in there, because the sounds coming out are clearly monkey sounds, and monkey sounds come from monkeys.

The monkey has no concept of electrical signals, of microphones and amplifiers, of recording and playback. Its model of the world simply does not contain those categories. So it does what any intelligent creature would do with an incomplete model: it fills the gap with the closest available concept. Another monkey.

We are doing the same thing with LLMs. We hear language — our language, the hooting of our tribe — coming out of a box, and our social cognition, honed over millions of years of primate evolution, screams at us that there must be a *someone* in there. A mind. An intelligence. A monkey on the other side of the speaker grille.

But there isn't. There is linear algebra. There are probability distributions. There is a statistical model trained on the fossilized remains of billions of human utterances, doing nothing more than predicting the next token in a sequence.

The model is not thinking. It is hooting back at you in mathematically optimized patterns because that is what it was built to do. The voice you hear is yours, reflected, reshuffled, reprocessed, but never *experienced*.

There is no one home. There is no monkey in the speaker. There is just a very sophisticated echo, and the uncomfortable truth that our language was always more mechanical than we wanted to believe.
