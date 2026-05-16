document.addEventListener('DOMContentLoaded', async () => {
    const filterPills = document.querySelectorAll('#blog-filters .filter-pill');
    const searchInput = document.getElementById('blog-search');
    const gridContainer = document.getElementById('blog-grid-container');
    const featuredContainer = document.getElementById('featured-article-container');

    // Fetch posts from Hashnode (using function from hashnode.js)
    if (typeof fetchHashnodePosts !== 'function') {
        gridContainer.innerHTML = '<div style="color: red; text-align: center; padding: 2rem;">Error: hashnode.js is missing or not loaded.</div>';
        return;
    }

    const posts = await fetchHashnodePosts(10); // Fetch latest 10 posts

    if (posts.length === 0) {
        gridContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8;">No articles found. Please check your Hashnode username.</div>';
        return;
    }

    // Render Featured Post (first post)
    const featuredPost = posts[0];
    const featuredTag = featuredPost.tags && featuredPost.tags.length > 0 ? featuredPost.tags[0].name : "Article";
    const featuredDate = formatDate(featuredPost.publishedAt);
    const featuredImage = featuredPost.coverImage?.url || ''; // You can add a placeholder image here if you want
    
    featuredContainer.innerHTML = `
        <div class="featured-article" data-category="${featuredTag.toLowerCase()}">
            <div class="featured-banner" style="background-image: url('${featuredImage}'); background-size: cover; background-position: center;"></div>
            <div class="featured-content">
                <span class="blog-category" style="margin-bottom: 1.5rem; display: inline-block;">${featuredTag}</span>
                <h2 class="featured-title">${featuredPost.title}</h2>
                <p class="featured-excerpt">${featuredPost.brief}</p>
                <div class="featured-meta">
                    <span>${featuredDate}</span>
                    <span class="dot-separator">•</span>
                    <span>${featuredPost.readTimeInMinutes} min read</span>
                </div>
                <a href="blog-post.html?slug=${featuredPost.slug}" class="btn btn-primary" style="margin-top: 1.5rem; padding: 0.8rem 2rem;">Read Article</a>
            </div>
        </div>
    `;

    // Render Grid Posts (remaining posts)
    const gridPosts = posts.slice(1);
    gridContainer.innerHTML = ''; // clear loading text

    gridPosts.forEach(post => {
        const tag = post.tags && post.tags.length > 0 ? post.tags[0].name : "Article";
        const date = formatDate(post.publishedAt);
        
        const articleHtml = `
            <article class="blog-grid-card" data-category="${tag.toLowerCase()}" onclick="window.location.href='blog-post.html?slug=${post.slug}'" style="cursor: pointer;">
                <div class="blog-grid-content">
                    <div class="blog-meta">
                        <span class="blog-category">${tag}</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.brief}</p>
                    <div class="blog-footer-meta">
                        <span class="blog-date">${date}</span>
                        <span class="blog-read-time">${post.readTimeInMinutes} min read</span>
                    </div>
                </div>
            </article>
        `;
        gridContainer.insertAdjacentHTML('beforeend', articleHtml);
    });

    // Re-initialize filtering and search since DOM changed
    const articles = document.querySelectorAll('.blog-grid-card, .featured-article');

    function filterAndSearch() {
        const activePill = document.querySelector('#blog-filters .filter-pill.active');
        const activeFilter = activePill ? activePill.dataset.filter : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        articles.forEach(article => {
            const category = article.dataset.category || '';
            const title = article.querySelector('.blog-title, .featured-title')?.textContent.toLowerCase() || '';
            const desc = article.querySelector('.blog-excerpt, .featured-excerpt')?.textContent.toLowerCase() || '';
            
            const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                article.classList.remove('blog-item-hidden');
                requestAnimationFrame(() => {
                    article.classList.remove('blog-item-filtering');
                });
            } else {
                article.classList.add('blog-item-filtering');
                setTimeout(() => {
                    if (article.classList.contains('blog-item-filtering')) {
                        article.classList.add('blog-item-hidden');
                    }
                }, 300);
            }
        });
    }

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            filterAndSearch();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }
});
