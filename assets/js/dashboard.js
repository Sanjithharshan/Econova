// ===================================
// DASHBOARD MODULE
// ===================================

let currentUser = null;
let currentRole = null;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    const userData = localStorage.getItem('econova_user');
    if (!userData) {
        window.location.href = '../index.html';
        return;
    }
    
    currentUser = JSON.parse(userData);
    currentRole = currentUser.role;
    
    // Setup dashboard based on role
    setupDashboard();
    
    // Load initial data
    loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
});

function setupDashboard() {
    // Update profile info
    document.getElementById('profileName').textContent = currentUser.username;
    document.getElementById('profileRole').textContent = capitalizeFirst(currentRole);
    
    // Show relevant navigation based on role
    showRoleNavigation(currentRole);
    
    // Update dashboard title
    const roleTitles = {
        'citizen': 'Citizen Dashboard',
        'municipal': 'Municipal Authority Dashboard',
        'recycler': 'Recycler Dashboard',
        'admin': 'Administrator Dashboard'
    };
    
    document.getElementById('dashboardTitle').textContent = roleTitles[currentRole];
}

function showRoleNavigation(role) {
    const navGroups = document.querySelectorAll('.nav-group');
    navGroups.forEach(group => {
        group.style.display = 'none';
    });
    
    const activeGroup = document.querySelector(`.${role}-only`);
    if (activeGroup) {
        activeGroup.style.display = 'block';
    }
}

function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            alert('Notifications feature coming soon!');
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.classList.add('active');
    } else {
        document.getElementById('overview').classList.add('active');
    }
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

// Load Dashboard Data
function loadDashboardData() {
    // Load stats based on role
    const stats = getRoleStats(currentRole);
    
    // Animate stats
    animateStats(stats);
    
    // Load activity
    loadRecentActivity();
}

function getRoleStats(role) {
    const statsMap = {
        'citizen': {
            stat1: { value: 125, label: 'kg Waste Recycled' },
            stat2: { value: 0.45, label: 'Tonnes CO₂ Saved' },
            stat3: { value: 850, label: 'Reward Points' },
            stat4: { value: 87, label: 'Eco Score' }
        },
        'municipal': {
            stat1: { value: 15250, label: 'Total Bins Monitored' },
            stat2: { value: 245, label: 'Active Pickups Today' },
            stat3: { value: 23, label: 'Pending Complaints' },
            stat4: { value: 92, label: 'System Efficiency %' }
        },
        'recycler': {
            stat1: { value: 8450, label: 'Total Materials Collected' },
            stat2: { value: 125, label: 'Optimized Routes' },
            stat3: { value: 45, label: 'Collection Efficiency %' },
            stat4: { value: 678, label: 'Vehicles Active' }
        },
        'admin': {
            stat1: { value: 25000, label: 'Total Users' },
            stat2: { value: 15600, label: 'Active Bins' },
            stat3: { value: 98.5, label: 'System Uptime %' },
            stat4: { value: 1250, label: 'Data Points Today' }
        }
    };
    
    return statsMap[role] || statsMap.citizen;
}

function animateStats(stats) {
    // Update labels
    document.getElementById('stat1Label').textContent = stats.stat1.label;
    document.getElementById('stat2Label').textContent = stats.stat2.label;
    document.getElementById('stat3Label').textContent = stats.stat3.label;
    document.getElementById('stat4Label').textContent = stats.stat4.label;
    
    // Animate values
    animateValue('stat1Value', 0, stats.stat1.value, 1500);
    animateValue('stat2Value', 0, stats.stat2.value, 1500);
    animateValue('stat3Value', 0, stats.stat3.value, 1500);
    animateValue('stat4Value', 0, stats.stat4.value, 1500);
}

function animateValue(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= end) {
            clearInterval(timer);
            current = end;
        }
        
        // Format number if needed
        element.textContent = formatNumber(current);
    }, stepTime);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.round(num).toString();
}

function loadRecentActivity() {
    const activities = getRecentActivities(currentRole);
    const activityList = document.getElementById('activityList');
    
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityList.appendChild(activityItem);
    });
}

function getRecentActivities(role) {
    const activitiesMap = {
        'citizen': [
            { icon: 'recycle', title: 'Waste Recycled', description: '5 kg of plastic waste', time: '2 hours ago' },
            { icon: 'leaf', title: 'Carbon Saved', description: '0.5 kg CO₂ saved today', time: '4 hours ago' },
            { icon: 'trophy', title: 'Reward Earned', description: 'Earned 50 points', time: 'Yesterday' },
            { icon: 'truck', title: 'Pickup Scheduled', description: 'Waste pickup confirmed', time: '2 days ago' }
        ],
        'municipal': [
            { icon: 'bin', title: 'Bin Alert', description: 'Bin #1254 reached 90% capacity', time: '15 min ago' },
            { icon: 'comment', title: 'New Complaint', description: 'Citizen complaint received', time: '1 hour ago' },
            { icon: 'chart', title: 'Report Generated', description: 'Weekly sustainability report', time: '3 hours ago' },
            { icon: 'truck', title: 'Route Optimized', description: '5 pickup routes updated', time: '5 hours ago' }
        ],
        'recycler': [
            { icon: 'route', title: 'Route Completed', description: 'Collection route #12 completed', time: '30 min ago' },
            { icon: 'recycle', title: 'Materials Collected', description: '2.5 tonnes collected', time: '2 hours ago' },
            { icon: 'chart', title: 'Efficiency Report', description: '95% collection efficiency', time: '4 hours ago' }
        ],
        'admin': [
            { icon: 'users', title: 'New User Registered', description: '25 new users today', time: '1 hour ago' },
            { icon: 'cog', title: 'System Update', description: 'AI model retrained', time: '2 hours ago' },
            { icon: 'chart', title: 'Analytics Generated', description: 'Monthly report ready', time: '3 hours ago' }
        ]
    };
    
    return activitiesMap[role] || activitiesMap.citizen;
}

function createActivityItem(activity) {
    const item = document.createElement('div');
    item.className = 'activity-item';
    
    const iconMap = {
        'recycle': 'fa-recycle',
        'leaf': 'fa-leaf',
        'trophy': 'fa-trophy',
        'truck': 'fa-truck',
        'bin': 'fa-bin',
        'comment': 'fa-comment',
        'chart': 'fa-chart-line',
        'route': 'fa-route',
        'users': 'fa-users',
        'cog': 'fa-cog'
    };
    
    item.innerHTML = `
        <div class="activity-icon">
            <i class="fas ${iconMap[activity.icon]}"></i>
        </div>
        <div class="activity-content">
            <h4>${activity.title}</h4>
            <p>${activity.description}</p>
        </div>
        <div class="activity-time">${activity.time}</div>
    `;
    
    return item;
}

// Logout Handler
function handleLogout(event) {
    event.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('econova_user');
        window.location.href = '../index.html';
    }
}

// Utility Functions
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Action Button Handlers (to be implemented in specific modules)
function reportWaste() {
    alert('Waste reporting feature coming soon!');
}

function lodgeComplaint() {
    alert('Complaint lodging feature coming soon!');
}

function calculateCarbon() {
    alert('Carbon calculator feature coming soon!');
}

function checkRewards() {
    alert('Rewards feature coming soon!');
}

