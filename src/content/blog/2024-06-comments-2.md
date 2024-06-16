---
title: "[Comments pt. 2] ...and here's a bit about how I did it"
description: How I added a comments section to an Astro site.
date: 2024-06-16
tags:
    - astro
    - ssr
    - valtown
    - rest
    - forms
    - progressive-enhancement
    - svelte
    - deno
draft: true
---

```
.   c       m
 ..     o  ...      e
   ......... ..            t
              .. m ... n
               ..... .......  s
                           ...
                             ...
```

[Part 1 - ASCII art](/blog/2024-06-comments)

# Part 2 - implementing comments

Having a static site makes dynamic content like user submitted comments a bit more complicated. I've looked into ready-made solutions in the past, but they are largely pretty bad. Things like [Disqus](https://disqus.com/) harvest data from every visitor and add a ton of bloat. [Utterances](https://utteranc.es/) is pretty slick and basically hacks Github Issues but limits you to comments from people with Github accounts.

It has never felt worth setting up a long-running database for a comment section that, lets face it, probably won't see much use. SQLite has been having a moment lately in the web application context and it makes a lot of sense for this use case. Because SQLite is just a file on a disk, when its not in use, it has extremely low-to-no money/energy/compute costs.

So with cheap and simple-to-setup SQLite/LibSQL databases available all over the place ([AstroDB](https://astro.build/db/), [Val.town](https://www.val.town/), [Turso](https://turso.tech/) ..._they're all Turso_) I figured, why not?

## Moderation

Aside from taking name and message inputs and displaying them, I added a few enhancements to make moderation quick and simple.

-   Anyone can hide comments for themselves.
-   Anyone can report comments, which makes them hidden by default for everyone. I also get an email notification where I can review the comment and click a link to delete the comment if needed.

## Astro Server Actions

I started off using experimental [Astro server actions](https://astro.build/blog/astro-480/#experimental-astro-actions), which were quite nice for cutting down on form processing boilerplate. It worked great on my local dev server but I couldn't get it to work in production. Something about using AstroDB and Actions together in a serverless environment isn't quite working yet. I look forward to using server actions when they're more stable. For the time being, writing API endpoints within a single Astro repo is still pretty nice.

## Email Notifications (Val.town)

[Val.town](https://www.val.town/about) is a social code platform with stellar vibes. The team behind it seem like stand up folks and it has a small and active community. It is so easy to create quick backend projects with features that would otherwise be a pain to setup like email, databases, cron jobs, http handlers, etc.

When I want to trigger an email to myself, say, when someone leaves a comment, I just trigger the relevant Val's endpoint with a POST request.

-   [Val handling comment notifications](https://www.val.town/v/parkerdavis/newCommentNotification)
-   [Val handling report notifications](https://www.val.town/v/parkerdavis/reportCommentNotification)

Pretty simple.

## Progressive Enhancement

Once I got everything working, I wondered, does this work [without client javascript](https://adamsilver.io/blog/javascript-isnt-always-available-and-its-not-the-users-fault/)?

Turns out no, it didn't. Here I was, passing JSON around, thinking that is and has always been the default for how browsers and servers talk to each other.

### GET vs POST

#### POST

I started with the POST method, because semantically that makes the most sense – I am POSTing the comment to the database. Muscle memory would have me JSON.stringify-ing the data...

```js
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
    body: JSON.stringify(comment),
});
```

...but a standard HTML form POST request is encoded differently.

```js {4,6}
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: ...?
});
```

Ok... `x-www-form-urlencoded`. How does one encode a javascript object into that? The easiest way I found was passing it in a `URLSearchParams()` constructor.

```js {6}
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(comment),
});
```

When you receive it on the backend, you parse the request body as a formData object:

```js
const formData = await request.formData();
const data = Object.fromEntries(formData.entries());
```

#### GET

You can also use GET. GET is the default form method after all. A form GET request will pass all the data in the URL as query params, therefore not suitable for sensitive or large amounts of data due to loose URL length limits. That being said, GET would probably be fine for this use case.

To mimic a `<form action="url">...</form>` submission in javascript (method GET implied), you again encode the data object with the `URLSearchParams()` constructor and append that to the endpoint URL with a leading `?` before the query.

```js
const query = new URLSearchParams(comment);
const newUrl = `${POST_COMMENT_ENDPOINT}?${query}`;
const result = await fetch(newUrl);
```

On the server, you can parse the query params like so:

```js
const url = new URL(request.url);
const data = Object.fromEntries(url.searchParams.entries());
const { author, body, path } = data;
```

Then carry on to validate the data, check it exists, coerce it into the correct types.

So POST vs GET, which one is better for this use case? They both work. POST though, probably.

And then there is error handling...phew...

Does anybody know of an Astro/framework-agnostic equivalent to [Sveltekit Superforms](https://superforms.rocks/)? Maybe [simple-form](https://simple-stack.dev/form/)? Let me know in the comments.
