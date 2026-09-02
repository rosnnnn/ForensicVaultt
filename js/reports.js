// ==================== REPORTS PAGE JAVASCRIPT ====================

let reportsData = [
    {
        id: 'RPT-084',
        title: 'Ransomware Investigation Report',
        caseId: 'CR-247',
        type: 'Case Summary',
        generatedBy: 'Administrator',
        status: 'draft',
        date: 'Jan 22, 2025',
        format: 'PDF'
    },
    {
        id: 'RPT-083',
        title: 'Fraud Evidence Summary',
        caseId: 'CR-246',
        type: 'Evidence',
        generatedBy: 'Analyst A. Chen',
        status: 'review',
        date: 'Jan 21, 2025',
        format: 'PDF'
    },
    {
        id: 'RPT-081',
        title: 'Phishing Case Final Report',
        caseId: 'CR-241',
        type: 'Custody Log',
        generatedBy: 'Det. R. Torres',
        status: 'submitted',
        date: 'Jan 18, 2025',
        format: 'PDF'
    },
    {
        id: 'RPT-079',
        title: 'Monthly Analytics Report',
        caseId: '-',
        type: 'Analytics',
        generatedBy: 'Administrator',
        status: 'submitted',
        date: 'Jan 01, 2025',
        format: 'Excel'
    }
];

let selectedFormat = 'PDF';
let selectedReportType = null;

document.addEventListener('DOMContentLoaded', function() {
    loadReportsFromStorage();
    renderReportsTable();
    updateReportStats();
});

function loadReportsFromStorage() {
    const saved = localStorage.getItem('forensicVault_reports');
    if (saved) {
        try {
            reportsData = JSON.parse(saved);
        } catch (e) {}
    }
}

function saveReportsToStorage() {
    localStorage.setItem('forensicVault_reports', JSON.stringify(reportsData));
}

