// ===================================
// AUTHENTICATION MODULE
// ===================================

let selectedRole = null;

// Role Selection
function selectRole(role) {
    selectedRole = role;
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    
    roleSelection.style.display = 'none';
    loginForm.style.display = 'block';
    
    updateLoginTitle(role);
}

function updateLoginTitle(role) {
    const titles = {
        'citizen': {
            title: 'Citizen Login',
            subtitle: 'Access your waste management dashboard'
        },
        'municipal': {
            title: 'Municipal Authority Login',
            subtitle: 'Manage pickups and monitor bins'
        },
        'recycler': {
            title: 'Recycler Login',
            subtitle: 'Optimize your collection routes'
        },
        'admin': {
            title: 'Administrator Login',
            subtitle: 'System management and analytics'
        }
    };
    
    const info = titles[role];
    document.getElementById('loginTitle').textContent = info.title;
    document.getElementById('loginSubtitle').textContent = info.subtitle;
}

function backToRoles() {
    const roleSelection = document.getElementById('roleSelection');
    const loginForm = document.getElementById('loginForm');
    
    roleSelection.style.display = 'grid';
    loginForm.style.display = 'none';
    selectedRole = null;
}

// Form Switching
function switchToRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

// Password Toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password Strength Checker
document.addEventListener('DOMContentLoaded', function() {
    const regPassword = document.getElementById('regPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strength');
    
    if (regPassword) {
        regPassword.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            
            strengthBar.className = 'strength-bar ' + strength.level;
            strengthText.textContent = strength.text;
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const match = document.getElementById('passwordMatch');
            if (this.value === regPassword.value) {
                match.textContent = '✓ Passwords match';
                match.className = 'password-match match';
            } else {
                match.textContent = '✗ Passwords do not match';
                match.className = 'password-match no-match';
            }
        });
    }
});

function checkPasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
        return { level: 'weak', text: 'Weak' };
    } else if (strength <= 4) {
        return { level: 'medium', text: 'Medium' };
    } else {
        return { level: 'strong', text: 'Strong' };
    }
}

// Login Handler
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store user data
        const userData = {
            username: username,
            role: selectedRole,
            rememberMe: rememberMe,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('econova_user', JSON.stringify(userData));
        
        // Success feedback
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Login Successful!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = getDashboardURL(selectedRole);
        }, 1500);
        
    }, 1500);
}

function getDashboardURL(role) {
    const dashboards = {
        'citizen': 'dashboard.html?role=citizen',
        'municipal': 'dashboard.html?role=municipal',
        'recycler': 'dashboard.html?role=recycler',
        'admin': 'dashboard.html?role=admin'
    };
    
    return dashboards[role] || 'dashboard.html';
}

// Register Handler
function handleRegister(event) {
    event.preventDefault();
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        userType: document.getElementById('userType').value,
        password: document.getElementById('regPassword').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Store registration data
        localStorage.setItem('econova_registration', JSON.stringify(formData));
        
        // Success feedback
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        
        // Redirect to login
        setTimeout(() => {
            selectedRole = formData.userType;
            switchToLogin();
            updateLoginTitle(selectedRole);
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 1500);
        
    }, 1500);
}

// Social Login
function socialLogin(provider) {
    const providers = {
        'google': 'Google',
        'facebook': 'Facebook',
        'microsoft': 'Microsoft'
    };
    
    // Show loading
    const btn = event.target.closest('.social-btn');
    const icon = btn.querySelector('i');
    const originalIcon = icon.className;
    icon.className = 'fas fa-spinner fa-spin';
    
    setTimeout(() => {
        alert(`Social login with ${providers[provider]} is being implemented!\n\nFor now, please use email/password login.`);
        icon.className = originalIcon;
    }, 1000);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('econova_user');
    if (user) {
        const userData = JSON.parse(user);
        // Redirect if session is valid
        if (userData.rememberMe) {
            const sessionAge = Date.now() - new Date(userData.timestamp).getTime();
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;
            
            if (sessionAge < thirtyDays) {
                window.location.href = getDashboardURL(userData.role);
            }
        }
    }
});

// Forgot Password
document.addEventListener('DOMContentLoaded', function() {
    const forgotLink = document.querySelector('.forgot-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Password reset functionality coming soon!\n\nPlease contact support at support@econova.com');
        });
    }
});

