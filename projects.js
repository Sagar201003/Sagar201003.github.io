// ==========================================
// Hybrid Category Classification Engine
// ==========================================
const MANUAL_OVERRIDES = {
    "Diabetes-Prediction": "MLOps",
    "DiabetesPredictionPart2": "MLOps",
    "HeartDisPred": "Full Stack",
    "TitanicSurvivalPrediction": "Full Stack",
    "BreastCancerClassification": "Full Stack",
    "ParkinsonPredictor": "Full Stack",
    "Sagar201003.github.io": "Full Stack",
    "CCL": "MLOps"
};

function categorizeRepo(repo) {
    if (MANUAL_OVERRIDES[repo.name]) return MANUAL_OVERRIDES[repo.name];
    
    const searchString = (repo.name + " " + (repo.description || "") + " " + (repo.topics || []).join(" ")).toLowerCase();
    
    if (searchString.match(/yolo|gan|pose|mask|detection|opencv|image|vision|cv|resnet|sar|landslide|anomaly|face|surveillance/)) return "Computer Vision";
    if (searchString.match(/nlp|llm|rag|gpt|text|language|unsloth|sme/)) return "NLP/LLMs";
    if (searchString.match(/prediction|classification|predictor|dataset|mlops|pipeline/)) return "MLOps";
    if (searchString.match(/django|next\.js|web|app|ecommerce|portfolio|juice|streamlit/)) return "Full Stack";
    
    return "Other";
}

// ==========================================
// Card & Row Rendering Helpers
// ==========================================
const beautifulGradients = [
    "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)",
    "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    "linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)",
    "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)"
];

// Category icons for the filtered view title
const categoryIcons = {
    "Computer Vision": "👁️",
    "NLP/LLMs": "🧠",
    "MLOps": "⚙️",
    "Full Stack": "🚀",
    "Other": "📦"
};

function createCardHTML(repo, index, showCategory = false) {
    const gradient = beautifulGradients[index % beautifulGradients.length];
    const title = formatRepoName(repo.name);
    const desc = repo.description || "No description provided.";
    const topics = repo.topics || [];
    const category = categorizeRepo(repo);
    const categoryBadgeHtml = showCategory 
        ? `<span class="tech-badge" style="background: rgba(139,92,246,0.25); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.3);">${category}</span>` 
        : '';
    const tagsHtml = topics.slice(0, 4).map(t => `<span class="tech-badge">${t}</span>`).join('');
    
    return `
        <div class="project-card" style="opacity: 0; animation: cardFadeIn 0.4s ease forwards; animation-delay: ${index * 0.08}s;">
            <div class="card-banner" style="background: ${gradient}; position: relative; overflow: hidden;">
                <div style="position: absolute; inset: 0; background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px); background-size: 12px 12px;"></div>
            </div>
            <div class="card-content">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <h3 class="project-title">${title}</h3>
                    <div class="row-stars" style="color: #f59e0b;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                        <span>${repo.stargazers_count}</span>
                    </div>
                </div>
                ${categoryBadgeHtml}
                <p class="project-desc">${desc}</p>
                <div class="tech-stack" style="margin-bottom: 1.5rem;">
                    ${tagsHtml}
                </div>
                <div class="card-actions" style="margin-top: auto;">
                    <a href="project-detail.html?repo=${repo.name}" class="btn-card">View Details</a>
                    <a href="${repo.html_url}" target="_blank" class="btn-card btn-github">GitHub</a>
                </div>
            </div>
        </div>
    `;
}

function createRowHTML(repo) {
    const langColor = getLanguageColor(repo.language);
    const title = formatRepoName(repo.name);
    const desc = repo.description || "No description provided.";
    const lang = repo.language || "Unknown";
    const category = categorizeRepo(repo);
    const categoryBadge = `<span class="tech-badge" style="background: rgba(139,92,246,0.2); color: #c4b5fd; border: 1px solid rgba(139,92,246,0.25); margin-left: 0.5rem; font-size: 0.7rem;">${category}</span>`;
    
    return `
        <a href="project-detail.html?repo=${repo.name}" class="project-list-row">
            <div class="row-main">
                <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
                    <h3 class="row-title" style="margin: 0;">${title}</h3>
                    ${categoryBadge}
                </div>
                <p class="row-desc">${desc}</p>
            </div>
            <div class="row-meta">
                <div class="row-lang">
                    <span class="lang-dot" style="background-color: ${langColor};"></span>
                    <span>${lang}</span>
                </div>
                <div class="row-stars">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="color: #f59e0b;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span>${repo.stargazers_count}</span>
                </div>
                <div class="row-github" onclick="event.preventDefault(); window.open('${repo.html_url}', '_blank');">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                </div>
            </div>
        </a>
    `;
}

function renderEmptyState(message) {
    return `
        <div style="text-align: center; grid-column: 1 / -1; padding: 4rem 2rem; color: #94a3b8;">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
            <p style="font-size: 1.1rem;">${message}</p>
        </div>
    `;
}

