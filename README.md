# ThecrashO — Personal Portfolio Website

> **Pyae Sone Phyo** · Generalist × Specialist (with AI)  
> Full-Stack Developer · AI Automation Builder · Content Creator

![Portfolio Preview](assets/images/preview.png)

---

## 🌐 Live Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `index.html` | Hero, Ecosystem, Skills & Tools, Store, Contact |
| Projects | `projects.html` | Filterable project showcase |
| Paper | `blog.html` | Articles & insights (Markdown-powered) |

---

## 📁 Project Structure

```
ThecrashO/
├── index.html          # Main SPA — Home, Store, Contact sections
├── projects.html       # Projects showcase page
├── blog.html           # Paper (blog) listing & reader page
│
├── css/
│   └── style.css       # Global design system (dark/light mode, all components)
│
├── js/
│   ├── main.js         # Navigation, theme toggle, skills/store/projects rendering
│   └── blog.js         # Paper (blog) listing & Markdown article reader
│
├── data/
│   ├── blog.json       # Paper article metadata list
│   ├── projects.json   # Project cards data
│   ├── skills.json     # Skills & tools data
│   └── store.json      # Digital products & pricing data
│
├── blog/               # Markdown (.md) article files
│   └── *.md            # Individual paper/article files
│
├── assets/
│   ├── images/         # Avatar, preview images
│   └── docs/           # CV / PDF downloads
│
├── scripts/            # Build or utility scripts
└── package.json        # Project metadata
```

---

## 🏗️ Website Architecture

### Design Pattern — Multi-page SPA Hybrid

This site uses a **hybrid architecture** — the main page (`index.html`) behaves like a Single Page Application (SPA) with client-side section switching, while `projects.html` and `blog.html` are separate HTML pages for clean URL separation.

```
index.html  (SPA — section-based navigation)
│
├── #home     → Hero + Ecosystem + Skills
├── #store    → Digital Products
└── #contact  → Contact Form

projects.html  (Standalone page)
blog.html      (Standalone page — "Paper")
```

### Navigation Flow

```
[Navbar]
  ├── Home       → navigate('home')       — SPA hash routing
  ├── Projects   → projects.html          — Full page load
  ├── Paper      → blog.html              — Full page load
  ├── Store      → navigate('store')      — SPA hash routing
  ├── Contact    → navigate('contact')    — SPA hash routing
  └── 🌙 Theme  → toggleDark()           — localStorage persisted
```

### Data Flow

All dynamic content is **JSON-driven** — no backend required. JavaScript fetches local JSON files on load:

```
data/skills.json   →  renderSkills()   →  Home: Skills & Tools section
data/store.json    →  renderStore()    →  Home: Store section
data/projects.json →  renderProjects() →  projects.html: Project cards
data/blog.json     →  blog.js          →  blog.html: Paper listing

blog/*.md          →  marked.js        →  blog.html: Markdown → HTML reader
```

### Paper (Blog) System

The **Paper** page (`blog.html`) is a lightweight, zero-backend article system:

1. `data/blog.json` stores article metadata (title, date, description, filename)
2. `js/blog.js` fetches the JSON and renders the article listing grid
3. When a user clicks an article, `blog.js` fetches the `.md` file from `blog/`
4. The Markdown is parsed by **marked.js** (CDN) and rendered as HTML in-page
5. No page reload — article reading is done client-side

### Theme System

- Default: detects OS preference via `prefers-color-scheme`
- Persisted in `localStorage` across pages
- Applied via `data-theme="dark|light"` on `<html>` tag
- Inline `<script>` in `<head>` prevents flash-of-wrong-theme (FOUT)

### Currency Toggle (Store)

The Store section supports **USD / MMK / Both** price display, toggled client-side via `setCurrency()` — no re-fetch needed.

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** — Semantic structure
- **CSS3 (Vanilla)** — Custom design system, CSS variables, dark/light mode
- **JavaScript (ES6+)** — All interactivity, no frameworks
- **Bootstrap Icons** — Icon library (CDN)
- **Google Fonts (Inter)** — Typography
- **marked.js** — Markdown parsing for Paper articles (CDN)

### Data
- **JSON** — All content is data-driven via local JSON files
- **Markdown** — Paper articles written in `.md` format

### Infrastructure
- **Static hosting** — No server required (GitHub Pages / Netlify compatible)
- **Git & GitHub** — Version control & deployment

---

## ✨ Key Features

- 🌗 **Dark / Light Mode** — System-aware with localStorage persistence
- 📱 **Responsive Design** — Mobile-first layout with bottom navbar
- 📝 **Paper System** — Markdown-powered article reader, zero backend
- 🗂️ **Project Filter** — Tag-based filtering for project showcase
- 💰 **Currency Toggle** — USD / MMK price switching in Store
- 📬 **Telegram Contact** — Direct message pre-fill via Telegram deep link
- ⚡ **No Build Step** — Pure HTML/CSS/JS, runs directly in browser

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/ThecrashO/ThecrashO.git
cd ThecrashO

# Serve locally (any static server)
npx serve .
# or
python -m http.server 8080
# then open http://localhost:8080
```

> ⚠️ Must be served via HTTP (not `file://`) due to `fetch()` calls for JSON/Markdown.

---

## 📝 Adding Content

### Add a new Paper article
1. Create a Markdown file: `blog/my-article.md`
2. Add metadata entry to `data/blog.json`:
```json
{
  "title": "My Article Title",
  "date": "2026-08-08",
  "desc": "Short description.",
  "file": "my-article.md"
}
```

### Add a new Project
Add an entry to `data/projects.json`:
```json
{
  "title": "Project Name",
  "desc": "Short description.",
  "tag": "Web App",
  "tagIcon": "bi-globe",
  "categories": ["web"],
  "links": {
    "github": "https://github.com/...",
    "demo": "https://..."
  }
}
```

---

## 🔗 Connect

| Platform | Link |
|----------|------|
| GitHub | [github.com/ThecrashO](https://github.com/ThecrashO) |
| Telegram | [@thecrashO](https://t.me/thecrashO_Official) |
| Academy | [@thecrasho_academy](https://t.me/thecrasho_academy) |
| YouTube | [@thecrasho](https://youtube.com/@thecrasho) |
| TikTok | [@thecrasho](https://www.tiktok.com/@thecrasho) |
| X (Twitter) | [@thecrashoX](https://x.com/thecrashoX) |
| Email | thecrasho99@gmail.com |

---

## 📄 License

MIT © 2026 Pyae Sone Phyo (ThecrashO)
