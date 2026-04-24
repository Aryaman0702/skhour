function attemptLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const err = document.getElementById('login-error');
    
    // In a real application, you would NOT hardcode this in client-side JS!
    if (user === 'skatinghour' && pass === '12345678') {
        localStorage.setItem('skating_admin_auth', 'true');
        window.location.href = 'admin.html';
    } else {
        err.style.display = 'block';
    }
}

// Allow pressing enter to login
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        attemptLogin();
    }
});
