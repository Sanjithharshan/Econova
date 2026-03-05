// ===================================
// SENSOR MODULE - JavaScript
// ===================================

// Mock sensor data
const mockBins = [
    { id: 'BIN-001', name: 'North Gate Parking', zone: 'north', fillLevel: 45, temp: 30, gas: 120, battery: 85, status: 'normal', lastUpdate: '2 min ago' },
    { id: 'BIN-002', name: 'Main Street Entrance', zone: 'central', fillLevel: 92, temp: 35, gas: 280, battery: 67, status: 'critical', lastUpdate: '30 sec ago' },
    { id: 'BIN-003', name: 'Shopping District East', zone: 'east', fillLevel: 78, temp: 32, gas: 190, battery: 92, status: 'warning', lastUpdate: '1 min ago' },
    { id: 'BIN-004', name: 'City Park West', zone: 'west', fillLevel: 23, temp: 28, gas: 85, battery: 95, status: 'normal', lastUpdate: '3 min ago' },
    { id: 'BIN-005', name: 'Residential Block A', zone: 'south', fillLevel: 65, temp: 31, gas: 150, battery: 72, status: 'normal', lastUpdate: '2 min ago' },
    { id: 'BIN-006', name: 'Bus Terminal', zone: 'central', fillLevel: 88, temp: 34, gas: 240, battery: 58, status: 'warning', lastUpdate: '45 sec ago' },
    { id: 'BIN-007', name: 'Hospital Road', zone: 'north', fillLevel: 35, temp: 29, gas: 95, battery: 88, status: 'normal', lastUpdate: '5 min ago' },
    { id: 'BIN-008', name: 'Commercial Hub', zone: 'east', fillLevel: 95, temp: 38, gas: 320, battery: 45, status: 'critical', lastUpdate: '1 min ago' },
    { id: 'BIN-009', name: 'Library Square', zone: 'west', fillLevel: 52, temp: 30, gas: 130, battery: 90, status: 'normal', lastUpdate: '4 min ago' },
    { id: 'BIN-010', name: 'Sports Complex', zone: 'south', fillLevel: 70, temp: 32, gas: 170, battery: 80, status: 'normal', lastUpdate: '3 min ago' }
];

let allBins = [...mockBins];
let displayedBins = [...mockBins];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderBins();
    setupEventListeners();
    checkAlerts();
    
    // Simulate real-time updates
    setInterval(updateSensorData, 5000);
});

// Event Listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('zoneFilter').addEventListener('change', handleFilter);
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    displayedBins = allBins.filter(bin => 
        bin.name.toLowerCase().includes(searchTerm) || 
        bin.id.toLowerCase().includes(searchTerm)
    );
    renderBins();
}

// Handle Filter
function handleFilter() {
    const statusFilter = document.getElementById('statusFilter').value;
    const zoneFilter = document.getElementById('zoneFilter').value;
    
    displayedBins = allBins.filter(bin => {
        const statusMatch = statusFilter === 'all' || bin.status === statusFilter;
        const zoneMatch = zoneFilter === 'all' || bin.zone === zoneFilter;
        return statusMatch && zoneMatch;
    });
    
    renderBins();
}

// Render Bin Cards
function renderBins() {
    const container = document.getElementById('binsContainer');
    
    if (displayedBins.length === 0) {
        container.innerHTML = '<div class="no-results"><p>No bins found matching your criteria</p></div>';
        return;
    }
    
    container.innerHTML = displayedBins.map(bin => `
        <div class="bin-card ${bin.status}" onclick="openBinDetails('${bin.id}')">
            <div class="bin-header">
                <div class="bin-info">
                    <h3>${bin.name}</h3>
                    <p>
                        <i class="fas fa-map-marker-alt"></i>
                        ${bin.id} • ${bin.zone.charAt(0).toUpperCase() + bin.zone.slice(1)} Zone
                    </p>
                </div>
                <span class="bin-status ${bin.status}">
                    ${bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}
                </span>
            </div>
            
            <div class="bin-progress">
                <div class="progress-header">
                    <span>Fill Level</span>
                    <span>${bin.fillLevel}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${bin.fillLevel}%"></div>
                </div>
            </div>
            
            <div class="bin-metrics">
                <div class="metric">
                    <div class="metric-label">
                        <i class="fas fa-thermometer-half"></i> Temp
                    </div>
                    <div class="metric-value">${bin.temp}°C</div>
                </div>
                <div class="metric">
                    <div class="metric-label">
                        <i class="fas fa-wind"></i> Gas
                    </div>
                    <div class="metric-value">${bin.gas} PPM</div>
                </div>
                <div class="metric">
                    <div class="metric-label">
                        <i class="fas fa-battery-three-quarters"></i> Battery
                    </div>
                    <div class="metric-value">${bin.battery}%</div>
                </div>
            </div>
            
            <div class="bin-footer">
                <span class="last-update">
                    <i class="fas fa-clock"></i> Updated ${bin.lastUpdate}
                </span>
                <button class="view-btn" onclick="event.stopPropagation(); openBinDetails('${bin.id}')">
                    View Details
                </button>
            </div>
        </div>
    `).join('');
}

