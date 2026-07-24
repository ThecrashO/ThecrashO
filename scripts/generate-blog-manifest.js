/**
 * Scans blog/*.md and writes data/blog.json.
 * Run after adding or editing a post:  node scripts/generate-blog-manifest.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'blog');
const OUT_FILE = path.join(ROOT, 'data', 'blog.json');

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return {};

    const meta = {};
    match[1].split('\n').forEach((line) => {
        const idx = line.indexOf(':');
        if (idx > 0) {
            const key = line.slice(0, idx).trim();
            const value = line.slice(idx + 1).trim();
            meta[key] = value;
        }
    });
    return meta;
}

function formatMeta(date, readTime) {
    const parsed = new Date(date);
    const label = Number.isNaN(parsed.getTime())
        ? date
        : parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    return readTime ? `${label} · ${readTime}` : label;
}

const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
const posts = files.map((file) => {
    const id = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
    const meta = parseFrontmatter(raw);

    return {
        id,
        tag: meta.tag || 'Blog',
        title: meta.title || id,
        desc: meta.desc || '',
        date: meta.date || '1970-01-01',
        readTime: meta.readTime || '',
        meta: formatMeta(meta.date, meta.readTime),
        image: meta.image || '',
    };
});

posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 4) + '\n');

console.log(`Wrote ${posts.length} post(s) to data/blog.json`);
