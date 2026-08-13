/**
 * Markdown-based Paper loader.
 * Listing: data/paper.json  |  Article: paper/{slug}.md
 *
 * "Paper" = evidence-based writing with clear arguments, written to explain ideas to others.
 */

function parseFrontmatter(text) {
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { meta: {}, body: text };

    const meta = {};
    match[1].split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx > 0) {
            meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
        }
    });

    return { meta, body: match[2].trim() };
}

function formatMeta(date, readTime) {
    const parsed = new Date(date);
    const label = Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return readTime ? `${label} · ${readTime}` : label;
}

async function loadManifest() {
    const res = await fetch('data/paper.json');
    if (!res.ok) throw new Error('Could not load paper manifest');
    return res.json();
}

async function loadPost(slug) {
    const res = await fetch(`paper/${slug}.md`);
    if (!res.ok) return null;

    const text = await res.text();
    const { meta, body } = parseFrontmatter(text);

    return {
        id: slug,
        tag: meta.tag || 'Paper',
        title: meta.title || slug,
        desc: meta.desc || '',
        meta: formatMeta(meta.date, meta.readTime),
        image: meta.image || '',
        body,
    };
}

function renderListing(posts) {
    const listingEl = document.getElementById('blog-listing');
    const articleEl = document.getElementById('blog-article');
    const backBtn = document.getElementById('blog-back-btn');
    document.body.classList.remove('paper-article-mode');
    document.documentElement.classList.remove('paper-article-route');

    if (!posts || posts.length === 0) {
        listingEl.innerHTML = `<p style="color:var(--text-muted); grid-column:1/-1; text-align:center; padding:3rem 1rem;">No papers yet — the first one is on its way.</p>`;
        listingEl.style.display = 'grid';
        articleEl.style.display = 'none';
        backBtn.style.display = 'none';
        return;
    }

    listingEl.innerHTML = posts.map((post) => `
        <article class="blog-card" lang="my">
            ${post.image ? `<div class="blog-card-image-wrap"><img src="${post.image}" alt="${post.title}"></div>` : ''}
            <div class="blog-card-body">
                <div class="blog-tag">${post.tag}</div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-desc">${post.desc}</p>
                <div class="blog-meta">${post.meta}</div>
                <a href="paper.html?post=${post.id}" class="blog-link">Read More →</a>
            </div>
        </article>
    `).join('');

    listingEl.style.display = 'grid';
    articleEl.style.display = 'none';
    backBtn.style.display = 'none';
}

function renderArticle(post) {
    const listingEl = document.getElementById('blog-listing');
    const articleEl = document.getElementById('blog-article');
    const backBtn = document.getElementById('blog-back-btn');
    const html = typeof marked !== 'undefined' ? marked.parse(post.body) : post.body;
    document.body.classList.add('paper-article-mode');
    document.documentElement.classList.add('paper-article-route');

    listingEl.style.display = 'none';
    articleEl.style.display = 'block';
    backBtn.style.display = 'inline-flex';

    articleEl.innerHTML = `
        <div class="blog-article-shell" lang="my">
            <div class="blog-article-hero">
                <div class="blog-article-head">
                    <div class="blog-article-badge">${post.tag}</div>
                    <h2 class="blog-article-title">${post.title}</h2>
                    <div class="blog-article-meta">
                        <div class="blog-author-block">
                            <img src="assets/images/avatar.png" alt="ThecrashO avatar" class="blog-author-avatar" />
                            <span class="blog-author">@thecrashO</span>
                        </div>
                        <span class="blog-meta-separator">•</span>
                        <span>${post.meta}</span>
                    </div>
                    ${post.desc ? `<p class="blog-article-desc">${post.desc}</p>` : ''}
                </div>
                ${post.image ? `<div class="blog-article-image-wrap"><img src="${post.image}" alt="${post.title}"></div>` : ''}
            </div>
            <div class="blog-article-content markdown-body">
                <button class="copy-article-btn" onclick="copyBlogArticle()"><i class="bi bi-clipboard"></i> Copy article</button>
                ${html}
            </div>
        </div>
    `;
}

function copyBlogArticle() {
    const title = document.querySelector('.blog-article-title')?.textContent || 'Paper';
    const body = document.querySelector('.blog-article-content')?.innerText || '';
    const text = `${title}\n\n${body.replace('Copy paper', '').trim()}\n\n— @thecrashO`;

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.copy-article-btn');
        if (btn) btn.innerHTML = '<i class="bi bi-check2"></i> Copied';
    });
}

async function initBlog() {
    const listingEl = document.getElementById('blog-listing');
    const selectedId = new URLSearchParams(window.location.search).get('post');

    try {
        if (selectedId) {
            const post = await loadPost(selectedId);
            if (!post) {
                renderListing(await loadManifest());
                return;
            }
            renderArticle(post);
            return;
        }

        renderListing(await loadManifest());
    } catch (err) {
        listingEl.innerHTML = `<p style="color:var(--text-muted)">Could not load papers. Run <code>node scripts/generate-blog-manifest.js</code> and serve via a local server.</p>`;
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', initBlog);
