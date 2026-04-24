const token = localStorage.getItem('skating_admin_auth_token');
if (!token) {
    window.location.href = 'login.html';
}const ind = document.getElementById('chat-indicator');
const statTxt = document.getElementById('chat-stat-txt');
const box = document.getElementById('live-chat-box');

let peer = null;
let activeConnections = [];

document.addEventListener('DOMContentLoaded', () => {
    initPeer();
});

function initPeer() {
    // Fixed ID for the admin node
    peer = new Peer('sh-admin-livechat-aryaman-702');

    peer.on('open', (id) => {
        ind.className = 'chat-status active';
        ind.innerText = 'Online';
        statTxt.innerText = '- Waiting for customers...';
    });

    peer.on('connection', (conn) => {
        activeConnections.push(conn);
        statTxt.innerText = `- ${activeConnections.length} Customer(s) connected!`;
        
        // Announce
        appendMsg('sys', `User connected (${conn.peer})`);
        
        conn.on('data', (data) => {
            appendMsg('user', data);
        });

        conn.on('close', () => {
            activeConnections = activeConnections.filter(c => c !== conn);
            statTxt.innerText = activeConnections.length > 0 
                ? `- ${activeConnections.length} Customer(s) connected!`
                : '- Waiting for customers...';
            appendMsg('sys', `User disconnected (${conn.peer})`);
        });
    });

    peer.on('error', (err) => {
        console.error(err);
        if(err.type === 'unavailable-id') {
            statTxt.innerText = '- Admin tab already open elsewhere!';
            ind.className = 'chat-status';
            ind.style.background = '#ff4757';
        } else {
            statTxt.innerText = '- Connection error. Retrying...';
            setTimeout(initPeer, 5000);
        }
    });
}

function appendMsg(sender, text) {
    let div = document.createElement('div');
    div.className = 'cmsg';
    if (sender === 'user') div.classList.add('msg-user');
    else if (sender === 'admin') div.classList.add('msg-admin');
    else div.classList.add('msg-sys');
    
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function sendAdminMsg() {
    const inp = document.getElementById('admin-chat-input');
    const txt = inp.value.trim();
    if (!txt) return;
    
    if (activeConnections.length === 0) {
        alert("No customers connected to reply to!");
        return;
    }
    
    // Broadcast to all active connections
    activeConnections.forEach(conn => {
        conn.send(txt);
    });
    
    appendMsg('admin', txt);
    inp.value = '';
}

function endSession() {
    activeConnections.forEach(conn => conn.close());
    activeConnections = [];
    appendMsg('sys', 'You disconnected all users.');
    statTxt.innerText = '- Waiting for customers...';
}
