// ==================== DASHBOARD PAGE JAVASCRIPT ====================

document.addEventListener('DOMContentLoaded', function() {
    updateDashboardStats();
    animateKPIs();
});

function updateDashboardStats() {
    // Load real data from localStorage
    const cases = JSON.parse(localStorage.getItem('forensicVault_cases') || '[]');
    const evidence = JSON.parse(localStorage.getItem('forensicVault_evidence') || '[]');

    const totalCases = cases.length > 0 ? cases.length : 156;
    const activeCases = cases.filter(c => c.status === 'active').length || 42;
    const totalEvidence = evidence.length > 0 ? evidence.length : 1247;
    const verifiedEvidence = evidence.filter(e => e.status === 'verified').length || 1189;

    const kpis = document.querySelectorAll('.kpi-card h3');
    if (kpis.length >= 4) {
        kpis[0].setAttribute('data-target', totalCases);
        kpis[1].setAttribute('data-target', activeCases);
        kpis[2].setAttribute('data-target', totalEvidence);
        kpis[3].setAttribute('data-target', verifiedEvidence);
    }
}

function animateKPIs() {
    const kpis = document.querySelectorAll('.kpi-card h3');
    kpis.forEach(kpi => {
        const target = parseInt(kpi.getAttribute('data-target') || kpi.textContent);
        if (isNaN(target)) return;

        let current = 0;
        const duration = 1500;
        const step = target / (duration / 16);

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            kpi.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Quick action shortcuts
function quickNewCase() {
    window.location.href = 'cases.html';
}

function quickUploadEvidence() {
    window.location.href = 'evidence.html';
}

function quickGenerateReport() {
    window.location.href = 'reports.html';
}