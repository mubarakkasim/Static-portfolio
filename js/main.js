// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        // toggle mobile menu using class so CSS can control layout
        if (navLinks) navLinks.classList.toggle('show-mobile');
        hamburger.classList.toggle('active');
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

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Only prevent default if it's a hash link on the same page
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 768 && navLinks) {
                    navLinks.classList.remove('show-mobile');
                    if (hamburger) hamburger.classList.remove('active');
                }
            }
        }
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            if (statusEl) statusEl.textContent = 'Please complete all fields.';
            return;
        }

        const endpoint = this.action;

        try {
            if (endpoint) {
                if (statusEl) statusEl.textContent = 'Sending...';
                
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
                    try { const json = await res.json(); if (json && json.error) errMsg = json.error; } catch (_) { }
                    if (statusEl) statusEl.textContent = errMsg + ' You can try the mail option below.';
                }
            } else {
                // No endpoint configured — fallback to mailto: link (opens user's mail client)
                const subject = encodeURIComponent(`Portfolio contact from ${data.name}`);
                const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
                // Replace with your actual email address for mailto fallback
                window.location.href = `mailto:khankingmubcy@gmail.com?subject=${subject}&body=${body}`;
                if (statusEl) statusEl.textContent = 'Opening your mail client...';
            }
        } catch (err) {
            console.error('Contact form error', err);
            if (statusEl) statusEl.textContent = 'An error occurred sending the message.';
        }
    });
}

// Navbar Scroll Effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        }
    }
});
