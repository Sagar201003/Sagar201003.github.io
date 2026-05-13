document.addEventListener('DOMContentLoaded', () => {
    const filterPills = document.querySelectorAll('#blog-filters .filter-pill');
    const articles = document.querySelectorAll('.blog-grid-card, .featured-article');
    const searchInput = document.getElementById('blog-search');

    if (!filterPills.length || !articles.length) return;

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
                // Show card
                article.classList.remove('blog-item-hidden');
                requestAnimationFrame(() => {
                    article.classList.remove('blog-item-filtering');
                });
            } else {
                // Hide card smoothly
                article.classList.add('blog-item-filtering');
                setTimeout(() => {
                    if (article.classList.contains('blog-item-filtering')) {
                        article.classList.add('blog-item-hidden');
                    }
                }, 300); // Wait for fade out
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
