const token = localStorage.getItem('skating_admin_auth_token');
if (!token) window.location.href = 'login.html';

let allEnquiries = [];
let currentType = 'Trial';

document.addEventListener('DOMContentLoaded', () => {
    fetchEnquiries();
});

async function fetchEnquiries() {
    try {
        const res = await fetch('/api/enquiries', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) throw new Error('Unauthorized');
        allEnquiries = await res.json();
        renderEnquiries();
    } catch(e) {
        console.error(e);
        window.location.href = 'login.html';
    }
}

function switchTab(type) {
    currentType = type;
    
    // Update button styles
    const tabTrials = document.getElementById('tab-trials');
    const tabEnq = document.getElementById('tab-enquiries');
    
    if (type === 'Trial') {
        tabTrials.style.background = '#0f4cdb'; tabTrials.style.color = '#fff';
        tabEnq.style.background = 'transparent'; tabEnq.style.color = '#0f4cdb';
    } else {
        tabEnq.style.background = '#0f4cdb'; tabEnq.style.color = '#fff';
        tabTrials.style.background = 'transparent'; tabTrials.style.color = '#0f4cdb';
    }
    
    renderEnquiries();
}

function renderEnquiries() {
    const tbody = document.getElementById('enquiries-body');
    if (!tbody) return;
    
    const filtered = allEnquiries.filter(e => {
        if (currentType === 'Trial') return e.type === 'Trial';
        return e.type !== 'Trial'; // Default to Enquiry
    });
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding: 1.5rem; text-align: center; color: #7a90c0; font-size: 0.85rem;">No ${currentType.toLowerCase()}s found.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = filtered.map(e => `
        <tr style="border-bottom: 1px solid #dce4f5;">
            <td style="padding: 0.8rem 0.5rem; font-size:0.75rem; color:#3d5280; white-space:nowrap;">${e.date || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-weight:600; font-size:0.85rem;">${e.name || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;">${e.phone || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;"><a style="color:#0f4cdb; text-decoration:none;" href="mailto:${e.email}">${e.email || '-'}</a></td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;">${e.location || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.8rem; color:#666;">${e.message || '-'}</td>
        </tr>
    `).join('');
}

async function clearEnquiries() {
    if (confirm(`Are you sure you want to clear ALL entries in the database?`)) {
        await fetch('/api/enquiries', {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        fetchEnquiries();
    }
}
