// ==================== EVIDENCE PAGE WITH REAL FILE UPLOAD ====================

let evidenceData = [];
let selectedFile = null;

document.addEventListener('DOMContentLoaded', function() {
    loadEvidenceFromStorage();
    renderEvidenceTable();
    updateEvidenceStats();
});

function loadEvidenceFromStorage() {
    const saved = localStorage.getItem('forensicVault_evidence');
    if (saved) {
        try {
            evidenceData = JSON.parse(saved);
        } catch (e) {
            evidenceData = getDefaultEvidence();
        }
    } else {
        evidenceData = getDefaultEvidence();
        saveEvidenceToStorage();
    }
}

function getDefaultEvidence() {
    return [
        { id: 'EV-103', type: 'image', caseId: 'CR-247', description: 'Screenshot of ransom note', uploadedBy: 'Det. J. Davis', status: 'verified', date: 'Jan 22, 2025', size: '4.2 MB', hash: 'a3f8c91d2e4b67890f1a2b3c4d5e6f7890a1b2c3d4e5f6789012345678901234', fileData: null, fileName: 'ransom_note.png' },
        { id: 'EV-102', type: 'document', caseId: 'CR-246', description: 'Bank transaction records', uploadedBy: 'Ofc. S. Miller', status: 'verified', date: 'Jan 21, 2025', size: '1.8 MB', hash: 'b4c9d02e3f5a78901b2c3d4e5f67890a1b2c3d4e5f67890123456789012345bc', fileData: null, fileName: 'transactions.pdf' },
        { id: 'EV-101', type: 'video', caseId: 'CR-244', description: 'CCTV footage recording', uploadedBy: 'Det. R. Torres', status: 'pending', date: 'Jan 20, 2025', size: '245 MB', hash: 'c5d0e13f4a6b89012c3d4e5f6789012a3b4c5d6e7f890123456789012345cdef', fileData: null, fileName: 'cctv_footage.mp4' },
        { id: 'EV-089', type: 'audio', caseId: 'CR-241', description: 'Recorded phone call', uploadedBy: 'Ofc. K. Lee', status: 'tamper', date: 'Jan 18, 2025', size: '12.4 MB', hash: 'd6e1f24a5b7c90123d4e5f6789012a3b4c5d6e7f8901234567890123456defab', fileData: null, fileName: 'phone_call.mp3' }
    ];
}

function saveEvidenceToStorage() {
    try {
        localStorage.setItem('forensicVault_evidence', JSON.stringify(evidenceData));
    } catch (e) {
        showToast('Storage limit reached! Delete old evidence.', 'error');
    }
}

function renderEvidenceTable(filteredData = null) {
    const tbody = document.querySelector('#evidenceTable tbody');
    if (!tbody) return;

    const data = filteredData || evidenceData;

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:40px;color:#6b7280;">
            <i class="fas fa-inbox" style="font-size:32px;margin-bottom:10px;display:block;"></i>
            No evidence found</td></tr>`;
        return;
    }

    const typeIcons = {
        image: { icon: 'fa-image', color: '#3498db', label: 'Image' },
        document: { icon: 'fa-file-alt', color: '#2ecc71', label: 'Document' },
        video: { icon: 'fa-video', color: '#9b59b6', label: 'Video' },
        audio: { icon: 'fa-volume-up', color: '#ffa502', label: 'Audio' },
        other: { icon: 'fa-file', color: '#00c6ff', label: 'Other' }
    };

    const statusMap = {
        verified: { class: 'status-closed', label: '✓ Verified' },
        pending: { class: 'status-active', label: '⏳ Pending' },
        tamper: { class: 'status-high', label: '⚠ Tamper Alert' }
    };

    tbody.innerHTML = data.map(e => {
        const typeInfo = typeIcons[e.type] || typeIcons.other;
        const statusInfo = statusMap[e.status] || statusMap.pending;

        return `
            <tr data-type="${e.type}" data-status="${e.status}">
                <td><strong style="color:#00c6ff;">${e.id}</strong></td>
                <td><span class="type-tag"><i class="fas ${typeInfo.icon}" style="color:${typeInfo.color};"></i> ${typeInfo.label}</span></td>
                <td><strong style="color:#00c6ff;">${e.caseId}</strong></td>
                <td>${e.description}</td>
                <td>${e.uploadedBy}</td>
                <td><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></td>
                <td>${e.date}</td>
                <td>
                    <button class="tbl-btn view" onclick="viewEvidence('${e.id}')" title="View"><i class="fas fa-eye"></i></button>
                    <button class="tbl-btn edit" onclick="verifyEvidence('${e.id}')" title="Verify Hash"><i class="fas fa-fingerprint"></i></button>
                    <button class="tbl-btn del" onclick="deleteEvidence('${e.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            </tr>`;
    }).join('');
}

