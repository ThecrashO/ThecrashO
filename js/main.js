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

    window.open(`https://t.me/thecrashO?text=${text}`, '_blank');
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

        storeEl.innerHTML = items.map((item) => {
            // Feature list HTML
            const featuresHTML = Array.isArray(item.features) && item.features.length
                ? `<ul class="store-features">
                    ${item.features.map(f => `
                        <li class="store-feature-item">
                            <i class="bi bi-check2"></i>
                            <span>${f}</span>
                        </li>`).join('')}
                   </ul>`
                : '';

            // Audience HTML
            const audienceHTML = item.audience
                ? `<div class="store-audience">
                       <i class="bi bi-people-fill"></i>
                       <span>${item.audience}</span>
                   </div>`
                : '';

            // Price display (both currencies stacked)
            const priceDisplay = `
                <div class="store-price">
                    <div class="price-pill">
                        <span class="price-usd" data-usd="${item.priceUsd}">${item.priceUsd === 0 ? 'Free' : `$${item.priceUsd}`}</span>
                        <span class="price-mmk" data-mmk="${item.priceMmk}">${item.priceMmk === 0 ? 'Free' : `${item.priceMmk.toLocaleString()} MMK`}</span>
                    </div>
                </div>`;

            return `
                <div class="store-card">
                    <div class="store-card-top">
                        <div class="store-icon"><i class="bi ${item.icon}"></i></div>
                        ${item.badge ? `<span class="store-badge">${item.badge}</span>` : ''}
                    </div>
                    <div class="store-type">${item.type}</div>
                    <div class="store-name">${item.name}</div>
                    <div class="store-desc">${item.desc}</div>
                    <div class="store-divider"></div>
                    ${featuresHTML}
                    ${audienceHTML}
                    <div class="store-bottom">
                        ${priceDisplay}
                        <a class="store-cta" href="${item.link}" target="_blank" rel="noopener noreferrer">
                            <i class="bi bi-box-arrow-up-right"></i> ${item.button}
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        // Re-apply currency state after render
        const activeCurrencyBtn = document.querySelector('.currency-btn.active');
        if (activeCurrencyBtn) {
            const mode = activeCurrencyBtn.id.replace('btn-', '');
            setCurrency(mode);
        }
    } catch (err) {
        storeEl.innerHTML = '<p style="color:var(--text-muted)">Unable to load products.</p>';
        console.error(err);
    }
}


let projectManifest = [];

function projectLinksHTML(project, modalClass = '') {
    return Object.entries(project.links || {}).map(([key, value]) => {
        const label = key === 'github'   ? 'GitHub'
                    : key === 'demo'     ? 'Live Demo'
                    : key === 'template' ? 'Use Template'
                    : key === 'guide'    ? 'Complete Guide'
                    : key === 'telegram' ? 'Open Telegram Bot'
                    : key;
        const icon  = key === 'github'   ? 'bi-github'
                    : key === 'template' ? 'bi-puzzle-fill'
                    : key === 'guide'    ? 'bi-book-fill'
                    : key === 'telegram' ? 'bi-telegram'
                    : 'bi-box-arrow-up-right';
        return `<a href="${value}" target="_blank" rel="noopener noreferrer" class="project-link ${modalClass}"><i class="bi ${icon}"></i> ${label}</a>`;
    }).join('');
}

function projectPrimaryLink(project) {
    return project.links?.demo
        || project.links?.guide
        || project.links?.telegram
        || project.links?.template
        || project.links?.github
        || 'projects.html';
}

async function renderHomeHighlights() {
    const projectsEl = document.getElementById('home-selected-projects');
    const paperEl = document.getElementById('home-latest-paper');
    if (!projectsEl && !paperEl) return;

    if (projectsEl) {
        try {
            const res = await fetch('data/projects.json', { cache: 'no-store' });
            if (!res.ok) throw new Error('Could not load selected projects');
            const projects = await res.json();
            const selected = projects.filter((project) => project.featured).concat(projects.filter((project) => !project.featured)).slice(0, 2);

            projectsEl.innerHTML = selected.map((project) => {
                const href = projectPrimaryLink(project);
                const stack = (project.stack || []).slice(0, 3).map((item) => `<span>${item}</span>`).join('');
                return `
                    <article class="home-project-card">
                        <a href="${href}" target="_blank" rel="noopener noreferrer" class="home-project-image${project.imageFit === 'contain' ? ' image-contain' : ''}" aria-label="Open ${project.title}">
                            <img src="${project.image}" alt="${project.title} project screenshot" loading="lazy">
                        </a>
                        <div class="home-project-body">
                            <span class="home-project-type"><i class="bi ${project.tagIcon}"></i> ${project.tag}</span>
                            <h2>${project.title}</h2>
                            <p>${project.desc}</p>
                            <div class="home-project-stack">${stack}</div>
                            <a href="projects.html" class="home-project-more">View project details <i class="bi bi-arrow-up-right"></i></a>
                        </div>
                    </article>`;
            }).join('');
        } catch (err) {
            projectsEl.innerHTML = '<p class="home-load-error">Unable to load selected projects.</p>';
            console.error(err);
        }
    }

    if (paperEl) {
        try {
            const res = await fetch('data/paper.json');
            if (!res.ok) throw new Error('Could not load latest paper');
            const papers = await res.json();
            const paper = papers[0];

            paperEl.innerHTML = paper ? `
                <article class="home-paper-card" lang="my">
                    <a href="paper.html?post=${paper.id}" class="home-paper-image">
                        <img src="${paper.image}" alt="${paper.title}" loading="lazy">
                    </a>
                    <div class="home-paper-body">
                        <span class="home-paper-tag">${paper.tag}</span>
                        <h2>${paper.title}</h2>
                        <p>${paper.desc}</p>
                        <span class="home-paper-meta">${paper.meta}</span>
                        <a href="paper.html?post=${paper.id}" class="home-paper-link">ဆက်ဖတ်ရန် <i class="bi bi-arrow-right"></i></a>
                    </div>
                </article>` : '<p class="home-load-error">No papers yet.</p>';
        } catch (err) {
            paperEl.innerHTML = '<p class="home-load-error">Unable to load the latest paper.</p>';
            console.error(err);
        }
    }
}

function openProjectDetails(projectId) {
    const project = projectManifest.find((item) => item.id === projectId);
    const modal = document.getElementById('project-modal');
    const content = document.getElementById('project-modal-content');
    if (!project || !modal || !content) return;

    const stack = (project.stack || []).map((item) => `<span class="project-tech">${item}</span>`).join('');
    const highlights = (project.details?.highlights || []).map((item) => `<li><i class="bi bi-check2-circle"></i><span>${item}</span></li>`).join('');
    content.innerHTML = `
        <div class="project-modal-image"><img src="${project.image}" alt="${project.title} project cover"></div>
        <div class="project-modal-body">
            <div class="project-modal-eyebrow"><i class="bi ${project.tagIcon}"></i> ${project.tag}</div>
            <h2 id="project-modal-title">${project.title}</h2>
            <p class="project-modal-lead">${project.desc}</p>
            <div class="project-modal-stats">
                <div><strong>${project.impact?.value || '—'}</strong><span>${project.impact?.label || 'project outcome'}</span></div>
                <div class="project-modal-stack">${stack}</div>
            </div>
            <div class="project-modal-story">
                <section><span class="project-detail-label">The problem</span><p>${project.details?.problem || ''}</p></section>
                <section><span class="project-detail-label">The solution</span><p>${project.details?.solution || ''}</p></section>
            </div>
            <div class="project-highlights-section">
                <span class="project-detail-label">Key capabilities</span>
                <ul class="project-highlights">${highlights}</ul>
            </div>
            <div class="project-modal-footer">
                <span>Explore the project</span>
                <div class="project-modal-links">${projectLinksHTML(project, 'project-modal-link')}</div>
            </div>
        </div>`;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.project-modal-close')?.focus();
}

function closeProjectDetails() {
    const modal = document.getElementById('project-modal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
}

async function renderProjects() {
    const container = document.getElementById('all-projects');
    if (!container) return;

    try {
        const res = await fetch('data/projects.json', { cache: 'no-store' });
        if (!res.ok) throw new Error('Could not load project manifest');
        const projects = await res.json();
        projectManifest = projects;

        container.innerHTML = projects.map((project, index) => {
            const categories = Array.isArray(project.categories) ? project.categories.join(' ') : project.categories || '';
            const stack = (project.stack || []).map((item) => `<span class="project-tech">${item}</span>`).join('');
            const links = projectLinksHTML(project, 'project-case-link');
            return `
                <article class="project-case-study" data-category="${categories}" data-project-id="${project.id}">
                    <a class="project-case-visual${project.imageFit === 'contain' ? ' image-contain' : ''}" href="${projectPrimaryLink(project)}"
                        target="_blank" rel="noopener noreferrer" aria-label="Open ${project.title}">
                        <img src="${project.image}" alt="${project.title} project screenshot" loading="lazy">
                        <span class="project-case-open"><i class="bi bi-arrow-up-right"></i></span>
                    </a>
                    <div class="project-case-content">
                        <div class="project-case-kicker">
                            <span class="project-case-number">${String(index + 1).padStart(2, '0')}</span>
                            <span class="project-case-type"><i class="bi ${project.tagIcon}"></i> ${project.tag}</span>
                        </div>
                        <h2 class="project-case-title">${project.title}</h2>
                        <p class="project-case-desc">${project.desc}</p>
                        <div class="project-case-stack">${stack}</div>
                        <div class="project-case-links">${links}</div>
                    </div>
                </article>
            `;
        }).join('');

        document.querySelectorAll('.filter-tag').forEach((tag) => {
            const filter = tag.dataset.filter;
            const count = filter === 'all' ? projects.length : projects.filter((project) => project.categories.includes(filter)).length;
            const countEl = tag.querySelector('.filter-count');
            if (countEl) countEl.textContent = count;
        });

    } catch (err) {
        container.innerHTML = '<p style="color:var(--text-muted)">Unable to load projects.</p>';
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
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
    const projectCards = () => document.querySelectorAll('#all-projects .project-case-study');
    const hash = window.location.hash.slice(1);

    if (hash) {
        navigate(hash);
    }

    await renderSkills();
    await renderStore();
    await renderProjects();
    await renderHomeHighlights();

    document.querySelectorAll('[data-close-project]').forEach((element) => element.addEventListener('click', closeProjectDetails));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeProjectDetails();
    });

    const filterProjects = () => {
        const cards = projectCards();
        const activeFilter = document.querySelector('.filter-tag.active')?.dataset.filter || 'all';

        cards.forEach(card => {
            if (activeFilter === 'all') {
                card.style.display = '';
            } else {
                const categories = card.dataset.category ? card.dataset.category.split(' ') : [];
                card.style.display = categories.includes(activeFilter) ? '' : 'none';
            }
        });
    };

    if (filterTags.length === 0) return;

    filterTags.forEach(tag => {
        tag.addEventListener('click', function () {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterProjects();
        });
    });

    filterProjects();
});
