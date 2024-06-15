---
title: "[Comments pt. 2] ...and here's a bit about how I did it"
description: I added a comments section to this blog. Show me your ASCII art.
date: 2024-06-15
tags:
    - ascii
    - svelte
    - astro
    - ssr
    - rest
    - valtown
    - deno
draft: true
---

## [Part 1 - ASCII art](/blog/2024-06-comments)

<br>

## Part 2 - implementing comments

Having a static site makes dynamic content a bit more complicated to implement. I've looked into some ready-made solutions in the past, but they are largely pretty bad. Things like Disqus harvest data from every visitor to your site. There is one for tech folks where it hacks github comments, but that limits you to only people with github accounts.

I figured I'd just build it, see how it goes. Most of the functionality is within my Astro project. Svelte components that call API routes which talk to Astro DB. Its pretty nice. I roped in Val.town to handle the email notification functionality.

### Astro Server Actions

I started off using prerelease experimental [Astro actions](https://astro.build/blog/astro-480/#experimental-astro-actions), which was quite nice at cutting down on form processing boilerplate. It worked great on my local dev server but surprise surprise, I couldn't get it to work in production. Something about AstroDB and Actions don't play well together. That'll get smoothed out eventually.

### Additional Features

Aside from taking names and message inputs and displaying them, I added a few features to make moderation simpler.

-   Anyone can hide comments for themselves
-   Anyone can report comments, which hides them for everyone. I get a email notification where I can click a link to delete the comment if needed.

### Val.town Email Notifications

[Val.town](https://www.val.town/) is a cool service that makes it easy to create quick projects with built-in email, databases, cron jobs, and all sorts of things that would be a pain to setup otherwise. For this, I just tag a fetch post request to my val's endpoints, then they take that data and send me an email.

[Notifications for new comments](https://www.val.town/v/parkerdavis/newCommentNotification)

[Notifications for report button](https://www.val.town/v/parkerdavis/reportCommentNotification)

### Progressive Enhancement:

Once I got everything working, I wondered: Does this still work without browser javascript? Turns out no! Forms by default don't send JSON data, they send "FORM DATA".

#### When to Use request.formData()

request.formData() is used to handle form submissions where the form's enctype is application/x-www-form-urlencoded or multipart/form-data. This is the default encoding type when you use a standard HTML form without specifying the enctype.

#### When to Use request.json()

await request.json() is used to handle JSON data sent in the body of a POST request. This is common in API requests where the client sends data as JSON, typically using fetch with a Content-Type of application/json.

Normal javascript way:

```js
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(comment),
});
```

Javascript but just like a standard HTML form:

```js
const result = await fetch(POST_COMMENT_ENDPOINT, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ ...comment }),
});
```