function updateEvidenceStats() {
    const total = evidenceData.length;
    const verified = evidenceData.filter(e => e.status === 'verified').length;
    const pending = evidenceData.filter(e => e.status === 'pending').length;
    const tamper = evidenceData.filter(e => e.status === 'tamper').length;

    const kpis = document.querySelectorAll('.kpi-card h3');
    if (kpis.length >= 4) {
        kpis[0].textContent = total.toLocaleString();
        kpis[1].textContent = verified.toLocaleString();
        kpis[2].textContent = pending;
        kpis[3].textContent = tamper;
    }

    const typeCounts = {
        image: evidenceData.filter(e => e.type === 'image').length,
        video: evidenceData.filter(e => e.type === 'video').length,
        document: evidenceData.filter(e => e.type === 'document').length,
        audio: evidenceData.filter(e => e.type === 'audio').length,
        other: evidenceData.filter(e => e.type === 'other').length
    };

    const typeCards = document.querySelectorAll('.evidence-type-card h3');
    if (typeCards.length >= 5) {
        typeCards[0].textContent = typeCounts.image;
        typeCards[1].textContent = typeCounts.video;
        typeCards[2].textContent = typeCounts.document;
        typeCards[3].textContent = typeCounts.audio;
        typeCards[4].textContent = typeCounts.other;
    }
}

function filterEvidence() {
    const search = document.getElementById('evSearch')?.value.toLowerCase() || '';
    const type = document.getElementById('evTypeFilter')?.value || '';
    const status = document.getElementById('evStatusFilter')?.value || '';

    const filtered = evidenceData.filter(e => {
        const matchSearch = !search ||
            e.id.toLowerCase().includes(search) ||
            e.description.toLowerCase().includes(search) ||
            e.caseId.toLowerCase().includes(search) ||
            e.uploadedBy.toLowerCase().includes(search);
        const matchType = !type || e.type === type;
        const matchStatus = !status || e.status === status;
        return matchSearch && matchType && matchStatus;
    });

    renderEvidenceTable(filtered);
}

// ==================== UPLOAD MODAL ====================
function openUploadModal() {
    selectedFile = null;
    showModal('📤 Upload New Evidence',
        `<div class="modal-form">
            <div class="drop-zone" id="dropZone" onclick="document.getElementById('fileInput').click()">
                <div style="font-size:42px;margin-bottom:10px;">📂</div>
                <p style="color:#b0c4de;font-size:14px;">Drag & drop files or <span style="color:#00c6ff;font-weight:600;cursor:pointer;">click to browse</span></p>
                <p style="color:#6b7280;font-size:11px;margin-top:6px;">Max 5MB per file (localStorage limit)</p>
                <input type="file" id="fileInput" style="display:none;" onchange="handleFileSelect(event)" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt">
                <div id="filePreview" style="margin-top:12px;"></div>
            </div>
            <div class="form-row">
                <div class="form-group-modal">
                    <label>Linked Case ID <span style="color:#ff4757;">*</span></label>
                    <input type="text" id="up-case" placeholder="e.g., CR-247" value="CR-247">
                </div>
                <div class="form-group-modal">
                    <label>Evidence Type</label>
                    <select id="up-type">
                        <option value="image">Digital Image</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="audio">Audio File</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
            <div class="form-group-modal">
                <label>Description <span style="color:#ff4757;">*</span></label>
                <textarea id="up-desc" placeholder="Brief description of evidence..."></textarea>
            </div>
        </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" id="uploadBtn" onclick="submitUpload()"><i class="fas fa-upload"></i> Upload & Generate Hash</button>`
    );

    // Enable drag & drop
    setTimeout(() => {
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.style.borderColor = '#00c6ff';
                dropZone.style.background = 'rgba(0,198,255,0.05)';
            });
            dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                dropZone.style.borderColor = 'rgba(0,198,255,0.3)';
                dropZone.style.background = '';
            });
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFile(files[0]);
                }
            });
        }
    }, 100);
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) handleFile(file);
}