// Open Bin Details Modal
function openBinDetails(binId) {
    const bin = allBins.find(b => b.id === binId);
    if (!bin) return;
    
    const modal = document.getElementById('binModal');
    const details = document.getElementById('binDetails');
    
    details.innerHTML = `
        <div class="bin-detail-header">
            <h3>${bin.name}</h3>
            <span class="bin-status ${bin.status}">${bin.status.charAt(0).toUpperCase() + bin.status.slice(1)}</span>
        </div>
        
        <div class="detail-grid">
            <div class="detail-item">
                <label>
                    <i class="fas fa-id-badge"></i> Bin ID
                </label>
                <p>${bin.id}</p>
            </div>
            <div class="detail-item">
                <label>
                    <i class="fas fa-map-marker-alt"></i> Zone
                </label>
                <p>${bin.zone.charAt(0).toUpperCase() + bin.zone.slice(1)} Zone</p>
            </div>
            <div class="detail-item">
                <label>
                    <i class="fas fa-trash-alt"></i> Fill Level
                </label>
                <p class="highlight">${bin.fillLevel}%</p>
            </div>
            <div class="detail-item">
                <label>
                    <i class="fas fa-thermometer-half"></i> Temperature
                </label>
                <p>${bin.temp}°C</p>
            </div>
            <div class="detail-item">
                <label>
                    <i class="fas fa-wind"></i> Gas Emissions
                </label>
                <p>${bin.gas} PPM</p>
            </div>
            <div class="detail-item">
                <label>
                    <i class="fas fa-battery-three-quarters"></i> Battery Level
                </label>
                <p>${bin.battery}%</p>
            </div>
        </div>
        
        <div class="action-buttons">
            <button class="btn btn-primary" onclick="schedulePickup('${bin.id}')">
                <i class="fas fa-calendar-check"></i> Schedule Pickup
            </button>
            <button class="btn btn-secondary" onclick="viewHistory('${bin.id}')">
                <i class="fas fa-history"></i> View History
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close Bin Details Modal
function closeBinModal() {
    document.getElementById('binModal').classList.remove('active');
}

// Schedule Pickup
function schedulePickup(binId) {
    alert(`Pickup scheduled for ${binId}. Notification sent to collection team.`);
    closeBinModal();
}

// View History
function viewHistory(binId) {
    alert(`Historical data for ${binId} would be displayed here.`);
}

// Check and Display Alerts
function checkAlerts() {
    const criticalBins = allBins.filter(bin => bin.status === 'critical');
    const alertPanel = document.getElementById('alertPanel');
    
    if (criticalBins.length > 0) {
        alertPanel.querySelector('strong').textContent = `${criticalBins.length} Critical Alert${criticalBins.length > 1 ? 's' : ''}`;
        alertPanel.classList.add('show');
    }
}

// View All Alerts
function viewAlerts() {
    handleFilter();
    document.getElementById('statusFilter').value = 'critical';
    handleFilter();
    document.getElementById('alertPanel').classList.remove('show');
}

// Refresh Data
function refreshData() {
    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');
    
    icon.classList.add('fa-spin');
    
    setTimeout(() => {
        updateSensorData();
        icon.classList.remove('fa-spin');
        btn.innerHTML = '<i class="fas fa-check"></i> Data Refreshed';
        btn.style.background = 'linear-gradient(135deg, #10b981, #34d399)';
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
            btn.style.background = '';
        }, 2000);
    }, 1000);
}

// Update Sensor Data (Simulated)
function updateSensorData() {
    allBins.forEach(bin => {
        // Simulate small random changes
        const change = (Math.random() - 0.5) * 2;
        bin.fillLevel = Math.max(0, Math.min(100, bin.fillLevel + change));
        bin.temp = Math.max(20, Math.min(45, bin.temp + change * 0.5));
        bin.gas = Math.max(50, Math.min(400, bin.gas + change * 2));
        bin.battery = Math.max(0, Math.min(100, bin.battery - 0.1));
        
        // Update status based on fill level
        if (bin.fillLevel >= 90) {
            bin.status = 'critical';
        } else if (bin.fillLevel >= 75) {
            bin.status = 'warning';
        } else {
            bin.status = 'normal';
        }
        
        bin.lastUpdate = 'just now';
    });
    
    displayedBins = [...allBins];
    renderBins();
    checkAlerts();
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('binModal');
    if (event.target === modal) {
        closeBinModal();
    }
}

