/**
 * ============================================
 * NAVIGATION
 * ============================================
 */
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

    const targetPage = document.getElementById(page);
    if (!targetPage) return;

    targetPage.classList.add('active');

    const navBtn = document.getElementById('nav-' + page);
    if (navBtn) navBtn.classList.add('active');

    if (page === 'home') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    } else {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${page}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


/**
 * ============================================
 * HIDE NAVBAR ON SCROLL
 * ============================================
 */
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    if (navbar) {
        navbar.classList.toggle('hidden', cur > lastScroll && cur > 80);
    }
    lastScroll = cur;
}, { passive: true });


/**
 * ============================================
 * DARK / LIGHT MODE TOGGLE
 * ============================================
 */
function toggleDark() {
    const html = document.documentElement;
    const isDark = html.dataset.theme === 'dark';

    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    try {
        localStorage.setItem('theme', newTheme);
    } catch (e) {
        // ignore
    }
}

function setTheme(theme) {
    const html = document.documentElement;
    html.dataset.theme = theme;
    const icon = document.querySelector('#darkToggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-moon-stars-fill' : 'bi bi-sun-fill';
    }
}


/**
 * ============================================
 * CURRENCY TOGGLE
 * ============================================
 */
function setCurrency(mode) {
    document.querySelectorAll('.currency-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-' + mode);
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.price-usd').forEach(el => {
        el.style.display = (mode === 'mmk') ? 'none' : 'inline-flex';
    });

    document.querySelectorAll('.price-mmk').forEach(el => {
        el.style.display = (mode === 'usd') ? 'none' : 'inline-flex';
    });
}

setCurrency('both');


/**
 * ============================================
 * SEND VIA TELEGRAM
 * ============================================
 */
function sendTelegram() {
    const name = document.getElementById('cf-name')?.value || 'Someone';
    const contact = document.getElementById('cf-contact')?.value || '';
    const subject = document.getElementById('cf-subject')?.value || 'Inquiry';
    const msg = document.getElementById('cf-msg')?.value || '';

    const text = encodeURIComponent(
        `Hi Pyae Sone! I'm ${name}.\n` +
        `Contact: ${contact}\n` +
        `Subject: ${subject}\n\n` +
        `${msg}`
    );

    window.open(`https://t.me/theprimev?text=${text}`, '_blank');
}


/**
 * ============================================
 * PROJECT FILTER
 * ============================================
 */
async function renderSkills() {
    const coreSkillsEl = document.getElementById('core-skills');
    const toolsSkillsEl = document.getElementById('tools-skills');

    if (!coreSkillsEl || !toolsSkillsEl) return;

    try {
        const res = await fetch('data/skills.json');
        if (!res.ok) throw new Error('Could not load skill manifest');
        const skills = await res.json();

        const coreSkills = skills.filter((item) => item.group === 'core');
        const toolsSkills = skills.filter((item) => item.group === 'tools');

        coreSkillsEl.innerHTML = coreSkills.map((skill) => `
            <div class="skill-card">
                <i class="bi ${skill.icon}"></i>
                <span>${skill.label}</span>
            </div>
        `).join('');

        toolsSkillsEl.innerHTML = toolsSkills.map((skill) => `
            <div class="skill-card">
                <i class="bi ${skill.icon}"></i>
                <span>${skill.label}</span>
            </div>
        `).join('');
    } catch (err) {
        coreSkillsEl.innerHTML = '<p style="color:var(--text-muted)">Unable to load skills.</p>';
        toolsSkillsEl.innerHTML = '<p style="color:var(--text-muted)">Unable to load skills.</p>';
        console.error(err);
    }
}

async function renderStore() {
    const storeEl = document.getElementById('store-items');
    if (!storeEl) return;

    try {
        const res = await fetch('data/store.json');
        if (!res.ok) throw new Error('Could not load store manifest');
        const items = await res.json();

        storeEl.innerHTML = items.map((item) => `
            <div class="store-card">
                <div class="store-icon"><i class="bi ${item.icon}"></i></div>
                <div class="store-type">${item.type}</div>
                <div class="store-name">${item.name}</div>
                <div class="store-desc">${item.desc}</div>
                <div class="store-price">
                    <div class="price-pill">
                        <span class="price-usd" data-usd="${item.priceUsd}">${item.priceUsd === 0 ? 'Free' : `$${item.priceUsd}`}</span>
                        <span class="price-mmk" data-mmk="${item.priceMmk}">${item.priceMmk === 0 ? 'Free' : `${item.priceMmk} MMK`}</span>
                    </div>
                </div>
                <a class="btn-primary" style="width:100%;justify-content:center;display:inline-flex;align-items:center;gap:.5rem" href="${item.link}" target="_blank"><i class="bi bi-box-arrow-up-right"></i> ${item.button}</a>
            </div>
        `).join('');
    } catch (err) {
        storeEl.innerHTML = '<p style="color:var(--text-muted)">Unable to load products.</p>';
        console.error(err);
    }
}

async function renderProjects() {
    const container = document.getElementById('all-projects');
    if (!container) return;

    try {
        const res = await fetch('data/projects.json');
        if (!res.ok) throw new Error('Could not load project manifest');
        const projects = await res.json();

        container.innerHTML = projects.map((project) => {
            const links = Object.entries(project.links || {}).map(([key, value]) => {
                const label = key === 'github' ? 'GitHub' : key === 'demo' ? 'Live Demo' : key;
                const icon = key === 'github' ? 'bi-github' : 'bi-box-arrow-up-right';
                return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="project-link"><i class="bi ${icon}"></i> ${label}</a>`;
            }).join('');

            const categories = Array.isArray(project.categories) ? project.categories.join(' ') : project.categories || '';
            return `
                <div class="project-card" data-category="${categories}">
                    <div class="project-tag"><i class="bi ${project.tagIcon}"></i> ${project.tag}</div>
                    <div class="project-title">${project.title}</div>
                    <div class="project-desc">${project.desc}</div>
                    <div class="project-links">${links}</div>
                </div>
            `;
        }).join('');
    } catch (err) {
        container.innerHTML = '<p style="color:var(--text-muted)">Unable to load projects.</p>';
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Apply saved theme (or system preference) on load
    try {
        let theme = localStorage.getItem('theme');
        if (!theme) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark';
            } else {
                theme = 'light';
            }
        }
        setTheme(theme);
    } catch (e) {
        // ignore localStorage errors
    }
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = () => document.querySelectorAll('#all-projects .project-card');
    const hash = window.location.hash.slice(1);

    if (hash) {
        navigate(hash);
    }

    await renderSkills();
    await renderStore();
    await renderProjects();

    const filterProjects = () => {
        const cards = projectCards();
        const activeFilter = document.querySelector('.filter-tag.active')?.dataset.filter || 'all';

        cards.forEach(card => {
            if (activeFilter === 'all') {
                card.style.display = 'block';
            } else {
                const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
                card.style.display = categories.includes(activeFilter) ? 'block' : 'none';
            }
        });
    };

    if (filterTags.length === 0) return;

    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterProjects();
        });
    });

    filterProjects();
});