async function handleFile(file) {
    // Size check (5MB limit for localStorage)
    if (file.size > 5 * 1024 * 1024) {
        showToast('File too large! Max 5MB (localStorage limit)', 'error');
        return;
    }

    selectedFile = file;

    // Auto-detect type
    let detectedType = 'other';
    if (file.type.startsWith('image/')) detectedType = 'image';
    else if (file.type.startsWith('video/')) detectedType = 'video';
    else if (file.type.startsWith('audio/')) detectedType = 'audio';
    else if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) detectedType = 'document';

    const typeSelect = document.getElementById('up-type');
    if (typeSelect) typeSelect.value = detectedType;

    // Show preview
    const preview = document.getElementById('filePreview');
    if (preview) {
        preview.innerHTML = `
            <div style="padding:12px;background:rgba(0,198,255,0.08);border:1px solid rgba(0,198,255,0.2);border-radius:8px;text-align:left;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <div style="width:40px;height:40px;background:rgba(0,198,255,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:20px;">
                        ${detectedType === 'image' ? '🖼️' : detectedType === 'video' ? '🎬' : detectedType === 'audio' ? '🎵' : detectedType === 'document' ? '📄' : '💾'}
                    </div>
                    <div style="flex:1;overflow:hidden;">
                        <div style="color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${file.name}</div>
                        <div style="color:#b0c4de;font-size:11px;">${formatFileSize(file.size)} • ${file.type || 'Unknown type'}</div>
                    </div>
                    <button onclick="removeSelectedFile()" style="background:rgba(255,71,87,0.15);border:none;color:#ff4757;padding:6px 10px;border-radius:6px;cursor:pointer;"><i class="fas fa-times"></i></button>
                </div>
            </div>`;
    }
}

function removeSelectedFile() {
    selectedFile = null;
    document.getElementById('filePreview').innerHTML = '';
    document.getElementById('fileInput').value = '';
}

async function submitUpload() {
    const caseId = document.getElementById('up-case').value.trim();
    const type = document.getElementById('up-type').value;
    const description = document.getElementById('up-desc').value.trim();

    if (!selectedFile) {
        showToast('Please select a file to upload', 'error');
        return;
    }
    if (!caseId) {
        showToast('Please enter Case ID', 'error');
        return;
    }
    if (!description) {
        showToast('Please enter description', 'error');
        return;
    }

    // Show loading
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating SHA-256 Hash...';
    }

    try {
        // Generate REAL SHA-256 hash
        const hash = await generateSHA256(selectedFile);
        // Convert file to base64 for storage
        const fileData = await fileToBase64(selectedFile);

        const lastId = evidenceData.length > 0
            ? Math.max(...evidenceData.map(e => parseInt(e.id.replace('EV-', '')) || 0))
            : 100;
        const newId = 'EV-' + (lastId + 1);

        const today = new Date();
        const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const newEvidence = {
            id: newId,
            type,
            caseId: caseId.toUpperCase(),
            description,
            uploadedBy: localStorage.getItem('username') || 'John Doe',
            status: 'verified',
            date: dateStr,
            size: formatFileSize(selectedFile.size),
            hash,
            fileData,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
            uploadedAt: new Date().toISOString()
        };

        evidenceData.unshift(newEvidence);
        saveEvidenceToStorage();
        renderEvidenceTable();
        updateEvidenceStats();

        // Add notification
        if (typeof addNotification === 'function') {
            addNotification('New Evidence Uploaded', `${newId} added to case ${caseId.toUpperCase()}`, 'evidence', '📤');
        }

        closeModal();
        showToast(`✅ Evidence ${newId} uploaded! Hash generated.`, 'success');
        selectedFile = null;
    } catch (err) {
        console.error('Upload error:', err);
        showToast('Upload failed: ' + err.message, 'error');
        if (uploadBtn) {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload & Generate Hash';
        }
    }
}

