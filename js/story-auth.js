// Simple Authentication for My Story Page
// Allowed users: Fatima, Ameerah, Husna, Maishanu

(function () {
    // Check if already authenticated
    if (sessionStorage.getItem('storyAccess') === 'granted') {
        return;
    }

    // Allowed names
    const allowed = ['fatima', 'ameerah', 'husna', 'maishanu'];

    // Ask for name
    const userName = prompt('This page is private.\n\nPlease enter your name to continue:');

    if (!userName) {
        alert('Access denied. Redirecting to home page.');
        window.location.href = 'index.html';
        return;
    }

    // Check if name is allowed
    if (allowed.includes(userName.toLowerCase().trim())) {
        sessionStorage.setItem('storyAccess', 'granted');
        alert('Welcome, ' + userName + '! 👋');
    } else {
        alert('Sorry, this content is private.\nRedirecting to home page.');
        window.location.href = 'index.html';
    }
})();