function renderReportsTable() {
    const tbody = document.querySelector('#reportsTable tbody');
    if (!tbody) return;

    if (reportsData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:#6b7280;">
            <i class="fas fa-inbox" style="font-size:32px;margin-bottom:10px;display:block;"></i>
            No reports found</td></tr>`;
        return;
    }

    const statusMap = {
        draft: { class: 'status-active', label: 'Draft' },
        review: { class: 'status-new', label: 'Under Review' },
        submitted: { class: 'status-closed', label: 'Submitted' }
    };

    tbody.innerHTML = reportsData.map(r => {
        const statusInfo = statusMap[r.status] || statusMap.draft;
        return `
            <tr>
                <td><strong style="color:#00c6ff;">${r.id}</strong></td>
                <td>${r.title}</td>
                <td><strong style="color:#00c6ff;">${r.caseId}</strong></td>
                <td><span class="type-tag">${r.type}</span></td>
                <td>${r.generatedBy}</td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td>${r.date}</td>
                <td>
                    <button class="tbl-btn view" onclick="viewReport('${r.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="tbl-btn edit" onclick="downloadReport('${r.id}')" title="Download"><i class="fas fa-download"></i></button>
                    <button class="tbl-btn del" onclick="deleteReport('${r.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');
}

function updateReportStats() {
    const total = reportsData.length;
    const submitted = reportsData.filter(r => r.status === 'submitted').length;
    const draft = reportsData.filter(r => r.status === 'draft').length;

    const kpis = document.querySelectorAll('.kpi-card h3');
    if (kpis.length >= 3) {
        kpis[0].textContent = total;
        kpis[1].textContent = submitted;
        kpis[2].textContent = draft;
    }
}

function openGenerateReportModal(preselectedType = null) {
    selectedReportType = preselectedType;
    selectedFormat = 'PDF';

    showModal('📊 Generate New Report',
        `<div class="modal-form">
            <div class="form-group-modal">
                <label>Report Title <span style="color:#ff4757;">*</span></label>
                <input type="text" id="rpt-title" placeholder="Enter report title" ${preselectedType ? `value="${preselectedType} Report"` : ''}>
            </div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Report Type</label>
                    <select id="rpt-type">
                        <option ${preselectedType === 'Case Summary' ? 'selected' : ''}>Case Summary</option>
                        <option ${preselectedType === 'Evidence Report' ? 'selected' : ''}>Evidence Report</option>
                        <option ${preselectedType === 'Chain of Custody' ? 'selected' : ''}>Chain of Custody</option>
                        <option ${preselectedType === 'Analytics' ? 'selected' : ''}>Analytics</option>
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Case ID (Optional)</label>
                    <input type="text" id="rpt-case" placeholder="e.g., CR-247">
                </div>
            </div>
            <div class="form-group-modal">
                <label>Format</label>
                <div style="display:flex;gap:8px;">
                    <button type="button" onclick="selectFormat('PDF', this)" class="format-btn active">PDF</button>
                    <button type="button" onclick="selectFormat('Excel', this)" class="format-btn">Excel</button>
                    <button type="button" onclick="selectFormat('CSV', this)" class="format-btn">CSV</button>
                    <button type="button" onclick="selectFormat('JSON', this)" class="format-btn">JSON</button>
                </div>
            </div>
            <div class="form-group-modal">
                <label>Additional Notes (Optional)</label>
                <textarea id="rpt-notes" placeholder="Any additional information..."></textarea>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="submitReport()"><i class="fas fa-download"></i> Generate Report</button>`
    );
}

function selectFormat(format, btn) {
    selectedFormat = format;
    btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function submitReport() {
    const title = document.getElementById('rpt-title').value.trim();
    const type = document.getElementById('rpt-type').value;
    const caseId = document.getElementById('rpt-case').value.trim() || '-';

    if (!title) {
        showToast('Please enter report title', 'error');
        return;
    }

    // Generate new report ID
    const lastId = reportsData.length > 0 
        ? Math.max(...reportsData.map(r => parseInt(r.id.replace('RPT-', '')))) 
        : 80;
    const newId = 'RPT-' + (lastId + 1);

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const newReport = {
        id: newId,
        title,
        caseId: caseId.toUpperCase(),
        type,
        generatedBy: localStorage.getItem('username') || 'Administrator',
        status: 'draft',
        date: dateStr,
        format: selectedFormat
    };

    reportsData.unshift(newReport);
    saveReportsToStorage();
    renderReportsTable();
    updateReportStats();

    closeModal();
    showToast(`Report ${newId} generated as ${selectedFormat}!`, 'success');
}

function viewReport(id) {
    const r = reportsData.find(x => x.id === id);
    if (!r) return;

    showModal(`📄 Report — ${r.id}`,
        `<div class="detail-grid">
            <div class="detail-item"><label>Report ID</label><strong style="color:#00c6ff;">${r.id}</strong></div>
            <div class="detail-item"><label>Format</label><span class="type-tag">${r.format}</span></div>
            <div class="detail-item full"><label>Title</label><strong>${r.title}</strong></div>
            <div class="detail-item"><label>Type</label><span>${r.type}</span></div>
            <div class="detail-item"><label>Case ID</label><strong style="color:#00c6ff;">${r.caseId}</strong></div>
            <div class="detail-item"><label>Generated By</label><span>${r.generatedBy}</span></div>
            <div class="detail-item"><label>Date</label><span>${r.date}</span></div>
            <div class="detail-item full"><label>Status</label>
                <span class="status-badge ${r.status === 'submitted' ? 'status-closed' : r.status === 'review' ? 'status-new' : 'status-active'}">
                    ${r.status === 'submitted' ? 'Submitted' : r.status === 'review' ? 'Under Review' : 'Draft'}
                </span>
            </div>
         </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Close</button>
         <button class="btn-modal-primary" onclick="downloadReport('${r.id}')"><i class="fas fa-download"></i> Download ${r.format}</button>`
    );
}

function downloadReport(id) {
    const r = reportsData.find(x => x.id === id);
    if (!r) return;

    // Simulate download
    const content = `FORENSIC VAULT - ${r.type.toUpperCase()} REPORT\n\n` +
                    `Report ID: ${r.id}\n` +
                    `Title: ${r.title}\n` +
                    `Case ID: ${r.caseId}\n` +
                    `Generated By: ${r.generatedBy}\n` +
                    `Date: ${r.date}\n` +
                    `Status: ${r.status}\n\n` +
                    `This is a sample report generated by ForensicVault system.\n` +
                    `All data is confidential and for authorized personnel only.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${r.id}_${r.title.replace(/\s+/g, '_')}.${r.format.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Report ${id} downloaded as ${r.format}`, 'success');
}

function deleteReport(id) {
    showModal('🗑️ Delete Report',
        `<p>Are you sure you want to delete report <strong style="color:#00c6ff;">${id}</strong>?</p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-danger" onclick="confirmDeleteReport('${id}')"><i class="fas fa-trash"></i> Delete</button>`
    );
}

function confirmDeleteReport(id) {
    reportsData = reportsData.filter(r => r.id !== id);
    saveReportsToStorage();
    renderReportsTable();
    updateReportStats();
    closeModal();
    showToast(`Report ${id} deleted`, 'warning');
}