// ==================== VIEW EVIDENCE (with file preview!) ====================
function viewEvidence(id) {
    const e = evidenceData.find(x => x.id === id);
    if (!e) return;

    const typeIcons = { image: '🖼️', video: '🎬', document: '📄', audio: '🎵', other: '💾' };
    const statusMap = {
        verified: { class: 'status-closed', label: '✓ Verified & Intact' },
        pending: { class: 'status-active', label: '⏳ Pending Verification' },
        tamper: { class: 'status-high', label: '⚠ Tamper Detected' }
    };
    const statusInfo = statusMap[e.status];

    // Build file preview
    let filePreviewHTML = '';
    if (e.fileData) {
        if (e.type === 'image') {
            filePreviewHTML = `
                <div class="detail-item full">
                    <label>File Preview</label>
                    <div style="margin-top:8px;text-align:center;background:#000;border-radius:8px;padding:10px;">
                        <img src="${e.fileData}" style="max-width:100%;max-height:400px;border-radius:6px;" alt="${e.fileName}">
                    </div>
                </div>`;
        } else if (e.type === 'video') {
            filePreviewHTML = `
                <div class="detail-item full">
                    <label>Video Preview</label>
                    <div style="margin-top:8px;">
                        <video controls style="width:100%;max-height:400px;border-radius:8px;background:#000;">
                            <source src="${e.fileData}" type="${e.fileType || 'video/mp4'}">
                            Your browser doesn't support video playback.
                        </video>
                    </div>
                </div>`;
        } else if (e.type === 'audio') {
            filePreviewHTML = `
                <div class="detail-item full">
                    <label>Audio Preview</label>
                    <div style="margin-top:8px;padding:20px;background:rgba(0,198,255,0.05);border-radius:8px;text-align:center;">
                        <div style="font-size:48px;margin-bottom:10px;">🎵</div>
                        <audio controls style="width:100%;">
                            <source src="${e.fileData}" type="${e.fileType || 'audio/mpeg'}">
                            Your browser doesn't support audio playback.
                        </audio>
                    </div>
                </div>`;
        } else if (e.type === 'document') {
            const isPDF = e.fileType === 'application/pdf' || e.fileName?.endsWith('.pdf');
            if (isPDF) {
                filePreviewHTML = `
                    <div class="detail-item full">
                        <label>Document Preview</label>
                        <div style="margin-top:8px;">
                            <iframe src="${e.fileData}" style="width:100%;height:400px;border:1px solid rgba(0,198,255,0.2);border-radius:8px;background:#fff;"></iframe>
                        </div>
                    </div>`;
            } else {
                filePreviewHTML = `
                    <div class="detail-item full">
                        <label>Document</label>
                        <div style="margin-top:8px;padding:20px;background:rgba(46,204,113,0.05);border-radius:8px;text-align:center;">
                            <div style="font-size:48px;margin-bottom:10px;">📄</div>
                            <p style="color:#b0c4de;margin-bottom:12px;">${e.fileName}</p>
                            <a href="${e.fileData}" download="${e.fileName}" class="btn-modal-primary" style="text-decoration:none;display:inline-flex;">
                                <i class="fas fa-download"></i> Download File
                            </a>
                        </div>
                    </div>`;
            }
        } else {
            filePreviewHTML = `
                <div class="detail-item full">
                    <label>File</label>
                    <div style="margin-top:8px;padding:20px;background:rgba(0,198,255,0.05);border-radius:8px;text-align:center;">
                        <div style="font-size:48px;margin-bottom:10px;">💾</div>
                        <p style="color:#b0c4de;margin-bottom:12px;">${e.fileName}</p>
                        <a href="${e.fileData}" download="${e.fileName}" class="btn-modal-primary" style="text-decoration:none;display:inline-flex;">
                            <i class="fas fa-download"></i> Download File
                        </a>
                    </div>
                </div>`;
        }
    } else {
        filePreviewHTML = `
            <div class="detail-item full">
                <label>File</label>
                <div style="padding:20px;background:rgba(107,114,128,0.05);border-radius:8px;text-align:center;color:#6b7280;">
                    <i class="fas fa-file" style="font-size:32px;margin-bottom:8px;display:block;"></i>
                    Sample evidence (no actual file stored)
                </div>
            </div>`;
    }

    showModal(`🗂️ Evidence Details — ${e.id}`,
        `<div class="detail-grid">
            <div class="detail-item"><label>Evidence ID</label><strong style="color:#00c6ff;">${e.id}</strong></div>
            <div class="detail-item"><label>Type</label><span>${typeIcons[e.type]} ${e.type.charAt(0).toUpperCase() + e.type.slice(1)}</span></div>
            <div class="detail-item"><label>Linked Case</label><strong style="color:#00c6ff;">${e.caseId}</strong></div>
            <div class="detail-item"><label>File Size</label><span>${e.size}</span></div>
            <div class="detail-item full"><label>Status</label><span class="status-badge ${statusInfo.class}">${statusInfo.label}</span></div>
            <div class="detail-item full"><label>Description</label><span>${e.description}</span></div>
            <div class="detail-item full"><label>File Name</label><span style="font-family:monospace;color:#00c6ff;">${e.fileName || 'N/A'}</span></div>
            ${filePreviewHTML}
            <div class="detail-item full"><label>SHA-256 Hash</label><div class="hash-display">${e.hash}</div></div>
            <div class="detail-item full"><label>Upload Info</label><span>Uploaded by <strong>${e.uploadedBy}</strong> on ${e.date}</span></div>
         </div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Close</button>
         ${e.fileData ? `<a href="${e.fileData}" download="${e.fileName || e.id}" class="btn-modal-primary" style="text-decoration:none;background:linear-gradient(135deg,#2ecc71,#27ae60);"><i class="fas fa-download"></i> Download</a>` : ''}
         <button class="btn-modal-primary" onclick="closeModal();verifyEvidence('${e.id}')"><i class="fas fa-fingerprint"></i> Verify Hash</button>`
    );
}

