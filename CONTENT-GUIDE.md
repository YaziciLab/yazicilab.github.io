# Content guide

How to update the Yazici Lab website. You can do all of this in the browser on
github.com: open the file, click the pencil icon, edit, then **Commit changes**.
The site updates about a minute later.

> **YAML tips** (the `.yml` files): indentation matters and uses **spaces, not tabs**.
> Each entry starts with `- `. If a value contains a colon, wrap it in quotes:
> `title: "Fuzzy logic: a survey"`. If the build fails, the **Actions** tab shows
> the file and line with the problem.

---

## Add a lab member

Open `_data/people.yml` and add an entry under `members:`

```yaml
  - name: Aruzhan Bekova
    role: PhD students          # must match one of the names under `roles:`
    topic: Fuzzy spatial queries for sensor data
    email: aruzhan.bekova@nu.edu.kz
    linkedin: https://www.linkedin.com/in/...
    photo: aruzhan-bekova.jpg   # optional
```

**Photos:** square, at least 400×400 px, under 300 KB. Upload to
`assets/img/people/`. With no photo, the person's initials are shown.

**When someone graduates:** delete them from `members:` and add them to `alumni:`

```yaml
  - name: Aruzhan Bekova
    degree: PhD
    year: 2028
    now: Assistant Professor, Some University
```

## Add a publication

Open `_data/publications.yml` and add:

```yaml
- title: "Full title of the paper"
  authors: A. Bekova, D. Example, A. Yazıcı
  venue: IEEE Transactions on Fuzzy Systems
  year: 2027
  type: journal               # journal | conference | book | chapter
  selected: false             # true = also shown on the home page (keep 3–4)
  links:
    doi: https://doi.org/...
    pdf: https://...          # leave out any link you don't have
    code: https://github.com/...
```

The list is sorted by year automatically, and "A. Yazıcı" is highlighted in bold.

## Add a project

Open `_data/projects.yml`:

```yaml
- title: Project name
  status: ongoing             # ongoing | completed
  years: 2026 – present
  area: sensor-networks       # an `id` from research_areas.yml
  summary: >-
    Two or three sentences on what the project does and why it matters.
  members: [Adnan Yazıcı, Aruzhan Bekova]
  funding: Nazarbayev University Faculty Development Grant
  links:
    - label: Project page
      url: https://...
```

## Add news, an award or a conference trip

Open `_data/news.yml` and add at the **top** (newest first):

```yaml
- date: 2027-03-14
  type: conference            # achievement | conference | announcement
  text: Aruzhan presented our paper at [FUZZ-IEEE 2027](https://...) in Rome.
```

The four newest items also appear on the home page.

## Publish a blog post

1. In `_posts/`, create `YYYY-MM-DD-short-title.md`, e.g. `2027-03-20-notes-from-fuzz-ieee.md`.
2. Start it with:
   ```yaml
   ---
   title: Notes from FUZZ-IEEE 2027
   author: Aruzhan Bekova
   tags: [conference, fuzzy logic]
   ---
   ```
3. Write the post in Markdown below. Images go in `assets/img/blog/` and are
   added with `![Description of the image](/assets/img/blog/file.png)`.

**Review process (recommended):** students submit posts as a *pull request*
rather than committing directly. In the repository's **Settings → Branches**,
add a rule for `main` that requires a pull request review. The site maintainer
reviews, then merges, and the post goes live.

There is also a ready-made guide for students on the blog itself:
"How to write a post for the lab blog".

## Change the look

- Colours and fonts: the variables at the top of `assets/css/main.css`
  (`--ink`, `--paper`, `--mu-low`, `--mu-high`, …). Dark-mode colours are just below.
- Navigation links: `_includes/header.html`.
- Home page text and sections: `index.html`.
