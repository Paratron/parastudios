---
title: "Podcast notes: 🎙 The Building Blocks of Agentic Systems"
slug: notes-from-building-blocks-of-agentic-systems
publishTime: "2024-09-26 10:45:00"
tags: [notes, AI, LangChain, Podcast, Agents]
description: "Insights from the TWIML AI Podcast episode discussing LangChain and its role in AI development."
---
**Podcast notes: 🎙 The Building Blocks of Agentic Systems**

![A hand with a pen writing in a notebook, decorated with futuristic lines](./header.webp)

In a rapidly evolving AI landscape, one thing remains constant: the need for effective communication between humans and the machines we’re building. Whether it's through prompt engineering or coding, how we express our intentions to AI systems is key to their success. On a recent episode of the *Twiml AI Podcast*, host Sam Charrington sat down with Harrison Chase, co-founder and CEO of [LangChain](https://www.langchain.com/), to discuss how LangChain is helping developers build with large language models (LLMs) and AI agents in more effective and scalable ways.

> This blog post is inspired by the TWIML podcast episode titled ["The Building Blocks of Agentic Systems"](https://twimlai.com/podcast/twimlai/the-building-blocks-of-agentic-systems/), which I thoroughly enjoyed. I wanted to preserve the key insights from this interview in text form for my personal reference and to revisit later.

### The Story Behind LangChain

Harrison Chase's journey to founding LangChain was built on a foundation of machine learning (ML) and ML operations (MLOps). He gained experience at fintech company Kensho and MLOps startup Robust Intelligence, where he worked on NLP, time series analysis, and model testing and validation. By September 2022, Chase was ready to strike out on his own but didn’t know what exactly to pursue. Around this time, the AI space was buzzing with activity: Stable Diffusion had just launched, and OpenAI's GPT-3 was starting to gain traction, although ChatGPT was still on the horizon.

After attending meetups and hackathons, Chase recognized a growing demand for tools to build applications using LLMs. He saw an opportunity to abstract common patterns and workflows into a simple package, which eventually became LangChain. The timing was perfect: a month later, ChatGPT launched, and the momentum around LLM development skyrocketed. 

Fast forward nearly two years, and LangChain has grown tremendously. It boasts 15 million monthly downloads, powers over 100,000 applications, and has [a vibrant open-source community](https://github.com/langchain-ai) with more than 2,000 contributors.

### The Rise of LangChain and Its Product Suite

LangChain functions as an python-based orchestration framework for Large Language Models (LLMs), enabling developers to seamlessly integrate various AI models, vector stores, and tools into cohesive applications. Chase emphasized LangChain's key strength: its ability to act as a connective layer between diverse LLM components. This includes linking vector stores, document loaders, and an extensive array of LLM providers — over 80 in total. The framework's versatility has contributed to its widespread adoption across numerous AI initiatives.

As the company grew, so did its product offerings. In addition to the original LangChain library, the company has introduced:

1. [**LangSmith**](https://www.langchain.com/langsmith): A tool for observability, testing, and evaluation. LangSmith helps developers transition from prototyping to production by offering insights into how applications are functioning. It includes features for observability, such as tracking app behavior, and testing and evaluation tools to ensure consistent performance.
   
2. [**LangGraph**](https://www.langchain.com/langgraph): A low-level orchestration tool designed for complex, agentic applications that involve loops, decision-making, and memory. LangGraph provides a more granular level of control for developers building advanced AI systems. 

3. **LangGraph Cloud**: A hosted runtime for LangGraph, enabling developers to deploy and manage their agent systems with built-in persistence and memory.

These products are designed to help developers move beyond simple prototypes and build AI applications that can scale effectively in production environments.

### Agents: Hype and Reality

A major part of LangChain’s appeal lies in its support for building **agents** — AI systems that can make decisions and act autonomously. However, as Chase explained, there’s still a gap between the potential of AI agents and their current real-world capabilities.

The idea of AI agents gained major attention with the release of [Auto-GPT](https://github.com/Significant-Gravitas/AutoGPT) in March 2023, which Chase described as a "fastest growing GitHub project in history." Auto-GPT captured the imagination by running an LLM in a loop and enabling it to use tools like web search to complete ambitious tasks such as "growing a Twitter following." However, the excitement quickly cooled as users realized that agents often struggled to complete complex tasks reliably and were generally slow.

Chase noted that agents work best in more _focused applications_, such as customer support or data enrichment, where there is a clear workflow and limited ambiguity. For instance, [Elastic's agent-based system](https://www.elastic.co/elastic-agent) helps users debug issues by searching through logs and providing explanations. Similarly, [Ramp built an agent](https://ramp.com/blog/ramp-finance-automation-platform) that helps users navigate their website by identifying actions they need to take, such as filing expense reports.

What makes these systems successful is their _structured, workflow-driven nature_. They don’t rely on the LLM to make every decision but rather guide it through a series of steps that are tightly controlled, reducing the chances of error.

### RAG and Agents: Where Retrieval Meets Action

Another major trend in AI applications is **retrieval-augmented generation (RAG)**. RAG involves enhancing LLMs by allowing them to pull in external data—often from enterprise systems—to generate more informed responses. Chase pointed out that RAG is essentially an extension of search functionality, with LLMs retrieving and reasoning over documents or logs.

LangChain supports RAG use cases through its integrations with various vector stores and retrieval tools. However, Chase highlighted that the combination of RAG with agents is becoming increasingly popular. In this setup, an agent uses RAG _as a tool_, dynamically deciding when to retrieve external data and how to incorporate it into its decision-making process.

### LangSmith: Observability and Evaluation in Action

Building reliable AI systems goes beyond just making them functional — it requires careful **evaluation and observability**. This is where [LangSmith](https://www.langchain.com/langsmith) comes in. According to Chase, LangSmith offers deep insights into how an AI application is behaving, which is crucial for catching issues early and iterating on the system.

Developers can use LangSmith to trace the steps taken by their agent, monitor inputs and outputs, and ensure that the system is performing as expected. LangSmith also offers tools for testing and evaluation, allowing developers to track metrics over time and continuously refine their models. A big focus of LangSmith is helping developers understand where their agents might be making wrong decisions due to poor inputs, a lack of context, or other factors.

### The Future of LLMs and AI Agents

Looking ahead, Chase shared some of his thoughts on where the AI ecosystem is headed. While models like GPT-4 have advanced significantly, he believes that we’ll continue to need sophisticated orchestration tools like [LangGraph](https://www.langchain.com/langgraph) to manage complex AI workflows. He’s also bullish on the future of **dynamic few-shot prompting**, a technique that helps personalize AI outputs by selecting the most relevant examples to guide the LLM’s behavior.

Chase also sees potential in **multimodal models**, especially those that incorporate speech. Applications like customer support, where much of the interaction happens over the phone, could benefit immensely from speech-enabled agents that bypass the need for transcription.

### Conclusion

As the AI landscape continues to evolve, LangChain is positioning itself as a key player in helping developers bridge the gap between prototype and production. Whether it’s through building agentic systems, leveraging retrieval-augmented generation, or ensuring robust observability, LangChain is providing the tools developers need to create more reliable and effective AI applications.

LangChain’s story is a testament to the power of timing, community, and a deep understanding of where the AI space is headed. And with Chase at the helm, it’s clear that LangChain will continue to play a pivotal role in the future of AI development.

---

This blog post summarizes key insights from an episode of the *TWIML AI Podcast* titled ["The Building Blocks of Agentic Systems"](https://twimlai.com/podcast/twimlai/the-building-blocks-of-agentic-systems/), which I found highly insightful. I’ve preserved these takeaways in text form for future reference and personal use.