// ==========================================
// Main Application Logic
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const featuredGrid = document.getElementById('featured-projects-grid');
    const recentGrid = document.getElementById('recent-projects-grid');
    const allList = document.getElementById('all-projects-list');
    const defaultView = document.getElementById('default-view');
    const filteredView = document.getElementById('filtered-view');
    const filteredGrid = document.getElementById('filtered-projects-grid');
    const filteredTitle = document.getElementById('filtered-view-title');
    const filterTabs = document.querySelectorAll('#category-filters .filter-pill');
    const searchInput = document.getElementById('project-search');

    if (!featuredGrid || !allList) return;

    if (typeof getProcessedRepos !== 'function') {
        featuredGrid.innerHTML = '<div style="color: red; text-align: center; grid-column: 1/-1;">Error: github.js is missing.</div>';
        allList.innerHTML = '<div style="color: red; text-align: center;">Error: github.js is missing.</div>';
        if (recentGrid) recentGrid.innerHTML = '<div style="color: red; text-align: center; grid-column: 1/-1;">Error: github.js is missing.</div>';
        return;
    }

    const { featured, all } = await getProcessedRepos();

    // Track current state
    let currentCategory = 'All';
    let currentSearchQuery = '';

    // ==========================================
    // Render Default View (Recent + Featured + All)
    // ==========================================
    function renderDefaultView() {
        // Recent Works (Top 3 recently updated, excluding portfolio repo)
        if (recentGrid) {
            recentGrid.innerHTML = '';
            const recentRepos = all.filter(r => r.name !== 'Sagar201003.github.io').slice(0, 3);
            if (recentRepos.length === 0) {
                recentGrid.innerHTML = renderEmptyState('No recent projects found.');
            } else {
                recentRepos.forEach((repo, index) => {
                    recentGrid.insertAdjacentHTML('beforeend', createCardHTML(repo, index, true));
                });
            }
        }

        // Featured Projects
        featuredGrid.innerHTML = '';
        if (featured.length === 0) {
            featuredGrid.innerHTML = renderEmptyState('No featured projects found.');
        } else {
            featured.forEach((repo, index) => {
                featuredGrid.insertAdjacentHTML('beforeend', createCardHTML(repo, index + 3));
            });
        }

        // All Projects (compact list)
        renderAllProjectsList(all);
    }

    function renderAllProjectsList(repos) {
        allList.innerHTML = '';
        if (repos.length === 0) {
            allList.innerHTML = renderEmptyState('No projects match your search.');
            return;
        }
        repos.forEach(repo => {
            allList.insertAdjacentHTML('beforeend', createRowHTML(repo));
        });
    }

    // ==========================================
    // Render Filtered View (Category Cards)
    // ==========================================
    function renderFilteredView(category, searchQuery = '') {
        let filteredRepos = all.filter(repo => categorizeRepo(repo) === category);

        // Apply search within category
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filteredRepos = filteredRepos.filter(repo => {
                const name = (repo.name || '').toLowerCase();
                const desc = (repo.description || '').toLowerCase();
                return name.includes(q) || desc.includes(q);
            });
        }

        const icon = categoryIcons[category] || '📦';
        filteredTitle.textContent = `${icon} ${category} Projects (${filteredRepos.length})`;

        filteredGrid.innerHTML = '';
        if (filteredRepos.length === 0) {
            filteredGrid.innerHTML = renderEmptyState(`No projects found in "${category}"${searchQuery ? ` matching "${searchQuery}"` : ''}.`);
        } else {
            filteredRepos.forEach((repo, index) => {
                filteredGrid.insertAdjacentHTML('beforeend', createCardHTML(repo, index, false));
            });
        }
    }

    // ==========================================
    // View Switching Logic
    // ==========================================
    function switchToDefaultView() {
        filteredView.style.display = 'none';
        defaultView.style.opacity = '0';
        defaultView.style.display = 'block';
        // Trigger reflow, then fade in
        requestAnimationFrame(() => {
            defaultView.style.transition = 'opacity 0.3s ease';
            defaultView.style.opacity = '1';
        });
    }

    function switchToFilteredView(category) {
        defaultView.style.display = 'none';
        filteredView.style.opacity = '0';
        filteredView.style.display = 'block';
        renderFilteredView(category, currentSearchQuery);
        // Trigger reflow, then fade in
        requestAnimationFrame(() => {
            filteredView.style.transition = 'opacity 0.3s ease';
            filteredView.style.opacity = '1';
        });
    }

    // ==========================================
    // Tab Click Handlers
    // ==========================================
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            currentCategory = tab.getAttribute('data-category');

            if (currentCategory === 'All') {
                switchToDefaultView();
                // Apply search to default all-list if there is a query
                if (currentSearchQuery) {
                    const q = currentSearchQuery.toLowerCase();
                    const filtered = all.filter(repo => {
                        const name = (repo.name || '').toLowerCase();
                        const desc = (repo.description || '').toLowerCase();
                        return name.includes(q) || desc.includes(q);
                    });
                    renderAllProjectsList(filtered);
                }
            } else {
                switchToFilteredView(currentCategory);
            }
        });
    });

    // ==========================================
    // Search Bar Integration
    // ==========================================
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.trim();

            if (currentCategory === 'All') {
                // In default view, filter the All Projects list
                if (currentSearchQuery) {
                    const q = currentSearchQuery.toLowerCase();
                    const filtered = all.filter(repo => {
                        const name = (repo.name || '').toLowerCase();
                        const desc = (repo.description || '').toLowerCase();
                        return name.includes(q) || desc.includes(q);
                    });
                    renderAllProjectsList(filtered);
                } else {
                    renderAllProjectsList(all);
                }
            } else {
                // In filtered view, re-render with search
                renderFilteredView(currentCategory, currentSearchQuery);
            }
        });
    }

    // ==========================================
    // Initial Render
    // ==========================================
    renderDefaultView();
});

// ==========================================
// Utility: Language Colors
// ==========================================
function getLanguageColor(lang) {
    const colors = {
        "Python": "#3572A5",
        "Jupyter Notebook": "#DA5B0B",
        "JavaScript": "#f1e05a",
        "TypeScript": "#3178c6",
        "HTML": "#e34c26",
        "CSS": "#563d7c",
        "C++": "#f34b7d",
        "C": "#555555",
        "Java": "#b07219",
        "Rust": "#dea584",
        "Go": "#00ADD8"
    };
    return colors[lang] || "#64c8ff";
}
