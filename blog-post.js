document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.article-body h2');
    const navLinks = document.querySelectorAll('.toc-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let current = sections[0].getAttribute('id');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            // Check if section is past the threshold
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
