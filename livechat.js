if (localStorage.getItem('skating_admin_auth') !== 'true') {
    window.location.href = 'login.html';
}

let lastLogLen = 0;

document.addEventListener('DOMContentLoaded', () => {
    setInterval(pollChat, 1000);
    pollChat();
});

function pollChat() {
    let status = localStorage.getItem('skating_live_chat_status');
    const ind = document.getElementById('chat-indicator');
    const statTxt = document.getElementById('chat-stat-txt');
    
    if (status === 'requested') {
        ind.className = 'chat-status active';
        ind.innerText = 'Live';
        statTxt.innerText = '- Customer is connected and waiting!';
    } else {
        ind.className = 'chat-status';
        ind.innerText = 'Offline';
        statTxt.innerText = '(Waiting for customer requests...)';
        lastLogLen = 0;
        return;
    }
    
    let log = JSON.parse(localStorage.getItem('skating_live_chat_log')) || [];
    if (log.length > lastLogLen) {
        renderChat(log);
        lastLogLen = log.length;
    }
}

function renderChat(log) {
    const box = document.getElementById('live-chat-box');
    box.innerHTML = '';
    
    log.forEach(msg => {
        let div = document.createElement('div');
        div.className = 'cmsg';
        if (msg.sender === 'user') div.classList.add('msg-user');
        else if (msg.sender === 'admin') div.classList.add('msg-admin');
        else div.classList.add('msg-sys');
        
        div.innerText = msg.text;
        box.appendChild(div);
    });
    
    box.scrollTop = box.scrollHeight;
}

function sendAdminMsg() {
    const inp = document.getElementById('admin-chat-input');
    const txt = inp.value.trim();
    if (!txt) return;
    
    let status = localStorage.getItem('skating_live_chat_status');
    if (status !== 'requested') {
        alert("No active session to reply to!");
        return;
    }
    
    let log = JSON.parse(localStorage.getItem('skating_live_chat_log')) || [];
    log.push({sender: 'admin', text: txt});
    localStorage.setItem('skating_live_chat_log', JSON.stringify(log));
    inp.value = '';
    pollChat();
}

function endSession() {
    localStorage.setItem('skating_live_chat_status', 'ended');
    localStorage.setItem('skating_live_chat_log', '[]');
    let box = document.getElementById('live-chat-box');
    box.innerHTML = '<div class="cmsg msg-sys">Session ended by admin.</div>';
    lastLogLen = 0;
}
