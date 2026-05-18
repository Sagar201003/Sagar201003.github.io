const MANUAL_OVERRIDES = {
    "Diabetes-Prediction": "MLOps",
    "DiabetesPredictionPart2": "MLOps",
    "HeartDisPred": "Full Stack",
    "TitanicSurvivalPrediction": "Full Stack",
    "BreastCancerClassification": "Full Stack",
    "ParkinsonPredictor": "Full Stack",
    "Sagar201003.github.io": "Full Stack"
};

function categorizeRepo(repo) {
    if (MANUAL_OVERRIDES[repo.name]) return MANUAL_OVERRIDES[repo.name];
    
    const searchString = (repo.name + " " + (repo.description || "") + " " + (repo.topics || []).join(" ")).toLowerCase();
    
    if (searchString.match(/yolo|gan|pose|mask|detection|opencv|image|vision|cv|resnet/)) return "Computer Vision";
    if (searchString.match(/nlp|llm|rag|gpt|text|language/)) return "NLP/LLMs";
    if (searchString.match(/prediction|classification|predictor|ml|dataset/)) return "MLOps";
    if (searchString.match(/django|next\.js|web|app|ecommerce|portfolio/)) return "Full Stack";
    
    return "Other";
}

// Define beautiful vibrant gradients for the cards
const beautifulGradients = [
    "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", // Purple to Pink
    "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)", // Blue to Teal
    "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", // Orange to Red
    "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", // Violet to Blue
    "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"  // Emerald to Blue
];

function createCardHTML(repo, index) {
    const gradient = beautifulGradients[index % beautifulGradients.length];
    const title = formatRepoName(repo.name);
    const desc = repo.description || "No description provided.";
    const topics = repo.topics || [];
    const tagsHtml = topics.slice(0, 4).map(t => `<span class="tech-badge">${t}</span>`).join('');
    
    return `
        <div class="project-card">
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

document.addEventListener('DOMContentLoaded', async () => {
    const featuredGrid = document.getElementById('featured-projects-grid');
    const recentGrid = document.getElementById('recent-projects-grid');
    const allList = document.getElementById('all-projects-list');
    const filterTabs = document.querySelectorAll('#category-filters .filter-pill');

    if (!featuredGrid || !allList) return;

    if (typeof getProcessedRepos !== 'function') {
        featuredGrid.innerHTML = '<div style="color: red; text-align: center; grid-column: 1/-1;">Error: github.js is missing.</div>';
        allList.innerHTML = '<div style="color: red; text-align: center;">Error: github.js is missing.</div>';
        if(recentGrid) recentGrid.innerHTML = '<div style="color: red; text-align: center; grid-column: 1/-1;">Error: github.js is missing.</div>';
        return;
    }

    const { featured, all } = await getProcessedRepos();

    // Render Recent Works (Top 3 recently updated)
    if (recentGrid) {
        recentGrid.innerHTML = '';
        const recentRepos = all.slice(0, 3);
        if (recentRepos.length === 0) {
            recentGrid.innerHTML = '<div style="color: #94a3b8; text-align: center; grid-column: 1/-1;">No recent projects found.</div>';
        } else {
            recentRepos.forEach((repo, index) => {
                recentGrid.insertAdjacentHTML('beforeend', createCardHTML(repo, index));
            });
        }
    }

    // Render Featured
    featuredGrid.innerHTML = '';
    if (featured.length === 0) {
        featuredGrid.innerHTML = '<div style="color: #94a3b8; text-align: center; grid-column: 1/-1;">No featured projects found.</div>';
    } else {
        featured.forEach((repo, index) => {
            featuredGrid.insertAdjacentHTML('beforeend', createCardHTML(repo, index + 3)); // Offset colors
        });
    }

    // Function to render the All Projects list
    function renderAllProjects(reposToRender) {
        allList.innerHTML = '';
        if (reposToRender.length === 0) {
            allList.innerHTML = '<div style="color: #94a3b8; text-align: center;">No projects found in this category.</div>';
            return;
        }

        reposToRender.forEach(repo => {
            const langColor = getLanguageColor(repo.language);
            const title = formatRepoName(repo.name);
            const desc = repo.description || "No description provided.";
            const lang = repo.language || "Unknown";
            const categoryBadge = `<span class="tech-badge" style="background: rgba(255,255,255,0.1); margin-bottom: 0.5rem; display: inline-block;">${categorizeRepo(repo)}</span>`;
            
            const row = `
                <a href="project-detail.html?repo=${repo.name}" class="project-list-row">
                    <div class="row-main">
                        <h3 class="row-title">${title}</h3>
                        ${categoryBadge}
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
            allList.insertAdjacentHTML('beforeend', row);
        });
    }

    // Initial render of all projects
    renderAllProjects(all);

    // Setup Filter Tabs functionality
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            filterTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked
            tab.classList.add('active');

            const selectedCategory = tab.getAttribute('data-category');
            
            if (selectedCategory === 'All') {
                renderAllProjects(all);
            } else {
                const filteredRepos = all.filter(repo => categorizeRepo(repo) === selectedCategory);
                renderAllProjects(filteredRepos);
            }
        });
    });
});

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
    return colors[lang] || "#64c8ff"; // default to electric blue
}
