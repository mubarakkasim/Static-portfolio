// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        // toggle mobile menu using class so CSS can control layout
        if (navLinks) navLinks.classList.toggle('show-mobile');
    });
}

// Theme (light/dark) toggle with persistence
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
        // use solid icons which are available in the free CDN
        themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
}

// initialize theme from localStorage or system preference
(function initTheme(){
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

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.classList.remove('show-mobile');
            }
        }
    });
});

// Form Submission Handler - supports optional `data-endpoint` on the form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const statusEl = document.getElementById('form-status');
        if (statusEl) statusEl.textContent = 'Sending...';

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            if (statusEl) statusEl.textContent = 'Please complete all fields.';
            return;
        }

        const endpoint = (this.dataset && this.dataset.endpoint) ? this.dataset.endpoint.trim() : '';

        try {
            if (endpoint) {
                // POST JSON to the endpoint (Formspree or similar)
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (res.ok) {
                    if (statusEl) statusEl.textContent = 'Message sent — thank you!';
                    this.reset();
                } else {
                    let errMsg = 'Failed to send message.';
                    try { const json = await res.json(); if (json && json.error) errMsg = json.error; } catch (_) {}
                    if (statusEl) statusEl.textContent = errMsg + ' You can try the mail option below.';
                }
            } else {
                // No endpoint configured — fallback to mailto: link (opens user's mail client)
                const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
                const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
                // Replace YOUR_EMAIL_HERE with your email address for mailto fallback
                window.location.href = `mailto:YOUR_EMAIL_HERE?subject=${subject}&body=${body}`;
                if (statusEl) statusEl.textContent = 'Opening your mail client...';
            }
        } catch (err) {
            console.error('Contact form error', err);
            if (statusEl) statusEl.textContent = 'An error occurred sending the message.';
        }
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

