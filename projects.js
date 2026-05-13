document.addEventListener('DOMContentLoaded', () => {
    const filterPills = document.querySelectorAll('.filter-pill');
    const projectCards = document.querySelectorAll('.project-card');
    const searchInput = document.getElementById('project-search');

    if (!filterPills.length || !projectCards.length) return;

    function filterAndSearch() {
        const activePill = document.querySelector('.filter-pill.active');
        const activeFilter = activePill ? activePill.dataset.filter : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

        projectCards.forEach(card => {
            const category = card.dataset.category || '';
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.project-desc')?.textContent.toLowerCase() || '';
            
            const matchesFilter = activeFilter === 'all' || category.includes(activeFilter);
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);

            if (matchesFilter && matchesSearch) {
                // Show card
                card.classList.remove('hidden');
                // Allow a tiny reflow before removing filtering-out for transition
                requestAnimationFrame(() => {
                    card.classList.remove('filtering-out');
                });
            } else {
                // Hide card smoothly
                card.classList.add('filtering-out');
                setTimeout(() => {
                    if (card.classList.contains('filtering-out')) {
                        card.classList.add('hidden');
                    }
                }, 300); // Matches the CSS transition duration
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
