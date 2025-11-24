// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAuthModals();
});

function initializeAuthModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Open login modal
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
    
    // Open register modal
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'flex';
    });
    
    // Close modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // Switch between login and register modals
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'flex';
    });
    
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate login process
    showNotification('Logging in...', 'info');
    
    // In a real application, this would make an API call
    setTimeout(() => {
        document.getElementById('loginModal').style.display = 'none';
        showNotification('Login successful!', 'success');
        
        // Update UI for logged in user
        updateUIForLoggedInUser(email);
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simulate registration process
    showNotification('Creating account...', 'info');
    
    // In a real application, this would make an API call
    setTimeout(() => {
        document.getElementById('registerModal').style.display = 'none';
        showNotification('Registration successful! Please log in.', 'success');
    }, 1500);
}

function updateUIForLoggedInUser(email) {
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <span style="color: white; margin-right: 10px;">Welcome, ${email.split('@')[0]}</span>
        <button class="btn btn-outline" id="logoutBtn">Logout</button>
        <button class="btn btn-primary" id="dashboardBtn">Dashboard</button>
    `;
    
    // Add event listeners for new buttons
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('dashboardBtn').addEventListener('click', showDashboard);
}

function handleLogout() {
    // Reset UI
    const authButtons = document.querySelector('.auth-buttons');
    authButtons.innerHTML = `
        <button class="btn btn-outline" id="loginBtn">Login</button>
        <button class="btn btn-primary" id="registerBtn">Register</button>
    `;
    
    // Re-initialize auth modals
    initializeAuthModals();
    
    showNotification('Logged out successfully', 'info');
}

function showDashboard() {
    showNotification('Admin dashboard would open here', 'info');
    // In a real application, this would redirect to the dashboard page
}

// Make showNotification available globally
window.showNotification = showNotification;