// ==================== VERIFY HASH ====================
async function verifyEvidence(id) {
    const e = evidenceData.find(x => x.id === id);
    if (!e) return;

    showModal('🔐 Verify Hash Integrity',
        `<p style="margin-bottom:14px;color:#b0c4de;">Verifying SHA-256 hash for <strong style="color:#00c6ff;">${e.id}</strong></p>
         <div class="hash-info-box">
            <strong style="color:#2ecc71;">🔒 Original SHA-256 Hash:</strong>
            <div class="hash-display" style="margin-top:8px;">${e.hash}</div>
         </div>
         ${e.fileData ? `
         <div style="margin-top:12px;padding:12px;background:rgba(0,198,255,0.05);border:1px solid rgba(0,198,255,0.15);border-radius:8px;">
            <p style="font-size:12px;color:#b0c4de;">
                <i class="fas fa-info-circle" style="color:#00c6ff;margin-right:6px;"></i>
                Re-computing SHA-256 hash from stored file data to check integrity.
            </p>
         </div>` : ''}
         <div id="verifyResult" style="margin-top:12px;"></div>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-primary" id="verifyBtn" onclick="performVerification('${e.id}')"><i class="fas fa-fingerprint"></i> Verify Now</button>`
    );
}

async function performVerification(id) {
    const e = evidenceData.find(x => x.id === id);
    if (!e) return;

    const verifyBtn = document.getElementById('verifyBtn');
    const resultDiv = document.getElementById('verifyResult');
    
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    }

    setTimeout(async () => {
        let isValid = true;
        let currentHash = e.hash;

        // If file data exists, re-compute hash
        if (e.fileData) {
            try {
                // Convert base64 back to blob
                const response = await fetch(e.fileData);
                const blob = await response.blob();
                currentHash = await generateSHA256(blob);
                isValid = currentHash === e.hash;
            } catch (err) {
                console.error('Verification error:', err);
            }
        } else {
            // Simulate for demo data
            isValid = e.status !== 'tamper';
        }

        if (resultDiv) {
            if (isValid) {
                resultDiv.innerHTML = `
                    <div style="padding:14px;background:rgba(46,204,113,0.1);border:1px solid rgba(46,204,113,0.3);border-radius:8px;">
                        <div style="color:#2ecc71;font-weight:600;margin-bottom:6px;">
                            <i class="fas fa-check-circle"></i> Hash Matches! Evidence is Intact ✅
                        </div>
                        <div class="hash-display" style="margin-top:6px;">${currentHash}</div>
                    </div>`;
                e.status = 'verified';
            } else {
                resultDiv.innerHTML = `
                    <div style="padding:14px;background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.3);border-radius:8px;">
                        <div style="color:#ff4757;font-weight:600;margin-bottom:6px;">
                            <i class="fas fa-exclamation-triangle"></i> TAMPERING DETECTED! ⚠️
                        </div>
                        <div style="font-size:12px;color:#b0c4de;">Hash mismatch — file has been modified.</div>
                        <div class="hash-display" style="margin-top:8px;">Current: ${currentHash}</div>
                    </div>`;
                e.status = 'tamper';
                if (typeof addNotification === 'function') {
                    addNotification('⚠️ Tamper Alert', `${id} hash mismatch detected!`, 'alert', '⚠️');
                }
            }
            saveEvidenceToStorage();
            renderEvidenceTable();
            updateEvidenceStats();
        }

        if (verifyBtn) {
            verifyBtn.innerHTML = '<i class="fas fa-check"></i> Verification Complete';
        }

        showToast(isValid ? `✅ ${id} verified successfully!` : `⚠️ ${id} tampering detected!`, isValid ? 'success' : 'error');
    }, 1000);
}

