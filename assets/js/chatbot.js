// EcoNova Chatbot Widget
(function(){
	const KB = buildKnowledgeBase();
	let root, panel, body, input, quick;

	function init(){
		root = document.createElement('div');
		root.className = 'econova-chatbot';
		root.innerHTML = `
			<button class="cb-fab" aria-label="Open EcoNova Assistant" id="cbFab"><i class="fas fa-comment-dots"></i></button>
			<div class="cb-panel" id="cbPanel">
				<div class="cb-header">
					<i class="fas fa-robot"></i>
					<div>
						<div class="cb-title">EcoNova Assistant</div>
						<div class="cb-sub">Ask about segregation, pickups, recycling, tips</div>
					</div>
				</div>
				<div class="cb-body" id="cbBody"></div>
				<div class="cb-quick" id="cbQuick"></div>
				<div class="cb-input">
					<input id="cbInput" type="text" placeholder="Type your question..." />
					<button id="cbSend">Send</button>
				</div>
			</div>`;
		document.body.appendChild(root);
		panel = root.querySelector('#cbPanel');
		body = root.querySelector('#cbBody');
		input = root.querySelector('#cbInput');
		quick = root.querySelector('#cbQuick');

		root.querySelector('#cbFab').addEventListener('click', ()=> panel.classList.toggle('active'));
		root.querySelector('#cbSend').addEventListener('click', send);
		input.addEventListener('keydown', e=>{ if(e.key==='Enter') send(); });

		greet();
		renderQuick(['Segregation','Pickup','Recycling','Tips','Help']);
	}

	function greet(){
		const user = getUser();
		addBot(`Hi${user ? `, ${user.username}`:''}! I can help with waste segregation, pickup scheduling, recycling centers, and eco tips. Try: "How do I dispose plastic?"`);
	}

	function send(){
		const text = (input.value || '').trim();
		if(!text) return;
		input.value = '';
		addUser(text);
		setTimeout(()=> handle(text), 150);
	}

	function handle(text){
		const intent = detectIntent(text);
		switch(intent.name){
			case 'segregation': return addBot(answerSegregation(intent));
			case 'pickup': return addBot(answerPickup(intent));
			case 'recycling': return addBot(answerRecycling(intent));
			case 'tips': return addBot(answerTips(intent));
			case 'greeting': return greet();
			default: return addBot("I'm not sure yet. You can ask about segregation, pickups, recycling locations, or tips. Type 'help' for examples.");
		}
	}

	function detectIntent(text){
		const q = text.toLowerCase();
		if(/hi|hello|hey\b/.test(q)) return { name:'greeting' };
		if(/(segregat|dispose|bin|which bin|category|organic|plastic|glass|metal|paper|ewaste|e-waste|hazard)/.test(q)){
			const item = extractItem(q);
			return { name:'segregation', item };
		}
		if(/(pickup|collection|schedule|when.*collect|next.*pickup|bin.*full)/.test(q)){
			const day = /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/.exec(q)?.[1];
			return { name:'pickup', day };
		}
		if(/(recycling|center|location|nearest|drop.?off|where.*recycle)/.test(q)){
			const area = /in\s+([a-z\s]+)/.exec(q)?.[1]?.trim();
			return { name:'recycling', area };
		}
		if(/(tip|reduce|reuse|compost|save|environment|eco)/.test(q)) return { name:'tips' };
		if(/help|examples|what can you do/.test(q)) return { name:'tips' };
		return { name:'unknown' };
	}

	function extractItem(q){
		const items = ['plastic','glass','metal','paper','cardboard','organic','food','ewaste','e-waste','battery','electronics','hazardous','medical'];
		return items.find(i=> q.includes(i));
	}

	function answerSegregation({item}){
		if(!item) return KB.segregation.default;
		return KB.segregation.items[item] || KB.segregation.default;
	}
	function answerPickup({day}){
		const user = getUser();
		const base = KB.pickup.base.replace('{{area}}', user?.area || 'your area');
		if(day) return base + ' ' + `For ${cap(day)}, pickups start at 7:00am.`;
		return base + ' ' + KB.pickup.hint;
	}
	function answerRecycling({area}){
		const a = (area||'nearby').toLowerCase();
		const list = KB.recycling.sample.map(x=> `• ${x.name} – ${x.address}` ).join('\n');
		return `Here are some ${a} recycling drop‑off options:\n${list}\nYou can filter by plastic, paper, glass, or e‑waste. (Demo data)`;
	}
	function answerTips(){
		return 'Quick eco tips:\n• Rinse and dry recyclables before binning\n• Compost fruit/veg scraps\n• Keep e‑waste separate\n• Flatten cardboard to save space\n• Carry a reusable bottle and bag';
	}

	function renderQuick(labels){
		quick.innerHTML = '';
		labels.forEach(l=>{
			const b = document.createElement('button');
			b.textContent = l;
			b.addEventListener('click', ()=>{
				const map = {Segregation:'How do I dispose plastic?', Pickup:'When is the next pickup?', Recycling:'Recycling centers near me', Tips:'Give me eco tips', Help:'help'};
				input.value = map[l] || l; send();
			});
			quick.appendChild(b);
		});
	}

	function addBot(text){ addMsg('bot', text); }
	function addUser(text){ addMsg('user', text); }
	function addMsg(author, text){
		const div = document.createElement('div');
		div.className = 'cb-msg '+author;
		div.innerHTML = `<div class="bubble">${escape(text).replace(/\n/g,'<br>')}</div>`;
		body.appendChild(div); body.scrollTop = body.scrollHeight;
	}

	function getUser(){
		try{ return JSON.parse(localStorage.getItem('econova_user')); }catch(e){ return null; }
	}
	function cap(s){ return s? s.charAt(0).toUpperCase()+s.slice(1):''; }
	function escape(s){ return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

	function buildKnowledgeBase(){
		return {
			segregation:{
				default:'General segregation: Organic → green; Recyclables (plastic, paper, metal, glass) → blue; Non‑recyclable → gray; Hazardous & e‑waste → designated centers.',
				items:{
					'plastic':'Plastic: Rinse, dry, remove food residue. Place in blue recyclables bin. Soft films may require store drop‑off.',
					'glass':'Glass: Rinse. Keep lids off. Place in blue bin. Avoid broken glass in regular bins; use wrapped and labeled disposal if required locally.',
					'paper':'Paper/Cardboard: Keep dry. Flatten boxes. Remove plastic liners. Recycle in blue bin.',
					'cardboard':'Cardboard: Flatten to save space. Remove tapes if possible. Blue bin.',
					'organic':'Organic/Food: Use green bin or home compost; avoid liquids and plastic liners.',
					'food':'Food scraps: Green bin or compost; drain excess liquids.',
					'metal':'Metal cans: Rinse and place in blue bin; keep sharp edges safe.',
					'ewaste':'E‑waste: Keep separate. Take to certified e‑waste center or municipal drives.',
					'e-waste':'E‑waste: Keep separate. Take to certified e‑waste center or municipal drives.',
					'battery':'Batteries: Hazardous. Use battery collection points; never put in household bins.',
					'hazardous':'Hazardous (paints, chemicals, medical): Use municipal hazardous waste programs; never in household bins.',
					'medical':'Medical waste: Use approved sharps/medical disposal services; do not place in regular bins.'
				}
			},
			pickup:{
				base:'Pickup scheduling: Smart routes are generated from bin levels in {{area}}. For planned schedules, check the dashboard calendar.',
				hint:'Tell me your area or day (e.g., "next pickup on Tuesday?") to get specifics.'
			},
			recycling:{
				sample:[
					{ name:'EcoGreen Recycling Center', address:'12 Greenway Ave (Plastics, Paper, Glass)' },
					{ name:'e‑Cycle Hub', address:'44 Circuit Rd (E‑waste only)' },
					{ name:'BlueBin Drop‑off', address:'Market Square P2 (Cans, Bottles)' }
				]
			}
		};
	}

	// bootstrap
	document.addEventListener('DOMContentLoaded', ()=>{
		if(!document.querySelector('.econova-chatbot')) init();
	});
})();
