// ==================== CASES PAGE JAVASCRIPT ====================
// Handles all functionality for cases.html

// ==================== SAMPLE CASES DATA ====================
// This acts like a database (stored in browser localStorage)
let casesData = [
    {
        id: 'CR-247',
        crimeType: 'Ransomware Attack',
        victim: 'TechCorp Ltd',
        officer: 'Det. J. Davis',
        priority: 'critical',
        status: 'high',
        date: 'Jan 22, 2025',
        description: 'Ransomware attack encrypting critical company data'
    },
    {
        id: 'CR-246',
        crimeType: 'Financial Fraud',
        victim: 'First National Bank',
        officer: 'Ofc. S. Miller',
        priority: 'high',
        status: 'active',
        date: 'Jan 21, 2025',
        description: 'Unauthorized wire transfers detected'
    },
    {
        id: 'CR-245',
        crimeType: 'Identity Theft',
        victim: 'Jane Doe',
        officer: 'Analyst A. Chen',
        priority: 'medium',
        status: 'new',
        date: 'Jan 21, 2025',
        description: 'Stolen identity used for credit card fraud'
    },
    {
        id: 'CR-244',
        crimeType: 'Data Exfiltration',
        victim: 'MedSystems Inc',
        officer: 'Det. R. Torres',
        priority: 'high',
        status: 'active',
        date: 'Jan 20, 2025',
        description: 'Patient records leaked to external servers'
    },
    {
        id: 'CR-241',
        crimeType: 'Phishing Campaign',
        victim: 'Govt. Agency',
        officer: 'Ofc. K. Lee',
        priority: 'low',
        status: 'closed',
        date: 'Jan 18, 2025',
        description: 'Mass phishing emails targeting employees'
    },
    {
        id: 'CR-238',
        crimeType: 'Insider Threat',
        victim: 'DataFlow Corp',
        officer: 'Det. M. Kumar',
        priority: 'medium',
        status: 'closed',
        date: 'Jan 15, 2025',
        description: 'Employee stole confidential trade secrets'
    }
];

// ==================== INITIALIZE ON PAGE LOAD ====================
document.addEventListener('DOMContentLoaded', function() {
    // Load cases from localStorage if available
    loadCasesFromStorage();
    // Render the cases table
    renderCasesTable();
    // Update KPI counts
    updateCaseStats();
});

// ==================== STORAGE FUNCTIONS ====================
function loadCasesFromStorage() {
    const saved = localStorage.getItem('forensicVault_cases');
    if (saved) {
        try {
            casesData = JSON.parse(saved);
        } catch (e) {
            console.log('Using default cases data');
        }
    }
}

function saveCasesToStorage() {
    localStorage.setItem('forensicVault_cases', JSON.stringify(casesData));
}

