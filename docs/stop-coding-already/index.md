---
title: "Stop Coding Already!"
slug: stop-coding-already
publishTime: "2024-09-23 22:30:00"
description: Discover why taking a step back to plan before diving into coding can lead to more efficient and successful projects. Learn about the benefits of mental modeling, note-taking, and using AI tools to refine your ideas before writing a single line of code.
tags: ["software-development", "planning", "productivity", "project-management", "mental-modeling", "ai", "llm", "obsidian", "mvp", "coding-process"]
---
# Stop coding already!

![Very slowly growing plants](./header.webp)

This is a topic which developers only rarely talk about. It's about the planning and research you can (or should) do before you actually start a new coding project or feature.

When I was a younger developer - especially in the days where I was still a student and was coding only in my free time, I would immediately open my code editor and start a new project as soon as an idea would hit me.

It happened sometimes that I encountered major roadblocks when I was already halfway through. In the worst cases, I had built a system based on so many false assumptions that I had to throw everything away and start over from scratch.

When that happened, a strange effect appeared: sometimes I was able to rewrite a whole system in two days where I had spent more than two weeks before. What happened here?

## Writing code is like crystallising your mental model of a system

During my two-week coding session, I learned a lot about the requirements and problems of the system I was creating. Whenever I coded myself into a corner, I was looking for a way out, reconsidered some decisions, and changed parts of the system.

The reason this happened was that my mental model was incomplete when I started. I hadn't fully thought through how different components should be shaped, how they would interact, or how they should be combined. I was figuring out all of this while building the system. It's like trying to write a book before you've made up your mind what it should be about.

Very often it would turn out I made wrong assumptions about my data architecture at the beginning. I built stuff that didn't work out, made wrong assumptions, and ended up with bad data architecture that couldn't support the features I wanted to implement.

This process of coding, hitting roadblocks, and then rethinking my approach was actually helping me build a more complete mental model of the system. Each hurdle I encountered forced me to reconsider my assumptions and flesh out my understanding of what I was truly trying to build.

In essence, I was using the act of coding as a way to explore and define my project, rather than having a clear plan from the start. While this approach led to some insights, it also resulted in a lot of wasted time and frustration. It's this realisation that led me to change my approach to starting new projects.

## My approach today

Today, my process looks very different. Before I start a new project, I spend a lot of time in Obsidian. I write out ideas, build mental models, and do a ton of planning. Sometimes, an idea turns out to be not so great or not exactly doable as I initially envisioned it. But that's okay - it's better to figure that out before I've invested weeks of coding time.

It's important to note that this process isn't about designing the perfect system upfront. Instead, it's about thinking things through, playing it out mentally, and shaping things in your mind. The mind is so much faster than putting things into actual code, testing, and debugging. This mental exercise helps me anticipate potential issues and solutions before I even write a line of code.

One of the reasons I've adopted this approach is that I don't have as much time anymore to sit at a computer all day and hack around like I used to as a student. However, I've found that "mental coding" is possible anywhere - from showering to walking the dog to mowing the lawn. These moments of reflection allow me to engage with my ideas continuously, even when I'm away from my desk. Then, when I do have a moment, I can quickly jot down the refined results of that thought process into my note app. This way, I'm always making progress, even when I'm not actively coding.

A recent addition to my way of working is making use of LLMs like ChatGPT or Claude to refine my ideas and thoughts. It's a little like playing mental ping pong and a great way to iterate on things and bring additional perspectives. This has to be taken with a grain of salt, though, since LLMs tend to be too agreeable to any suggestion. However, I often take the approach of telling the AI: "Now look at my thoughts from a critical perspective" to roast my ideas and make any flaws obvious. This back-and-forth helps me challenge my assumptions and consider angles I might have missed.

Here's what my pre-coding process typically looks like now:

1. I create a folder for each potential project in Obsidian (or any other place to take notes).
2. I maintain an index file with a short description of the project and a list of features I want to implement. When I sometimes abandon an idea for some time and come back maybe months later, I can pick up and discover my thoughts from the index file quickly.
3. I fill this folder with lots of ideas and thoughts, broken into several notes.
4. I do research on my target users to make sure I'm building something people actually need (If I have that in mind. Sometimes I just build things because _I_ want them).
5. I collect information on competitors to understand what's already out there. Sometimes its absolutely unnecessary to re-invent the wheel.
6. I create feature descriptions in separate files, all linked from the index.
7. For complex features, I describe them in detail, thinking through potential pitfalls.
8. I try to envision "how would this look like to be usage-friendly", often sketching out:
    - Network APIs
    - JavaScript APIs (with code examples of how I envision the final thing working)
    - An object model for my data
    - Routes and pages for web applications
9. I start thinking about a marketing plan early on.
10. I begin collecting potential leads for the project.
11. I gather blogs and topics I might want to write about related to the project.

(I usually only start thinking about the last three points when it becomes clear that the idea is going to turn into a real thing.)

Throughout this process, I sometimes use LLMs to bounce ideas, get different perspectives, and critically examine my plans. This additional layer of ideation and critique helps refine my thoughts and catch potential issues early.

It's crucial to note that while I think through many aspects of the project, I'm always mindful of scope. I'm absolutely aware of the need to start small with a so-called Minimum Viable Product (MVP) and then measure things and iterate. So when I think the vision has enough content to not only build out a base version but also a few additional things, I pick the crucial elements to make the idea work at all and start working on that.

This process helps me crystallize my ideas and catch potential issues before I write a single line of code. It's saved me from going down many dead-end paths and helped me build more robust, well-thought-out systems. However, it's not set in stone - I remain flexible and ready to adapt as I start coding and encounter real-world challenges.

When I finally do start coding, I have a clear roadmap to follow. I know what I'm building, why I'm building it, and how it should work. This often leads to faster development and fewer major restructurings along the way. But I'm always ready to revisit and revise my plans based on what I learn during the actual development process.

So the next time you have a brilliant idea for a new project, resist the urge to immediately start coding. Take a step back, open your note-taking tool of choice, and start planning. Consider using LLMs as a brainstorming partner, but always maintain a critical perspective. Remember to keep your initial scope small and focused on the core functionality. Your future self will thank you for the time spent in thought and planning, even as you remain agile and responsive to what you learn along the way.