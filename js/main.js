/* ============================================
   Mubarak Kasim Portfolio — Main JS
   ============================================ */

// ─── Mobile Navigation Toggle ───────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        if (navLinks) navLinks.classList.toggle('show-mobile');
        hamburger.classList.toggle('active');
    });
}

// ─── Theme (light/dark) toggle with persistence ────
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    }
}

// Initialize theme
(function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return setTheme(saved);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
})();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = htmlEl.getAttribute('data-theme') || 'light';
        setTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ─── Smooth Scrolling for Navigation Links ──────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.classList.remove('show-mobile');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        }
    });
});

// ─── Active Nav Link on Scroll ──────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
            navAnchors.forEach(a => {
                a.classList.remove('active');
                if (a.getAttribute('href') === '#' + id) {
                    a.classList.add('active');
                }
            });
        }
    });
}

// ─── Navbar Scroll Effect ───────────────────────────
const navbar = document.getElementById('main-nav');

function onScroll() {
    updateActiveNav();
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── Contact Form Handling ──────────────────────────
const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.email || !data.message) {
            if (statusEl) statusEl.textContent = 'Please complete all fields.';
            return;
        }

        const endpoint = this.action;

        try {
            if (endpoint) {
                if (statusEl) statusEl.textContent = 'Sending...';
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    if (statusEl) statusEl.textContent = 'Message sent — thank you! 🎉';
                    this.reset();
                } else {
                    let errMsg = 'Failed to send message.';
                    try { const json = await res.json(); if (json && json.error) errMsg = json.error; } catch (_) { }
                    if (statusEl) statusEl.textContent = errMsg;
                }
            } else {
                const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
                const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
                window.location.href = `mailto:khankingmubcy@gmail.com?subject=${subject}&body=${body}`;
                if (statusEl) statusEl.textContent = 'Opening your mail client...';
            }
        } catch (err) {
            console.error('Contact form error', err);
            if (statusEl) statusEl.textContent = 'An error occurred sending the message.';
        }
    });
}

// ─── Hero Role Rotator ──────────────────────────────
const roles = [
    'Software Engineer',
    'Web Application Developer',
    'Data Analyst',
    'Mathematics Teacher',
    'Laravel Expert',
    'Yii2 Developer',
    'Business Solutions Architect'
];

const roleRotator = document.getElementById('role-rotator');
if (roleRotator) {
    let roleIndex = 0;
    setInterval(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleRotator.style.opacity = '0';
        roleRotator.style.transform = 'translateY(8px)';
        setTimeout(() => {
            roleRotator.textContent = roles[roleIndex];
            roleRotator.style.opacity = '1';
            roleRotator.style.transform = 'translateY(0)';
        }, 300);
    }, 3000);
    roleRotator.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
}

// ─── Stat Counter Animation ─────────────────────────
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseInt(counter.dataset.count, 10);
        const duration = 2000;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            counter.textContent = Math.round(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
                counter.dataset.animated = 'true';
            }
        }
        requestAnimationFrame(update);
    });
}

// Use IntersectionObserver for counters
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(statsSection);
}

// ─── Scroll-Reveal Animation ────────────────────────
const fadeElements = document.querySelectorAll(
    '.service-card, .project-card, .tech-card, .edu-card, .timeline-item, .about-paragraph, .about-photo-wrapper'
);

fadeElements.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

fadeElements.forEach(el => fadeObserver.observe(el));

// ─── Hero Particle Canvas ───────────────────────────
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrameId;

    function resizeCanvas() {
        const hero = canvas.parentElement;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor(canvas.width * canvas.height / 12000), 80);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
            ctx.fill();

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(180, 180, 180, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animFrameId = requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Stop animation when hero is no longer visible for perf
    const heroSection = document.getElementById('home');
    if (heroSection) {
        const heroObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!animFrameId) drawParticles();
                } else {
                    cancelAnimationFrame(animFrameId);
                    animFrameId = null;
                }
            });
        }, { threshold: 0 });
        heroObs.observe(heroSection);
    }
}
