// ==================== USERS PAGE JAVASCRIPT ====================

let usersData = [
    { id: 1, firstName: 'John', lastName: 'Doe', username: 'admin', email: 'john@forensicvault.gov', role: 'Administrator', status: 'active', lastLogin: 'Today, 09:42 AM', color: '#00c6ff' },
    { id: 2, firstName: 'A.', lastName: 'Chen', username: 'achen', email: 'chen@forensicvault.gov', role: 'Forensic Analyst', status: 'active', lastLogin: 'Today, 08:15 AM', color: '#2ecc71' },
    { id: 3, firstName: 'J.', lastName: 'Davis', username: 'jdavis', email: 'jdavis@forensicvault.gov', role: 'Investigator', status: 'active', lastLogin: 'Yesterday, 05:30 PM', color: '#ef4444' },
    { id: 4, firstName: 'S.', lastName: 'Miller', username: 'smiller', email: 'miller@forensicvault.gov', role: 'Investigator', status: 'offline', lastLogin: '2 days ago', color: '#3b82f6' },
    { id: 5, firstName: 'R.', lastName: 'Torres', username: 'rtorres', email: 'torres@forensicvault.gov', role: 'Investigator', status: 'active', lastLogin: 'Today, 11:20 AM', color: '#a855f7' }
];

document.addEventListener('DOMContentLoaded', function() {
    loadUsersFromStorage();
    renderUsersTable();
    updateUserStats();
});

function loadUsersFromStorage() {
    const saved = localStorage.getItem('forensicVault_users');
    if (saved) {
        try { usersData = JSON.parse(saved); } catch (e) {}
    }
}

function saveUsersToStorage() {
    localStorage.setItem('forensicVault_users', JSON.stringify(usersData));
}

function renderUsersTable(filteredData = null) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const data = filteredData || usersData;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:#6b7280;">
            <i class="fas fa-inbox" style="font-size:32px;margin-bottom:10px;display:block;"></i>
            No users found</td></tr>`;
        return;
    }

    const roleClass = {
        'Administrator': 'status-new',
        'Investigator': 'status-new',
        'Forensic Analyst': 'status-active'
    };

    tbody.innerHTML = data.map(u => {
        const initials = (u.firstName[0] + u.lastName[0]).toUpperCase();
        const statusClass = u.status === 'active' ? 'online-dot' : 'offline-dot';
        const statusLabel = u.status === 'active' ? '● Active' : '● Offline';

        return `
            <tr>
                <td>
                    <div class="user-cell">
                        <div class="user-cell-avatar" style="background:linear-gradient(135deg,${u.color},${adjustColor(u.color, -30)});">${initials}</div>
                        <div>
                            <strong>${u.firstName} ${u.lastName}</strong>
                            <div style="font-size:11px;color:#6b7280;">${u.email}</div>
                        </div>
                    </div>
                </td>
                <td><span style="color:#00c6ff;">${u.username}</span></td>
                <td><span class="status-badge ${roleClass[u.role] || 'status-new'}">${u.role}</span></td>
                <td><span class="${statusClass}">${statusLabel}</span></td>
                <td>${u.lastLogin}</td>
                <td>
                    <button class="tbl-btn view" onclick="viewUser(${u.id})" title="View"><i class="fas fa-eye"></i></button>
                    <button class="tbl-btn edit" onclick="editUser(${u.id})" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="tbl-btn del" onclick="deleteUser(${u.id})" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');
}

function adjustColor(color, amount) {
    return color; // Simple version, keep same color
}

function updateUserStats() {
    const total = usersData.length;
    const active = usersData.filter(u => u.status === 'active').length;
    const admins = usersData.filter(u => u.role === 'Administrator').length;
    const investigators = usersData.filter(u => u.role === 'Investigator').length;

    const kpis = document.querySelectorAll('.kpi-card h3');
    if (kpis.length >= 4) {
        kpis[0].textContent = total;
        kpis[1].textContent = active;
        kpis[2].textContent = admins;
        kpis[3].textContent = investigators;
    }
}

function filterUsers() {
    const search = document.getElementById('userSearch').value.toLowerCase();
    const filtered = usersData.filter(u => {
        return !search || 
            u.firstName.toLowerCase().includes(search) ||
            u.lastName.toLowerCase().includes(search) ||
            u.username.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.role.toLowerCase().includes(search);
    });
    renderUsersTable(filtered);
}

function openAddUserModal() {
    showModal('👤 Add New User',
        `<div class="modal-form">
            <div class="form-row">
                <div class="form-group-modal">
                    <label>First Name <span style="color:#ff4757;">*</span></label>
                    <input type="text" id="u-first" placeholder="First name">
                </div>
                <div class="form-group-modal">
                    <label>Last Name <span style="color:#ff4757;">*</span></label>
                    <input type="text" id="u-last" placeholder="Last name">
                </div>
            </div>
            <div class="form-group-modal">
                <label>Username / Badge ID <span style="color:#ff4757;">*</span></label>
                <input type="text" id="u-username" placeholder="username">
            </div>
            <div class="form-group-modal">
                <label>Email Address <span style="color:#ff4757;">*</span></label>
                <input type="email" id="u-email" placeholder="officer@forensicvault.gov">
            </div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Role</label>
                    <select id="u-role">
                        <option>Investigator</option>
                        <option>Forensic Analyst</option>
                        <option>Administrator</option>
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Temp Password <span style="color:#ff4757;">*</span></label>
                    <input type="password" id="u-pass" placeholder="Min 8 characters">
                </div>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="submitNewUser()"><i class="fas fa-user-plus"></i> Add User</button>`
    );
}