// ==================== DELETE ====================
function deleteEvidence(id) {
    const e = evidenceData.find(x => x.id === id);
    if (!e) return;

    showModal('🗑️ Delete Evidence',
        `<p>Are you sure you want to delete evidence <strong style="color:#00c6ff;">${e.id}</strong>?</p>
         <p style="margin-top:10px;color:#ff4757;font-size:12px;">
            ⚠️ This will permanently remove the file and cannot be undone.
         </p>`,
        `<button class="btn-modal-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn-modal-danger" onclick="confirmDeleteEvidence('${id}')"><i class="fas fa-trash"></i> Delete</button>`
    );
}

function confirmDeleteEvidence(id) {
    evidenceData = evidenceData.filter(e => e.id !== id);
    saveEvidenceToStorage();
    renderEvidenceTable();
    updateEvidenceStats();
    closeModal();
    showToast(`Evidence ${id} deleted`, 'warning');
}

function exportEvidence() {
    const csv = [
        ['Evidence ID', 'Type', 'Case ID', 'Description', 'Uploaded By', 'Status', 'Date', 'Size', 'SHA-256 Hash', 'File Name'],
        ...evidenceData.map(e => [e.id, e.type, e.caseId, e.description, e.uploadedBy, e.status, e.date, e.size, e.hash, e.fileName || 'N/A'])
    ].map(row => row.map(c => `"${c}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forensicvault_evidence_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`${evidenceData.length} evidence items exported!`, 'success');
}