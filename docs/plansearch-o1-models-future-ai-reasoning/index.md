---
title: "PLANSEARCH for LLMs"
slug: plansearch-o1-models-future-ai-reasoning
publishTime: "2024-09-24 14:00:00"
description: Explore the fascinating developments in AI reasoning capabilities, comparing OpenAI's o1 models with the PLANSEARCH approach. Discover how these advancements are revolutionizing problem-solving in fields like coding, science, and mathematics.
tags: ["artificial-intelligence", "machine-learning", "plansearch", "openai", "o1-models", "ai-reasoning", "problem-solving", "coding", "science", "mathematics", "ai-research", "future-of-ai"]
---
# PLANSEARCH for LLMs

![An abstract, AI generated image symbolizing reasoning](./header.webp)

I've been diving into a fascinating [paper about PLANSEARCH](https://arxiv.org/abs/2409.03733), a new approach to AI problem-solving. As I was reading it, I couldn't help but draw parallels to OpenAI's recently announced o1 series of models. Both seem to be pushing in a similar direction: enhancing AI's ability to reason through complex problems.

## The o1 Approach to Reasoning

OpenAI's o1 models are designed to "spend more time thinking before they respond." They're trained to refine their thinking process, try different strategies, and recognize their mistakes. This approach has led to impressive results in fields like science, coding, and math.

For instance, on a qualifying exam for the International Mathematics Olympiad (IMO), GPT-4o correctly solved only 13% of problems, while the new o1 model scored 83%. That's a staggering improvement.

## How PLANSEARCH Compares

Where the o1 models seem to have internalized a general approach to deeper reasoning, PLANSEARCH explicitly breaks down the problem-solving process into stages:

1. Generate multiple observations about the problem
2. Combine these observations to potentially uncover new insights
3. Develop several potential solutions based on these insights
4. Only then attempt to implement a solution

It's fascinating to see different research teams converging on similar ideas about improving AI reasoning capabilities.

## Putting it to the Test

Both approaches show promising results. OpenAI reports that their o1 models perform similarly to PhD students on challenging tasks in physics, chemistry, and biology. They've also seen dramatic improvements in math and coding benchmarks, reaching the 89th percentile in Codeforces competitions.

PLANSEARCH, while focused primarily on coding tasks, has shown significant improvements too:

- Consistently outperforming traditional methods like repeated sampling
- In some cases, pushing solve rates from 40% up to over 70% on coding benchmarks like HumanEval+ and MBPP+

## Beyond Coding: Broader Applications

While PLANSEARCH's paper focuses on code generation, and OpenAI highlights scientific and mathematical applications, I can't help but think about how these approaches could be applied even more broadly. Imagine using reasoning-enhanced AI for:

- Designing complex systems architectures
- Analyzing and optimizing business processes
- Tackling interdisciplinary research questions
- Planning out API endpoints or database schemas
- Brainstorming product features or marketing strategies

The key in both cases seems to be that focus on deeper, more deliberate reasoning before jumping to conclusions.

## Implementation Considerations

From a developer's perspective, PLANSEARCH looks like it could be implemented as a pipeline of prompts. If you've ever used LangChain or similar tools, you're already halfway there. The tricky part would be managing state between the different stages and evaluating the quality and diversity of the generated ideas.

The o1 models, on the other hand, seem to have this reasoning process more deeply integrated. OpenAI is offering them through their API and ChatGPT interfaces, making them more readily accessible for experimentation.

I'm particularly intrigued by the o1-mini model. The idea of a faster, cheaper model that's particularly good at coding tasks is really appealing for day-to-day development work. It's 80% cheaper than the full o1-preview model, which could make it a game-changer for certain applications.

## Safety and Ethical Considerations

It's worth noting that OpenAI has put a lot of emphasis on the safety aspects of their o1 models. They've developed a new safety training approach that leverages the models' reasoning capabilities to better adhere to safety and alignment guidelines.

While the PLANSEARCH paper doesn't delve into safety considerations as deeply, it's an important aspect to keep in mind as we develop more powerful AI reasoning tools. As these systems become more capable of complex problem-solving, ensuring they do so in alignment with human values becomes increasingly critical.

## Thoughts on the Future

It's exciting to see this focus on improving AI's reasoning capabilities. Both PLANSEARCH and the o1 models represent steps towards AI that can engage in more human-like problem-solving, rather than just pattern matching based on training data.

I'm keen to see how these approaches evolve and converge. Will we see PLANSEARCH-like structured reasoning integrated into future language models? How will techniques like this change the way we interact with AI assistants in our daily work?

There's also the question of computational cost. The o1 models are more expensive to run than their predecessors, and PLANSEARCH's multi-step approach likely comes with its own computational overhead. Balancing improved reasoning capabilities with efficiency will be an interesting challenge going forward.

## What's Next?

For now, I'm looking forward to experimenting with the o1 models and thinking about how I might incorporate some of PLANSEARCH's ideas into my own AI-assisted workflows. It feels like we're on the cusp of some really interesting developments in AI-assisted problem-solving.

I'm particularly interested in seeing how these advancements might be integrated into existing development tools and workflows. Could we see IDEs that incorporate PLANSEARCH-like reasoning to help with complex refactoring tasks? Or DevOps tools that use o1-style models to optimize deployment strategies?

The potential is enormous, and I can't wait to see what the community builds with these new capabilities.

---

If you want to dive into the details, you can find the PLANSEARCH paper at [https://arxiv.org/abs/2409.03733](https://arxiv.org/abs/2409.03733), and OpenAI's blog post about the o1 models on their website. I'd love to hear your thoughts if you end up experimenting with either of these approaches!