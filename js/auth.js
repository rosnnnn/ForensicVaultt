// ==================== AUTH.JS - Login & Registration System ====================

// ==================== INITIALIZE DEFAULT ADMIN ====================
(function initDefaultUsers() {
    const users = JSON.parse(localStorage.getItem('forensicVault_authUsers') || '[]');
    if (users.length === 0) {
        const defaultUsers = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                username: 'admin',
                email: 'admin@forensicvault.gov',
                password: 'admin123',
                role: 'Administrator',
                registeredOn: new Date().toISOString(),
                color: '#00c6ff'
            }
        ];
        localStorage.setItem('forensicVault_authUsers', JSON.stringify(defaultUsers));
    }
})();

// ==================== LOGIN HANDLER ====================
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const rememberMe = document.getElementById('remember')?.checked || false;

    // Validation
    if (!username) {
        showToast('Please enter your username', 'error');
        return false;
    }
    if (!password) {
        showToast('Please enter your password', 'error');
        return false;
    }
    if (!role) {
        showToast('Please select your role', 'error');
        return false;
    }

    // Get registered users
    const users = JSON.parse(localStorage.getItem('forensicVault_authUsers') || '[]');
    
    // Find matching user
    const user = users.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === password
    );

    if (!user) {
        showToast('❌ Invalid username or password', 'error');
        return false;
    }

    // Check if role matches
    if (user.role.toLowerCase() !== role.toLowerCase()) {
        showToast(`⚠️ Role mismatch. Your account is registered as ${user.role}`, 'warning');
        return false;
    }

    // Login button loading state
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
    }

    setTimeout(() => {
        // Save session
        localStorage.setItem('username', `${user.firstName} ${user.lastName}`);
        localStorage.setItem('role', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUserId', user.id);

        if (rememberMe) {
            localStorage.setItem('rememberedUser', username);
        } else {
            localStorage.removeItem('rememberedUser');
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        const allUsers = JSON.parse(localStorage.getItem('forensicVault_authUsers') || '[]');
        const idx = allUsers.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            allUsers[idx] = user;
            localStorage.setItem('forensicVault_authUsers', JSON.stringify(allUsers));
        }

        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> Success! Redirecting...';
            loginBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        }

        showToast(`Welcome back, ${user.firstName}! 🎉`, 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    }, 1000);

    return false;
}

// ==================== REGISTER HANDLER ====================
function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms')?.checked || false;

    // Validation
    if (!firstName) {
        showToast('Please enter your first name', 'error');
        return false;
    }
    if (!lastName) {
        showToast('Please enter your last name', 'error');
        return false;
    }
    if (!username) {
        showToast('Please enter a username', 'error');
        return false;
    }
    if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return false;
    }
    if (!email) {
        showToast('Please enter your email', 'error');
        return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
        showToast('Please enter a valid email address', 'error');
        return false;
    }
    if (!role) {
        showToast('Please select your role', 'error');
        return false;
    }
    if (!password) {
        showToast('Please enter a password', 'error');
        return false;
    }
    if (password.length < 8) {
        showToast('Password must be at least 8 characters', 'error');
        return false;
    }
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
    }
    if (!agreeTerms) {
        showToast('Please agree to Terms & Conditions', 'error');
        return false;
    }

    // Check if username exists
    const users = JSON.parse(localStorage.getItem('forensicVault_authUsers') || '[]');
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        showToast('❌ Username already exists. Try another.', 'error');
        return false;
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast('❌ Email already registered', 'error');
        return false;
    }

    // Loading state
    const regBtn = document.querySelector('.login-btn');
    if (regBtn) {
        regBtn.disabled = true;
        regBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    }

    setTimeout(() => {
        const colors = ['#00c6ff', '#2ecc71', '#ef4444', '#3b82f6', '#a855f7', '#ffa502'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Capitalize role properly
        const roleMap = {
            'administrator': 'Administrator',
            'investigator': 'Investigator',
            'analyst': 'Forensic Analyst'
        };

        const newUser = {
            id: Date.now(),
            firstName,
            lastName,
            username,
            email,
            password,
            role: roleMap[role.toLowerCase()] || role,
            registeredOn: new Date().toISOString(),
            color: randomColor
        };

        users.push(newUser);
        localStorage.setItem('forensicVault_authUsers', JSON.stringify(users));

        if (regBtn) {
            regBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
            regBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        }

        showToast(`🎉 Welcome ${firstName}! Account created successfully.`, 'success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }, 1000);

    return false;
}

// ==================== TOGGLE PASSWORD VISIBILITY ====================
function togglePassword(inputId, iconEl) {
    const input = document.getElementById(inputId);
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        iconEl.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        iconEl.className = 'fas fa-eye';
    }
}

// ==================== FORGOT PASSWORD ====================
function showForgotPassword(e) {
    if (e) e.preventDefault();
    showModal('🔑 Reset Password',
        `<p style="margin-bottom:14px;color:#b0c4de;">Enter your registered email to receive a reset link.</p>
         <div class="modal-form">
            <div class="form-group-modal">
                <label>Email Address</label>
                <input type="email" id="forgot-email" placeholder="officer@forensicvault.gov">
            </div>
         </div>
         <p style="margin-top:12px;font-size:11px;color:#6b7280;">
            <i class="fas fa-info-circle"></i> A password reset link will be sent to your email (valid for 30 minutes).
         </p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="sendResetLink()"><i class="fas fa-paper-plane"></i> Send Reset Link</button>`
    );
}

function sendResetLink() {
    const email = document.getElementById('forgot-email').value.trim();
    if (!email) {
        showToast('Please enter your email', 'error');
        return;
    }
    if (!email.includes('@')) {
        showToast('Invalid email address', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('forensicVault_authUsers') || '[]');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    closeModal();

    if (user) {
        showToast(`✉️ Reset link sent to ${email}`, 'success');
    } else {
        showToast('Email not found in our system', 'error');
    }
}

// ==================== PRE-FILL REMEMBERED USERNAME ====================
document.addEventListener('DOMContentLoaded', function() {
    const remembered = localStorage.getItem('rememberedUser');
    const usernameField = document.getElementById('username');
    const rememberBox = document.getElementById('remember');
    
    if (remembered && usernameField && window.location.pathname.includes('login')) {
        usernameField.value = remembered;
        if (rememberBox) rememberBox.checked = true;
    }
});