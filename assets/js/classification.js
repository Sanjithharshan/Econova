// ===================================
// CLASSIFICATION MODULE - JavaScript
// ===================================

// Waste categories
const categories = {
    organic: {
        name: 'Organic Waste',
        icon: 'fas fa-leaf',
        color: '#10b981',
        info: 'This item should be disposed of in the organic waste bin for composting. Organic waste decomposes naturally and can be converted into nutrient-rich compost.'
    },
    plastic: {
        name: 'Recyclable Plastic',
        icon: 'fas fa-recycle',
        color: '#06b6d4',
        info: 'This plastic item is recyclable. Please dispose it in the blue recycling bin. It will be processed and turned into new products.'
    },
    glass: {
        name: 'Glass',
        icon: 'fas fa-wine-glass',
        color: '#8b5cf6',
        info: 'This glass item is recyclable. Place it in the glass recycling container. Glass can be infinitely recycled without losing quality.'
    },
    metal: {
        name: 'Metal',
        icon: 'fas fa-wrench',
        color: '#f59e0b',
        info: 'Metal items are highly recyclable. Dispose in designated metal recycling bins. These materials have high market value for recycling.'
    },
    paper: {
        name: 'Paper & Cardboard',
        icon: 'fas fa-file-alt',
        color: '#ec4899',
        info: 'Paper and cardboard products are recyclable. Place in paper recycling bins. These materials can be turned into new paper products.'
    },
    hazardous: {
        name: 'Hazardous Waste',
        icon: 'fas fa-exclamation-triangle',
        color: '#ef4444',
        info: 'This is hazardous waste! Handle with care. Contact your local waste management authority for proper disposal procedures. Do not mix with regular waste.'
    },
    ewaste: {
        name: 'E-Waste',
        icon: 'fas fa-laptop',
        color: '#6366f1',
        info: 'Electronic waste requires special handling. Take to certified e-waste recycling centers. These items contain valuable and hazardous materials.'
    },
    mixed: {
        name: 'Mixed Waste',
        icon: 'fas fa-inbox',
        color: '#6b7280',
        info: 'This appears to be mixed waste. Try to separate components by category for better recycling rates. Each material type has its own recycling process.'
    }
};

// Mock classification history
const classificationHistory = [
    { image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&q=80', category: 'organic', confidence: 95, date: '2 hours ago' },
    { image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&q=80', category: 'plastic', confidence: 88, date: '5 hours ago' },
    { image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=100&q=80', category: 'glass', confidence: 92, date: '1 day ago' },
    { image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&q=80', category: 'paper', confidence: 89, date: '2 days ago' },
    { image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&q=80', category: 'organic', confidence: 94, date: '3 days ago' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupUploadArea();
    loadHistory();
    
    // File input change
    document.getElementById('imageInput').addEventListener('change', handleFileSelect);
});

// Setup Upload Area
function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        document.getElementById('imageInput').click();
    });
}

// Handle File Select
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// Handle File
function handleFile(file) {
    // Check file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }
    
    // Check file size
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
    }
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        showPreview(e.target.result);
        classifyWaste(e.target.result);
    };
    reader.readAsDataURL(file);
}

// Show Preview
function showPreview(imageSrc) {
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const previewImage = document.getElementById('previewImage');
    
    uploadArea.style.display = 'none';
    previewSection.style.display = 'block';
    previewImage.src = imageSrc;
}

// Remove Image
function removeImage() {
    const uploadArea = document.getElementById('uploadArea');
    const previewSection = document.getElementById('previewSection');
    const resultSection = document.getElementById('resultSection');
    const imageInput = document.getElementById('imageInput');
    
    uploadArea.style.display = 'block';
    previewSection.style.display = 'none';
    resultSection.style.display = 'none';
    imageInput.value = '';
}

// Classify Waste
function classifyWaste(imageSrc) {
    // Show loading
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // Simulate AI classification (random for demo)
    setTimeout(() => {
        const randomCategory = Object.keys(categories)[Math.floor(Math.random() * Object.keys(categories).length)];
        const confidence = 80 + Math.random() * 15; // 80-95%
        
        displayResult(randomCategory, confidence);
        addToHistory(imageSrc, randomCategory, confidence);
    }, 2000);
}

// Display Result
function displayResult(category, confidence) {
    const categoryData = categories[category];
    
    // Update category badge
    const categoryBadge = document.getElementById('categoryBadge');
    categoryBadge.innerHTML = `
        <i class="${categoryData.icon}"></i>
        <span id="categoryName">${categoryData.name}</span>
    `;
    categoryBadge.style.background = `linear-gradient(135deg, ${categoryData.color}, ${adjustBrightness(categoryData.color, 20)})`;
    
    // Update confidence
    const confidenceBar = document.getElementById('confidenceBar');
    const confidenceText = document.getElementById('confidenceText');
    confidenceBar.style.width = `${confidence}%`;
    confidenceText.textContent = `${confidence.toFixed(0)}%`;
    
    // Update info
    document.getElementById('classificationInfo').textContent = categoryData.info;
    
    // Show result
    document.getElementById('resultSection').style.display = 'block';
    
    // Animate
    confidenceBar.style.transition = 'none';
    confidenceBar.style.width = '0%';
    setTimeout(() => {
        confidenceBar.style.transition = 'width 1s ease-out';
        confidenceBar.style.width = `${confidence}%`;
    }, 100);
}

// Adjust Brightness
function adjustBrightness(hex, percent) {
    const num = parseInt(hex.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Add to History
function addToHistory(imageSrc, category, confidence) {
    classificationHistory.unshift({
        image: imageSrc,
        category: category,
        confidence: confidence,
        date: 'just now'
    });
    
    if (classificationHistory.length > 5) {
        classificationHistory.pop();
    }
    
    loadHistory();
}

// Load History
function loadHistory() {
    const historyList = document.getElementById('historyList');
    
    if (classificationHistory.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: var(--text-light);">No recent classifications</p>';
        return;
    }
    
    historyList.innerHTML = classificationHistory.map(item => {
        const categoryData = categories[item.category];
        return `
            <div class="history-item" onclick="viewCategoryInfo('${item.category}')">
                <img src="${item.image}" alt="Classification">
                <div class="history-item-details">
                    <div class="category">${categoryData.name}</div>
                    <div class="confidence">Confidence: ${item.confidence.toFixed(0)}%</div>
                    <div class="date">${item.date}</div>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `;
    }).join('');
}

// View Category Info
function viewCategoryInfo(categoryKey) {
    const category = categories[categoryKey];
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalInfo = document.getElementById('modalInfo');
    
    modalTitle.textContent = category.name;
    modalInfo.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
            <div style="font-size: 3rem; color: ${category.color};">
                <i class="${category.icon}"></i>
            </div>
            <div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${category.name}</h3>
                <p style="color: var(--text-light);">Proper disposal information</p>
            </div>
        </div>
        
        <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${category.color};">
            <p style="line-height: 1.8; color: var(--text-dark);">${category.info}</p>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close Info Modal
function closeInfoModal() {
    document.getElementById('infoModal').classList.remove('active');
}

// View All History
function viewAllHistory() {
    alert('Full classification history would be displayed in a separate page with filtering and sorting options.');
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        closeInfoModal();
    }
}