// ==================== RENDER TABLE ====================
function renderCasesTable(filteredData = null) {
    const tbody = document.querySelector('#casesTable tbody');
    if (!tbody) return;

    const dataToRender = filteredData || casesData;

    if (dataToRender.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;padding:40px;color:#6b7280;">
                    <i class="fas fa-inbox" style="font-size:32px;margin-bottom:10px;display:block;"></i>
                    No cases found
                </td>
            </tr>`;
        document.getElementById('caseCount').textContent = 0;
        return;
    }

    tbody.innerHTML = dataToRender.map(c => {
        const priorityClass = c.priority === 'critical' || c.priority === 'high' ? 'priority-high' :
                              c.priority === 'medium' ? 'priority-medium' : 'priority-low';
        const priorityLabel = c.priority.charAt(0).toUpperCase() + c.priority.slice(1);

        const statusMap = {
            'new': { class: 'status-new', label: 'New Case' },
            'active': { class: 'status-active', label: 'Under Investigation' },
            'high': { class: 'status-high', label: 'High Priority' },
            'closed': { class: 'status-closed', label: 'Closed' }
        };
        const statusInfo = statusMap[c.status] || statusMap.new;

        return `
            <tr data-status="${c.status}" data-priority="${c.priority === 'critical' ? 'high' : c.priority}">
                <td><strong style="color:#00c6ff;">${c.id}</strong></td>
                <td>${c.crimeType}</td>
                <td>${c.victim}</td>
                <td>${c.officer}</td>
                <td><span class="${priorityClass}"><i class="fas fa-circle"></i> ${priorityLabel}</span></td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td>${c.date}</td>
                <td>
                    <button class="tbl-btn view" onclick="viewCase('${c.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="tbl-btn edit" onclick="editCase('${c.id}')" title="Edit"><i class="fas fa-pen"></i></button>
                    <button class="tbl-btn del" onclick="deleteCase('${c.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');

    document.getElementById('caseCount').textContent = dataToRender.length;
}

// ==================== UPDATE KPI STATS ====================
function updateCaseStats() {
    const total = casesData.length;
    const active = casesData.filter(c => c.status === 'active').length;
    const closed = casesData.filter(c => c.status === 'closed').length;
    const highPriority = casesData.filter(c => c.status === 'high' || c.priority === 'critical' || c.priority === 'high').length;

    // Update KPI cards (only if they use the IDs)
    const kpis = document.querySelectorAll('.kpi-card h3');
    if (kpis.length >= 4) {
        kpis[0].textContent = total;
        kpis[1].textContent = active;
        kpis[2].textContent = closed;
        kpis[3].textContent = highPriority;
    }
}

// ==================== FILTER CASES ====================
function filterCases() {
    const search = document.getElementById('caseSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const priority = document.getElementById('priorityFilter').value;

    const filtered = casesData.filter(c => {
        const matchSearch = !search || 
            c.id.toLowerCase().includes(search) ||
            c.crimeType.toLowerCase().includes(search) ||
            c.victim.toLowerCase().includes(search) ||
            c.officer.toLowerCase().includes(search);

        const matchStatus = !status || c.status === status;

        const matchPriority = !priority || 
            (priority === 'high' && (c.priority === 'critical' || c.priority === 'high')) ||
            (priority === 'medium' && c.priority === 'medium') ||
            (priority === 'low' && c.priority === 'low');

        return matchSearch && matchStatus && matchPriority;
    });

    renderCasesTable(filtered);
}

// ==================== CREATE NEW CASE ====================
function openNewCaseModal() {
    showModal('📁 Create New Case',
        `<div class="modal-form">
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Crime Type <span style="color:#ff4757;">*</span></label>
                    <select id="new-crime-type">
                        <option value="Cybercrime">Cybercrime</option>
                        <option value="Financial Fraud">Financial Fraud</option>
                        <option value="Identity Theft">Identity Theft</option>
                        <option value="Ransomware Attack">Ransomware Attack</option>
                        <option value="Data Exfiltration">Data Exfiltration</option>
                        <option value="Phishing Campaign">Phishing Campaign</option>
                        <option value="Insider Threat">Insider Threat</option>
                        <option value="Malware Infection">Malware Infection</option>
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Priority <span style="color:#ff4757;">*</span></label>
                    <select id="new-priority">
                        <option value="critical">Critical</option>
                        <option value="high" selected>High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>
            <div class="form-group-modal">
                <label>Victim / Organization <span style="color:#ff4757;">*</span></label>
                <input type="text" id="new-victim" placeholder="Enter victim or organization name">
            </div>
            <div class="form-group-modal">
                <label>Case Description</label>
                <textarea id="new-description" placeholder="Brief description of the incident..."></textarea>
            </div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Assign Officer <span style="color:#ff4757;">*</span></label>
                    <select id="new-officer">
                        <option value="Det. J. Davis">Det. J. Davis</option>
                        <option value="Ofc. S. Miller">Ofc. S. Miller</option>
                        <option value="Analyst A. Chen">Analyst A. Chen</option>
                        <option value="Det. R. Torres">Det. R. Torres</option>
                        <option value="Ofc. K. Lee">Ofc. K. Lee</option>
                        <option value="Det. M. Kumar">Det. M. Kumar</option>
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Status</label>
                    <select id="new-status">
                        <option value="new" selected>New Case</option>
                        <option value="active">Under Investigation</option>
                        <option value="high">High Priority</option>
                    </select>
                </div>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="submitNewCase()"><i class="fas fa-plus"></i> Create Case</button>`
    );
}

function submitNewCase() {
    const crimeType = document.getElementById('new-crime-type').value;
    const priority = document.getElementById('new-priority').value;
    const victim = document.getElementById('new-victim').value.trim();
    const description = document.getElementById('new-description').value.trim();
    const officer = document.getElementById('new-officer').value;
    const status = document.getElementById('new-status').value;

    // Validation
    if (!victim) {
        showToast('Please enter victim/organization name', 'error');
        return;
    }

    // Generate new case ID
    const lastId = casesData.length > 0 
        ? Math.max(...casesData.map(c => parseInt(c.id.replace('CR-', '')))) 
        : 240;
    const newId = 'CR-' + (lastId + 1);

    // Get today's date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Create new case object
    const newCase = {
        id: newId,
        crimeType,
        victim,
        officer,
        priority,
        status,
        date: dateStr,
        description
    };

    // Add to array (at the top)
    casesData.unshift(newCase);

    // Save and refresh
    saveCasesToStorage();
    renderCasesTable();
    updateCaseStats();

    closeModal();
    showToast(`Case ${newId} created successfully!`, 'success');
}

// ==================== VIEW CASE ====================
function viewCase(id) {
    const c = casesData.find(x => x.id === id);
    if (!c) {
        showToast('Case not found', 'error');
        return;
    }

    const priorityColors = {
        critical: '#ff4757',
        high: '#ffa502',
        medium: '#ffd43b',
        low: '#2ecc71'
    };

    const statusMap = {
        'new': { class: 'status-new', label: 'New Case' },
        'active': { class: 'status-active', label: 'Under Investigation' },
        'high': { class: 'status-high', label: 'High Priority' },
        'closed': { class: 'status-closed', label: 'Closed' }
    };
    const statusInfo = statusMap[c.status] || statusMap.new;

    showModal(`📁 Case Details — ${c.id}`,
        `<div class="detail-grid">
            <div class="detail-item">
                <label>Case ID</label>
                <strong style="color:#00c6ff;">${c.id}</strong>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span class="status-badge ${statusInfo.class}">${statusInfo.label}</span>
            </div>
            <div class="detail-item">
                <label>Priority</label>
                <span style="color:${priorityColors[c.priority]};font-weight:600;">
                    <i class="fas fa-circle" style="font-size:8px;"></i> ${c.priority.toUpperCase()}
                </span>
            </div>
            <div class="detail-item">
                <label>Date Filed</label>
                <span>${c.date}</span>
            </div>
            <div class="detail-item full">
                <label>Crime Type</label>
                <span style="font-size:14px;font-weight:600;">${c.crimeType}</span>
            </div>
            <div class="detail-item full">
                <label>Victim / Organization</label>
                <span>${c.victim}</span>
            </div>
            <div class="detail-item full">
                <label>Assigned Officer</label>
                <span>${c.officer}</span>
            </div>
            ${c.description ? `
            <div class="detail-item full">
                <label>Description</label>
                <span style="line-height:1.6;">${c.description}</span>
            </div>` : ''}
            <div class="detail-item full">
                <label>Linked Evidence (3)</label>
                <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap;">
                    <span style="padding:4px 10px;background:rgba(0,198,255,0.15);color:#00c6ff;border-radius:12px;font-size:11px;">EV-103</span>
                    <span style="padding:4px 10px;background:rgba(0,198,255,0.15);color:#00c6ff;border-radius:12px;font-size:11px;">EV-104</span>
                    <span style="padding:4px 10px;background:rgba(0,198,255,0.15);color:#00c6ff;border-radius:12px;font-size:11px;">EV-098</span>
                </div>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Close</button>
         <button class="btn-modal-primary" onclick="closeModal();editCase('${c.id}')"><i class="fas fa-pen"></i> Edit Case</button>
         <a href="custody.html" class="btn-modal-primary" style="text-decoration:none;background:linear-gradient(135deg,#ffa502,#ff8c00);"><i class="fas fa-link"></i> Custody Log</a>`
    );
}

// ==================== EDIT CASE ====================
function editCase(id) {
    const c = casesData.find(x => x.id === id);
    if (!c) {
        showToast('Case not found', 'error');
        return;
    }

    const crimeTypes = ['Cybercrime', 'Financial Fraud', 'Identity Theft', 'Ransomware Attack', 'Data Exfiltration', 'Phishing Campaign', 'Insider Threat', 'Malware Infection'];
    const officers = ['Det. J. Davis', 'Ofc. S. Miller', 'Analyst A. Chen', 'Det. R. Torres', 'Ofc. K. Lee', 'Det. M. Kumar'];

    showModal(`✏️ Edit Case — ${c.id}`,
        `<div class="modal-form">
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Crime Type</label>
                    <select id="edit-crime-type">
                        ${crimeTypes.map(t => `<option value="${t}" ${t === c.crimeType ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Priority</label>
                    <select id="edit-priority">
                        <option value="critical" ${c.priority === 'critical' ? 'selected' : ''}>Critical</option>
                        <option value="high" ${c.priority === 'high' ? 'selected' : ''}>High</option>
                        <option value="medium" ${c.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="low" ${c.priority === 'low' ? 'selected' : ''}>Low</option>
                    </select>
                </div>
            </div>
            <div class="form-group-modal">
                <label>Victim / Organization</label>
                <input type="text" id="edit-victim" value="${c.victim}">
            </div>
            <div class="form-group-modal">
                <label>Description</label>
                <textarea id="edit-description">${c.description || ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Officer</label>
                    <select id="edit-officer">
                        ${officers.map(o => `<option value="${o}" ${o === c.officer ? 'selected' : ''}>${o}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group-modal">
                    <label>Status</label>
                    <select id="edit-status">
                        <option value="new" ${c.status === 'new' ? 'selected' : ''}>New Case</option>
                        <option value="active" ${c.status === 'active' ? 'selected' : ''}>Under Investigation</option>
                        <option value="high" ${c.status === 'high' ? 'selected' : ''}>High Priority</option>
                        <option value="closed" ${c.status === 'closed' ? 'selected' : ''}>Closed</option>
                    </select>
                </div>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" onclick="submitEditCase('${c.id}')"><i class="fas fa-save"></i> Save Changes</button>`
    );
}

function submitEditCase(id) {
    const index = casesData.findIndex(c => c.id === id);
    if (index === -1) return;

    const victim = document.getElementById('edit-victim').value.trim();
    if (!victim) {
        showToast('Victim name is required', 'error');
        return;
    }

    // Update the case
    casesData[index] = {
        ...casesData[index],
        crimeType: document.getElementById('edit-crime-type').value,
        priority: document.getElementById('edit-priority').value,
        victim: victim,
        description: document.getElementById('edit-description').value.trim(),
        officer: document.getElementById('edit-officer').value,
        status: document.getElementById('edit-status').value
    };

    saveCasesToStorage();
    renderCasesTable();
    updateCaseStats();

    closeModal();
    showToast(`Case ${id} updated successfully!`, 'success');
}

// ==================== DELETE CASE ====================
function deleteCase(id) {
    const c = casesData.find(x => x.id === id);
    if (!c) return;

    showModal('🗑️ Delete Case',
        `<p style="margin-bottom:12px;">Are you sure you want to delete this case?</p>
         <div style="padding:14px;background:rgba(255,71,87,0.08);border:1px solid rgba(255,71,87,0.2);border-radius:8px;">
            <div style="font-size:14px;color:#fff;margin-bottom:4px;">
                <strong style="color:#00c6ff;">${c.id}</strong> — ${c.crimeType}
            </div>
            <div style="font-size:12px;color:#b0c4de;">Victim: ${c.victim}</div>
         </div>
         <p style="margin-top:12px;color:#ff4757;font-size:12px;">
            ⚠️ This action cannot be undone. All linked evidence references will remain but unlinked.
         </p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-danger" onclick="confirmDeleteCase('${id}')"><i class="fas fa-trash"></i> Delete Permanently</button>`
    );
}

function confirmDeleteCase(id) {
    casesData = casesData.filter(c => c.id !== id);
    saveCasesToStorage();
    renderCasesTable();
    updateCaseStats();

    closeModal();
    showToast(`Case ${id} deleted`, 'warning');
}

// ==================== EXPORT CASES ====================
function exportCases() {
    const csv = [
        ['Case ID', 'Crime Type', 'Victim', 'Officer', 'Priority', 'Status', 'Date', 'Description'],
        ...casesData.map(c => [c.id, c.crimeType, c.victim, c.officer, c.priority, c.status, c.date, c.description || ''])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensicvault_cases_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`${casesData.length} cases exported successfully!`, 'success');
}