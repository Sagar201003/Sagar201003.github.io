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
