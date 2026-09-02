// ==================== ANALYTICS PAGE JAVASCRIPT ====================

let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is ready
    setTimeout(initAllCharts, 200);
});

function initAllCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        return;
    }

    Chart.defaults.color = '#b0c4de';
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;

    initPieChart();
    initBarChart();
    initLineChart();
    initDonutChart();
}

function initPieChart() {
    const canvas = document.getElementById('chartPie');
    if (!canvas) return;

    charts.pie = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Cybercrime', 'Fraud', 'Identity Theft', 'Ransomware', 'Insider', 'Other'],
            datasets: [{
                data: [72, 54, 41, 38, 28, 14],
                backgroundColor: [
                    'rgba(0,198,255,0.8)',
                    'rgba(52,152,219,0.8)',
                    'rgba(155,89,182,0.8)',
                    'rgba(255,71,87,0.8)',
                    'rgba(255,165,2,0.8)',
                    'rgba(46,204,113,0.8)'
                ],
                borderColor: 'rgba(15,20,25,0.9)',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { padding: 12, boxWidth: 10 }
                },
                tooltip: {
                    backgroundColor: 'rgba(15,20,25,0.95)',
                    padding: 12,
                    cornerRadius: 8
                }
            }
        }
    });
}

function initBarChart() {
    const canvas = document.getElementById('chartBar');
    if (!canvas) return;

    charts.bar = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Davis', 'Miller', 'Chen', 'Torres', 'Lee', 'Kumar'],
            datasets: [{
                label: 'Cases Assigned',
                data: [42, 38, 31, 29, 24, 19],
                backgroundColor: 'rgba(0,198,255,0.7)',
                borderColor: 'rgba(0,198,255,1)',
                borderWidth: 1,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(0,198,255,0.9)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15,20,25,0.95)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
            }
        }
    });
}

function initLineChart() {
    const canvas = document.getElementById('chartLine');
    if (!canvas) return;

    charts.line = new Chart(canvas, {
        type: 'line',
        data: {
            labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
            datasets: [
                {
                    label: 'Cases Opened',
                    data: [28, 34, 31, 42, 38, 45, 52],
                    borderColor: '#00c6ff',
                    backgroundColor: 'rgba(0,198,255,0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00c6ff',
                    pointRadius: 5,
                    pointHoverRadius: 8
                },
                {
                    label: 'Cases Closed',
                    data: [22, 28, 26, 35, 31, 38, 44],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46,204,113,0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2ecc71',
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { padding: 16, boxWidth: 12 } },
                tooltip: {
                    backgroundColor: 'rgba(15,20,25,0.95)',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                x: { grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
            }
        }
    });
}

function initDonutChart() {
    const canvas = document.getElementById('chartDonut');
    if (!canvas) return;

    charts.donut = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Images', 'Videos', 'Documents', 'Audio', 'Other'],
            datasets: [{
                data: [412, 287, 394, 156, 180],
                backgroundColor: [
                    'rgba(52,152,219,0.8)',
                    'rgba(155,89,182,0.8)',
                    'rgba(46,204,113,0.8)',
                    'rgba(255,165,2,0.8)',
                    'rgba(0,198,255,0.8)'
                ],
                borderColor: 'rgba(15,20,25,0.9)',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 14, boxWidth: 12 }
                },
                tooltip: {
                    backgroundColor: 'rgba(15,20,25,0.95)',
                    padding: 12,
                    cornerRadius: 8
                }
            }
        }
    });
}

function exportAnalytics() {
    // Simulate analytics export
    const data = {
        exported: new Date().toISOString(),
        summary: {
            totalCases: 247,
            avgResolution: '14 days',
            hashVerificationRate: '89%',
            caseClosureRate: '92%'
        },
        crimeTypes: {
            Cybercrime: 72,
            Fraud: 54,
            IdentityTheft: 41,
            Ransomware: 38,
            Insider: 28,
            Other: 14
        },
        investigators: {
            Davis: 42, Miller: 38, Chen: 31,
            Torres: 29, Lee: 24, Kumar: 19
        }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Analytics data exported!', 'success');
}