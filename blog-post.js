document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('dynamic-article-container');
    
    // Get slug from URL
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        container.innerHTML = '<div style="text-align: center; padding: 5rem; color: #f43f5e;">Error: No article specified. <a href="blog.html" style="color: #64c8ff;">Go back to blog</a></div>';
        return;
    }

    if (typeof fetchHashnodePostBySlug !== 'function') {
        container.innerHTML = '<div style="color: red; text-align: center; padding: 5rem;">Error: hashnode.js is missing.</div>';
        return;
    }

    // Fetch the article
    const post = await fetchHashnodePostBySlug(slug);

    if (!post) {
        container.innerHTML = '<div style="text-align: center; padding: 5rem; color: #f43f5e;">Article not found. <a href="blog.html" style="color: #64c8ff;">Go back to blog</a></div>';
        return;
    }

    // Prepare data
    const date = formatDate(post.publishedAt);
    const tag = post.tags && post.tags.length > 0 ? post.tags[0].name : "Article";
    const authorName = post.author?.name || "Author";
    const authorPic = post.author?.profilePicture || "";
    const coverImage = post.coverImage?.url || "";
    
    // Generate Tags HTML
    const tagsHtml = post.tags ? post.tags.map(t => `<span class="skill-tag">${t.name}</span>`).join('') : '';

    // Build the HTML
    container.innerHTML = `
        <!-- Header -->
        <header class="article-header">
            <span class="blog-category" style="display: inline-block; margin-bottom: 1rem;">${tag}</span>
            <h1 class="article-title">${post.title}</h1>
            
            <div class="author-meta">
                <div class="author-avatar" style="${authorPic ? `background-image: url('${authorPic}'); background-size: cover;` : ''}">
                    ${!authorPic ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>` : ''}
                </div>
                <div class="author-info">
                    <span class="author-name">${authorName}</span>
                    <div class="author-details">
                        <span>${date}</span>
                        <span class="dot-separator">•</span>
                        <span>${post.readTimeInMinutes} min read</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Banner -->
        ${coverImage ? `<div class="article-banner" style="background-image: url('${coverImage}');"></div>` : '<div class="article-banner"></div>'}

        <!-- Content Layout -->
        <div class="article-layout">
            <div class="article-body">
                ${post.content.html}
            </div>

            <aside class="article-sidebar">
                <div class="toc-container">
                    <h4 class="toc-title">Table of Contents</h4>
                    <nav class="toc-nav" id="toc-nav">
                        <!-- Hashnode HTML contains id attributes on headings, we could parse them dynamically here -->
                        <a href="#" class="toc-link" style="font-size: 0.9em; opacity: 0.7;">TOC is generated dynamically by Hashnode</a>
                    </nav>
                </div>
                <div style="margin-top: 2rem;">
                    <a href="blog.html" class="btn btn-primary" style="width: 100%; text-align: center; padding: 0.8rem;">← Back to Blog</a>
                </div>
            </aside>
        </div>

        <!-- Footer Meta -->
        <div class="article-footer">
            <div class="article-tags">
                ${tagsHtml}
            </div>

            <div class="author-bio-card">
                <div class="bio-avatar" style="${authorPic ? `background-image: url('${authorPic}'); background-size: cover;` : ''}">
                    ${!authorPic ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>` : ''}
                </div>
                <div class="bio-text">
                    <h4>${authorName}</h4>
                    <p>AI/ML Engineer passionate about building robust intelligent systems and writing about the bleeding edge of NLP and Computer Vision.</p>
                </div>
            </div>
        </div>
    `;

    // Wait a tick for HTML to render, then apply syntax highlighting if any code blocks exist
    setTimeout(() => {
        // Find all headings and build TOC dynamically
        const headings = document.querySelectorAll('.article-body h1, .article-body h2, .article-body h3');
        const tocNav = document.getElementById('toc-nav');
        
        if (headings.length > 0 && tocNav) {
            tocNav.innerHTML = '';
            headings.forEach((heading, index) => {
                if (!heading.id) {
                    heading.id = 'heading-' + index;
                }
                const link = document.createElement('a');
                link.href = '#' + heading.id;
                link.className = 'toc-link';
                link.textContent = heading.textContent;
                
                // Indent h3
                if (heading.tagName.toLowerCase() === 'h3') {
                    link.style.paddingLeft = '1.5rem';
                    link.style.fontSize = '0.9em';
                }
                
                tocNav.appendChild(link);
            });
        }
    }, 100);
});