function submitNewUser() {
    const firstName = document.getElementById('u-first').value.trim();
    const lastName = document.getElementById('u-last').value.trim();
    const username = document.getElementById('u-username').value.trim();
    const email = document.getElementById('u-email').value.trim();
    const role = document.getElementById('u-role').value;
    const pass = document.getElementById('u-pass').value;

    if (!firstName || !lastName || !username || !email) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    if (pass.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return;
    }
    if (usersData.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        showToast('Username already exists', 'error');
        return;
    }

    const colors = ['#00c6ff', '#2ecc71', '#ef4444', '#3b82f6', '#a855f7', '#ffa502'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newUser = {
        id: Date.now(),
        firstName, lastName, username, email, role,
        status: 'active',
        lastLogin: 'Just now',
        color: randomColor
    };

    usersData.unshift(newUser);
    saveUsersToStorage();
    renderUsersTable();
    updateUserStats();

    closeModal();
    showToast(`User ${firstName} ${lastName} added successfully!`, 'success');
}

function viewUser(id) {
    const u = usersData.find(x => x.id === id);
    if (!u) return;

    const initials = (u.firstName[0] + u.lastName[0]).toUpperCase();

    showModal(`👤 User Profile — ${u.firstName} ${u.lastName}`,
        `<div style="text-align:center;margin-bottom:20px;">
            <div class="user-cell-avatar" style="background:linear-gradient(135deg,${u.color},${u.color});width:70px;height:70px;font-size:26px;margin:0 auto 12px;">${initials}</div>
            <h3 style="color:#fff;margin-bottom:4px;">${u.firstName} ${u.lastName}</h3>
            <p style="color:#00c6ff;font-size:13px;">${u.role}</p>
         </div>
         <div class="detail-grid">
            <div class="detail-item"><label>Username</label><strong style="color:#00c6ff;">${u.username}</strong></div>
            <div class="detail-item"><label>Status</label><span class="${u.status === 'active' ? 'online-dot' : 'offline-dot'}">${u.status === 'active' ? '● Active' : '● Offline'}</span></div>
            <div class="detail-item full"><label>Email</label><span>${u.email}</span></div>
            <div class="detail-item full"><label>Last Login</label><span>${u.lastLogin}</span></div>
         </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Close</button>
         <button class="btn-modal-primary" onclick="closeModal();editUser(${u.id})"><i class="fas fa-pen"></i> Edit Profile</button>`
    );
}

function editUser(id) {
    const u = usersData.find(x => x.id === id);
    if (!u) return;

    showModal(`✏️ Edit User — ${u.firstName} ${u.lastName}`,
        `<div class="modal-form">
            <div class="form-row">
                <div class="form-group-modal"><label>First Name</label><input type="text" id="e-first" value="${u.firstName}"></div>
                <div class="form-group-modal"><label>Last Name</label><input type="text" id="e-last" value="${u.lastName}"></div>
            </div>
            <div class="form-group-modal"><label>Email</label><input type="email" id="e-email" value="${u.email}"></div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Role</label>
                    <select id="e-role">
                        <option ${u.role === 'Administrator' ? 'selected' : ''}>Administrator</option>
                        <option ${u.role === 'Investigator' ? 'selected' : ''}>Investigator</option>
                        <option ${u.role === 'Forensic Analyst' ? 'selected' : ''}>Forensic Analyst</option>
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Status</label>
                    <select id="e-status">
                        <option value="active" ${u.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="offline" ${u.status === 'offline' ? 'selected' : ''}>Offline</option>
                    </select>
                </div>
            </div>
         </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="submitEditUser(${id})"><i class="fas fa-save"></i> Save Changes</button>`
    );
}

function submitEditUser(id) {
    const index = usersData.findIndex(u => u.id === id);
    if (index === -1) return;

    usersData[index] = {
        ...usersData[index],
        firstName: document.getElementById('e-first').value.trim(),
        lastName: document.getElementById('e-last').value.trim(),
        email: document.getElementById('e-email').value.trim(),
        role: document.getElementById('e-role').value,
        status: document.getElementById('e-status').value
    };

    saveUsersToStorage();
    renderUsersTable();
    updateUserStats();
    closeModal();
    showToast('User updated successfully!', 'success');
}

function deleteUser(id) {
    const u = usersData.find(x => x.id === id);
    if (!u) return;

    if (u.username === 'admin') {
        showToast('Cannot delete admin user', 'error');
        return;
    }

    showModal('🗑️ Delete User',
        `<p>Are you sure you want to delete user <strong>${u.firstName} ${u.lastName}</strong>?</p>
         <p style="margin-top:10px;color:#ff4757;font-size:12px;">⚠️ This action cannot be undone.</p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-danger" onclick="confirmDeleteUser(${id})"><i class="fas fa-trash"></i> Delete User</button>`
    );
}

function confirmDeleteUser(id) {
    usersData = usersData.filter(u => u.id !== id);
    saveUsersToStorage();
    renderUsersTable();
    updateUserStats();
    closeModal();
    showToast('User deleted', 'warning');
}

function exportUsers() {
    const csv = [
        ['ID', 'First Name', 'Last Name', 'Username', 'Email', 'Role', 'Status', 'Last Login'],
        ...usersData.map(u => [u.id, u.firstName, u.lastName, u.username, u.email, u.role, u.status, u.lastLogin])
    ].map(row => row.map(c => `"${c}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Users exported successfully!', 'success');
}