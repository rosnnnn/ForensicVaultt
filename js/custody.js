// ==================== CHAIN OF CUSTODY JAVASCRIPT ====================

let custodyLogs = [
    {
        id: 1,
        type: 'alert',
        icon: '⚠️',
        title: '🚨 Unauthorized Modification Attempt BLOCKED',
        user: 'Unknown IP',
        ip: '192.168.1.45',
        time: '02:15 AM',
        date: 'Jan 22, 2025',
        description: 'Attempt to modify Evidence EV-089 · Access denied by security system · Incident logged and admin notified',
        evidenceId: 'EV-089'
    },
    {
        id: 2,
        type: 'upload',
        icon: '📤',
        title: 'Evidence Uploaded to System',
        user: 'Officer J. Davis',
        time: '10:24 AM',
        date: 'Jan 22, 2025',
        description: 'Evidence EV-103 uploaded · Size: 4.2 MB · SHA-256 hash generated',
        hash: 'a3f8c91d2e4b67890f1a2b3c4d5e6f7890a1b2c3d4e5f6789012345678901234',
        evidenceId: 'EV-103'
    },
    {
        id: 3,
        type: 'verify',
        icon: '✅',
        title: 'Hash Integrity Verified',
        user: 'Analyst A. Chen',
        time: '11:02 AM',
        date: 'Jan 22, 2025',
        description: 'Evidence EV-103 · SHA-256 match confirmed · Integrity fully intact',
        evidenceId: 'EV-103'
    },
    {
        id: 4,
        type: 'view',
        icon: '👁️',
        title: 'Evidence Accessed (Read-Only)',
        user: 'Det. R. Torres',
        time: '02:15 PM',
        date: 'Jan 22, 2025',
        description: 'Evidence EV-103 accessed for Case CR-247 · Read-only session · Duration: 24 minutes',
        evidenceId: 'EV-103'
    },
    {
        id: 5,
        type: 'transfer',
        icon: '📋',
        title: 'Evidence Transferred to Court',
        user: 'Administrator',
        time: '03:30 PM',
        date: 'Jan 22, 2025',
        description: 'Encrypted transfer completed · Recipient: District Court · Transfer ID: TRX-8823',
        evidenceId: 'EV-103'
    },
    {
        id: 6,
        type: 'report',
        icon: '📊',
        title: 'Final Report Generated',
        user: 'Administrator',
        time: '04:30 PM',
        date: 'Jan 22, 2025',
        description: 'CR-247 Final Report · PDF format · 42 pages · Digitally signed',
        evidenceId: 'CR-247'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    renderCustodyLog();
});

function renderCustodyLog(filterEvidenceId = null) {
    const container = document.querySelector('.custody-timeline');
    if (!container) return;

    const data = filterEvidenceId 
        ? custodyLogs.filter(l => l.evidenceId === filterEvidenceId)
        : custodyLogs;

    if (data.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px;color:#6b7280;">
            <i class="fas fa-inbox" style="font-size:32px;margin-bottom:10px;display:block;"></i>
            No custody records found</div>`;
        return;
    }

    const typeStyles = {
        alert: { bg: 'rgba(255,71,87,0.15)', color: '#ff4757', border: '#ff4757' },
        upload: { bg: 'rgba(0,198,255,0.15)', color: '#00c6ff', border: '#00c6ff' },
        verify: { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: '#2ecc71' },
        view: { bg: 'rgba(52,152,219,0.15)', color: '#3498db', border: '#3498db' },
        transfer: { bg: 'rgba(155,89,182,0.15)', color: '#9b59b6', border: '#9b59b6' },
        report: { bg: 'rgba(255,165,2,0.15)', color: '#ffa502', border: '#ffa502' }
    };

    container.innerHTML = data.map((log, idx) => {
        const style = typeStyles[log.type] || typeStyles.view;
        const isLast = idx === data.length - 1;

        return `
            <div class="ct-item ${log.type === 'alert' ? 'alert' : ''}">
                <div class="ct-dot" style="background:${style.bg};color:${style.color};border-color:${style.border};">${log.icon}</div>
                ${!isLast ? '<div class="ct-line"></div>' : ''}
                <div class="ct-content">
                    <h4 ${log.type === 'alert' ? 'style="color:#ff4757;"' : ''}>${log.title}</h4>
                    <div class="ct-meta">
                        <span><i class="fas fa-user"></i> ${log.user}</span>
                        ${log.ip ? `<span><i class="fas fa-globe"></i> ${log.ip}</span>` : ''}
                        <span><i class="fas fa-clock"></i> ${log.time} · ${log.date}</span>
                    </div>
                    <p class="ct-desc">${log.description}</p>
                    ${log.hash ? `<div class="hash-display" style="margin-top:8px;">${log.hash}</div>` : ''}
                </div>
            </div>`;
    }).join('');
}

function filterCustody() {
    const filter = document.getElementById('custodyFilter').value;
    renderCustodyLog(filter || null);
}

function exportCustodyLog() {
    const csv = [
        ['Time', 'Date', 'Type', 'Title', 'User', 'IP', 'Evidence ID', 'Description'],
        ...custodyLogs.map(l => [l.time, l.date, l.type, l.title, l.user, l.ip || '', l.evidenceId || '', l.description])
    ].map(row => row.map(c => `"${c}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `custody_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Custody log exported successfully!', 'success');
}