---
title: 'Comments 2: the nitty gritty'
description: How I added a comments section to an Astro site.
date: 2024-06-17T00:13:01
tags:
    - astro
    - ssr
    - valtown
    - rest
    - forms
    - progressive-enhancement
    - svelte
    - deno
    - portfolio
draft: false
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

## SQLite

Having a static site makes dynamic content like user submitted comments a bit more complicated. I've looked into ready-made solutions in the past, but they are largely pretty bad.

For rolling my own, it has never felt worth setting up a long-running database for a comment section that, lets face it, probably won't see much use.

SQLite has been having a moment lately in the web application space and it makes a lot of sense for this use case. Because SQLite is just a file on a disk, when it's not in use it has extremely low-to-no money/energy/compute costs.

So with cheap and simple-to-setup SQLite/LibSQL databases available like [Astro DB](https://astro.build/db/), [Val Town](https://www.val.town/), [Turso](https://turso.tech/) (_they're all Turso_), I figured, why not?

## Features / Moderation

Aside from taking name and message inputs, storing them, and displaying them, I added a few enhancements to make moderation quick and simple.

- Anyone can hide comments for themselves.
- Anyone can report comments, which makes them hidden by default for everyone. I also get an email notification where I can review the comment and click a link to delete the comment if needed.
- Not moderation related but you better believe you can [click on a quail](/blog/2024-05-27-quail) for comments too!

## Email Notifications (Val.town)

When I want to trigger an email to myself, say, when someone leaves a comment, I just hit a Val endpoint with a POST request.

[Val.town](https://www.val.town/about) is a social code platform with good vibes. It is so easy to create quick backend projects with features that would otherwise be a pain to setup like email, databases, CRON jobs, HTTP handlers, etc.

- [Val handling comment notifications](https://www.val.town/v/parkerdavis/newCommentNotification)
- [Val handling report notifications](https://www.val.town/v/parkerdavis/reportCommentNotification)

Simple stuff.

## Astro Server Actions

For the bulk of the backend code I tried out the new experimental [Astro server actions](https://astro.build/blog/astro-480/#experimental-astro-actions), which were quite nice for cutting down on form processing boilerplate. It worked great on my local dev server but I couldn't get it to work in production. Something about using Astro DB and Actions together in a serverless environment wasn't quite clicking. For the time being, writing API endpoints within a [single Astro repo](https://github.com/parkerdavis1/agave-astro/tree/staging/src/pages/api/comments) is still pretty nice. (Update 2024-06-21: Actions work just fine in deployment now.)

## Progressive Enhancement

Once I got everything working, I wondered, does this work [without client javascript](https://adamsilver.io/blog/javascript-isnt-always-available-and-its-not-the-users-fault/)?

Turns out no, it didn't. Here I was, passing JSON around, thinking that is and has always been the default for how browsers and servers talk to each other.

### GET vs POST

#### POST

I started with the POST method, because semantically that makes the most sense – I am POSTing the comment to the database. Muscle memory would have me JSON.stringify-ing the data...

```js
// Client
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
    body: JSON.stringify(comment),
});
```

...but a standard HTML form POST request is encoded differently.

```js {5,7}
// Client
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: ...?
});
```

Ok... `x-www-form-urlencoded`. How does one encode a javascript object into that? It's a catchy name for URL query parameter style data so the easiest way I found was passing it in a `URLSearchParams()` constructor.

```js {7}
// Client
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
// Server
const formData = await request.formData();
const data = Object.fromEntries(formData.entries());
```

<!-- It feels strange to encode your body data with something called URLSearchParams, but hey, it works! -->

#### GET

You can also use GET. GET is the default form method after all. A form GET request will pass all the data in the URL as query params, therefore not suitable for sensitive or large amounts of data. That being said, GET would probably be fine for this use case.

To mimic a `<form action="url">...</form>` submission in javascript (method GET implied), you again encode the data object with the `URLSearchParams()` constructor and append that to the endpoint URL with a leading `?` before the query.

```js
// Client
const query = new URLSearchParams(comment);
const newUrl = `${POST_COMMENT_ENDPOINT}?${query}`;
const result = await fetch(newUrl);
```

On the server, you can parse the query params like so:

```js
// Server
const url = new URL(request.url);
const data = Object.fromEntries(url.searchParams.entries());
const { author, body, path } = data;
```

So POST vs GET, which one is better for this use case? Both encode your data as query strings, but with POST it is sent in the body rather than tacked onto the URL with GET. They both work, but let's go with POSTing URL-encoded form data.

Then we carry on with validating the data, checking that it exists, coercing it into the correct types.

And then there is error handling...phew.

Does anybody know of an Astro/framework-agnostic equivalent to [Sveltekit Superforms](https://superforms.rocks/)? Maybe [simple-form](https://simple-stack.dev/form/)? Let me know in the comments.
