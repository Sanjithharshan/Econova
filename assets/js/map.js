// EcoNova Map Module - Leaflet + Role Permissions
const BINS_KEY = 'econova_bins';
const USER_KEY = 'econova_user';
let map, markersLayer, isEditMode = false, role = 'citizen', user = null;

// Default center (fallback)
const DEFAULT_CENTER = [12.9716, 77.5946]; // Bengaluru

// Helpers
function loadBins(){ try{return JSON.parse(localStorage.getItem(BINS_KEY))||[]}catch(e){return []} }
function saveBins(b){ localStorage.setItem(BINS_KEY, JSON.stringify(b)); }
function loadUser(){ try{return JSON.parse(localStorage.getItem(USER_KEY))}catch(e){return null} }
function uid(){ return 'B'+Math.random().toString(36).slice(2,9); }

function init(){
	user = loadUser();
	if(!user){ window.location.href = '../index.html'; return; }
	role = user.role;

	setupMap();
	setupSidebar();
	renderBinsList();
	applyRoleControls();
}

function setupMap(){
	map = L.map('map').setView(DEFAULT_CENTER, 12);
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
	markersLayer = L.layerGroup().addTo(map);
	refreshMarkers();

	// Add marker on click in edit mode
	map.on('click', (e)=>{
		if(!isEditor()) return;
		if(!isEditMode) return;
		const coord = e.latlng;
		const bin = { id: uid(), name: 'New Bin', status: 'ok', type: 'mixed', lat: coord.lat, lng: coord.lng, notes: '', updatedAt: new Date().toISOString() };
		const bins = loadBins(); bins.push(bin); saveBins(bins);
		refreshMarkers(); renderBinsList();
	});
}

function setupSidebar(){
	// Address
	const addrEl = document.getElementById('userAddress');
	addrEl.textContent = user.address || 'Not set';
	document.getElementById('setAddressBtn').addEventListener('click', ()=>{
		const val = prompt('Enter your address (e.g., House No, Street, Area):', user.address||'');
		if(val!==null){ user.address = val.trim(); localStorage.setItem(USER_KEY, JSON.stringify(user)); addrEl.textContent = user.address || 'Not set'; }
	});

	// Tools
	const editTools = document.getElementById('editTools');
	if(isEditor()) editTools.style.display = 'block';
	
	document.getElementById('addBinBtn').addEventListener('click', ()=>{ isEditMode = true; alert('Edit mode ON: click on the map to add a bin.'); });
	document.getElementById('toggleEditBtn').addEventListener('click', ()=>{ isEditMode = !isEditMode; alert(`Edit mode ${isEditMode?'ON':'OFF'}`); });
}

function isEditor(){ return role==='admin' || role==='municipal'; }

function refreshMarkers(){
	markersLayer.clearLayers();
	const bins = loadBins();
	bins.forEach(b=>{
		const marker = L.marker([b.lat, b.lng]).addTo(markersLayer);
		marker.bindPopup(renderPopupHTML(b));
	});
}

function renderPopupHTML(b){
	const details = `<div style="min-width:220px">
		<div style="font-weight:700">${escapeHtml(b.name)}</div>
		<div style="color:#6b7280;font-size:.85rem">Type: ${b.type} • Status: ${b.status}</div>
		${b.notes? `<div style=\"margin-top:.4rem;\">Notes: ${escapeHtml(b.notes)}</div>`:''}
		<div style="margin-top:.6rem;display:flex;gap:.4rem;flex-wrap:wrap;">
			${isEditor()? `<button class=\"mini-btn\" onclick=\"window.__mapEdit('${b.id}')\"><i class=\"fas fa-pen\"></i></button>`:''}
			${isEditor()? `<button class=\"mini-btn danger\" onclick=\"window.__mapDelete('${b.id}')\"><i class=\"fas fa-trash\"></i></button>`:''}
		</div>
	</div>`;
	return details;
}

function renderBinsList(){
	const cont = document.getElementById('binsContainer');
	const bins = loadBins();
	if(bins.length===0){ cont.innerHTML = '<p style="color:#6b7280;text-align:center;">No bins yet. (Admins/Municipal can add by clicking the map in edit mode.)</p>'; return; }
	cont.innerHTML = bins.map(b=> `
		<div class="bin-item">
			<div>
				<div><strong>${escapeHtml(b.name)}</strong></div>
				<div class="bin-meta">${b.type} • ${b.status} • ${new Date(b.updatedAt).toLocaleString()}</div>
			</div>
			<div class="action-row">
				<button class="icon-btn" onclick="window.__mapZoom('${b.id}')"><i class="fas fa-magnifying-glass"></i></button>
				${isEditor()? `<button class="icon-btn" onclick="window.__mapEdit('${b.id}')"><i class="fas fa-pen"></i></button>`:''}
				${isEditor()? `<button class="icon-btn" onclick="window.__mapDelete('${b.id}')"><i class="fas fa-trash"></i></button>`:''}
			</div>
		</div>
	`).join('');
}

// Exposed actions
window.__mapZoom = function(id){
	const b = loadBins().find(x=>x.id===id); if(!b) return; map.setView([b.lat,b.lng], 16);
}
window.__mapEdit = function(id){
	if(!isEditor()) return;
	const bins = loadBins(); const idx = bins.findIndex(x=>x.id===id); if(idx<0) return;
	const b = bins[idx];
	const name = prompt('Bin name:', b.name);
	if(name===null) return;
	const type = prompt('Type (organic/recyclable/hazardous/mixed):', b.type);
	if(type===null) return;
	const status = prompt('Status (ok/needs-repair/overflow):', b.status);
	if(status===null) return;
	const notes = prompt('Notes:', b.notes||'');
	if(notes===null) return;
	bins[idx] = { ...b, name: name.trim()||'Bin', type: type.trim()||'mixed', status: status.trim()||'ok', notes: notes.trim(), updatedAt: new Date().toISOString() };
	saveBins(bins); refreshMarkers(); renderBinsList();
}
window.__mapDelete = function(id){
	if(!isEditor()) return;
	if(!confirm('Delete this bin?')) return;
	const bins = loadBins().filter(x=>x.id!==id); saveBins(bins); refreshMarkers(); renderBinsList();
}

function applyRoleControls(){
	// Sidebar edit tools visibility handled earlier; popup buttons controlled in HTML builders
}

function escapeHtml(str){ return (str||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

document.addEventListener('DOMContentLoaded', init);
