document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('project-detail-dynamic-container');
    const urlParams = new URLSearchParams(window.location.search);
    const repoName = urlParams.get('repo');

    if (!repoName) {
        container.innerHTML = '<div style="text-align: center; padding: 10rem 2rem; color: #f43f5e;">Error: No repository specified. <a href="projects.html" style="color: #64c8ff;">Go back to projects</a></div>';
        return;
    }

    if (typeof fetchReadme !== 'function') {
        container.innerHTML = '<div style="color: red; text-align: center; padding: 10rem;">Error: github.js is missing.</div>';
        return;
    }

    try {
        // Fetch repo details directly
        const repoResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}`);
        if (!repoResponse.ok) throw new Error("Repository not found");
        const repo = await repoResponse.json();

        // Fetch README
        const readmeMarkdown = await fetchReadme(repoName);
        
        // Parse markdown if exists
        const readmeHtml = readmeMarkdown ? marked.parse(readmeMarkdown) : '<p style="text-align: center; color: #94a3b8; padding: 3rem;">No README.md available for this repository.</p>';

        const langColor = repo.language ? getLanguageColor(repo.language) : '#64c8ff';
        const title = formatRepoName(repo.name);
        const tagsHtml = (repo.topics || []).map(t => `<span class="tech-badge">${t}</span>`).join('');
        const demoBtn = repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-primary btn-demo-large"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>Live Demo</a>` : '';

        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        container.innerHTML = `
            <!-- Header -->
            <header class="project-detail-header">
                <div class="container">
                    <div class="project-detail-meta" style="display: flex; justify-content: center; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                        <span class="blog-category" style="display:inline-block; border-color: ${langColor}; color: ${langColor}; background: ${langColor}15;">${repo.language || 'Code'}</span>
                        <span style="color: #94a3b8;">Updated: ${updatedDate}</span>
                        <div style="display: flex; align-items: center; gap: 0.3rem; color: #f59e0b;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            <span>${repo.stargazers_count}</span>
                        </div>
                    </div>
                    <h1 class="project-detail-title">${title}</h1>
                    <p style="color: #94a3b8; font-size: 1.2rem; max-width: 800px; margin: 1rem auto 2rem;">${repo.description || ''}</p>
                    
                    <div class="tech-stack detail-stack">
                        ${tagsHtml}
                    </div>

                    <div class="project-detail-actions">
                        ${demoBtn}
                        <a href="${repo.html_url}" target="_blank" class="btn btn-secondary btn-github-large">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"></path></svg>
                            GitHub Repo
                        </a>
                    </div>
                </div>
            </header>

            <!-- Banner -->
            <div class="project-banner-container">
                <div class="project-banner-gradient" style="background: linear-gradient(180deg, ${langColor} 0%, rgba(10,10,15,1) 100%); opacity: 0.3;"></div>
            </div>

            <!-- Case Study Content (README) -->
            <main class="case-study-content container" style="max-width: 900px; padding-bottom: 5rem;">
                <div class="markdown-body article-body">
                    ${readmeHtml}
                </div>
                
                <div style="margin-top: 4rem; text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 3rem;">
                    <a href="projects.html" class="btn btn-primary" style="padding: 1rem 3rem;">&larr; Back to Projects</a>
                </div>
            </main>
        `;

        // Slight styling adjustments for markdown elements dynamically rendered
        setTimeout(() => {
            const mdBody = document.querySelector('.markdown-body');
            if(mdBody) {
                const imgs = mdBody.querySelectorAll('img');
                imgs.forEach(img => {
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '12px';
                    img.style.marginTop = '2rem';
                    img.style.marginBottom = '2rem';
                });
            }
        }, 100);

    } catch (error) {
        container.innerHTML = `<div style="text-align: center; padding: 10rem 2rem; color: #f43f5e;">Error loading project: ${error.message} <br><br> <a href="projects.html" style="color: #64c8ff;">Go back to projects</a></div>`;
    }
});

// Duplicated here just in case, though projects.js also has it.
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

function formatRepoName(name) {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
