// ===================================
// COMPLAINTS MODULE - Role-based
// ===================================

const STORAGE_KEY = 'econova_complaints';
let currentUser = null; // { username, role }

// Load user from auth storage
function getCurrentUser(){
    try{ return JSON.parse(localStorage.getItem('econova_user')); }catch(e){ return null; }
}

// Read/Write storage
function readComplaints(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){ return []; }
}
function writeComplaints(list){ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }

// Util
function uid(){ return 'C'+Math.random().toString(36).slice(2,9); }
function now(){ return new Date().toISOString(); }
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }

// Init
document.addEventListener('DOMContentLoaded', ()=>{
    currentUser = getCurrentUser();
    if(!currentUser){ window.location.href = '../index.html'; return; }

    setupRoleUI();
    bindEvents();
    renderList();
});

function setupRoleUI(){
    // Citizen sees submit form; others hide it
    const isCitizen = currentUser.role === 'citizen';
    document.getElementById('submitSection').style.display = isCitizen ? 'block' : 'none';

    const listTitle = document.getElementById('listTitle');
    if(currentUser.role === 'municipal') listTitle.innerHTML = '<i class="fas fa-inbox"></i> All Complaints';
    if(currentUser.role === 'admin') listTitle.innerHTML = '<i class="fas fa-inbox"></i> Complaints to Administrator';
    if(currentUser.role === 'recycler') listTitle.innerHTML = '<i class="fas fa-inbox"></i> Complaints to Recycler';
}

function bindEvents(){
    const form = document.getElementById('complaintForm');
    if(form){ form.addEventListener('submit', submitComplaint); }

    document.getElementById('statusFilter').addEventListener('change', renderList);
    document.getElementById('recipientFilter').addEventListener('change', renderList);
}

function submitComplaint(e){
    e.preventDefault();
    const title = document.getElementById('cmpTitle').value.trim();
    const target = document.getElementById('cmpTarget').value;
    const category = document.getElementById('cmpCategory').value;
    const location = document.getElementById('cmpLocation').value.trim();
    const description = document.getElementById('cmpDescription').value.trim();

    if(!title || !target || !description){ alert('Please fill title, recipient and description'); return; }

    const complaints = readComplaints();
    complaints.unshift({
        id: uid(),
        title, target, category, location, description,
        status: 'open',
        createdAt: now(),
        createdBy: { username: currentUser.username, role: currentUser.role }
    });
    writeComplaints(complaints);

    e.target.reset();
    alert('Complaint submitted successfully');
    renderList();
}

function filterByRole(complaints){
    if(currentUser.role === 'municipal'){
        return complaints; // see all
    }
    if(currentUser.role === 'admin'){
        return complaints.filter(c=> c.target === 'admin');
    }
    if(currentUser.role === 'recycler'){
        return complaints.filter(c=> c.target === 'recycler');
    }
    // citizen: see only own complaints
    return complaints.filter(c=> c.createdBy && c.createdBy.username === currentUser.username);
}

function applyUIFilters(list){
    const status = document.getElementById('statusFilter').value;
    const recipient = document.getElementById('recipientFilter').value;
    return list.filter(c=> (status==='all'||c.status===status) && (recipient==='all'||c.target===recipient));
}

function renderList(){
    const container = document.getElementById('complaintsList');
    const all = readComplaints();
    const scoped = filterByRole(all);
    const filtered = applyUIFilters(scoped);

    if(filtered.length===0){ container.innerHTML = '<p style="color:#6b7280;text-align:center;">No complaints to show</p>'; return; }

    container.innerHTML = filtered.map(c=> complaintItemHTML(c)).join('');
    // bind per-item actions
    container.querySelectorAll('[data-action]').forEach(btn=>{
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');
        btn.addEventListener('click', ()=> handleAction(action,id));
    });
}

function complaintItemHTML(c){
    const canManage = currentUser.role === 'municipal';
    return `
    <div class="complaint-item" style="border-left-color:${statusColor(c.status)}">
        <div>
            <div class="item-title">${escapeHtml(c.title)}</div>
            <div class="item-meta">to ${cap(c.target)} • ${cap(c.category)} • by ${escapeHtml(c.createdBy.username)} • ${new Date(c.createdAt).toLocaleString()}</div>
            <div class="item-meta"><span class="status ${c.status}">${cap(c.status)}</span></div>
        </div>
        <div class="item-actions">
            <button class="icon-btn" data-action="view" data-id="${c.id}"><i class="fas fa-eye"></i></button>
            ${canManage ? `
            <button class="icon-btn" data-action="open" data-id="${c.id}"><i class="fas fa-folder-open"></i></button>
            <button class="icon-btn" data-action="progress" data-id="${c.id}"><i class="fas fa-spinner"></i></button>
            <button class="icon-btn" data-action="resolve" data-id="${c.id}"><i class="fas fa-check"></i></button>` : ''}
        </div>
    </div>`;
}

function handleAction(action,id){
    if(action==='view'){ return openView(id); }
    if(currentUser.role!=='municipal') return;
    const list = readComplaints();
    const idx = list.findIndex(x=>x.id===id);
    if(idx===-1) return;
    if(action==='open') list[idx].status='open';
    if(action==='progress') list[idx].status='in-progress';
    if(action==='resolve') list[idx].status='resolved';
    writeComplaints(list);
    renderList();
}

function openView(id){
    const c = readComplaints().find(x=>x.id===id);
    if(!c) return;
    document.getElementById('modalTitle').textContent = c.title;
    document.getElementById('modalBody').innerHTML = `
        <div style="display:grid;gap:.6rem;">
            <div><strong>Recipient:</strong> ${cap(c.target)}</div>
            <div><strong>Category:</strong> ${cap(c.category)}</div>
            <div><strong>Status:</strong> ${cap(c.status)}</div>
            <div><strong>Location:</strong> ${c.location?escapeHtml(c.location):'—'}</div>
            <div><strong>Raised by:</strong> ${escapeHtml(c.createdBy.username)} (${cap(c.createdBy.role)})</div>
            <div><strong>Description:</strong><br>${escapeHtml(c.description)}</div>
        </div>`;
    document.getElementById('viewModal').classList.add('active');
}
function closeViewModal(){ document.getElementById('viewModal').classList.remove('active'); }

function statusColor(s){
    if(s==='in-progress') return '#f59e0b';
    if(s==='resolved') return '#10b981';
    return '#10b981';
}

// basic HTML escaping
function escapeHtml(str){ return str.replace(/[&<>"]+/g, s=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[s])); }