/* ---------- Canvas background animation (lightweight particle network) ---------- */
(function canvasBg(){
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpi = window.devicePixelRatio || 1;

    function resize() {
        dpi = window.devicePixelRatio || 1;
        width = canvas.clientWidth * dpi;
        height = canvas.clientHeight * dpi;
        canvas.width = width;
        canvas.height = height;
    }

    // Particles and performance-aware animation control
    const particles = [];
    const BASE_PARTICLE_COUNT = Math.max(20, Math.floor((window.innerWidth * window.innerHeight) / 160000));
    let particleCount = BASE_PARTICLE_COUNT;
    let desiredFPS = 60; // default
    let lastRender = 0;

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function createParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: rand(-0.25, 0.25),
                vy: rand(-0.25, 0.25),
                r: rand(0.6, 1.8)
            });
        }
    }

    function draw(theme) {
        ctx.clearRect(0, 0, width, height);
        const g = ctx.createLinearGradient(0, 0, width, height);
        if (theme === 'dark') {
            g.addColorStop(0, '#051124');
            g.addColorStop(1, '#071225');
        } else {
            g.addColorStop(0, '#f7fbff');
            g.addColorStop(1, '#eef7ff');
        }
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);

        // particles
        ctx.beginPath();
        for (let p of particles) {
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r * dpi, 0, Math.PI * 2);
        }
        ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(16,24,40,0.06)';
        ctx.fill();

        // connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dx = a.x - b.x, dy = a.y - b.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                const maxDist = 120 * dpi;
                if (dist < maxDist) {
                    const alpha = 1 - dist / maxDist;
                    ctx.strokeStyle = theme === 'dark' ? `rgba(255,255,255,${0.06 * alpha})` : `rgba(16,24,40,${0.06 * alpha})`;
                    ctx.lineWidth = 0.7 * dpi;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }
    }

    function step(timestamp) {
        if (!lastRender) lastRender = timestamp;
        const theme = document.documentElement.getAttribute('data-theme');

        if (desiredFPS === 0) {
            // render static background only
            draw(theme);
            return; // stop animation loop entirely
        }

        const msPerFrame = 1000 / desiredFPS;
        if (timestamp - lastRender < msPerFrame) {
            requestAnimationFrame(step);
            return;
        }
        lastRender = timestamp;

        for (let p of particles) {
            p.x += p.vx * dpi;
            p.y += p.vy * dpi;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        draw(theme);
        requestAnimationFrame(step);
    }

    async function assessPerformanceHints() {
        // start with defaults
        let mode = 'normal';

        // Check user override for animation (localStorage)
        const userAnimPref = localStorage.getItem('animation'); // 'on' | 'off' | null

        // prefers-reduced-motion -> disable
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            mode = 'off';
        }

        // save-data hint
        if (navigator.connection && navigator.connection.saveData) {
            mode = 'low';
        }

        // battery check (if supported)
        if (navigator.getBattery) {
            try {
                const battery = await navigator.getBattery();
                if (battery.level !== undefined && battery.level < 0.25 && !battery.charging) {
                    mode = 'low';
                }
                // listen for changes
                battery.addEventListener('levelchange', () => { assessPerformanceHints(); });
                battery.addEventListener('chargingchange', () => { assessPerformanceHints(); });
            } catch (e) {
                // ignore
            }
        }

        // apply user override: if user explicitly turned off animation, honor that (unless user prefers reduced motion)
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            mode = 'off';
        } else if (userAnimPref === 'off') {
            mode = 'off';
        }

        // adjust settings based on mode
        if (mode === 'off') {
            desiredFPS = 0; // stop animation
            particleCount = 0;
        } else if (mode === 'low') {
            desiredFPS = 18;
            particleCount = Math.max(6, Math.floor(BASE_PARTICLE_COUNT * 0.25));
        } else {
            desiredFPS = 60;
            particleCount = BASE_PARTICLE_COUNT;
        }
    }

    function start() {
        resize();
        assessPerformanceHints().then(() => {
            createParticles();
            if (desiredFPS === 0) {
                // draw a single frame and return
                draw(document.documentElement.getAttribute('data-theme'));
            } else {
                requestAnimationFrame(step);
            }
        });
    }

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    // react to connection changes
    if (navigator.connection) {
        navigator.connection.addEventListener('change', () => { assessPerformanceHints(); });
    }

    // restart when theme changes (to repaint gradient/line colors)
    const obs = new MutationObserver(() => { resize(); createParticles(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Listen for manual animation preference changes triggered outside this module
    window.addEventListener('animationprefchange', async () => {
        await assessPerformanceHints();
        // if animation should be off, draw one frame and stop
        if (desiredFPS === 0) {
            draw(document.documentElement.getAttribute('data-theme'));
            return;
        }
        // otherwise ensure particles exist and animation loop is running
        createParticles();
        requestAnimationFrame(step);
    });

    start();
})();

// Animation toggle control (manual on/off) placed outside the canvas module so it's available early
const animToggle = document.getElementById('anim-toggle');
function setAnimationEnabled(enabled) {
    localStorage.setItem('animation', enabled ? 'on' : 'off');
    if (animToggle) {
        animToggle.innerHTML = enabled ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
        animToggle.title = enabled ? 'Disable background animation' : 'Enable background animation';
        animToggle.setAttribute('aria-pressed', String(!enabled));
    }
    // re-evaluate performance hints — this will set desiredFPS accordingly
    // find and call assessPerformanceHints if available (it's in the canvas closure). We'll trigger a global event to notify it.
    window.dispatchEvent(new Event('animationprefchange'));
}

// Initialize anim toggle based on saved preference
(function initAnimToggle(){
    const pref = localStorage.getItem('animation');
    const enabled = pref !== 'off';
    if (animToggle) {
        animToggle.addEventListener('click', () => {
            const nowPref = localStorage.getItem('animation');
            const currentlyEnabled = nowPref !== 'off';
            setAnimationEnabled(!currentlyEnabled);
        });
    }
    setAnimationEnabled(enabled);
})();