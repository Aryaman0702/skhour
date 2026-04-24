if (localStorage.getItem('skating_admin_auth') !== 'true') {
    window.location.href = 'login.html';
}

// Initial Data Seed
const initialClasses = [
    { id: '1', location: 'Hamilton', venue: 'Dave Andre Arena, Hamilton', sessions: 'Saturday', timing: '6:30 PM – 7:30 PM', date: 'Mar 21, 28 · Apr 4, 11, 18, 25 · 2026' },
    { id: '2', location: 'Hamilton', venue: 'Dave Andre Arena, Hamilton', sessions: 'Sunday', timing: '1:00 PM | 2:00 PM | 3:00 PM', date: 'Mar 22, 29 · Apr 5, 12, 19, 26 · 2026' },
    { id: '3', location: 'Milton', venue: 'Milton Skating Rink, Milton', sessions: 'Friday', timing: '3:45 AM – 4:35 AM', date: 'Jan 10 – Apr 25, 2026 (every Friday)' },
    { id: '4', location: 'Oakville', venue: 'Cutting Edge Ice Arena, Oakville', sessions: '❄️ Winter · Sun', timing: '12:30 | 1:30 | 2:30 AM', date: 'Jan 12 – Mar 16, 2026 · Ages 3–55' },
    { id: '5', location: 'Oakville', venue: 'Cutting Edge Ice Arena, Oakville', sessions: '🏆 Advanced · Sun', timing: '3:30 AM', date: 'Jan 12 – Mar 16 · Ages 6–40 · Approval req.' },
    { id: '6', location: 'Oakville', venue: 'Cutting Edge Ice Arena, Oakville', sessions: '🌸 Spring · Sun', timing: '12:30 | 1:30 | 2:30 AM', date: 'Mar 23 – May 4, 2026' },
    { id: '7', location: 'Oakville', venue: 'Cutting Edge Ice Arena, Oakville', sessions: '🏆 Spring Adv · Sun', timing: '3:30 AM', date: 'Mar 23 – May 4 · Ages 5–17' }
];

let classes;
try {
    classes = JSON.parse(localStorage.getItem('skating_classes')) || initialClasses;
} catch (e) {
    console.error("Error parsing classes:", e);
    classes = initialClasses;
}

// DOM Elements
const classListContainer = document.getElementById('class-list-container');
const modalOverlay = document.getElementById('modal-overlay');
const classForm = document.getElementById('class-form');
const modalTitle = document.getElementById('modal-title');
const adminMsg = document.getElementById('admin-msg');

function renderClasses() {
    classListContainer.innerHTML = '';
    
    if (classes.length === 0) {
        classListContainer.innerHTML = '<div style="text-align: center; padding: 3rem; color: #888;">No classes found. Add your first class above!</div>';
        return;
    }

    // Sort classes by location then by date/day
    const sortedClasses = [...classes].sort((a, b) => a.location.localeCompare(b.location));

    sortedClasses.forEach(c => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.innerHTML = `
            <div class="class-info">
                <h4>${c.location} — ${c.venue}</h4>
                <div class="class-meta">
                    <span><strong>Day:</strong> ${c.sessions}</span>
                    <span><strong>Time:</strong> ${c.timing}</span>
                    <span><strong>Date:</strong> ${c.date}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-icon btn-edit" onclick="editClass('${c.id}')" title="Edit Class">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteClass('${c.id}')" title="Delete Class">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;
        classListContainer.appendChild(card);
    });
}

function openModal(id = null) {
    if (id) {
        const c = classes.find(item => item.id === id);
        if (c) {
            modalTitle.innerText = "Edit Class";
            document.getElementById('form-id').value = c.id;
            document.getElementById('form-location').value = c.location;
            document.getElementById('form-venue').value = c.venue;
            document.getElementById('form-sessions').value = c.sessions;
            document.getElementById('form-timing').value = c.timing;
            document.getElementById('form-date').value = c.date;
        }
    } else {
        modalTitle.innerText = "Add New Class";
        classForm.reset();
        document.getElementById('form-id').value = '';
    }
    modalOverlay.classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
}

modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) closeModal();
};

classForm.onsubmit = (e) => {
    e.preventDefault();
    
    const id = document.getElementById('form-id').value;
    const classData = {
        id: id || Date.now().toString(),
        location: document.getElementById('form-location').value,
        venue: document.getElementById('form-venue').value,
        sessions: document.getElementById('form-sessions').value,
        timing: document.getElementById('form-timing').value,
        date: document.getElementById('form-date').value
    };

    if (id) {
        // Update
        const index = classes.findIndex(c => c.id === id);
        if (index !== -1) classes[index] = classData;
    } else {
        // Add
        classes.push(classData);
    }

    save();
    closeModal();
    renderClasses();
    showMsg('Class saved successfully!');
};

function deleteClass(id) {
    if (confirm('Are you sure you want to delete this class?')) {
        classes = classes.filter(c => c.id !== id);
        save();
        renderClasses();
        showMsg('Class deleted successfully!');
    }
}

function editClass(id) {
    openModal(id);
}

function save() {
    localStorage.setItem('skating_classes', JSON.stringify(classes));
    // Also build the legacy HTML strings for the frontend for backward compatibility
    syncToLegacyFormat();
}

function syncToLegacyFormat() {
    const legacySchedules = {
        hamilton: '',
        milton: '',
        oakville: ''
    };

    classes.forEach(c => {
        const html = `<div class="ls"><strong>${c.sessions} · ${c.timing}</strong>${c.date}</div>\n`;
        const key = c.location.toLowerCase();
        if (legacySchedules.hasOwnProperty(key)) {
            legacySchedules[key] += html;
        }
    });

    localStorage.setItem('skating_schedules', JSON.stringify(legacySchedules));
}

function showMsg(text) {
    adminMsg.innerText = text;
    adminMsg.classList.add('show');
    setTimeout(() => {
        adminMsg.classList.remove('show');
    }, 3000);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderClasses();
});

// Expose functions to global scope for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.editClass = editClass;
window.deleteClass = deleteClass;
