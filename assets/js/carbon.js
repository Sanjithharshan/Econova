// ===================================
// CARBON CALCULATOR - JavaScript
// ===================================

// CO2 emission factors (kg CO2 per kg of waste)
const emissionFactors = {
    organic: 0.15,
    plastic: 2.5,
    glass: 0.8,
    metal: 1.2,
    paper: 0.5,
    hazardous: 5.0,
    ewaste: 3.5
};

// Mock history
const calculationHistory = [
    { wasteType: 'organic', quantity: 5, co2: 0.75, date: '2 days ago' },
    { wasteType: 'plastic', quantity: 2, co2: 5.0, date: '5 days ago' },
    { wasteType: 'paper', quantity: 8, co2: 4.0, date: '1 week ago' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadHistory();
    
    document.getElementById('carbonForm').addEventListener('submit', handleCalculation);
});

// Handle Calculation
function handleCalculation(e) {
    e.preventDefault();
    
    const wasteType = document.getElementById('wasteType').value;
    const quantity = parseFloat(document.getElementById('quantity').value);
    
    if (!wasteType || quantity <= 0) {
        alert('Please enter valid waste details');
        return;
    }
    
    const co2 = calculateCO2(wasteType, quantity);
    displayResult(wasteType, quantity, co2);
    addToHistory(wasteType, quantity, co2);
}

// Calculate CO2
function calculateCO2(wasteType, quantity) {
    const factor = emissionFactors[wasteType];
    return quantity * factor;
}

// Display Result
function displayResult(wasteType, quantity, co2) {
    const resultCard = document.getElementById('resultCard');
    const co2Value = document.getElementById('co2Value');
    const co2Equivalent = document.getElementById('co2Equivalent');
    const comparisonChart = document.getElementById('comparisonChart');
    const recommendations = document.getElementById('recommendations');
    
    // Display CO2 value
    co2Value.textContent = co2.toFixed(2);
    
    // Generate equivalent
    const trees = Math.ceil(co2 / 0.06); // One tree absorbs ~0.06 kg CO2 per day
    const km = (co2 * 0.4).toFixed(1); // Average car emits ~0.118 kg CO2 per km
    co2Equivalent.textContent = `Equivalent to ${trees} trees needed to absorb this in one day, or ${km} km driven`;
    
    // Generate comparison chart
    generateComparisonChart(comparisonChart, co2);
    
    // Generate recommendations
    generateRecommendations(recommendations, wasteType, co2);
    
    // Show result
    resultCard.style.display = 'block';
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Generate Comparison Chart
function generateComparisonChart(container, co2) {
    const comparisons = [
        { label: 'Smartphone Charging', value: Math.min(co2 * 200, 100), max: 100 },
        { label: 'Light Bulb Use', value: Math.min(co2 * 50, 100), max: 100 },
        { label: 'Water Heating', value: Math.min(co2 * 30, 100), max: 100 }
    ];
    
    container.innerHTML = '<h4 style="margin-bottom: 1rem; font-size: 1.1rem;">Equivalent Energy Use</h4>' +
        comparisons.map(item => `
            <div class="bar-item">
                <span class="bar-label">${item.label}</span>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${Math.min(item.value, 100)}%">
                        ${Math.min(item.value, 100).toFixed(0)}%
                    </div>
                </div>
            </div>
        `).join('');
    
    // Animate bars
    setTimeout(() => {
        container.querySelectorAll('.bar-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }, 100);
}

// Generate Recommendations
function generateRecommendations(container, wasteType, co2) {
    const wasteTypeNames = {
        organic: 'organic waste',
        plastic: 'plastic',
        glass: 'glass',
        metal: 'metal',
        paper: 'paper',
        hazardous: 'hazardous materials',
        ewaste: 'electronic waste'
    };
    
    const specificRecommendations = {
        organic: [
            'Start composting at home to reduce organic waste',
            'Use organic waste for gardening and soil enrichment'
        ],
        plastic: [
            'Reduce plastic consumption by using reusable alternatives',
            'Ensure plastic items are properly recycled'
        ],
        glass: [
            'Glass is highly recyclable - always use recycling bins',
            'Consider using refillable glass containers'
        ],
        metal: [
            'Metals have high recycling value - separate and recycle',
            'Look for products with recyclable packaging'
        ],
        paper: [
            'Go paperless when possible for documents and bills',
            'Use both sides of paper before recycling'
        ],
        hazardous: [
            'Never dispose hazardous waste with regular trash',
            'Contact local authorities for proper disposal methods'
        ],
        ewaste: [
            'Donate or sell working electronics',
            'Use certified e-waste recycling centers'
        ]
    };
    
    const generalRecommendations = [
        'Consider waste reduction strategies to minimize generation',
        'Participate in community recycling programs',
        'Educate others about proper waste disposal'
    ];
    
    const allRecommendations = [...specificRecommendations[wasteType], ...generalRecommendations];
    
    container.innerHTML = '<h4 style="margin-bottom: 1rem; font-size: 1.1rem;">How to Reduce Your Impact</h4>' +
        allRecommendations.map(rec => `
            <div class="recommendation-item">
                <i class="fas fa-lightbulb"></i>
                <p>${rec}</p>
            </div>
        `).join('');
}

// Add to History
function addToHistory(wasteType, quantity, co2) {
    calculationHistory.unshift({
        wasteType: wasteType,
        quantity: quantity,
        co2: co2,
        date: 'just now'
    });
    
    if (calculationHistory.length > 10) {
        calculationHistory.pop();
    }
    
    loadHistory();
}

// Load History
function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No calculation history</p>';
        return;
    }
    
    historyList.innerHTML = calculationHistory.map(item => `
        <div class="history-item">
            <div class="history-item-header">
                <span class="history-item-category">${capitalizeFirst(item.wasteType)} • ${item.quantity} kg</span>
                <span class="history-item-co2">${item.co2.toFixed(2)} kg CO₂</span>
            </div>
            <div class="history-item-details">${item.date}</div>
        </div>
    `).join('');
}

// Capitalize First Letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

