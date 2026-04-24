async function attemptLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();
    const err = document.getElementById('login-error');
    
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });
        
        const data = await res.json();
        
        if (res.ok && data.token) {
            localStorage.setItem('skating_admin_auth_token', data.token);
            window.location.href = 'admin.html';
        } else {
            err.innerText = data.error || "Invalid credentials";
            err.style.display = 'block';
        }
    } catch(e) {
        console.error(e);
        err.innerText = "Server connection failed.";
        err.style.display = 'block';
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        attemptLogin();
    }
});
