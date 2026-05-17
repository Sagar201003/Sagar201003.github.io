// Typewriter Effect
const roles = ["AI/ML Engineer", "MLOps Practitioner", "Computer Vision Engineer", "Data Scientist"];
const typeWriterElement = document.getElementById('typewriter');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentRole = roles[roleIndex];

    // Determine the text to display based on deleting state
    if (isDeleting) {
        typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40; // Faster deleting
    } else {
        typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100; // Normal typing
    }

    // Logic to switch words and states
    if (!isDeleting && charIndex === currentRole.length) {
        // Word is fully typed, pause before deleting
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        // Word is fully deleted, switch to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before typing next word

        // Update prefix ("a" vs "an") dynamically if needed, though "I am an AI/ML Engineer" handles mostly.
        // Let's refine the grammar for the prefix
        const nextRole = roles[roleIndex];
        const prefixElem = document.querySelector('.role-prefix');
        if (['A', 'E', 'I', 'O', 'U'].includes(nextRole.charAt(0))) {
            prefixElem.textContent = "I am an ";
        } else {
            prefixElem.textContent = "I am a ";
        }
    }

    setTimeout(typeWriter, typeSpeed);
}

// Start typewriter effect after initial load
if (typeWriterElement) {
    setTimeout(typeWriter, 1200);
}


// Animated Neural Network Particle Background
const canvas = document.getElementById('neural-bg');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const connectionDistance = 140;
const particleCount = Math.floor(window.innerWidth / 15); // Dynamic particle count based on screen size
let mouse = { x: null, y: null };

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.baseRadius = Math.random() * 1.5 + 0.5;
        this.radius = this.baseRadius;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#64c8ff';
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const count = Math.min(Math.floor(window.innerWidth * window.innerHeight / 12000), 120); // Responsive max 120
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        // Connect to mouse
        if (mouse.x != null && mouse.y != null) {
            const dxMouse = particles[i].x - mouse.x;
            const dyMouse = particles[i].y - mouse.y;
            const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

            if (distanceMouse < 180) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                const alpha = 1 - (distanceMouse / 180);
                ctx.strokeStyle = `rgba(100, 200, 255, ${alpha * 0.6})`;
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Slight attraction to mouse
                particles[i].x -= dxMouse * 0.015;
                particles[i].y -= dyMouse * 0.015;
            }
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const alpha = 1 - (distance / connectionDistance);
                // Mix of accent violet and blue for lines
                ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.4})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Event Listeners
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Initialize
resizeCanvas();
initParticles();
animate();

// Navbar Scroll & Mobile Menu
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Global Helper for Date Formatting
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Fetch Latest Hashnode Articles for Homepage
document.addEventListener('DOMContentLoaded', async () => {
    const latestContainer = document.getElementById('latest-articles-container');
    if (!latestContainer) return; // Only run on index.html where this container exists

    if (typeof fetchHashnodePosts !== 'function') {
        latestContainer.innerHTML = '<div style="color: red; text-align: center; padding: 2rem; width: 100%;">Error: hashnode.js is missing.</div>';
        return;
    }

    const posts = await fetchHashnodePosts(3); // Fetch only top 3

    if (posts.length === 0) {
        latestContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: #94a3b8; width: 100%;">No articles found. Please check your Hashnode username.</div>';
        return;
    }

    latestContainer.innerHTML = ''; // clear loading text

    posts.forEach(post => {
        const tag = post.tags && post.tags.length > 0 ? post.tags[0].name : "Article";
        const date = formatDate(post.publishedAt);

        const articleHtml = `
            <article class="blog-card" onclick="window.location.href='blog-post.html?slug=${post.slug}'" style="cursor: pointer;">
                <div class="blog-card-content">
                    <div class="blog-meta">
                        <span class="blog-category">${tag}</span>
                        <span class="blog-date">${date}</span>
                        <span class="blog-read-time">${post.readTimeInMinutes} min read</span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.brief}</p>
                    <a href="blog-post.html?slug=${post.slug}" class="read-more">Read More &rarr;</a>
                </div>
            </article>
        `;
        latestContainer.insertAdjacentHTML('beforeend', articleHtml);
    });
});

