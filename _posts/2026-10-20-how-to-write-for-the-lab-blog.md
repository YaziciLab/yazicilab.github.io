---
title: How to write a post for the lab blog
author: Yazici Lab
tags: [guide, blog]
---

The lab blog is a place for members to share what they're working on, what they learned at a conference, or a tool that saved them a week. Posts don't need to be polished papers. A clear page that someone outside the lab can follow is plenty.

## What makes a good post

- **One idea per post.** "What I learned at FUZZ-IEEE" or "Three mistakes I made with sensor data" works better than a list of everything you did this semester.
- **Write for a curious student**, not a reviewer. Explain terms the first time you use them.
- **Show something.** A figure, a short code snippet or a photo from a poster session makes the post easier to read.
- **500 to 1,200 words** is a good length.

## How to submit it

1. Create a new file in the `_posts` folder of the website repository, named `YYYY-MM-DD-short-title.md`, for example `2026-11-03-notes-from-vldb.md`.
2. Start the file with this header, then write your post in Markdown below it:

```yaml
---
title: Notes from VLDB 2026
author: Your Name
tags: [conference, databases]
---
```

3. Put any images in `assets/img/blog/` and add them with `![What the image shows](/assets/img/blog/your-image.png)`.
4. Open a pull request. The site maintainer will review it, and the post goes live a minute or two after it's merged.

If you're not comfortable with GitHub yet, send your text and images to the site maintainer and they'll publish it for you.
