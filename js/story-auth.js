// Authentication Gate for My Story Page
// Only allows access to: Fatima, Ameerah, Husna, Maishanu

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // Allowed names (case-insensitive)
    const allowedNames = ['fatima', 'ameerah', 'husna', 'maishanu'];

    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('storyAuth') === 'true';

    if (isAuthenticated) {
        return; // User already authenticated, allow access
    }

    // Create authentication overlay
    const authHTML = `
        <div id="auth-gate" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        ">
            <div style="
                background: var(--bg-card, #fff);
                padding: 3rem 2.5rem;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 1.5rem;
                    background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    color: white;
                ">
                    <i class="fas fa-lock"></i>
                </div>
                
                <h2 style="
                    font-size: 2rem;
                    color: var(--text-main, #0f172a);
                    margin-bottom: 0.75rem;
                ">Private Content</h2>
                
                <div style="
                    display: inline-block;
                    padding: 0.5rem 1.5rem;
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: #78350f;
                    font-weight: 700;
                    font-size: 0.85rem;
                    border-radius: 20px;
                    margin-bottom: 1.5rem;
                    letter-spacing: 1px;
                ">BETA VERSION</div>
                
                <p style="
                    color: var(--text-muted, #475569);
                    font-size: 1.05rem;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                ">This is a personal story currently in development. Access is restricted to close family and friends.</p>
                
                <form id="auth-form" style="margin-bottom: 1.5rem;">
                    <label style="
                        display: block;
                        text-align: left;
                        color: var(--text-main, #0f172a);
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    ">What is your name?</label>
                    <input type="text" id="auth-name" placeholder="Enter your name" required autocomplete="off" style="
                        width: 100%;
                        padding: 1rem;
                        background: var(--bg-surface, #f8fafc);
                        border: 2px solid var(--border-color, #e2e8f0);
                        border-radius: 10px;
                        color: var(--text-main, #0f172a);
                        font-size: 1rem;
                        margin-bottom: 1rem;
                        transition: all 0.3s ease;
                    ">
                    <button type="submit" style="
                        width: 100%;
                        padding: 1rem;
                        background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
                        color: white;
                        border: none;
                        border-radius: 10px;
                        font-weight: 600;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-unlock-alt"></i> Request Access
                    </button>
                </form>
                
                <div id="auth-message" style="
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    display: none;
                "></div>
                
                <a href="index.html" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--primary-color, #2563eb);
                    font-weight: 600;
                    text-decoration: none;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-arrow-left"></i> Back to Home
                </a>
            </div>
        </div>
    `;

    // Insert auth gate into page
    document.body.insertAdjacentHTML('afterbegin', authHTML);

    // Hide main content
    const mainContent = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (mainContent) {
        mainContent.style.display = 'none';
    }
    if (header) {
        header.style.display = 'none';
    }
    if (footer) {
        footer.style.display = 'none';
    }

    // Handle form submission
    const authForm = document.getElementById('auth-form');
    const authInput = document.getElementById('auth-name');
    const authMessage = document.getElementById('auth-message');

    authForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const enteredName = authInput.value.trim().toLowerCase();

        if (allowedNames.includes(enteredName)) {
            // Access granted
            authMessage.style.display = 'block';
            authMessage.style.background = '#d1fae5';
            authMessage.style.color = '#065f46';
            authMessage.innerHTML = '<i class="fas fa-check-circle"></i> Access Granted! Welcome...';

            // Store authentication in session
            sessionStorage.setItem('storyAuth', 'true');

            // Remove auth gate and show content
            setTimeout(() => {
                document.getElementById('auth-gate').remove();
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                if (header) {
                    header.style.display = 'block';
                }
                if (footer) {
                    footer.style.display = 'block';
                }
            }, 1500);
        } else {
            // Access denied
            authMessage.style.display = 'block';
            authMessage.style.background = '#fee2e2';
            authMessage.style.color = '#991b1b';
            authMessage.innerHTML = '<i class="fas fa-times-circle"></i> Access Denied. This content is private.';

            // Redirect to home after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        #auth-name:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        #auth-form button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }
    `;
    document.head.appendChild(style);
});
