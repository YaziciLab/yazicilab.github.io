# Yazici Lab website

The website of **Dr Yazici's Research Lab** at Nazarbayev University, built with
[Jekyll](https://jekyllrb.com) and hosted for free on **GitHub Pages**.

Almost everything on the site comes from a few plain text files, so updating it
rarely means touching HTML:

| To change…                         | Edit this file                  |
|------------------------------------|---------------------------------|
| Lab members, alumni, Prof. Yazıcı's bio | `_data/people.yml`         |
| Publications                       | `_data/publications.yml`        |
| Research areas                     | `_data/research_areas.yml`      |
| Projects (ongoing and completed)   | `_data/projects.yml`            |
| News, awards, conference trips     | `_data/news.yml`                |
| Blog posts                         | a new file in `_posts/`         |
| Site name, email, address, footer links | `_config.yml`              |
| Colours and fonts                  | top of `assets/css/main.css`    |

Step-by-step instructions for each of these are in **[CONTENT-GUIDE.md](CONTENT-GUIDE.md)**.

---

## Publishing the site (one-time setup)

### 1. Create a GitHub organisation for the lab

Use an organisation rather than a personal account, so the site doesn't
disappear when a student graduates.

1. Sign in to GitHub, then go to **github.com/organizations/plan** and choose the free plan.
2. Name it, for example `yazici-lab`.
3. Invite Prof. Yazıcı and make him an **Owner**. Add at least one other
   maintainer so there's always a backup.

### 2. Upload this project

**Option A — website only (no installs):**

1. In the organisation, click **New repository**.
2. Name it `yazici-lab.github.io` (replace with your organisation's name, exactly).
   This name gives you the address `https://yazici-lab.github.io`.
3. Make it **Public**, then create it.
4. Click **uploading an existing file**, drag in *all* files and folders from this
   project (not the outer folder itself), and click **Commit changes**.

**Option B — with Git:**

```bash
cd yazici-lab
git init
git add .
git commit -m "First version of the lab website"
git branch -M main
git remote add origin https://github.com/yazici-lab/yazici-lab.github.io.git
git push -u origin main
```

### 3. Turn on GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   **Branch** to `main` and folder `/ (root)`. Click **Save**.
3. After a minute or two, the site is live at `https://yazici-lab.github.io`.
   The **Actions** tab shows each build; a red cross there means a typo in one of
   the files (the log says which line).

### 4. Set the address in `_config.yml`

Edit `_config.yml` and set:

```yaml
url: "https://yazici-lab.github.io"
baseurl: ""
```

If you named the repository something else (e.g. `website`), the site lives at
`https://yazici-lab.github.io/website`, so use `baseurl: "/website"`.

### 5. Optional: a university address (e.g. `yazicilab.nu.edu.kz`)

1. Ask NU IT to create a **CNAME** DNS record:
   `yazicilab.nu.edu.kz → yazici-lab.github.io`
2. In **Settings → Pages → Custom domain**, enter `yazicilab.nu.edu.kz` and save.
   (GitHub adds a `CNAME` file to the repository; keep it.)
3. Once the DNS check passes, tick **Enforce HTTPS**.
4. Change `url` in `_config.yml` to `https://yazicilab.nu.edu.kz`.

A purchased domain such as `yazicilab.org` works the same way; follow GitHub's
guide "Managing a custom domain for your GitHub Pages site".

### 6. Help people find it

- Add the site to **Google Search Console** (search.google.com/search-console)
  and submit `https://YOUR-ADDRESS/sitemap.xml`. The sitemap is generated automatically.
- Link to it from Prof. Yazıcı's NU profile, Google Scholar, ORCID and the lab's LinkedIn page.
- Fill in the `social:` links in `_config.yml` so they appear in the footer.

---

## Before going public: checklist

- [ ] Replace or delete every entry marked `sample: true` in the `_data` files.
- [ ] Then set `show_sample_tags: false` in `_config.yml` (or leave it on as a safety net).
- [ ] Double-check the three book entries in `_data/publications.yml` (authors, years).
- [ ] Get each member's consent before adding their photo, email or LinkedIn.
- [ ] Ask Prof. Yazıcı to approve the home page headline and research descriptions.
- [ ] Fill in the Google Scholar / LinkedIn links.

---

## Previewing changes on your own computer (optional)

You can edit everything directly on github.com and skip this. To preview locally:

1. Install Ruby (on Windows, use RubyInstaller *with DevKit*; on macOS,
   `brew install ruby`).
2. In this folder run:
   ```bash
   gem install bundler
   bundle install
   bundle exec jekyll serve
   ```
3. Open http://localhost:4000. The page reloads when you save a file
   (restart the command after editing `_config.yml`).

---

## How the site is put together

```
_config.yml          site settings
_data/               all lab content (people, publications, projects, news)
_posts/              blog posts, one Markdown file each
_layouts/            page templates (default, page, post)
_includes/           reusable pieces (header, footer, publication entry, …)
assets/css/main.css  all styling; colours and fonts are tokens at the top
assets/js/main.js    mobile menu, publication/news filters, hero animation
assets/img/          favicon, people photos (people/), blog images (blog/)
index.html           home page
research.html, people.html, publications.html, news.html, blog/index.html
```

**The design idea.** The lab's research is about reasoning with imprecise data,
so the visual language borrows from fuzzy logic. The home page shows a field of
sensors answering a *fuzzy query*: instead of "near" or "not near", every sensor
gets a membership degree μ between 0 and 1, shown by its colour (teal → amber)
and size. Each research area and page is marked with a small membership-function
curve (triangle, trapezoid, Gaussian, sigmoid). The animation pauses when
off-screen and respects the visitor's "reduce motion" setting.
