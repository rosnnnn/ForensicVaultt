// ==================== MAIN.JS - Core Utilities ====================

// ==================== THEME SYSTEM ====================
(function initTheme() {
    const savedTheme = localStorage.getItem('forensicVault_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('forensicVault_theme', newTheme);
    
    // Update icon
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.innerHTML = newTheme === 'dark' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
    showToast(`Switched to ${newTheme} mode`, 'info');
}

// ==================== MOBILE MENU ====================
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('show');
    }
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('show');
}

// ==================== NOTIFICATIONS SYSTEM ====================
let notificationsData = [];

function initNotifications() {
    // Load or create default notifications
    const saved = localStorage.getItem('forensicVault_notifications');
    if (saved) {
        try {
            notificationsData = JSON.parse(saved);
        } catch (e) {
            notificationsData = getDefaultNotifications();
        }
    } else {
        notificationsData = getDefaultNotifications();
        saveNotifications();
    }
    updateNotificationBadge();
}

function getDefaultNotifications() {
    return [
        { id: 1, type: 'alert', icon: '⚠️', title: 'Tamper attempt detected', message: 'Unauthorized access to EV-089 blocked', time: '2 min ago', read: false, color: '#ff4757' },
        { id: 2, type: 'case', icon: '📁', title: 'New case assigned', message: 'CR-247 has been assigned to you', time: '18 min ago', read: false, color: '#00c6ff' },
        { id: 3, type: 'evidence', icon: '✅', title: 'Hash verified', message: 'EV-103 integrity confirmed', time: '1 hour ago', read: false, color: '#2ecc71' },
        { id: 4, type: 'report', icon: '📊', title: 'Report exported', message: 'Monthly report exported by admin', time: '3 hours ago', read: true, color: '#3498db' },
        { id: 5, type: 'system', icon: '🔄', title: 'System backup complete', message: 'Daily backup completed successfully', time: '6 hours ago', read: true, color: '#ffa502' }
    ];
}

function saveNotifications() {
    localStorage.setItem('forensicVault_notifications', JSON.stringify(notificationsData));
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    const unread = notificationsData.filter(n => !n.read).length;
    if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function toggleNotifications() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;
    dropdown.classList.toggle('show');
    if (dropdown.classList.contains('show')) {
        renderNotifications();
    }
}

function renderNotifications() {
    const list = document.getElementById('notificationList');
    if (!list) return;

    if (notificationsData.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:30px;color:#6b7280;">
            <i class="fas fa-bell-slash" style="font-size:32px;margin-bottom:10px;display:block;"></i>
            No notifications</div>`;
        return;
    }

    list.innerHTML = notificationsData.map(n => `
        <div class="notif-item ${!n.read ? 'unread' : ''}" onclick="markAsRead(${n.id})">
            <div class="notif-icon" style="background:${n.color}22;color:${n.color};">${n.icon}</div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-message">${n.message}</div>
                <div class="notif-time">${n.time}</div>
            </div>
            ${!n.read ? '<div class="notif-dot"></div>' : ''}
        </div>
    `).join('');
}

function markAsRead(id) {
    const notif = notificationsData.find(n => n.id === id);
    if (notif) {
        notif.read = true;
        saveNotifications();
        renderNotifications();
        updateNotificationBadge();
    }
}

function markAllRead() {
    notificationsData.forEach(n => n.read = true);
    saveNotifications();
    renderNotifications();
    updateNotificationBadge();
    showToast('All notifications marked as read', 'success');
}

function clearNotifications() {
    if (confirm('Clear all notifications?')) {
        notificationsData = [];
        saveNotifications();
        renderNotifications();
        updateNotificationBadge();
        showToast('All notifications cleared', 'info');
    }
}

function addNotification(title, message, type = 'info', icon = '🔔') {
    const colors = {
        alert: '#ff4757', case: '#00c6ff', evidence: '#2ecc71',
        report: '#3498db', system: '#ffa502', info: '#00c6ff'
    };
    const newNotif = {
        id: Date.now(),
        type,
        icon,
        title,
        message,
        time: 'Just now',
        read: false,
        color: colors[type] || '#00c6ff'
    };
    notificationsData.unshift(newNotif);
    if (notificationsData.length > 20) notificationsData = notificationsData.slice(0, 20);
    saveNotifications();
    updateNotificationBadge();
}

// Close notifications when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notificationDropdown');
    const icon = document.querySelector('.notification-icon-wrapper');
    if (dropdown && icon && !dropdown.contains(e.target) && !icon.contains(e.target)) {
        dropdown.classList.remove('show');
    }
});

// ==================== SMART PAGE LOADER ====================
(function() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const loaderPages = ['', 'index.html', 'dashboard.html'];
    const shouldShowLoader = loaderPages.includes(currentPage);
    const cameFromInternal = sessionStorage.getItem('internalNav') === 'true';
    sessionStorage.removeItem('internalNav');

    if (!shouldShowLoader || cameFromInternal) {
        document.addEventListener('DOMContentLoaded', function() {
            const loader = document.getElementById('pageLoader');
            if (loader) loader.remove();
        });
    } else {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const loader = document.getElementById('pageLoader');
                if (loader) {
                    loader.classList.add('fade-out');
                    setTimeout(function() {
                        if (loader && loader.parentNode) loader.remove();
                    }, 600);
                }
            }, 1800);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.sidebar-menu a, a.action-btn, .view-all').forEach(function(link) {
            link.addEventListener('click', function() {
                const href = this.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    sessionStorage.setItem('internalNav', 'true');
                }
            });
        });
    });
})();

// ==================== AUTH ====================
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) window.location.href = 'login.html';
}

function loadUserInfo() {
    const username = localStorage.getItem('username') || 'John Doe';
    const role = localStorage.getItem('role') || 'Administrator';

    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');

    if (userNameEl) userNameEl.textContent = username;
    if (userRoleEl) userRoleEl.textContent = role.charAt(0).toUpperCase() + role.slice(1);
    if (userAvatarEl) {
        const initials = username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        userAvatarEl.textContent = initials;
    }

    // Initialize notifications
    initNotifications();

    // Set theme icon
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        themeBtn.innerHTML = theme === 'dark' 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUserId');
        sessionStorage.removeItem('internalNav');
        window.location.href = 'login.html';
    }
}

// ==================== MODAL ====================
function showModal(title, body, footer) {
    const overlay = document.getElementById('modalOverlay');
    if (!overlay) return;
    document.getElementById('modalTitle').innerHTML = title;
    document.getElementById('modalBody').innerHTML = body;
    document.getElementById('modalFooter').innerHTML = footer || '';
    overlay.classList.add('show');
}

function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    if (overlay) overlay.classList.remove('show');
}

document.addEventListener('click', function(e) {
    const overlay = document.getElementById('modalOverlay');
    if (overlay && e.target === overlay) closeModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
        closeMobileMenu();
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) dropdown.classList.remove('show');
    }
});

// ==================== TOAST ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        alert(message);
        return;
    }
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== SHA-256 HASH GENERATOR ====================
async function generateSHA256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function generateSHA256FromText(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==================== FILE TO BASE64 ====================
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// ==================== FORMAT FILE SIZE ====================
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .stat-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});