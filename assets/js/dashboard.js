/**
 * QR Code Management Dashboard JavaScript
 * Complete dashboard functionality including QR generation, campaigns, analytics
 */

// Application State
let appState = {
    currentTab: 'generator',
    theme: localStorage.getItem('theme') || 'light',
    qrCode: null,
    campaigns: [
        {
            id: "msft-2025",
            name: "Microsoft Event 2025",
            url: "msft-2025",
            destination: "https://accionlabs.com/microsoft-event",
            utm_params: { source: "msft_booth", medium: "qr", campaign: "2025" },
            status: "active",
            created: "2025-09-10",
            scans: 1245,
            ctr: 87.5
        },
        {
            id: "business-cards",
            name: "Business Card Networking", 
            url: "business-cards",
            destination: "https://yourdomain.com/contact",
            utm_params: { source: "business_card", medium: "qr", campaign: "networking" },
            status: "active",
            created: "2025-09-01", 
            scans: 678,
            ctr: 88.2
        }
    ],
    files: []
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing QR Dashboard...');

    // Apply saved theme
    applyTheme(appState.theme);

    // Initialize event listeners
    initializeEventListeners();

    // Initialize QR generator
    initializeQRGenerator();

    // Set initial tab
    showTab('generator');

    console.log('✅ Dashboard initialized successfully');
});

// Event Listeners
function initializeEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            showTab(tab);
        });
    });

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // QR form inputs
    const qrInputs = ['qrUrl', 'qrSize', 'errorLevel', 'foregroundColor', 'backgroundColor', 'qrBorder'];
    qrInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updateQRPreview);
        }
    });

    // Border range slider
    const borderSlider = document.getElementById('qrBorder');
    if (borderSlider) {
        borderSlider.addEventListener('input', (e) => {
            document.getElementById('borderValue').textContent = e.target.value;
            updateQRPreview();
        });
    }
}

// Tab Management
function showTab(tabName) {
    appState.currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === tabName);
    });

    console.log(`📑 Switched to ${tabName} tab`);
}

// Theme Management
function toggleTheme() {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

function applyTheme(theme) {
    appState.theme = theme;
    localStorage.setItem('theme', theme);

    document.body.classList.toggle('theme-dark', theme === 'dark');

    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// QR Code Generation
function initializeQRGenerator() {
    // Set default values
    const urlInput = document.getElementById('qrUrl');
    if (urlInput) {
        urlInput.value = 'https://YOUR_USERNAME.github.io/qr-hosting/msft-2025';
    }

    // Generate initial QR code
    updateQRPreview();
}

function updateQRPreview() {
    const urlInput = document.getElementById('qrUrl');
    const sizeInput = document.getElementById('qrSize');
    const errorInput = document.getElementById('errorLevel');
    const foregroundInput = document.getElementById('foregroundColor');
    const backgroundInput = document.getElementById('backgroundColor');
    const borderInput = document.getElementById('qrBorder');

    if (!urlInput || !urlInput.value) return;

    const url = urlInput.value;
    const size = parseInt(sizeInput?.value || '400');
    const errorLevel = errorInput?.value || 'Q';
    const foregroundColor = foregroundInput?.value || '#000000';
    const backgroundColor = backgroundInput?.value || '#ffffff';
    const border = parseInt(borderInput?.value || '4');

    try {
        // Create QR code
        const canvas = document.getElementById('qrCanvas');
        if (canvas && typeof QRious !== 'undefined') {
            appState.qrCode = new QRious({
                element: canvas,
                value: url,
                size: size,
                level: errorLevel,
                foreground: foregroundColor,
                background: backgroundColor,
                padding: border * 4
            });

            // Update preview info
            updatePreviewInfo(size, errorLevel);
        }

        console.log('🔄 QR preview updated');

    } catch (error) {
        console.error('❌ QR generation error:', error);
        showNotification('Error generating QR code', 'error');
    }
}

function updatePreviewInfo(size, errorLevel) {
    const previewSize = document.getElementById('previewSize');
    const previewError = document.getElementById('previewError');
    const previewPrint = document.getElementById('previewPrint');

    if (previewSize) previewSize.textContent = `${size}x${size}px`;
    if (previewError) previewError.textContent = `${errorLevel} (${getErrorPercentage(errorLevel)}%)`;
    if (previewPrint) previewPrint.textContent = getPrintSize(size);
}

function getErrorPercentage(level) {
    const levels = { 'L': 7, 'M': 15, 'Q': 25, 'H': 30 };
    return levels[level] || 25;
}

function getPrintSize(pixels) {
    const cm = Math.round((pixels / 100) * 10) / 10;
    return `${cm}cm x ${cm}cm`;
}

function refreshPreview() {
    updateQRPreview();
    showNotification('Preview refreshed', 'success');
}

function downloadQR(format) {
    if (!appState.qrCode) {
        showNotification('Please generate a QR code first', 'error');
        return;
    }

    const campaignNameInput = document.getElementById('campaignName');
    const campaignName = campaignNameInput?.value || 'qr-code';
    const canvas = document.getElementById('qrCanvas');

    if (format === 'png' && canvas) {
        const link = document.createElement('a');
        link.download = `${campaignName}-qr.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        addToFilesList(`${campaignName}-qr.png`, 'PNG', canvas.toDataURL('image/png'));

    } else if (format === 'svg') {
        // For SVG, we'd need to regenerate or use a different approach
        // This is a simplified version
        showNotification('SVG download feature coming soon', 'info');
        return;
    }

    showNotification(`QR code downloaded as ${format.toUpperCase()}`, 'success');
    console.log(`📥 Downloaded QR code as ${format}`);
}

// File Management
function addToFilesList(filename, format, dataUrl) {
    const file = {
        id: Date.now(),
        name: filename,
        format: format,
        size: estimateFileSize(dataUrl),
        created: new Date().toISOString(),
        dataUrl: dataUrl
    };

    appState.files.push(file);
}

function estimateFileSize(dataUrl) {
    const sizeBytes = Math.round((dataUrl.length * 3) / 4);
    if (sizeBytes < 1024) return `${sizeBytes} B`;
    if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`;
    return `${Math.round(sizeBytes / (1024 * 1024))} MB`;
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });

    const colors = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

console.log('📊 Dashboard JavaScript loaded successfully');