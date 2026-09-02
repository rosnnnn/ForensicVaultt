// ==================== SETTINGS PAGE JAVASCRIPT ====================

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(loadSettings, 100);
});

function loadSettings() {
    const name = localStorage.getItem('username') || 'John Doe';
    const role = localStorage.getItem('role') || 'Administrator';

    const setName = document.getElementById('setName');
    const setEmail = document.getElementById('setEmail');
    const setRole = document.getElementById('setRole');
    const setUser = document.getElementById('setUser');

    if (setName) setName.value = name;
    if (setEmail) setEmail.value = name.toLowerCase().replace(/\s+/g, '.') + '@forensicvault.gov';
    if (setRole) setRole.value = role.charAt(0).toUpperCase() + role.slice(1);
    if (setUser) setUser.textContent = name;

    // Load saved preferences
    loadPreferences();
}

function loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('forensicVault_prefs') || '{}');
    
    const toggles = document.querySelectorAll('.setting-toggle input[type="checkbox"]');
    toggles.forEach((toggle, idx) => {
        const keys = ['twoFactor', 'sessionTimeout', 'auditLog', 'emailNotifs'];
        const defaultValues = [true, true, true, false];
        toggle.checked = prefs[keys[idx]] !== undefined ? prefs[keys[idx]] : defaultValues[idx];
        toggle.addEventListener('change', savePreferences);
    });
}

function savePreferences() {
    const toggles = document.querySelectorAll('.setting-toggle input[type="checkbox"]');
    const keys = ['twoFactor', 'sessionTimeout', 'auditLog', 'emailNotifs'];
    const prefs = {};

    toggles.forEach((toggle, idx) => {
        prefs[keys[idx]] = toggle.checked;
    });

    localStorage.setItem('forensicVault_prefs', JSON.stringify(prefs));
    showToast('Preference updated', 'success');
}

function updateProfile() {
    const name = document.getElementById('setName').value.trim();
    const email = document.getElementById('setEmail').value.trim();

    if (!name) {
        showToast('Name cannot be empty', 'error');
        return;
    }
    if (!email || !email.includes('@')) {
        showToast('Please enter valid email', 'error');
        return;
    }

    localStorage.setItem('username', name);
    showToast('Profile updated successfully!', 'success');

    // Update user info in top nav
    setTimeout(() => {
        loadUserInfo();
        document.getElementById('setUser').textContent = name;
    }, 300);
}

function saveAllSettings() {
    updateProfile();
    savePreferences();
    showToast('All settings saved!', 'success');
}

function clearAllData() {
    showModal('⚠️ Clear All Data',
        `<p style="margin-bottom:10px;">This will delete <strong>ALL</strong> stored data including:</p>
         <ul style="color:#b0c4de;font-size:13px;padding-left:20px;line-height:1.8;">
            <li>All cases</li>
            <li>All evidence records</li>
            <li>All reports</li>
            <li>All user accounts (except admin)</li>
            <li>All preferences</li>
         </ul>
         <p style="margin-top:12px;color:#ff4757;font-size:12px;">⚠️ This cannot be undone!</p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-danger" onclick="confirmClearData()"><i class="fas fa-trash"></i> Clear All Data</button>`
    );
}

function confirmClearData() {
    // Keep only auth data
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    localStorage.clear();
    
    if (isLoggedIn) {
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        localStorage.setItem('isLoggedIn', isLoggedIn);
    }

    closeModal();
    showToast('All data cleared successfully!', 'success');
    setTimeout(() => location.reload(), 1500);
}

function backupData() {
    const data = {
        exported: new Date().toISOString(),
        cases: JSON.parse(localStorage.getItem('forensicVault_cases') || '[]'),
        evidence: JSON.parse(localStorage.getItem('forensicVault_evidence') || '[]'),
        reports: JSON.parse(localStorage.getItem('forensicVault_reports') || '[]'),
        users: JSON.parse(localStorage.getItem('forensicVault_users') || '[]'),
        preferences: JSON.parse(localStorage.getItem('forensicVault_prefs') || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensicvault_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully!', 'success');
}