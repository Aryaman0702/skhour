if (localStorage.getItem('skating_admin_auth') !== 'true') {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    renderEnquiries();
});

function renderEnquiries() {
    let enquiries = JSON.parse(localStorage.getItem('skating_enquiries')) || [];
    const tbody = document.getElementById('enquiries-body');
    if (!tbody) return;
    
    if (enquiries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="padding: 1.5rem; text-align: center; color: #7a90c0; font-size: 0.85rem;">No database entries yet.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = enquiries.map(e => `
        <tr style="border-bottom: 1px solid #dce4f5;">
            <td style="padding: 0.8rem 0.5rem; font-size:0.75rem; color:#3d5280; white-space:nowrap;">${e.date || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-weight:600; font-size:0.85rem;">${e._subject || e.name || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;">${e.phone || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;"><a style="color:#0f4cdb; text-decoration:none;" href="mailto:${e.email}">${e.email || '-'}</a></td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;">${e.location || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.85rem;">${e.participants || '-'}</td>
            <td style="padding: 0.8rem 0.5rem; font-size:0.8rem; color:#666;">${e.message || '-'}</td>
        </tr>
    `).reverse().join('');
}

function clearEnquiries() {
    if (confirm('Are you sure you want to clear all database entries?')) {
        localStorage.removeItem('skating_enquiries');
        renderEnquiries();
    }
}
