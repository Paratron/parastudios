---
title: Strapi quirks you should know about
slug: strapi-quirks-you-should-know-about
publishTime: "2022-04-30 23:00:00"
description: When I first came across Strapi, I had some misconceptions about it which are not immediately clear when reading about the framework in their docs.
tags: ["strapi", "javascript", "backend", "api"]
---

# Strapi quirks you should know about

![Oscilloscope test station](./pexels-alexander-dummer-132700.jpg)

When I first came across Strapi, I had some misconceptions about it which are not immediately clear when reading about the framework in their docs.

I learned about some concepts and approaches only when actively using Strapi and wished to have known them before.

This is not a rant but just a heads up for other devs who consider building a project with strapi. I hope I can save them some hours of looking around in the docs and pulling out some hair. If it sounds ranty in some places, its because I experienced lots of frustration sometimes, so bear with me.

Here we go:

## The admin UI skips all business logic implemented into the API
This assumption threw me off the most because it leads to a chain of conclusions of what should be possible.

**For me, Strapi looked like a framework that lets you define a CRUD API, handles user authentication and offers an admin UI to interact with that API without having to build a dedicated UI first.**

Thats only halfway true. Yes, Strapi allows to define a data model and creates API endpoints for that model. It also allows to pour business logic into the mix by offering the ability to create new or modify existing endpoints (routes), controllers, services and more.

You begin to scratch your head when all of those modifications are completely ignored by the admin UI. The reason is: Strapi creates _two_ APIs. One I call the "frontend API" which is being consumed by your application and one "admin API" which is used exclusively by the admin UI.

There should be a big, red warning right on the getting started page: __"Strapi Admin does in _no way_ interact with the Strapi API"___

The problem is: when you add business logic like calling external services for additional data or validation, notify external systems or automatically adding rows into other collections, you are lost with the admin UI. You can manipulate the database contents but its not at all aware of the logic you added to the frontend API.

You _can_ hack yourself into the admin API but there is nearly no documentation about it. I ended up reading lots of Strapi source code on github to learn about how the admin API works.

## There are users and then there are users
Another design decision in Strapi was to have two kinds of users. One can access the frontend API only and others can access only the admin API. I assumed first that any user could have extra privileges given to access the admin UI. This is not the case.

Bonus points to make things worse: e-mail adresses need to be unique among both kinds of users. If there ist a user with the mail test@example.com for the frontend API, you cannot create another for the admin UI.

## Ralations to the users table are complicated

No pun intended.

I like to give my collections an `owner` field with a relation to the users table of the users and permissions plugin. This way I can easily connect objects (posts, comments, tasks, whatever) to their owners. That connection might be altered through business logic as well.

However, in order to set or read the relation, the requesting user needs to have full access to the users table. This means they would be able to pull user data from the API as well.

I work around this problem by setting and populating the owner fields separately through direct service calls in my controllers. This add one additional query to the database tough.