// Fetch Featured GitHub Projects for Homepage
document.addEventListener('DOMContentLoaded', async () => {
    const featuredContainer = document.getElementById('homepage-featured-projects');
    if (!featuredContainer) return;

    if (typeof getProcessedRepos !== 'function') {
        featuredContainer.innerHTML = '<div style="color: red; text-align: center; grid-column: 1/-1;">Error: github.js is missing.</div>';
        return;
    }

    try {
        const { featured } = await getProcessedRepos();

        featuredContainer.innerHTML = ''; // clear loading text

        if (!featured || featured.length === 0) {
            featuredContainer.innerHTML = '<div style="text-align: center; color: #94a3b8; grid-column: 1/-1;">No featured projects found.</div>';
            return;
        }

        // Define beautiful vibrant gradients for the cards
        const beautifulGradients = [
            "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", // Purple to Pink
            "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)", // Blue to Teal
            "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)", // Orange to Red
            "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)", // Violet to Blue
            "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)"  // Emerald to Blue
        ];

        featured.forEach((repo, index) => {
            const gradient = beautifulGradients[index % beautifulGradients.length];
            const title = typeof formatRepoName === 'function' ? formatRepoName(repo.name) : repo.name;
            const desc = repo.description || "No description provided.";
            const topics = repo.topics || [];
            const tagsHtml = topics.slice(0, 4).map(t => `<span class="tech-badge">${t}</span>`).join('');

            const card = `
                <div class="project-card">
                    <div class="card-banner" style="background: ${gradient}; position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px); background-size: 12px 12px;"></div>
                    </div>
                    <div class="card-content">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h3 class="project-title">${title}</h3>
                        <div class="row-stars" style="color: #f59e0b; display: flex; align-items: center; gap: 0.3rem;">
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
            featuredContainer.insertAdjacentHTML('beforeend', card);
        });
    } catch (err) {
        console.error(err);
        featuredContainer.innerHTML = `<div style="text-align: center; color: #f43f5e; grid-column: 1/-1;">Error rendering projects: ${err.message}</div>`;
    }
});

// ==========================================
// Contact Form Submission (Google Sheets + WhatsApp)
// ==========================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 🚨 IMPORTANT: Replace this URL with your Google Apps Script Web App URL!
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwas_z5rZlhcYQDcyTkBZ2iSlh8Ma6_AZGPq4ZUq4_w0d3gHvdyxrkFkvOInht_-ydt/exec';

        const btn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const statusDiv = document.getElementById('formStatus');

        // Check Honeypot (Anti-spam)
        const honeypot = contactForm.querySelector('input[name="_honeypot"]').value;
        if (honeypot) {
            console.log("Bot detected.");
            return;
        }

        // UI Loading State
        const originalText = btnText.innerText;
        btnText.innerText = 'Sending...';
        btn.style.opacity = '0.7';
        btn.disabled = true;
        btnIcon.style.display = 'none';

        statusDiv.style.display = 'none';

        const formData = new FormData(contactForm);

        try {
            if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
                throw new Error("Please configure your GOOGLE_SCRIPT_URL in script.js first.");
            }

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                statusDiv.innerText = '✅ Message sent successfully! I will get back to you soon.';
                statusDiv.style.color = '#4ade80';
                statusDiv.style.background = 'rgba(74, 222, 128, 0.1)';
                statusDiv.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error!', error.message);
            statusDiv.innerText = `❌ Error: ${error.message}`;
            statusDiv.style.color = '#f43f5e';
            statusDiv.style.background = 'rgba(244, 63, 94, 0.1)';
            statusDiv.style.display = 'block';
        } finally {
            // Restore UI Button State
            btnText.innerText = originalText;
            btn.style.opacity = '1';
            btn.disabled = false;
            btnIcon.style.display = 'block';
        }
    });
}
