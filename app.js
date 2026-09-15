const defaultOffices = [
  { id: 'OFF-01', name: 'Road Division Hilsa', type: 'Division', code: 'RDH', incharge: 'Executive Engineer', inchargeName: 'Hilsa Administrator', location: 'Hilsa, Nalanda' },
  { id: 'OFF-02', name: 'Road Sub Division Rajgir', type: 'Sub-Division', code: 'RSR', incharge: 'Assistant Engineer', inchargeName: 'Rajgir Data Creator', location: 'Rajgir, Nalanda' },
  { id: 'OFF-03', name: 'Road Sub Division Chandi', type: 'Sub-Division', code: 'RSC', incharge: 'Assistant Engineer', inchargeName: 'Chandi Data Viewer', location: 'Chandi, Nalanda' },
  { id: 'OFF-04', name: 'Quality Control Wing', type: 'Branch', code: 'QCW', incharge: 'Executive Engineer (QC)', inchargeName: 'Er. S. Kumar', location: 'Division Laboratory, Hilsa' },
  { id: 'OFF-05', name: 'Divisional Accounts Branch', type: 'Branch', code: 'DAB', incharge: 'Divisional Accounts Officer', inchargeName: 'Sri M. P. Sinha', location: 'Division HQ, Hilsa' }
];
const defaultDesignations = [
  'Executive Engineer',
  'Assistant Engineer',
  'Junior Engineer',
  'Divisional Accounts Officer',
  'Head Clerk',
  'Correspondence Clerk',
  'Data Entry Operator',
  'IT / Technical In-charge'
];
function getOffices(){
  if(!db||!db.offices||!Array.isArray(db.offices))return defaultOffices;
  if(typeof db.offices[0]==='string'){
    db.offices=db.offices.map((name,i)=>{
      let def=defaultOffices.find(d=>d.name===name);
      return def?JSON.parse(JSON.stringify(def)):{id:'OFF-'+String(i+1).padStart(2,'0'),name,type:name.toLowerCase().includes('sub')?'Sub-Division':(name.toLowerCase().includes('division')?'Division':'Branch'),code:name.split(' ').map(w=>w[0]).join('').toUpperCase(),incharge:'In-Charge Officer',inchargeName:'Designated Officer',location:'Nalanda'};
    });
  }
  return db.offices;
}
function getOfficeList(){return getOffices().map(o=>o.name)}
let offices=defaultOffices.map(o=>o.name);
function getUserOffices(u){
  if(!u)return defaultOffices.map(o=>o.name);
  if(u.assignedOffices&&Array.isArray(u.assignedOffices)&&u.assignedOffices.length)return u.assignedOffices;
  return [u.office||defaultOffices[0].name];
}
function renderOfficeBadges(u){
  let offs=getUserOffices(u),allOffs=getOfficeList();
  if(offs.length>=allOffs.length&&allOffs.length>1){
    return '<span class="badge-all-offices" title="Division-wide access across all units">🌐 All Offices ('+offs.length+')</span>';
  }
  let primary=u.office||offs[0],additional=offs.filter(o=>o!==primary);
  return '<div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">'
    +'<span class="badge-primary-office" title="Primary Office: '+esc(primary)+'">⭐ '+esc(primary)+'</span>'
    +additional.map(o=>'<span class="badge-assigned-office" title="Additional Assigned Office: '+esc(o)+'">+ '+esc(o)+'</span>').join('')
    +'</div>';
}

const defaultMaterials=[{item:'Stone Aggregate',letter:'(a)'},{item:'Sand',letter:'(b)'},{item:'Bricks',letter:'(c)'},{item:'Dust',letter:'(d)'},{item:'Boulder',letter:'(e)'},{item:'Earth Work',letter:'(f)'},{item:'Other Materials',letter:'(g)'}];
const sampleProject1Report={nameOfWork:'Strengthening and Widening of SH-71 (Hilsa - Chandi Section)',nameOfAgency:'M/s Bihar State Road Infra Construction Pvt. Ltd.',estimatedCost:'1452.80 Lakhs',agreementValue:'1389.20 Lakhs',dateOfStart:'2026-02-15',dateOfCompletionAgr:'2026-12-31',timeExtUpTo:'2027-03-31',timeExtLtNo:'RDH/TECH/2026/418',timeExtDate:'2026-08-10',aaAmount:'1452.80',aaLtNo:'RCD/PATNA/AA/108',aaDate:'2025-11-20',techApproval:'1452.80 Lakhs',techSanction:'1440.00 Lakhs',projectCostBOQ:'1389.20 Lakhs',dateOfTender:'2025-12-15',dateOfAgreement:'2026-02-01',actualDateOfCompletion:'In Progress (Target: 31 Dec 2026)',landAcquisition:'45.00',utilityShifting:'28.50',bitumenReq:'180.00 MT',bitumenConsumed:'125.40 MT',bitumenBalance:'54.60 MT',bitumenRemarks:'VG-30 Grade Bitumen',emulsionReq:'45.00 MT',emulsionConsumed:'32.00 MT',emulsionBalance:'13.00 MT',emulsionRemarks:'RS-1 Rapid Setting',materials:[{item:'Stone Aggregate',letter:'(a)',workDone:'18400 Cum',challanSubmitted:'18400 Cum',balanceChallan:'0',remarks:'Passed quality test'},{item:'Sand',letter:'(b)',workDone:'9200 Cum',challanSubmitted:'9200 Cum',balanceChallan:'0',remarks:'Coarse Sand Zone-II'},{item:'Bricks',letter:'(c)',workDone:'150000 Nos',challanSubmitted:'150000 Nos',balanceChallan:'0',remarks:'Class-I standard'},{item:'Dust',letter:'(d)',workDone:'4600 Cum',challanSubmitted:'4600 Cum',balanceChallan:'0',remarks:'Quarry Dust'},{item:'Boulder',letter:'(e)',workDone:'1200 Cum',challanSubmitted:'1200 Cum',balanceChallan:'0',remarks:'Sub-base filter'},{item:'Earth Work',letter:'(f)',workDone:'32000 Cum',challanSubmitted:'32000 Cum',balanceChallan:'0',remarks:'Embankment compaction'},{item:'Other Materials',letter:'(g)',workDone:'As per site',challanSubmitted:'Verified',balanceChallan:'0',remarks:'Kerb & Road signs'}],testReportBill:'3rd Running Account Bill',testReportLtNoDate:'QC/LAB/HIL/2026/89, Dt: 02-09-2026',testReportStatus:'Submitted',testReportRemarks:'All cube and core test reports attached and verified',updatedAt:'12 Sep 2026',updatedBy:'Hilsa Administrator'};
const seed={offices:JSON.parse(JSON.stringify(defaultOffices)),
users:[
{id:'ADM-HIL-01',name:'Hilsa Administrator',designation:'Executive Engineer',office:defaultOffices[0].name,assignedOffices:defaultOffices.map(o=>o.name),role:'Admin',password:'admin123',approved:true,permissions:{view:true,upload:true,edit:true,delete:true}},
{id:'CRE-RAJ-01',name:'Rajgir Data Creator',designation:'Assistant Engineer',office:defaultOffices[1].name,assignedOffices:[defaultOffices[1].name],role:'Data Creator',password:'creator123',approved:true,permissions:{view:true,upload:true,edit:true,delete:true}},
{id:'VIE-CHA-01',name:'Chandi Data Viewer',designation:'Junior Engineer',office:defaultOffices[2].name,assignedOffices:[defaultOffices[2].name],role:'Data Viewer',password:'viewer123',approved:true,permissions:{view:true,upload:false,edit:false,delete:false}},
{id:'CRE-HIL-02',name:'New Data Creator',designation:'Data Entry Operator',office:defaultOffices[0].name,assignedOffices:[defaultOffices[0].name],role:'Data Creator',password:'welcome123',approved:false,permissions:{view:true,upload:true,edit:true,delete:false}}],
projects:[{id:1,name:'SH-71 Strengthening 2026',office:offices[0],createdBy:'ADM-HIL-01',date:'12 Sep 2026',files:[{id:11,docNo:'EST-2026-01',name:'Technical Estimate.pdf',type:'PDF',size:'2.4 MB',date:'12 Sep 2026',description:'Detailed technical estimate and BOQ'},{id:12,docNo:'PHT-2026-01',name:'Site Photographs.zip',type:'ZIP',size:'18.6 MB',date:'10 Sep 2026',description:'Pre-construction road conditions'}],folders:[{id:101,name:'Agreements',files:[{id:1001,docNo:'AGR-2026-01',name:'Contract Agreement.pdf',type:'PDF',size:'3.2 MB',date:'12 Sep 2026',description:'Signed agreement copy with contractor'}]},{id:102,name:'Bills',files:[{id:1002,docNo:'BILL-RA-01',name:'First RA Bill.xlsx',type:'XLSX',size:'580 KB',date:'14 Sep 2026',description:'First running account bill submitted'}]},{id:103,name:'Drawings & Plans',files:[]}],report:sampleProject1Report,access:['ADM-HIL-01','CRE-RAJ-01','VIE-CHA-01']},{id:2,name:'Rajgir Bypass Maintenance',office:offices[1],createdBy:'CRE-RAJ-01',date:'08 Sep 2026',files:[{id:21,docNo:'WP-2026-01',name:'Work Programme.xlsx',type:'XLSX',size:'640 KB',date:'08 Sep 2026',description:'Road maintenance timeline'}],folders:[{id:201,name:'Agreements',files:[]},{id:202,name:'Bills',files:[]}],report:null,access:['ADM-HIL-01','CRE-RAJ-01']},{id:3,name:'Chandi Road Survey',office:offices[2],createdBy:'ADM-HIL-01',date:'04 Sep 2026',files:[],folders:[{id:301,name:'Survey Reports',files:[]}],report:null,access:['ADM-HIL-01','VIE-CHA-01']}],
letters:[{id:1,type:'Outward',number:'RDH/OUT/2026/114',date:'11 Sep 2026',subject:'Submission of revised work programme',office:offices[0],file:'Work Programme.pdf'},{id:2,type:'Inward',number:'PWD/IN/2026/881',date:'09 Sep 2026',subject:'Administrative approval for SH-71',office:offices[0],file:'Approval Letter.pdf'}]};
function getUserPerms(u){if(!u)return{view:false,upload:false,edit:false,delete:false};let p=u.permissions;if(p&&typeof p==='object'){return{view:p.view!==false,upload:!!p.upload,edit:!!p.edit,delete:!!p.delete}}if(u.role==='Admin')return{view:true,upload:true,edit:true,delete:true};if(u.role==='Data Creator')return{view:true,upload:true,edit:true,delete:true};if(u.role==='Data Viewer')return{view:true,upload:false,edit:false,delete:false};return{view:true,upload:false,edit:false,delete:false}}
function hasPerm(act){if(!current)return false;let p=getUserPerms(current);if(current.role==='Admin'&&(!current.permissions||current.permissions[act]===undefined))return true;return !!p[act]}
function canView(){return hasPerm('view')}
function canUpload(){return hasPerm('upload')}
function canEdit(){return hasPerm('edit')}
function canDelete(){return hasPerm('delete')}
let db=JSON.parse(localStorage.getItem('rdh-dms-v1')||'null')||seed;
if(db){
  if(!db.offices||!db.offices.length){db.offices=JSON.parse(JSON.stringify(defaultOffices));}
  else if(typeof db.offices[0]==='string'){db.offices=db.offices.map((n,i)=>{let def=defaultOffices.find(d=>d.name===n);return def?JSON.parse(JSON.stringify(def)):{id:'OFF-'+String(i+1).padStart(2,'0'),name:n,type:n.toLowerCase().includes('sub')?'Sub-Division':(n.toLowerCase().includes('division')?'Division':'Branch'),code:n.split(' ').map(w=>w[0]).join('').toUpperCase(),incharge:'In-Charge Officer',inchargeName:'Designated Officer',location:'Nalanda'}});}
  if(db.users){db.users.forEach(u=>{
    if(!u.designation){
      if(u.role==='Admin')u.designation='Executive Engineer';
      else if(u.role==='Data Creator')u.designation='Assistant Engineer';
      else if(u.role==='Data Viewer')u.designation='Junior Engineer';
      else u.designation='Staff Member';
    }
    if(!u.assignedOffices||!Array.isArray(u.assignedOffices)||!u.assignedOffices.length){
      if(u.role==='Admin'&&u.id==='ADM-HIL-01'){
        u.assignedOffices=getOfficeList();
      }else{
        u.assignedOffices=[u.office||defaultOffices[0].name];
      }
    }
    if(!u.permissions)u.permissions=getUserPerms(u);
  });}
  offices=getOfficeList();
}
if(db&&db.projects&&db.projects[0]&&!db.projects[0].report){db.projects[0].report=JSON.parse(JSON.stringify(sampleProject1Report));save()}
let current=null,view='dashboard',modal=null,activeProject=null,activeFolder=null;
function save(){localStorage.setItem('rdh-dms-v1',JSON.stringify(db))}function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}function roleKey(r){return r==='Admin'?'admin':r==='Data Creator'?'creator':'viewer'}
function login(){document.querySelector('#app').innerHTML=`<section class="login"><div class="login-card"><aside class="brand-pane"><div class="seal">RDH</div><h1>Road Division<br>Hilsa</h1><p>Secure Document Management System</p><div class="office-list">${getOfficeList().slice(0,5).map(o=>`<div>● ${esc(o)}</div>`).join('')}</div></aside><form class="login-form" id="login-form"><h2>Welcome back</h2><p>अपने अधिकृत account से sign in करें।</p><div class="field"><label>User ID</label><input id="uid" required placeholder="e.g. ADM-HIL-01"></div><div class="field"><label>Password</label><input id="pass" type="password" required placeholder="Password"></div><button class="primary full">Secure Login</button><div class="recovery-links"><button type="button" onclick="openRecovery('id')">Forgot User ID?</button><span>•</span><button type="button" onclick="openRecovery('password')">Forgot Password?</button></div><div id="login-msg"></div><div class="hint"><b>Demo accounts</b><br>Admin: ADM-HIL-01 / admin123<br>Creator: CRE-RAJ-01 / creator123<br>Viewer: VIE-CHA-01 / viewer123</div></form></div></section>${modal||''}`;document.querySelector('#login-form').onsubmit=e=>{e.preventDefault();let u=db.users.find(x=>x.id===uid.value.trim()&&x.password===pass.value);if(!u) return msg('Invalid User ID or password.');if(!u.approved)return msg('यह account अभी Admin approval की प्रतीक्षा में है।');current=u;view='dashboard';render()}}
function msg(t){document.querySelector('#login-msg').innerHTML=`<p class="small" style="color:#bf3c3c;margin-top:10px">${t}</p>`}
function openRecovery(kind){let isId=kind==='id';modal=`<div class="modal-wrap"><div class="modal"><h3>${isId?'Recover User ID':'Reset password'}</h3><p>${isId?'अपना registered name और office चुनें।':'User ID और office देकर reset request भेजें।'}</p><form onsubmit="submitRecovery(event,'${kind}')"><div class="field"><label>${isId?'Registered full name':'User ID'}</label><input name="value" required></div><div class="field"><label>Office</label><select name="office">${offices.map(o=>`<option>${o}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">${isId?'Find User ID':'Send reset request'}</button></div></form><div id="recovery-result"></div></div></div>`;login()}
function submitRecovery(e,kind){e.preventDefault();let x=Object.fromEntries(new FormData(e.target)),match=kind==='id'?db.users.find(u=>u.name.toLowerCase()===x.value.trim().toLowerCase()&&u.office===x.office):db.users.find(u=>u.id.toLowerCase()===x.value.trim().toLowerCase()&&u.office===x.office);let r=document.querySelector('#recovery-result');if(!match){r.innerHTML='<p class="small" style="color:#bf3c3c;margin-top:14px">Account details नहीं मिले। कृपया अपने office Admin से संपर्क करें।</p>';return}r.innerHTML=kind==='id'?`<div class="notice" style="margin-top:14px">आपका User ID: <b>${esc(match.id)}</b></div>`:`<div class="notice" style="margin-top:14px">Password reset request दर्ज हो गई है। Office Admin verification के बाद नया temporary password देगा।</div>`}
function nav(){let common=[['dashboard','Dashboard'],['projects','Project Folders'],['letters','Letter Register']];if(current.role==='Admin'){common.push(['offices','Office Management']);common.push(['users','User Administration']);common.push(['roles','Role Management']);}return common.map(([id,n])=>`<button class="${view===id?'active':''}" onclick="go('${id}')">${n}</button>`).join('')}
function render(){if(!current)return login();let uOffs=getUserOffices(current);document.querySelector('#app').innerHTML=`<div class="shell"><aside class="sidebar"><div class="identity"><strong>Road Division Hilsa</strong><span>${esc(current.office)}${uOffs.length>1?' <b style="color:#93c5fd;font-size:11px">(+'+(uOffs.length-1)+')</b>':''}</span><em class="role-tag">${current.role}</em></div><nav class="menu">${nav()}<button class="logout" onclick="logout()">↪ Logout</button></nav></aside><section class="content"><header class="topbar"><div><h2>${title()}</h2><div class="crumb">Document Management System / ${esc(current.office)}${uOffs.length>1?' <span style="font-weight:600;color:var(--navy)">(+'+(uOffs.length-1)+' offices)</span>':''}</div></div><div class="user-chip"><div class="avatar">${current.name[0]}</div><span>${esc(current.name)}</span></div></header><main class="page">${page()}</main></section></div>${modal||''}`;bindPicker()}
function title(){return({dashboard:'Dashboard',projects:'Project Folders',letters:'Letter Register',offices:'Office Management',users:'User Administration',roles:'Role Management'})[view]||'Document Management'}
function go(x){view=x;activeProject=null;activeFolder=null;render()}function logout(){current=null;activeFolder=null;render()}
function permitted(p){if(!canView())return false;if(current.role==='Admin')return true;let uOffs=getUserOffices(current);if(uOffs.includes(p.office))return true;return (p.access&&p.access.includes(current.id))||p.createdBy===current.id}
function page(){return view==='dashboard'?dashboard():view==='projects'?projects():view==='letters'?letters():view==='offices'?officeManagement():view==='roles'?roles():users()}
function dashboard(){let pp=db.projects.filter(permitted), pending=db.users.filter(x=>!x.approved).length;let totalDocs=pp.reduce((acc,p)=>acc+(p.files?p.files.length:0)+(p.folders||[]).reduce((fa,f)=>fa+(f.files?f.files.length:0),0),0);return `<div class="page-head"><div><h3>नमस्कार, ${esc(current.name)}</h3><p>${!canUpload()&&!canEdit()?'आपको केवल approved project documents का access प्राप्त है।':'अपनी files और correspondence को व्यवस्थित रखें।'}</p></div>${(canUpload()||canEdit())?`<button class="primary" onclick="openProjectModal()">+ New Project Folder</button>`:''}</div><div class="grid"><div class="metric metric-clickable" onclick="go('projects')" title="Click to view Project Folders"><label>Accessible projects</label><strong><a href="javascript:void(0)" class="metric-num-link" onclick="event.stopPropagation();go('projects')" title="Click to view Project Folders">${pp.length}</a></strong><span>All permitted folders <b style="color:var(--blue)">➔</b></span></div><div class="metric metric-clickable" onclick="go('projects')" title="Click to view all Project Documents"><label>Total documents</label><strong><a href="javascript:void(0)" class="metric-num-link" onclick="event.stopPropagation();go('projects')" title="Click to view all Project Documents">${totalDocs}</a></strong><span>Files in your workspace <b style="color:var(--blue)">➔</b></span></div><div class="metric metric-clickable" onclick="go('letters')" title="Click to view Letter Register"><label>Letters registered</label><strong><a href="javascript:void(0)" class="metric-num-link" onclick="event.stopPropagation();go('letters')" title="Click to view Letter Register">${db.letters.length}</a></strong><span>Inward / outward / other <b style="color:var(--blue)">➔</b></span></div><div class="metric metric-clickable" onclick="${current.role==='Admin'?"go('users')":"go('projects')"}" title="${current.role==='Admin'?'Click to review User Approvals':'Your office'}"><label>${current.role==='Admin'?'Pending approvals':'Your office'}</label><strong><a href="javascript:void(0)" class="metric-num-link" onclick="event.stopPropagation();${current.role==='Admin'?"go('users')":"go('projects')"}" title="${current.role==='Admin'?'Click to review User Approvals':'Your office'}">${current.role==='Admin'?pending:esc(current.office.split(' ').slice(-1)[0])}</a></strong><span>${current.role==='Admin'?'Action required <b style="color:var(--blue)">➔</b>':'Current office unit'}</span></div></div><div class="two-col"><section class="panel"><h4>Recent project folders</h4><div class="panel-sub">Latest accessible projects</div>${projectTable(pp.slice(0,4))}</section><section class="panel"><h4>Quick actions</h4><div class="panel-sub">Role-based shortcuts</div>${current.role==='Admin'?`<button class="primary full" onclick="go('users')">Review user approvals</button><br><br><button class="secondary full" onclick="go('roles')">Manage user roles & powers</button><br><br><button class="secondary full" onclick="go('projects')">Manage folder access</button>`:(canUpload()||canEdit())?`<button class="primary full" onclick="openProjectModal()">Create project folder</button><br><br><button class="secondary full" onclick="openLetterModal()">Register a letter</button>`:`<button class="primary full" onclick="go('projects')">View permitted documents</button>`}</section></div>`}
function projectTable(ps){if(!ps.length)return '<div class="empty">No project folder available.</div>';return `<div class="table-wrap"><table><thead><tr><th>Project</th><th>Office</th><th style="text-align:center">Documents</th><th style="text-align:center">Action</th></tr></thead><tbody>${ps.map(p=>{let docCount=(p.files?p.files.length:0)+(p.folders||[]).reduce((a,f)=>a+(f.files?f.files.length:0),0);return `<tr><td><b>${esc(p.name)}</b><br><span class="small">Created ${p.date}${p.ref?` · ${esc(p.ref)}`:''}</span></td><td>${esc(p.office)}</td><td style="text-align:center"><b>${docCount}</b></td><td style="text-align:center"><div style="display:flex;gap:5px;justify-content:center;align-items:center;flex-wrap:wrap"><button class="secondary small" onclick="openProject(${p.id})" title="Open this project folder">Open</button>${canEdit()?`<button class="secondary small" onclick="openEditProjectModal(${p.id})" title="Edit Project Folder">Edit</button>`:''}${canDelete()?`<button class="danger small" onclick="deleteProject(${p.id})" title="Delete Project Folder">Delete</button>`:''}</div></td></tr>`}).join('')}</tbody></table></div>`}
function projects(){let ps=db.projects.filter(permitted);if(activeProject){let p=db.projects.find(x=>x.id===activeProject);return projectDetail(p)}return `<div class="page-head"><div><h3>Project folders</h3><p>${!canUpload()&&!canEdit()?'Admin द्वारा share किए गए folders और files.':'Project-wise documents सुरक्षित रूप से रखें।'}</p></div>${(canUpload()||canEdit())?`<button class="primary" onclick="openProjectModal()">+ New Project Folder</button>`:''}</div><div class="folder-grid">${ps.map(p=>{let docCount=(p.files?p.files.length:0)+(p.folders||[]).reduce((a,f)=>a+(f.files?f.files.length:0),0);return `<article class="folder folder-card" ondblclick="openProject(${p.id})" title="Double-click to open folder"><div class="folder-icon">📁</div><h4>${esc(p.name)}</h4><p>${esc(p.office)} · ${docCount} document(s)${p.ref?`<br><span class="small" style="color:var(--navy);font-weight:600">${esc(p.ref)}</span>`:''}</p><div style="display:flex;gap:6px;margin-top:14px;flex-wrap:wrap"><button class="primary small" onclick="openProject(${p.id})">Open folder</button>${canEdit()?`<button class="secondary small" onclick="openEditProjectModal(${p.id})" title="Edit Project">✏ Edit</button>`:''}${canDelete()?`<button class="danger small" onclick="deleteProject(${p.id})" title="Delete Project">🗑 Delete</button>`:''}</div></article>`}).join('')||'<div class="empty">No accessible project folders.</div>'}</div>`}
function openSubFolder(pid,fid){activeFolder=fid;render()}
function subFolderDetail(p,f){let files=f.files||[];return `<div class="page-head"><div><button class="secondary small" onclick="openSubFolder(${p.id},null)">← Back to sub-folders</button><h4 style="margin-top:10px">📁 ${esc(f.name)}</h4><div class="panel-sub">${files.length} document(s) in this sub-folder</div></div>${canUpload()?`<button class="primary small" onclick="openUploadModal(${p.id},${f.id})">+ Upload Document</button>`:''}</div><div class="table-wrap"><table><thead><tr><th style="width:65px">Sl. No.</th><th>Document No.</th><th>Description</th><th style="text-align:center;width:80px">Upload</th><th style="text-align:center;width:95px">Download</th><th style="text-align:center;width:75px">Edit</th><th style="text-align:center;width:80px">Delete</th></tr></thead><tbody>${files.map((x,i)=>`<tr><td><b>${i+1}</b></td><td><b>${esc(x.docNo||('DOC-'+String(i+1).padStart(2,'0')))}</b><br><span class="small" style="color:var(--muted)">📄 ${esc(x.name)} (${esc(x.size)})</span></td><td>${esc(x.description||'—')}</td><td style="text-align:center">${canUpload()?`<button class="secondary small" onclick="openUploadModal(${p.id},${f.id},${x.id})" title="Replace / Upload file">Upload</button>`:'—'}</td><td style="text-align:center">${canView()?`<button class="secondary small" onclick="downloadFolderFile(${p.id},${f.id},${x.id})" title="Download file">⇩ Download</button>`:'—'}</td><td style="text-align:center">${canEdit()?`<button class="secondary small" onclick="openFileEditModal(${p.id},${f.id},${x.id})" title="Edit Details">Edit</button>`:'—'}</td><td style="text-align:center">${canDelete()?`<button class="danger small" onclick="removeFolderFile(${p.id},${f.id},${x.id})" title="Delete Document">Delete</button>`:'—'}</td></tr>`).join('')||`<tr><td colspan="7" class="empty">इस फ़ोल्डर में कोई फ़ाइल उपलब्ध नहीं है। ${canUpload()?'ऊपर दिए गए "+ Upload Document" बटन से फ़ाइल जोड़ें।':''}</td></tr>`}</tbody></table></div>`}
function projectReportSection(p){let r=p.report,hasReport=!!r;return `<section class="panel" style="margin-bottom:16px"><div class="page-head" style="margin-bottom:16px"><div><h4>Project Information Sheet</h4><div class="panel-sub">OFFICE OF THE EXECUTIVE ENGINEER ROAD DIVISION HILSA · Detail Project Information Report</div></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${canEdit()?(hasReport?`<button class="primary small" onclick="openReportModal(${p.id})">✏ Edit Report</button>`:`<button class="primary small" onclick="openReportModal(${p.id})">+ Fill Information Report</button>`):''} ${canDelete()&&hasReport?`<button class="danger small" onclick="deleteReport(${p.id})">🗑 Clear Report</button>`:''} ${hasReport&&canView()?`<button class="secondary small" onclick="window.print()">🖨 Print / PDF</button>`:''}</div></div>${hasReport?renderReportTable(p,r):`<div class="empty" style="padding:32px 16px;background:#f9fbfd;border:1px dashed #cbd8e1;border-radius:10px"><div style="font-size:32px;margin-bottom:8px">📋</div><b>Detail Project Information Report दर्ज नहीं है।</b><p class="small" style="margin-top:6px;color:var(--muted)">Admin या Edit अधिकार प्राप्त यूजर द्वारा इस प्रोजेक्ट की विस्तृत रिपोर्ट भरी जा सकती है।</p>${canEdit()?`<button class="primary small" style="margin-top:14px" onclick="openReportModal(${p.id})">+ Fill Information Report</button>`:''}</div>`}</section>`}
function renderReportTable(p,r){let mats=r.materials||defaultMaterials.map(m=>({item:m.item,letter:m.letter,workDone:'',challanSubmitted:'',balanceChallan:'',remarks:''}));return `<div class="report-sheet"><div class="report-title-banner"><h3>OFFICE OF THE EXECUTIVE ENGINEER ROAD DIVISION HILSA</h3><h4>Detail Project Information Report</h4></div><div class="table-wrap"><table class="report-table"><thead><tr><th style="width:60px;text-align:center">Sl. No.</th><th style="width:33%">Item</th><th>Description</th></tr></thead><tbody><tr><td class="center">1</td><td class="bold">Name of Work</td><td><b>${esc(r.nameOfWork||p.name)}</b></td></tr><tr><td class="center">2</td><td class="bold">Name of Agency</td><td>${esc(r.nameOfAgency||'—')}</td></tr><tr><td class="center">3</td><td class="bold">Estimated Cost</td><td>${esc(r.estimatedCost||'—')}</td></tr><tr><td class="center">4</td><td class="bold">Agreement Value</td><td>${esc(r.agreementValue||'—')}</td></tr><tr><td class="center">5</td><td class="bold">Date of Start</td><td>${esc(r.dateOfStart||'—')}</td></tr><tr><td class="center">6</td><td class="bold">Date of Completion (As Per Agr)</td><td>${esc(r.dateOfCompletionAgr||'—')}</td></tr><tr><td class="center">7</td><td class="bold">Time Extention Granted</td><td style="padding:0"><table class="report-subtable"><thead><tr><th>up to (Write Date Here)</th><th>Lt. No.</th><th>Date</th></tr></thead><tbody><tr><td>${esc(r.timeExtUpTo||'—')}</td><td>${esc(r.timeExtLtNo||'—')}</td><td>${esc(r.timeExtDate||'—')}</td></tr></tbody></table></td></tr><tr><td class="center">8</td><td class="bold">Adminstrative Aproval (in Lakhs)</td><td style="padding:0"><table class="report-subtable"><thead><tr><th>Amount (in Lakhs)</th><th>Lt. No.</th><th>Date</th></tr></thead><tbody><tr><td>${esc(r.aaAmount||'—')}</td><td>${esc(r.aaLtNo||'—')}</td><td>${esc(r.aaDate||'—')}</td></tr></tbody></table></td></tr><tr><td class="center">9</td><td class="bold">Technical Approval (in Lakhs)</td><td>${esc(r.techApproval||'—')}</td></tr><tr><td class="center">10</td><td class="bold">Technical Sanction (in Lakhs)</td><td>${esc(r.techSanction||'—')}</td></tr><tr><td class="center">11</td><td class="bold">Project Cost (As Per Approved BOQ)</td><td>${esc(r.projectCostBOQ||'—')}</td></tr><tr><td class="center">12</td><td class="bold">Date of Tender</td><td>${esc(r.dateOfTender||'—')}</td></tr><tr><td class="center">13</td><td class="bold">Date of Agreement</td><td>${esc(r.dateOfAgreement||'—')}</td></tr><tr><td class="center">14</td><td class="bold">Actual Date of Completion</td><td>${esc(r.actualDateOfCompletion||'—')}</td></tr><tr><td class="center">15</td><td class="bold">Land Acqusition ( Provision in lacs)</td><td>${esc(r.landAcquisition||'—')}</td></tr><tr><td class="center">16</td><td class="bold">Utility Shifting (Provision in lacs)</td><td>${esc(r.utilityShifting||'—')}</td></tr><tr><td class="center">17</td><td class="bold">Bitumen Consumption Status</td><td style="padding:0"><table class="report-subtable"><thead><tr><th>Required Bitumen Quantity (As per D.O Letter)</th><th>Consume Qty</th><th>Balance Qty</th><th>Remarks</th></tr></thead><tbody><tr><td>${esc(r.bitumenReq||'—')}</td><td>${esc(r.bitumenConsumed||'—')}</td><td>${esc(r.bitumenBalance||'—')}</td><td>${esc(r.bitumenRemarks||'—')}</td></tr></tbody></table></td></tr><tr><td class="center">17</td><td class="bold">Emulsion Consumption Status</td><td style="padding:0"><table class="report-subtable"><thead><tr><th>Required Bitumen Quantity (As per D.O Letter)</th><th>Consume Qty</th><th>Balance Qty</th><th>Remarks</th></tr></thead><tbody><tr><td>${esc(r.emulsionReq||'—')}</td><td>${esc(r.emulsionConsumed||'—')}</td><td>${esc(r.emulsionBalance||'—')}</td><td>${esc(r.emulsionRemarks||'—')}</td></tr></tbody></table></td></tr><tr><td class="center">18</td><td class="bold">Consumed Material</td><td style="padding:0"><table class="report-subtable"><thead><tr><th style="text-align:left">Material</th><th>As Per Upto date Work Done</th><th>Challan Submitted</th><th>Balance Challan</th><th>Remarks</th></tr></thead><tbody>${mats.map(m=>`<tr><td style="text-align:left;font-weight:600">${esc(m.letter||'')} ${esc(m.item)}</td><td>${esc(m.workDone||'—')}</td><td>${esc(m.challanSubmitted||'—')}</td><td>${esc(m.balanceChallan||'—')}</td><td>${esc(m.remarks||'—')}</td></tr>`).join('')}</tbody></table></td></tr><tr><td class="center">19</td><td class="bold">Test Report Status<br><span class="small" style="font-weight:normal">on Accounts Bill</span></td><td style="padding:0"><table class="report-subtable"><thead><tr><th>on Accounts Bill</th><th>Letter No. & Date</th><th>Submited/ Not Submited</th><th>Remarks</th></tr></thead><tbody><tr><td>${esc(r.testReportBill||'—')}</td><td>${esc(r.testReportLtNoDate||'—')}</td><td><span class="status ${r.testReportStatus==='Submitted'?'approved':'pending'}">${esc(r.testReportStatus||'Not Submitted')}</span></td><td>${esc(r.testReportRemarks||'—')}</td></tr></tbody></table></td></tr></tbody></table></div></div>`}
function projectDetail(p){let folders=p.folders||(p.folders=[]),activeF=activeFolder?folders.find(f=>f.id===activeFolder):null;return `<div class="page-head"><div><button class="secondary small" onclick="activeProject=null;activeFolder=null;render()">← All folders</button><h3 style="margin-top:12px">📁 ${esc(p.name)}</h3><p>${esc(p.office)} · Created ${p.date}${p.ref?` · <b style="color:var(--navy)">${esc(p.ref)}</b>`:''}</p></div><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">${canEdit()?`<button class="secondary small" onclick="openEditProjectModal(${p.id})">✏ Edit Project</button>`:''}${canDelete()?`<button class="danger small" onclick="deleteProject(${p.id})">🗑 Delete Project</button>`:''}${canUpload()?`<button class="primary" onclick="pickFile(${p.id})">+ Upload root file</button>`:''}</div></div>${current.role==='Admin'?`<section class="panel" style="margin-bottom:16px"><h4>Viewer access control</h4><div class="panel-sub">Select approved Data Viewers who may view and download this folder.</div><div class="access-list">${db.users.filter(u=>u.role==='Data Viewer'&&u.approved).map(u=>`<label class="access-row"><span>${esc(u.name)} <span class="small">· ${esc(u.office)}</span></span><span class="check"><input type="checkbox" ${p.access.includes(u.id)?'checked':''} onchange="toggleAccess(${p.id},'${u.id}',this.checked)"> View access</span></label>`).join('')||'<div class="empty">No approved data viewer found.</div>'}</div></section>`:''}<section class="panel" style="margin-bottom:16px">${activeF?subFolderDetail(p,activeF):`<div class="page-head"><div><h4>Project sub-folders</h4><div class="panel-sub">किसी भी फ़ोल्डर पर <b>Double Click</b> करके खोलें और उसके दस्तावेज़ देखें।</div></div>${(canUpload()||canEdit())?`<button class="primary small" onclick="openFolderModal(${p.id})">+ Add folder</button>`:''}</div><div class="folder-grid">${folders.map(f=>`<article class="folder folder-card" ondblclick="openSubFolder(${p.id},${f.id})" style="cursor:pointer;" title="Double-click to open folder"><div class="folder-icon">📂</div><h4>${esc(f.name)}</h4><p>${f.files.length} attachment(s)</p><div style="display:flex;gap:6px;margin-top:12px;flex-wrap:wrap"><button class="secondary small" onclick="openSubFolder(${p.id},${f.id})">Open ➔</button>${canUpload()?`<button class="secondary small" onclick="openUploadModal(${p.id},${f.id})">+ Attach</button>`:''}${canDelete()?` <button class="danger small" onclick="deleteFolder(${p.id},${f.id})">Delete</button>`:''}</div></article>`).join('')||'<div class="empty">No sub-folder created yet.</div>'}</div>`}</section>${projectReportSection(p)}<section class="panel"><h4>Root documents</h4><div class="panel-sub">${canUpload()?'Upload Word, Excel, PDF, image, ZIP or any other file type.':'Download only the files for which access is approved.'}</div>${fileTable(p.files,p.id)}</section>`}
function fileTable(files,pid){return files.length?`<div class="table-wrap"><table><thead><tr><th>File</th><th>Type</th><th>Uploaded</th><th>Size</th><th>Description</th><th>Action</th></tr></thead><tbody>${files.map(f=>`<tr><td><div class="file-row"><div class="file-ico">${esc(f.type)}</div><b>${esc(f.name)}</b></div></td><td>${esc(f.type)}</td><td>${f.date}</td><td>${f.size}</td><td>${esc(f.description||'—')}</td><td>${canView()?`<button class="secondary small" onclick="downloadFile(${pid},${f.id})">⇩ Download</button>`:''}${canEdit()?` <button class="secondary small" onclick="openFileEditModal(${pid},0,${f.id})">Edit</button>`:''}${canDelete()?` <button class="danger small" onclick="removeFile(${pid},${f.id})">Delete</button>`:''}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No files uploaded yet.</div>'}
function letters(){return `<div class="page-head"><div><h3>Letter register</h3><p>Inward, outward और other correspondence का digital record.</p></div>${(canUpload()||canEdit())?`<button class="primary" onclick="openLetterModal()">+ Register letter</button>`:''}</div><section class="panel"><div class="tabrow"><button class="active">All letters (${db.letters.length})</button><button>Inward</button><button>Outward</button><button>Other</button></div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Letter no.</th><th>Date</th><th>Subject</th><th>Attachment</th><th>Description</th><th>Action</th></tr></thead><tbody>${db.letters.map(l=>`<tr><td><span class="letter-type">${l.type}</span></td><td>${esc(l.number)}</td><td>${l.date}</td><td>${esc(l.subject)}</td><td>${esc(l.file||'—')}</td><td>${esc(l.description||'—')}</td><td>${l.file&&canView()?'<button class="secondary small">View</button> ':''}${canEdit()?`<button class="secondary small" onclick="openLetterModal(${l.id})">Edit</button> `:''}${canDelete()?`<button class="danger small" onclick="deleteLetter(${l.id})">Delete</button>`:''}</td></tr>`).join('')}</tbody></table></div></section>`}
function users(){if(current.role!=='Admin')return '';let us=db.users;return `<div class="page-head"><div><h3>User Administration</h3><p>Only approved accounts can access the document database.</p></div><div style="display:flex;gap:8px"><button class="secondary" onclick="go('roles')">🛡️ Role Management</button><button class="primary" onclick="openUserModal()">+ Add user</button></div></div><div class="tabrow"><button class="active">User Accounts (${us.length})</button><button onclick="go('roles')">Role & Permissions Management</button></div><section class="panel"><h4>All registered users</h4><div class="panel-sub">Approve, edit, or delete users; manage account credentials and role powers.</div><div class="table-wrap"><table><thead><tr><th>Name / user ID</th><th>Designation</th><th>Assigned Offices (कार्यालय)</th><th>Role</th><th>Powers (अधिकार)</th><th>Status</th><th>Action</th></tr></thead><tbody>${us.map(u=>{let p=getUserPerms(u);return `<tr><td><b>${esc(u.name)}</b><br><span class="small">${esc(u.id)}</span></td><td><span style="font-weight:600;color:var(--navy)">${esc(u.designation||'—')}</span></td><td>${renderOfficeBadges(u)}</td><td><b>${esc(u.role)}</b></td><td><div style="display:flex;gap:4px;flex-wrap:wrap"><span class="perm-pill ${p.view?'on':'off'}" style="padding:2px 7px;font-size:11px" title="Viewing Power">👁️ View</span><span class="perm-pill ${p.upload?'on':'off'}" style="padding:2px 7px;font-size:11px" title="Upload Power">📤 Upload</span><span class="perm-pill ${p.edit?'on':'off'}" style="padding:2px 7px;font-size:11px" title="Edit Power">✏️ Edit</span><span class="perm-pill ${p.delete?'on':'off'}" style="padding:2px 7px;font-size:11px" title="Delete Power">🗑️ Del</span></div></td><td><span class="status ${u.approved?'approved':'pending'}">${u.approved?'Approved':'Pending'}</span></td><td><div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${u.id===current.id?'<span class="small" style="font-weight:600;color:var(--muted)">Current admin</span>':`${u.approved?`<button class="danger small" onclick="setApproval('${u.id}',false)" title="Block User">Block</button>`:`<button class="primary small" onclick="setApproval('${u.id}',true)" title="Approve User">Approve</button>`}<button class="secondary small" onclick="openUserModal('${u.id}')" title="Edit User">Edit</button><button class="secondary small" onclick="openRoleModal('${u.id}')" title="Configure Powers">Powers</button><button class="danger small" style="background:#fee2e2;color:#991b1b" onclick="deleteUser('${u.id}')" title="Delete User">Delete</button>`}</div></td></tr>`}).join('')}</tbody></table></div></section>`}
function roles(){if(current.role!=='Admin')return '';let us=db.users;return `<div class="page-head"><div><h3>Role & Permissions Management</h3><p>Admin control panel: Kis user ko kya role, kin-kin offices ka charge aur kaun si power (Viewing, Upload, Edit, Delete) deni hai yahan se tay karein.</p></div><div style="display:flex;gap:8px"><button class="secondary" onclick="go('users')">👤 User Accounts</button><button class="primary" onclick="openUserModal()">+ Add user</button></div></div><div class="tabrow"><button onclick="go('users')">User Accounts (${us.length})</button><button class="active">Role & Permissions Management</button></div><div class="perm-legend"><div class="perm-legend-item"><b>Powers Legend:</b></div><div class="perm-legend-item">👁️ <b>Viewing:</b> Project folders, documents, sub-folder files dekhna aur download/print karna</div><div class="perm-legend-item">📤 <b>Upload:</b> Root files, sub-folder attachments upload karna aur correspondence register karna</div><div class="perm-legend-item">✏️ <b>Edit:</b> Document metadata badalna, report bharna aur letters edit karna</div><div class="perm-legend-item">🗑️ <b>Delete:</b> Files, sub-folders, letters delete karna aur reports clear karna</div></div><section class="panel"><h4>User Role & Granular Powers Matrix</h4><div class="panel-sub">Kisi bhi power button (pill) par click karke turant allow ya deny karein, ya "Configure" button se user ke multiple offices aur poora role set karein.</div><div class="table-wrap"><table><thead><tr><th>User / ID</th><th>Assigned Offices (कार्यालय)</th><th>Assigned Role</th><th style="text-align:center">👁️ Viewing</th><th style="text-align:center">📤 Upload</th><th style="text-align:center">✏️ Edit</th><th style="text-align:center">🗑️ Delete</th><th style="text-align:center">Action</th></tr></thead><tbody>${us.map(u=>{let p=getUserPerms(u);return `<tr><td><b>${esc(u.name)}</b><br><span class="small">${esc(u.id)}</span></td><td>${renderOfficeBadges(u)}</td><td><span class="role-tag" style="background:#eaf2f8;color:var(--navy);font-weight:700;font-size:12px;padding:4px 9px">${esc(u.role)}</span></td><td style="text-align:center"><button class="perm-pill ${p.view?'on':'off'}" onclick="toggleUserPerm('${u.id}','view')" title="Click to toggle Viewing power">${p.view?'✓ Allowed':'✗ Denied'}</button></td><td style="text-align:center"><button class="perm-pill ${p.upload?'on':'off'}" onclick="toggleUserPerm('${u.id}','upload')" title="Click to toggle Upload power">${p.upload?'✓ Allowed':'✗ Denied'}</button></td><td style="text-align:center"><button class="perm-pill ${p.edit?'on':'off'}" onclick="toggleUserPerm('${u.id}','edit')" title="Click to toggle Edit power">${p.edit?'✓ Allowed':'✗ Denied'}</button></td><td style="text-align:center"><button class="perm-pill ${p.delete?'on':'off'}" onclick="toggleUserPerm('${u.id}','delete')" title="Click to toggle Delete power">${p.delete?'✓ Allowed':'✗ Denied'}</button></td><td style="text-align:center"><button class="secondary small" onclick="openRoleModal('${u.id}')" title="Configure role, offices and powers for this user">Configure</button></td></tr>`}).join('')}</tbody></table></div></section>`}
function toggleUserPerm(uid,act){let u=db.users.find(x=>x.id===uid);if(!u)return;if(!u.permissions)u.permissions=getUserPerms(u);if(u.id===current.id&&act==='view'&&u.permissions.view){alert('You cannot revoke Viewing power from your own logged-in admin account!');return}u.permissions[act]=!u.permissions[act];if(u.id===current.id)current.permissions=u.permissions;save();render()}
function openRoleModal(uid){
  let u=db.users.find(x=>x.id===uid);if(!u)return;
  let p=getUserPerms(u),uOffs=getUserOffices(u),allOffs=getOffices();
  overlay(`<h3>Configure Role & Powers</h3>
<p>User: <b>${esc(u.name)}</b> (${esc(u.id)}) · Designation: <b>${esc(u.designation||'—')}</b> · Multiple Offices & Powers Assignment</p>
<form onsubmit="saveRolePerms(event,'${u.id}')">
  <div class="form-grid-2">
    <div class="field">
      <label>Assigned Role (पद / भूमिका)</label>
      <select id="roleSelect" name="role" onchange="applyRolePreset(this.value)">
        <option ${u.role==='Admin'?'selected':''}>Admin</option>
        <option ${u.role==='Data Creator'?'selected':''}>Data Creator</option>
        <option ${u.role==='Data Viewer'?'selected':''}>Data Viewer</option>
        <option ${(!['Admin','Data Creator','Data Viewer'].includes(u.role))?'selected':''}>Custom Role</option>
      </select>
    </div>
    <div class="field">
      <label>Primary Office (मुख्य पदस्थापन कार्यालय)</label>
      <select id="primaryOfficeSelect" name="primary_office" onchange="syncPrimaryOfficeCheck(this.value)">
        ${getOfficeList().map(o=>`<option value="${esc(o)}" ${u.office===o?'selected':''}>${esc(o)}</option>`).join('')}
      </select>
    </div>
  </div>

  <div style="margin:16px 0 8px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <b style="color:var(--navy);font-size:13px">Assigned Offices (अधिकार क्षेत्र के कार्यालय / Additional Charge):</b>
      <div class="small" style="color:var(--muted)">एक से अधिक कार्यालय टिक करें जहाँ का अधिकार इस यूजर को देना है (Multiple Offices):</div>
    </div>
    <div style="display:flex;gap:6px">
      <button type="button" class="secondary small" style="padding:2px 8px;font-size:11px" onclick="selectAllRoleOffices(true)">Select All / All Offices</button>
      <button type="button" class="secondary small" style="padding:2px 8px;font-size:11px" onclick="selectAllRoleOffices(false)">Reset to Primary</button>
    </div>
  </div>

  <div id="roleOfficesGrid" style="display:grid;grid-template-columns:1fr;gap:6px;background:#f8fafc;border:1px solid #dce8f1;border-radius:8px;padding:10px;max-height:220px;overflow-y:auto;margin-bottom:15px">
    ${allOffs.map(o=>{
      let isChecked=uOffs.includes(o.name)||(u.office===o.name);
      let isPrimary=(u.office===o.name);
      let badgeClass=o.type==='Division'?'badge-division':o.type==='Sub-Division'?'badge-subdiv':'badge-branch';
      return `<label class="office-select-item ${isChecked?'selected':''}" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;border-radius:6px;cursor:pointer">
        <div style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" name="assigned_offices" value="${esc(o.name)}" ${isChecked?'checked':''} onchange="this.closest('label').classList.toggle('selected',this.checked)" style="cursor:pointer">
          <div>
            <b>${esc(o.name)}</b> <span class="small" style="color:var(--muted)">(${esc(o.code||'—')})</span>
            ${isPrimary?'<span class="small" style="color:#0369a1;font-weight:700;margin-left:4px">[Primary]</span>':''}
          </div>
        </div>
        <span class="${badgeClass}" style="font-size:10px">${esc(o.type||'Sub-Division')}</span>
      </label>`;
    }).join('')}
  </div>

  <div style="margin:16px 0 10px;font-weight:700;color:var(--navy)">Granular Powers (अधिकार):</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:14px;margin-bottom:15px">
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer">
      <input type="checkbox" id="perm_view" name="perm_view" ${p.view?'checked':''} style="margin-top:3px">
      <div><b>👁️ Viewing Power</b><div class="small" style="color:var(--muted)">Projects, documents, letters & reports dekhna</div></div>
    </label>
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer">
      <input type="checkbox" id="perm_upload" name="perm_upload" ${p.upload?'checked':''} style="margin-top:3px">
      <div><b>📤 Upload Power</b><div class="small" style="color:var(--muted)">Root files, sub-folder attachments upload karna</div></div>
    </label>
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer">
      <input type="checkbox" id="perm_edit" name="perm_edit" ${p.edit?'checked':''} style="margin-top:3px">
      <div><b>✏️ Edit Power</b><div class="small" style="color:var(--muted)">Reports fill/edit karna, descriptions update karna</div></div>
    </label>
    <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer">
      <input type="checkbox" id="perm_delete" name="perm_delete" ${p.delete?'checked':''} style="margin-top:3px">
      <div><b>🗑️ Delete Power</b><div class="small" style="color:var(--muted)">Files, folders, letters delete aur clear karna</div></div>
    </label>
  </div>

  <div class="notice" style="margin-bottom:16px;font-size:12px">
    ℹ️ <b>Multi-Office Scope:</b> यह यूजर अपने सभी चयनित कार्यालयों के प्रोजेक्ट्स/फ़ाइलों और लेटर्स को ऊपर दिए गए अधिकारों के तहत एक्सेस व मैनेज कर सकेगा।
  </div>

  <div class="modal-actions">
    <button type="button" class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary">Save Role, Offices & Powers</button>
  </div>
</form>`, true);
}
function selectAllRoleOffices(checked){
  let cbs=document.querySelectorAll('#roleOfficesGrid input[name="assigned_offices"]');
  cbs.forEach(cb=>{
    cb.checked=checked;
    let label=cb.closest('label');
    if(label)label.classList.toggle('selected',checked);
  });
  if(!checked){
    let pri=document.querySelector('#primaryOfficeSelect')?.value;
    if(pri){
      let pcb=Array.from(cbs).find(c=>c.value===pri);
      if(pcb){
        pcb.checked=true;
        let label=pcb.closest('label');
        if(label)label.classList.add('selected');
      }
    }
  }
}
function syncPrimaryOfficeCheck(val){
  let cbs=document.querySelectorAll('#roleOfficesGrid input[name="assigned_offices"]');
  cbs.forEach(cb=>{
    if(cb.value===val){
      cb.checked=true;
      let label=cb.closest('label');
      if(label)label.classList.add('selected');
    }
  });
}
function applyRolePreset(role){
  let v=document.querySelector('#perm_view'),u=document.querySelector('#perm_upload'),e=document.querySelector('#perm_edit'),d=document.querySelector('#perm_delete');
  if(!v||!u||!e||!d)return;
  if(role==='Admin'||role==='Data Creator'){v.checked=true;u.checked=true;e.checked=true;d.checked=true}
  else if(role==='Data Viewer'){v.checked=true;u.checked=false;e.checked=false;d.checked=false}
}
function saveRolePerms(e,uid){
  e.preventDefault();
  let u=db.users.find(x=>x.id===uid);if(!u)return;
  let d=new FormData(e.target);
  let role=d.get('role');
  let primaryOffice=d.get('primary_office')||u.office;
  let checkedOffices=Array.from(e.target.querySelectorAll('input[name="assigned_offices"]:checked')).map(cb=>cb.value);
  if(!checkedOffices.length)checkedOffices=[primaryOffice];
  if(!checkedOffices.includes(primaryOffice))checkedOffices.unshift(primaryOffice);

  u.role=role;
  u.office=primaryOffice;
  u.assignedOffices=checkedOffices;
  u.permissions={view:!!d.get('perm_view'),upload:!!d.get('perm_upload'),edit:!!d.get('perm_edit'),delete:!!d.get('perm_delete')};

  if(u.id===current.id){
    current.role=u.role;
    current.office=u.office;
    current.assignedOffices=u.assignedOffices;
    current.permissions=u.permissions;
  }
  save();
  closeModal();
  render();
}
function openProject(id){view='projects';activeProject=id;activeFolder=null;render()}function toggleAccess(pid,uid,on){let p=db.projects.find(x=>x.id===pid);p.access=on?[...new Set([...p.access,uid])]:p.access.filter(x=>x!==uid);save();render()}function setApproval(id,on){db.users.find(u=>u.id===id).approved=on;save();render()}
function overlay(inner,isWide=false){modal=`<div class="modal-wrap" onclick="if(event.target===this)closeModal()"><div class="modal ${isWide?'modal-wide':''}"><button type="button" class="modal-close-btn" onclick="closeModal()" title="Close dialog">✕</button>${inner}</div></div>`;render()}function closeModal(){modal=null;render()}
function openProjectModal(){if(!canUpload()&&!canEdit()){alert('Permission denied: You do not have permission to create folders.');return}overlay(`<h3>Create project folder</h3><p>Create a new project folder under Road Division Hilsa.</p><form onsubmit="createProject(event)"><div class="field"><label>Project name</label><input name="name" required placeholder="e.g. NH-120 Improvement Works"></div><div class="field"><label>Office / Unit</label><select name="office">${(current.role==='Admin'?getOfficeList():getUserOffices(current)).map(o=>`<option ${o===current.office?'selected':''}>${o}</option>`).join('')}</select></div><div class="field"><label>Project description / content / reference</label><textarea name="ref" rows="3" placeholder="e.g. Widening and strengthening work details, scope or reference"></textarea></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Create folder</button></div></form>`)}
function createProject(e){e.preventDefault();if(!canUpload()&&!canEdit()){alert('Permission denied: You do not have permission to create folders.');return}let d=new FormData(e.target),name=(d.get('name')||'').trim(),office=d.get('office')||current.office,ref=(d.get('ref')||'').trim();let start=Date.now();db.projects.unshift({id:start,name,office,ref,createdBy:current.id,date:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),files:[],folders:['Agreements','Bills','Drawings & Plans'].map((n,i)=>({id:start+i+1,name:n,files:[]})),infoFields:[],infoRows:[],report:null,access:[current.id]});save();closeModal();openProject(start)}
function openEditProjectModal(pid){if(!canEdit()){alert('Permission denied: You do not have permission to edit project folders.');return}let p=db.projects.find(x=>x.id===pid);if(!p)return;overlay(`<h3>Edit Project Folder</h3><p>Update name, office and description/content for <b>${esc(p.name)}</b>.</p><form onsubmit="updateProject(event,${pid})"><div class="field"><label>Project name</label><input name="name" required value="${esc(p.name)}"></div><div class="field"><label>Office / Unit</label><select name="office">${offices.map(o=>`<option ${p.office===o?'selected':''}>${o}</option>`).join('')}</select></div><div class="field"><label>Project description / content / reference</label><textarea name="ref" rows="3" placeholder="Project description or reference">${esc(p.ref||'')}</textarea></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Update Project Folder</button></div></form>`)}
function updateProject(e,pid){e.preventDefault();if(!canEdit()){alert('Permission denied: You do not have permission to edit project folders.');return}let p=db.projects.find(x=>x.id===pid);if(!p)return;let d=new FormData(e.target);p.name=(d.get('name')||'').trim();p.office=d.get('office')||p.office;p.ref=(d.get('ref')||'').trim();if(p.report&&p.report.nameOfWork){p.report.nameOfWork=p.name;}save();closeModal();render()}
function deleteProject(pid){if(!canDelete()){alert('Permission denied: You do not have permission to delete project folders.');return}let p=db.projects.find(x=>x.id===pid);if(!p)return;if(confirm(`क्या आप सचमुच प्रोजेक्ट फ़ोल्डर "${p.name}" और इसके सभी दस्तावेज़ों, सब-फ़ोल्डर्स व रिपोर्ट को Delete करना चाहते हैं?`)){db.projects=db.projects.filter(x=>x.id!==pid);if(activeProject===pid){activeProject=null;activeFolder=null;}save();render()}}
function openFolderModal(pid){if(!canUpload()&&!canEdit()){alert('Permission denied: You do not have permission to create folders.');return}overlay(`<h3>Add project sub-folder</h3><p>Examples: Estimates, Drawings, Site Photos, Agreements, Correspondence.</p><form onsubmit="createFolder(event,${pid})"><div class="field"><label>Folder name</label><input name="name" required placeholder="e.g. Site Photographs"></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Create folder</button></div></form>`)}
function createFolder(e,pid){e.preventDefault();if(!canUpload()&&!canEdit()){alert('Permission denied: You do not have permission to create folders.');return}let p=db.projects.find(x=>x.id===pid);(p.folders||=[]).push({id:Date.now(),name:new FormData(e.target).get('name').trim(),files:[]});save();closeModal()}
function deleteFolder(pid,fid){if(!canDelete()){alert('Permission denied: You do not have permission to delete folders.');return}if(confirm('Delete this folder and all its file records?')){let p=db.projects.find(x=>x.id===pid);p.folders=p.folders.filter(f=>f.id!==fid);if(activeFolder===fid)activeFolder=null;save();render()}}
function openReportModal(pid){if(!canEdit()){alert('Permission denied: You do not have permission to edit this report.');return}let p=db.projects.find(x=>x.id===pid),r=p.report||{nameOfWork:p.name,nameOfAgency:'',estimatedCost:'',agreementValue:'',dateOfStart:'',dateOfCompletionAgr:'',timeExtUpTo:'',timeExtLtNo:'',timeExtDate:'',aaAmount:'',aaLtNo:'',aaDate:'',techApproval:'',techSanction:'',projectCostBOQ:'',dateOfTender:'',dateOfAgreement:'',actualDateOfCompletion:'',landAcquisition:'',utilityShifting:'',bitumenReq:'',bitumenConsumed:'',bitumenBalance:'',bitumenRemarks:'',emulsionReq:'',emulsionConsumed:'',emulsionBalance:'',emulsionRemarks:'',materials:defaultMaterials.map(m=>({item:m.item,letter:m.letter,workDone:'',challanSubmitted:'',balanceChallan:'',remarks:''})),testReportBill:'',testReportLtNoDate:'',testReportStatus:'Submitted',testReportRemarks:''},mats=r.materials&&r.materials.length?r.materials:defaultMaterials.map(m=>({item:m.item,letter:m.letter,workDone:'',challanSubmitted:'',balanceChallan:'',remarks:''}));overlay(`<h3>${p.report?'Edit':'Fill'} Detail Project Information Report</h3><p style="margin-bottom:14px;color:var(--muted)">OFFICE OF THE EXECUTIVE ENGINEER ROAD DIVISION HILSA</p><form onsubmit="saveReport(event,${pid})"><div class="report-section-legend">1. General Work & Agreement Information (Items 1 - 6)</div><div class="field"><label>1. Name of Work</label><input name="nameOfWork" required value="${esc(r.nameOfWork||p.name)}"></div><div class="form-grid-3"><div class="field"><label>2. Name of Agency</label><input name="nameOfAgency" placeholder="Agency / Contractor Name" value="${esc(r.nameOfAgency||'')}"></div><div class="field"><label>3. Estimated Cost</label><input name="estimatedCost" placeholder="e.g. 1452.80 Lakhs" value="${esc(r.estimatedCost||'')}"></div><div class="field"><label>4. Agreement Value</label><input name="agreementValue" placeholder="e.g. 1389.20 Lakhs" value="${esc(r.agreementValue||'')}"></div></div><div class="form-grid-2"><div class="field"><label>5. Date of Start</label><input name="dateOfStart" type="date" value="${toInputDate(r.dateOfStart)}"></div><div class="field"><label>6. Date of Completion (As Per Agr)</label><input name="dateOfCompletionAgr" type="date" value="${toInputDate(r.dateOfCompletionAgr)}"></div></div><div class="report-section-legend">2. Extensions & Approvals (Items 7 - 16)</div><div style="background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:10px 12px;margin-bottom:12px"><b style="font-size:12px;color:var(--navy)">7. Time Extention Granted:</b><div class="form-grid-3" style="margin-top:6px"><div class="field"><label class="small">Up to Date</label><input name="timeExtUpTo" type="date" value="${toInputDate(r.timeExtUpTo)}"></div><div class="field"><label class="small">Lt. No.</label><input name="timeExtLtNo" placeholder="Letter No." value="${esc(r.timeExtLtNo||'')}"></div><div class="field"><label class="small">Date</label><input name="timeExtDate" type="date" value="${toInputDate(r.timeExtDate)}"></div></div></div><div style="background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:10px 12px;margin-bottom:12px"><b style="font-size:12px;color:var(--navy)">8. Adminstrative Aproval (in Lakhs):</b><div class="form-grid-3" style="margin-top:6px"><div class="field"><label class="small">Amount (in Lakhs)</label><input name="aaAmount" placeholder="e.g. 1452.80" value="${esc(r.aaAmount||'')}"></div><div class="field"><label class="small">Lt. No.</label><input name="aaLtNo" placeholder="Letter No." value="${esc(r.aaLtNo||'')}"></div><div class="field"><label class="small">Date</label><input name="aaDate" type="date" value="${toInputDate(r.aaDate)}"></div></div></div><div class="form-grid-3"><div class="field"><label>9. Technical Approval (in Lakhs)</label><input name="techApproval" placeholder="in Lakhs" value="${esc(r.techApproval||'')}"></div><div class="field"><label>10. Technical Sanction (in Lakhs)</label><input name="techSanction" placeholder="in Lakhs" value="${esc(r.techSanction||'')}"></div><div class="field"><label>11. Project Cost (As Per BOQ)</label><input name="projectCostBOQ" placeholder="in Lakhs" value="${esc(r.projectCostBOQ||'')}"></div></div><div class="form-grid-3"><div class="field"><label>12. Date of Tender</label><input name="dateOfTender" type="date" value="${toInputDate(r.dateOfTender)}"></div><div class="field"><label>13. Date of Agreement</label><input name="dateOfAgreement" type="date" value="${toInputDate(r.dateOfAgreement)}"></div><div class="field"><label>14. Actual Date of Completion</label><input name="actualDateOfCompletion" placeholder="Date or Status" value="${esc(r.actualDateOfCompletion||'')}"></div></div><div class="form-grid-2"><div class="field"><label>15. Land Acqusition (Provision in lacs)</label><input name="landAcquisition" placeholder="in Lakhs" value="${esc(r.landAcquisition||'')}"></div><div class="field"><label>16. Utility Shifting (Provision in lacs)</label><input name="utilityShifting" placeholder="in Lakhs" value="${esc(r.utilityShifting||'')}"></div></div><div class="report-section-legend">3. Bitumen & Emulsion Consumption (Item 17)</div><div style="background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:10px 12px;margin-bottom:12px"><b style="font-size:12px;color:var(--navy)">Bitumen Consumption Status:</b><div class="form-grid-4" style="margin-top:6px"><div class="field"><label class="small">Required Qty (D.O Letter)</label><input name="bitumenReq" placeholder="e.g. 180 MT" value="${esc(r.bitumenReq||'')}"></div><div class="field"><label class="small">Consume Qty</label><input name="bitumenConsumed" placeholder="e.g. 125 MT" value="${esc(r.bitumenConsumed||'')}"></div><div class="field"><label class="small">Balance Qty</label><input name="bitumenBalance" placeholder="e.g. 55 MT" value="${esc(r.bitumenBalance||'')}"></div><div class="field"><label class="small">Remarks</label><input name="bitumenRemarks" placeholder="Remarks" value="${esc(r.bitumenRemarks||'')}"></div></div></div><div style="background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:10px 12px;margin-bottom:12px"><b style="font-size:12px;color:var(--navy)">Emulsion Consumption Status:</b><div class="form-grid-4" style="margin-top:6px"><div class="field"><label class="small">Required Qty (D.O Letter)</label><input name="emulsionReq" placeholder="e.g. 45 MT" value="${esc(r.emulsionReq||'')}"></div><div class="field"><label class="small">Consume Qty</label><input name="emulsionConsumed" placeholder="e.g. 32 MT" value="${esc(r.emulsionConsumed||'')}"></div><div class="field"><label class="small">Balance Qty</label><input name="emulsionBalance" placeholder="e.g. 13 MT" value="${esc(r.emulsionBalance||'')}"></div><div class="field"><label class="small">Remarks</label><input name="emulsionRemarks" placeholder="Remarks" value="${esc(r.emulsionRemarks||'')}"></div></div></div><div class="report-section-legend">4. Consumed Material (Item 18)</div><div class="table-wrap"><table class="sub-material-table"><thead><tr><th style="width:25%">Material</th><th>As Per Upto date Work Done</th><th>Challan Submitted</th><th>Balance Challan</th><th>Remarks</th></tr></thead><tbody>${mats.map((m,i)=>`<tr><td><b>${esc(m.letter)} ${esc(m.item)}</b><input type="hidden" name="mat_item_${i}" value="${esc(m.item)}"><input type="hidden" name="mat_letter_${i}" value="${esc(m.letter)}"></td><td><input name="mat_work_${i}" placeholder="Qty" value="${esc(m.workDone||'')}"></td><td><input name="mat_challan_${i}" placeholder="Challan" value="${esc(m.challanSubmitted||'')}"></td><td><input name="mat_bal_${i}" placeholder="Balance" value="${esc(m.balanceChallan||'')}"></td><td><input name="mat_rem_${i}" placeholder="Remarks" value="${esc(m.remarks||'')}"></td></tr>`).join('')}</tbody></table></div><div class="report-section-legend">5. Test Report Status on Accounts Bill (Item 19)</div><div class="form-grid-4"><div class="field"><label>on Accounts Bill</label><input name="testReportBill" placeholder="e.g. 3rd RA Bill" value="${esc(r.testReportBill||'')}"></div><div class="field"><label>Letter No. & Date</label><input name="testReportLtNoDate" placeholder="Letter no & date" value="${esc(r.testReportLtNoDate||'')}"></div><div class="field"><label>Submitted Status</label><select name="testReportStatus"><option value="Submitted" ${r.testReportStatus==='Submitted'?'selected':''}>Submitted</option><option value="Not Submitted" ${r.testReportStatus==='Not Submitted'?'selected':''}>Not Submitted</option></select></div><div class="field"><label>Remarks</label><input name="testReportRemarks" placeholder="Remarks" value="${esc(r.testReportRemarks||'')}"></div></div><div class="modal-actions" style="margin-top:24px"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Save Information Report</button></div></form>`,true)}
function saveReport(e,pid){e.preventDefault();if(!canEdit()){alert('Permission denied: You do not have permission to edit this report.');return}let p=db.projects.find(x=>x.id===pid),d=new FormData(e.target);let materials=[];for(let i=0;i<defaultMaterials.length;i++){materials.push({item:d.get(`mat_item_${i}`)||defaultMaterials[i].item,letter:d.get(`mat_letter_${i}`)||defaultMaterials[i].letter,workDone:(d.get(`mat_work_${i}`)||'').trim(),challanSubmitted:(d.get(`mat_challan_${i}`)||'').trim(),balanceChallan:(d.get(`mat_bal_${i}`)||'').trim(),remarks:(d.get(`mat_rem_${i}`)||'').trim()})}p.report={nameOfWork:(d.get('nameOfWork')||'').trim(),nameOfAgency:(d.get('nameOfAgency')||'').trim(),estimatedCost:(d.get('estimatedCost')||'').trim(),agreementValue:(d.get('agreementValue')||'').trim(),dateOfStart:d.get('dateOfStart')||'',dateOfCompletionAgr:d.get('dateOfCompletionAgr')||'',timeExtUpTo:d.get('timeExtUpTo')||'',timeExtLtNo:(d.get('timeExtLtNo')||'').trim(),timeExtDate:d.get('timeExtDate')||'',aaAmount:(d.get('aaAmount')||'').trim(),aaLtNo:(d.get('aaLtNo')||'').trim(),aaDate:d.get('aaDate')||'',techApproval:(d.get('techApproval')||'').trim(),techSanction:(d.get('techSanction')||'').trim(),projectCostBOQ:(d.get('projectCostBOQ')||'').trim(),dateOfTender:d.get('dateOfTender')||'',dateOfAgreement:d.get('dateOfAgreement')||'',actualDateOfCompletion:(d.get('actualDateOfCompletion')||'').trim(),landAcquisition:(d.get('landAcquisition')||'').trim(),utilityShifting:(d.get('utilityShifting')||'').trim(),bitumenReq:(d.get('bitumenReq')||'').trim(),bitumenConsumed:(d.get('bitumenConsumed')||'').trim(),bitumenBalance:(d.get('bitumenBalance')||'').trim(),bitumenRemarks:(d.get('bitumenRemarks')||'').trim(),emulsionReq:(d.get('emulsionReq')||'').trim(),emulsionConsumed:(d.get('emulsionConsumed')||'').trim(),emulsionBalance:(d.get('emulsionBalance')||'').trim(),emulsionRemarks:(d.get('emulsionRemarks')||'').trim(),materials:materials,testReportBill:(d.get('testReportBill')||'').trim(),testReportLtNoDate:(d.get('testReportLtNoDate')||'').trim(),testReportStatus:d.get('testReportStatus')||'Submitted',testReportRemarks:(d.get('testReportRemarks')||'').trim(),updatedAt:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),updatedBy:current.name};save();closeModal()}
function deleteReport(pid){if(!canDelete()){alert('Permission denied: You do not have permission to delete this report.');return}if(confirm('क्या आप सचमुच इस Detail Project Information Report को Clear/Delete करना चाहते हैं?')){let p=db.projects.find(x=>x.id===pid);p.report=null;save();render()}}
function fileToDataUrl(f){return new Promise(res=>{if(!f||!f.size)return res(null);let r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>res(null);r.readAsDataURL(f)})}
function openUserModal(uid,prefillOffice=null,prefillRole=null){
  let u=uid?db.users.find(x=>x.id===uid):null;
  let p=u?getUserPerms(u):{view:true,upload:true,edit:true,delete:(prefillRole==='Admin')};
  let curRole=u?u.role:(prefillRole||'Data Creator');
  let curOff=u?u.office:(prefillOffice||current.office);
  let uOffs=u?getUserOffices(u):[curOff];
  let allOffs=getOffices();

  overlay(`<h3>${u?'Edit / Update user account':'Add new user account'}</h3>
<p>${u?`Update details for <b>${esc(u.name)}</b> (${esc(u.id)})`:'New user can be assigned to multiple offices with specific roles and powers immediately.'}</p>
<form onsubmit="saveUser(event,'${u?u.id:''}')">
  <div class="form-grid-2">
    <div class="field">
      <label>Full name</label>
      <input name="name" required value="${esc(u?u.name:'')}" placeholder="e.g. Rahul Kumar">
    </div>
    <div class="field">
      <label>Designation (पदनाम)</label>
      <input name="designation" list="designationList" value="${esc(u?.designation||'')}" placeholder="e.g. Executive Engineer / Assistant Engineer">
      <datalist id="designationList">${defaultDesignations.map(d=>`<option value="${d}">`).join('')}</datalist>
    </div>
  </div>

  <div class="form-grid-2">
    <div class="field">
      <label>Primary Office / Unit</label>
      <select id="userPrimaryOfficeSelect" name="office" onchange="syncUserPrimaryOfficeCheck(this.value)">
        ${getOfficeList().map(o=>`<option value="${esc(o)}" ${curOff===o?'selected':''}>${esc(o)}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label>Role</label>
      <select name="role" onchange="applyRolePreset(this.value)">
        ${['Admin','Data Creator','Data Viewer'].map(r=>`<option ${curRole===r?'selected':''}>${r}</option>`).join('')}
      </select>
    </div>
  </div>

  <div style="margin:14px 0 6px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <b style="color:var(--navy);font-size:13px">Assigned Offices (Multiple Offices Assignment):</b>
      <div class="small" style="color:var(--muted)">जिन-जिन कार्यालयों का अधिकार देना है, उन्हें टिक करें:</div>
    </div>
    <div style="display:flex;gap:6px">
      <button type="button" class="secondary small" style="padding:2px 8px;font-size:11px" onclick="selectAllUserOffices(true)">Select All / All Offices</button>
      <button type="button" class="secondary small" style="padding:2px 8px;font-size:11px" onclick="selectAllUserOffices(false)">Reset to Primary</button>
    </div>
  </div>

  <div id="userOfficesGrid" style="display:grid;grid-template-columns:1fr;gap:6px;background:#f8fafc;border:1px solid #dce8f1;border-radius:8px;padding:10px;max-height:180px;overflow-y:auto;margin-bottom:14px">
    ${allOffs.map(o=>{
      let isChecked=uOffs.includes(o.name)||(curOff===o.name);
      let isPrimary=(curOff===o.name);
      let badgeClass=o.type==='Division'?'badge-division':o.type==='Sub-Division'?'badge-subdiv':'badge-branch';
      return `<label class="office-select-item ${isChecked?'selected':''}" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 10px;border-radius:6px;cursor:pointer">
        <div style="display:flex;align-items:center;gap:8px">
          <input type="checkbox" name="assigned_offices" value="${esc(o.name)}" ${isChecked?'checked':''} onchange="this.closest('label').classList.toggle('selected',this.checked)" style="cursor:pointer">
          <div>
            <b>${esc(o.name)}</b> <span class="small" style="color:var(--muted)">(${esc(o.code||'—')})</span>
            ${isPrimary?'<span class="small" style="color:#0369a1;font-weight:700;margin-left:4px">[Primary]</span>':''}
          </div>
        </div>
        <span class="${badgeClass}" style="font-size:10px">${esc(o.type||'Sub-Division')}</span>
      </label>`;
    }).join('')}
  </div>

  <div class="form-grid-2">
    <div class="field">
      <label>User ID</label>
      <input name="id" required value="${esc(u?u.id:'')}" placeholder="e.g. ADM-HIL-02 / CRE-RAJ-02" ${u&&u.id===current.id?'readonly style="background:#f4f7f9"':''}>
    </div>
    <div class="field">
      <label>${u?'Password (leave blank to keep unchanged)':'Password'}</label>
      <input name="password" type="password" ${u?'':'required'} placeholder="${u?'•••••••• (unchanged)':'Enter password'}">
    </div>
  </div>

  <div style="margin:14px 0 8px;font-weight:700;color:var(--navy)">Role Powers (अधिकार):</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:12px;margin-bottom:12px">
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
      <input type="checkbox" id="perm_view" name="perm_view" ${p.view?'checked':''}><span>👁️ Viewing</span>
    </label>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
      <input type="checkbox" id="perm_upload" name="perm_upload" ${p.upload?'checked':''}><span>📤 Upload</span>
    </label>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
      <input type="checkbox" id="perm_edit" name="perm_edit" ${p.edit?'checked':''}><span>✏️ Edit</span>
    </label>
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
      <input type="checkbox" id="perm_delete" name="perm_delete" ${p.delete?'checked':''}><span>🗑️ Delete</span>
    </label>
  </div>

  <div class="field">
    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
      <input type="checkbox" name="approved" ${(!u||u.approved)?'checked':''}>
      <span>Approved account (allow login immediately)</span>
    </label>
  </div>

  <div class="modal-actions">
    <button type="button" class="secondary" onclick="closeModal()">Cancel</button>
    <button class="primary">${u?'Update user':'Add user'}</button>
  </div>
</form>`, true);
}
function selectAllUserOffices(checked){
  let cbs=document.querySelectorAll('#userOfficesGrid input[name="assigned_offices"]');
  cbs.forEach(cb=>{
    cb.checked=checked;
    let label=cb.closest('label');
    if(label)label.classList.toggle('selected',checked);
  });
  if(!checked){
    let pri=document.querySelector('#userPrimaryOfficeSelect')?.value;
    if(pri){
      let pcb=Array.from(cbs).find(c=>c.value===pri);
      if(pcb){
        pcb.checked=true;
        let label=pcb.closest('label');
        if(label)label.classList.add('selected');
      }
    }
  }
}
function syncUserPrimaryOfficeCheck(val){
  let cbs=document.querySelectorAll('#userOfficesGrid input[name="assigned_offices"]');
  cbs.forEach(cb=>{
    if(cb.value===val){
      cb.checked=true;
      let label=cb.closest('label');
      if(label)label.classList.add('selected');
    }
  });
}
function saveUser(e,oldId){
  e.preventDefault();
  let d=Object.fromEntries(new FormData(e.target)),approved=e.target.querySelector('[name="approved"]').checked;
  let perms={view:!!e.target.querySelector('[name="perm_view"]')?.checked,upload:!!e.target.querySelector('[name="perm_upload"]')?.checked,edit:!!e.target.querySelector('[name="perm_edit"]')?.checked,delete:!!e.target.querySelector('[name="perm_delete"]')?.checked};
  let designation=(d.designation||'').trim()||(d.role==='Admin'?'Executive Engineer':(d.role==='Data Creator'?'Assistant Engineer':'Junior Engineer'));
  let checkedOffices=Array.from(e.target.querySelectorAll('input[name="assigned_offices"]:checked')).map(cb=>cb.value);
  if(!checkedOffices.length)checkedOffices=[d.office];
  if(!checkedOffices.includes(d.office))checkedOffices.unshift(d.office);

  if(oldId){
    let u=db.users.find(x=>x.id===oldId);
    if(!u)return;
    let newId=d.id.trim();
    if(newId!==oldId&&db.users.some(x=>x.id===newId)){alert('User ID already exists! Please use a unique User ID.');return}
    u.name=d.name.trim();
    u.designation=designation;
    u.office=d.office;
    u.assignedOffices=checkedOffices;
    u.role=d.role;
    u.id=newId;
    u.permissions=perms;
    if(d.password&&d.password.trim())u.password=d.password.trim();
    u.approved=approved;
    if(current.id===oldId){current=u}
  }else{
    let newId=d.id.trim();
    if(db.users.some(u=>u.id===newId)){alert('User ID already exists! Please use a unique User ID.');return}
    db.users.push({
      id:newId,
      name:d.name.trim(),
      designation:designation,
      office:d.office,
      assignedOffices:checkedOffices,
      role:d.role,
      password:d.password.trim(),
      approved:approved,
      permissions:perms
    });
  }
  save();closeModal();render();
}
function deleteUser(uid){if(uid===current.id){alert('You cannot delete your own logged-in admin account!');return}let u=db.users.find(x=>x.id===uid);if(!u)return;if(confirm(`Are you sure you want to delete user account "${u.name} (${u.id})"?`)){db.users=db.users.filter(x=>x.id!==uid);save();render()}}
function openLetterModal(id){if(id?!canEdit():(!canUpload()&&!canEdit())){alert('Permission denied: You do not have permission to register/edit letters.');return}let l=id?db.letters.find(x=>x.id===id):{};overlay(`<h3>${id?'Edit':'Register'} letter</h3><p>Letter details, attachment and description enter करें।</p><form onsubmit="saveLetter(event,${id||0})"><div class="field"><label>Letter type</label><select name="type">${['Outward','Inward','Other'].map(x=>`<option ${l.type===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Letter no.</label><input name="number" required value="${esc(l.number||'')}"></div><div class="field"><label>Date</label><input name="date" type="date" required value="${id?toInputDate(l.date):new Date().toISOString().slice(0,10)}"></div><div class="field"><label>Subject</label><input name="subject" required value="${esc(l.subject||'')}"></div><div class="field"><label>Attachment name</label><input name="file" value="${esc(l.file||'')}" placeholder="e.g. Letter.pdf"></div><div class="field"><label>Description</label><input name="description" value="${esc(l.description||'')}" placeholder="e.g. Approval letter for agreement"></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Save letter</button></div></form>`)}
function toInputDate(value){let d=new Date(value);return isNaN(d)?'':d.toISOString().slice(0,10)}
function saveLetter(e,id){e.preventDefault();if(id?!canEdit():(!canUpload()&&!canEdit())){alert('Permission denied: You do not have permission to register/edit letters.');return}let x=Object.fromEntries(new FormData(e.target));x.date=new Date(x.date).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});x.office=current.office;if(id){let at=db.letters.findIndex(l=>l.id===id);x.id=id;db.letters[at]=x}else{x.id=Date.now();db.letters.unshift(x)}save();closeModal()}function createLetter(e){saveLetter(e,0)}function deleteLetter(id){if(!canDelete()){alert('Permission denied: You do not have permission to delete letters.');return}if(confirm('Delete this letter record?')){db.letters=db.letters.filter(l=>l.id!==id);save();render()}}
function makeFile(f,description='',docNo='',dataUrl=null){return{id:Date.now()+Math.random(),docNo:docNo||('DOC-'+Date.now().toString().slice(-4)),name:f.name,type:(f.name.split('.').pop()||'FILE').toUpperCase(),size:(f.size/1024/1024).toFixed(2)+' MB',date:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),description,blob:f,dataUrl}}
function bindPicker(){let p=document.querySelector('#file-picker');if(p)p.onchange=async e=>{let project=db.projects.find(x=>x.id===Number(p.dataset.project)),target=p.dataset.folder?project.folders.find(f=>f.id===Number(p.dataset.folder)).files:project.files;for(let f of e.target.files){let dataUrl=await fileToDataUrl(f);target.push(makeFile(f,'','',dataUrl))};save();p.value='';delete p.dataset.folder;render()}}
function pickFile(pid){openUploadModal(pid)}function pickFolderFile(pid,fid){openUploadModal(pid,fid)}function openUploadModal(pid,folderId,replaceFileId){if(!canUpload()){alert('Permission denied: You do not have permission to upload files.');return}let p=db.projects.find(x=>x.id===pid),folder=folderId?p.folders.find(f=>f.id===folderId):null,existing=replaceFileId?(folder?folder.files.find(f=>f.id===replaceFileId):p.files.find(f=>f.id===replaceFileId)):null;overlay(`<h3>${existing?'Re-upload / Replace attachment':'Upload attachment'}</h3><p>${folder?`Folder: <b>${esc(folder.name)}</b>`:'Project root documents'}</p><form onsubmit="saveUpload(event,${pid},${folderId||0},${replaceFileId||0})"><div class="field"><label>Document No. / Reference</label><input name="docNo" required placeholder="e.g. DOC-01 / AG-2026/01" value="${esc(existing?.docNo||'')}"></div><div class="field"><label>Select file ${existing?`(Current: ${esc(existing.name)})`:''}</label><input name="file" type="file" ${existing?'':'required'}></div><div class="field"><label>Description</label><input name="description" required placeholder="e.g. Agreement copy / Bill details" value="${esc(existing?.description||'')}"></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">${existing?'Update document':'Upload file'}</button></div></form>`)}async function saveUpload(e,pid,folderId,replaceFileId){e.preventDefault();if(!canUpload()){alert('Permission denied: You do not have permission to upload files.');return}let d=new FormData(e.target),file=d.get('file'),docNo=d.get('docNo').trim(),desc=d.get('description').trim(),p=db.projects.find(x=>x.id===pid),target=folderId?p.folders.find(f=>f.id===folderId).files:p.files;if(replaceFileId){let existing=target.find(f=>f.id===replaceFileId);if(existing){existing.docNo=docNo;existing.description=desc;if(file&&file.size){let dataUrl=await fileToDataUrl(file);existing.name=file.name;existing.type=(file.name.split('.').pop()||'FILE').toUpperCase();existing.size=(file.size/1024/1024).toFixed(2)+' MB';existing.date=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});existing.dataUrl=dataUrl;existing.blob=file}}}else{let dataUrl=file&&file.size?await fileToDataUrl(file):null;target.push(makeFile(file,desc,docNo,dataUrl))}save();closeModal()}function openFileEditModal(pid,folderId,fid){if(!canEdit()){alert('Permission denied: You do not have permission to edit document details.');return}let p=db.projects.find(x=>x.id===pid),file=folderId?p.folders.find(f=>f.id===folderId).files.find(f=>f.id===fid):p.files.find(f=>f.id===fid);overlay(`<h3>Edit attachment details</h3><p>File: <b>${esc(file.name)}</b></p><form onsubmit="saveFileEdit(event,${pid},${folderId||0},${fid})"><div class="field"><label>Document No. / Reference</label><input name="docNo" required value="${esc(file.docNo||'')}"></div><div class="field"><label>Description</label><input name="description" required value="${esc(file.description||'')}"></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">Save changes</button></div></form>`)}function saveFileEdit(e,pid,folderId,fid){e.preventDefault();if(!canEdit()){alert('Permission denied: You do not have permission to edit document details.');return}let p=db.projects.find(x=>x.id===pid),file=folderId?p.folders.find(f=>f.id===folderId).files.find(f=>f.id===fid):p.files.find(f=>f.id===fid),d=new FormData(e.target);file.docNo=d.get('docNo').trim();file.description=d.get('description').trim();save();closeModal()}function removeFile(pid,fid){if(!canDelete()){alert('Permission denied: You do not have permission to delete files.');return}if(confirm('Delete this file record?')){let p=db.projects.find(x=>x.id===pid);p.files=p.files.filter(f=>f.id!==fid);save();render()}}function removeFolderFile(pid,folderId,fid){if(!canDelete()){alert('Permission denied: You do not have permission to delete attachments.');return}if(confirm('Delete this attachment?')){let f=db.projects.find(x=>x.id===pid).folders.find(x=>x.id===folderId);f.files=f.files.filter(x=>x.id!==fid);save();render()}}function downloadFile(pid,fid){if(!canView()){alert('Permission denied: You do not have permission to download files.');return}downloadObject(db.projects.find(x=>x.id===pid).files.find(x=>x.id===fid))}function downloadFolderFile(pid,folderId,fid){if(!canView()){alert('Permission denied: You do not have permission to download files.');return}downloadObject(db.projects.find(x=>x.id===pid).folders.find(x=>x.id===folderId).files.find(x=>x.id===fid))}function downloadObject(f){if(!f)return;let a=document.createElement('a');if(f.dataUrl){a.href=f.dataUrl}else if(f.blob&&typeof f.blob==='object'&&f.blob instanceof Blob){a.href=URL.createObjectURL(f.blob)}else{a.href='data:text/plain;charset=utf-8,'+encodeURIComponent('Demo document: '+(f.name||'file'))}a.download=f.name||'download';a.click();if(!f.dataUrl&&f.blob instanceof Blob)setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
render();

let activeOfficeTab='all';
function setOfficeTab(t){activeOfficeTab=t;render()}
function officeManagement(){
  if(current.role!=='Admin')return '';
  let offs=getOffices(),divCount=offs.filter(o=>o.type==='Division').length,subCount=offs.filter(o=>o.type==='Sub-Division').length,branchCount=offs.filter(o=>o.type==='Branch'||o.type==='Section / Cell').length,adminUsers=db.users.filter(u=>u.role==='Admin'&&u.approved);
  let filtered=activeOfficeTab==='all'?offs:activeOfficeTab==='division'?offs.filter(o=>o.type==='Division'):activeOfficeTab==='subdivision'?offs.filter(o=>o.type==='Sub-Division'):offs.filter(o=>o.type==='Branch'||o.type==='Section / Cell');
  return `<div class="page-head"><div><h3>Office & Division Management</h3><p>कार्यालय, प्रमंडल (Division), उप-प्रमंडल (Sub-Division) और शाखाओं का प्रबंधन एवं Multiple Admins नियुक्ति।</p></div><div style="display:flex;gap:8px"><button class="secondary" onclick="go('users')">👥 User Accounts</button><button class="primary" onclick="openOfficeModal()">+ Add Office / Sub-Division</button></div></div><div class="grid" style="margin-bottom:20px"><div class="metric"><label>Total Units / Offices</label><strong>${offs.length}</strong><span>All administrative units</span></div><div class="metric"><label>Divisions</label><strong>${divCount}</strong><span>Primary division HQ</span></div><div class="metric"><label>Sub-Divisions</label><strong>${subCount}</strong><span>Field sub-divisions</span></div><div class="metric"><label>Active Administrators</label><strong>${adminUsers.length}</strong><span>Multiple Office Admins</span></div></div><div class="tabrow"><button class="${activeOfficeTab==='all'?'active':''}" onclick="setOfficeTab('all')">All Units (${offs.length})</button><button class="${activeOfficeTab==='division'?'active':''}" onclick="setOfficeTab('division')">Divisions (${divCount})</button><button class="${activeOfficeTab==='subdivision'?'active':''}" onclick="setOfficeTab('subdivision')">Sub-Divisions (${subCount})</button><button class="${activeOfficeTab==='branch'?'active':''}" onclick="setOfficeTab('branch')">Branches & Wings (${branchCount})</button></div><section class="panel" style="margin-bottom:20px"><div class="page-head" style="margin-bottom:14px"><div><h4>Offices, Divisions & Branches Directory</h4><div class="panel-sub">Change office names, designations, add new units or assign dedicated administrators.</div></div><button class="primary small" onclick="openOfficeModal()">+ Add New Unit</button></div><div class="table-wrap"><table><thead><tr><th>Office / Unit Name</th><th style="text-align:center">Level / Type</th><th>In-Charge Designation & Name</th><th>Office Admin(s)</th><th style="text-align:center">Workload</th><th style="text-align:center">Action</th></tr></thead><tbody>${filtered.map(o=>{let oAdmins=db.users.filter(u=>u.role==='Admin'&&(u.office===o.name||(u.assignedOffices&&u.assignedOffices.includes(o.name))));let pCount=db.projects.filter(p=>p.office===o.name).length;let dCount=db.projects.filter(p=>p.office===o.name).reduce((acc,p)=>acc+(p.files?p.files.length:0)+(p.folders||[]).reduce((fa,f)=>fa+(f.files?f.files.length:0),0),0);let badgeClass=o.type==='Division'?'badge-division':o.type==='Sub-Division'?'badge-subdiv':'badge-branch';return `<tr><td><b>${esc(o.name)}</b> <span class="small" style="color:var(--muted);font-weight:700">(${esc(o.code||'—')})</span><br><span class="small" style="color:var(--muted)">📍 ${esc(o.location||'Nalanda')}</span></td><td style="text-align:center"><span class="${badgeClass}">${esc(o.type||'Sub-Division')}</span></td><td><b style="color:var(--navy)">${esc(o.incharge||'In-Charge Officer')}</b><br><span class="small">${esc(o.inchargeName||'Designated Officer')}</span></td><td><div style="display:flex;gap:4px;flex-wrap:wrap;align-items:center">${oAdmins.map(a=>`<span class="perm-pill on" style="font-size:11px" title="${esc(a.id)} · ${esc(a.designation||'Admin')}">🛡️ ${esc(a.name)}</span>`).join('')||'<span class="small" style="color:var(--muted)">None appointed</span>'}<button class="secondary small" style="padding:2px 7px;font-size:11px" onclick="openAssignAdminModal('${esc(o.name)}')" title="Appoint/Add Admin for this office">+ Admin</button></div></td><td style="text-align:center"><b>${pCount}</b> <span class="small">proj</span> · <b>${dCount}</b> <span class="small">docs</span></td><td style="text-align:center"><div style="display:flex;gap:5px;justify-content:center;align-items:center;flex-wrap:wrap"><button class="secondary small" onclick="openOfficeModal('${o.id}')" title="Edit Office Details">✏ Edit</button><button class="danger small" onclick="deleteOffice('${o.id}')" title="Delete Office">🗑 Delete</button></div></td></tr>`}).join('')||'<tr><td colspan="6" class="empty">No offices found in this category.</td></tr>'}</tbody></table></div></section><section class="panel"><div class="page-head" style="margin-bottom:14px"><div><h4>Multiple Office Administrators Matrix</h4><div class="panel-sub">All active administrators across divisions, sub-divisions, and branches. Multiple Admins have full management authority.</div></div><button class="primary small" onclick="openUserModal(null,null,'Admin')">+ Add New Admin Account</button></div><div class="table-wrap"><table><thead><tr><th>Admin Name / ID</th><th>Official Designation</th><th>Assigned Office / Unit</th><th>Administrative Powers</th><th>Status</th><th style="text-align:center">Action</th></tr></thead><tbody>${adminUsers.map(u=>`<tr><td><b>${esc(u.name)}</b><br><span class="small">${esc(u.id)}</span></td><td><span style="font-weight:600;color:var(--navy)">${esc(u.designation||'Administrator')}</span></td><td>${renderOfficeBadges(u)}</td><td><span class="perm-pill on" style="font-size:11px">👁️ View</span> <span class="perm-pill on" style="font-size:11px">📤 Upload</span> <span class="perm-pill on" style="font-size:11px">✏️ Edit</span> <span class="perm-pill on" style="font-size:11px">🗑️ Delete</span></td><td><span class="status approved">Active Admin</span></td><td style="text-align:center"><button class="secondary small" onclick="openUserModal('${u.id}')">Edit Admin</button> <button class="secondary small" onclick="openRoleModal('${u.id}')">Powers</button></td></tr>`).join('')}</tbody></table></div></section>`;
}
function openOfficeModal(officeId){
  if(current.role!=='Admin'){alert('Permission denied: Only Admin can manage offices.');return}
  let o=officeId?getOffices().find(x=>x.id===officeId):null;
  overlay(`<h3>${o?'Edit Office / Sub-Division':'Add New Office / Sub-Division'}</h3><p>${o?`Update details and in-charge for <b>${esc(o.name)}</b>.`:'Create a new Division, Sub-Division, Branch, or Wing under Road Division Hilsa.'}</p><form onsubmit="saveOffice(event,'${o?o.id:''}')"><div class="field"><label>Office / Unit Name (कार्यालय का नाम)</label><input name="name" required value="${esc(o?o.name:'')}" placeholder="e.g. Road Sub Division Islampur"></div><div class="form-grid-2"><div class="field"><label>Hierarchy Level / Category</label><select name="type"><option ${o&&o.type==='Division'?'selected':''}>Division</option><option ${(!o||o.type==='Sub-Division')?'selected':''}>Sub-Division</option><option ${o&&o.type==='Branch'?'selected':''}>Branch</option><option ${o&&o.type==='Section / Cell'?'selected':''}>Section / Cell</option></select></div><div class="field"><label>Office Code / Short Name</label><input name="code" value="${esc(o?o.code:'')}" placeholder="e.g. RSI / QCW"></div></div><div class="form-grid-2"><div class="field"><label>In-Charge Designation (प्रभारी पदनाम)</label><input name="incharge" list="designationList" value="${esc(o?o.incharge:'')}" placeholder="e.g. Assistant Engineer"><datalist id="designationList">${defaultDesignations.map(d=>`<option value="${d}">`).join('')}</datalist></div><div class="field"><label>In-Charge Officer Name (प्रभारी अधिकारी)</label><input name="inchargeName" value="${esc(o?o.inchargeName:'')}" placeholder="e.g. Er. Rajiv Kumar"></div></div><div class="field"><label>Location / Headquarters (मुख्यालय / पता)</label><input name="location" value="${esc(o?o.location:'')}" placeholder="e.g. Islampur, Nalanda"></div><div class="modal-actions"><button type="button" class="secondary" onclick="closeModal()">Cancel</button><button class="primary">${o?'Update Office Details':'Create Office / Unit'}</button></div></form>`);
}
function saveOffice(e,officeId){
  e.preventDefault();
  if(current.role!=='Admin'){alert('Permission denied: Only Admin can manage offices.');return}
  let d=new FormData(e.target),name=(d.get('name')||'').trim(),type=d.get('type')||'Sub-Division',code=(d.get('code')||'').trim().toUpperCase()||name.split(' ').map(w=>w[0]).join('').toUpperCase(),incharge=(d.get('incharge')||'').trim(),inchargeName=(d.get('inchargeName')||'').trim(),location=(d.get('location')||'').trim();
  if(!name){alert('Office name is required.');return}
  let offs=getOffices();
  if(officeId){
    let o=offs.find(x=>x.id===officeId);
    if(!o)return;
    let oldName=o.name;
    if(oldName!==name&&offs.some(x=>x.id!==officeId&&x.name.toLowerCase()===name.toLowerCase())){alert('An office with this name already exists!');return}
    o.name=name;o.type=type;o.code=code;o.incharge=incharge;o.inchargeName=inchargeName;o.location=location;
    if(oldName!==name){
      db.projects.forEach(p=>{if(p.office===oldName)p.office=name});
      db.users.forEach(u=>{
        if(u.office===oldName)u.office=name;
        if(u.assignedOffices&&Array.isArray(u.assignedOffices)){
          u.assignedOffices=u.assignedOffices.map(x=>x===oldName?name:x);
        }
      });
      db.letters.forEach(l=>{if(l.office===oldName)l.office=name});
      if(current.office===oldName)current.office=name;
      if(current.assignedOffices&&Array.isArray(current.assignedOffices)){
        current.assignedOffices=current.assignedOffices.map(x=>x===oldName?name:x);
      }
    }
  }else{
    if(offs.some(x=>x.name.toLowerCase()===name.toLowerCase())){alert('An office with this name already exists!');return}
    let newId='OFF-'+String(offs.length+1).padStart(2,'0')+'-'+Date.now().toString().slice(-4);
    offs.push({id:newId,name,type,code,incharge:incharge||'In-Charge Officer',inchargeName:inchargeName||'Designated Officer',location:location||'Nalanda'});
  }
  db.offices=offs;
  offices=getOfficeList();
  save();closeModal();render();
}
function deleteOffice(officeId){
  if(current.role!=='Admin'){alert('Permission denied: Only Admin can delete offices.');return}
  let offs=getOffices(),o=offs.find(x=>x.id===officeId);
  if(!o)return;
  if(offs.length<=1){alert('Cannot delete the only remaining office in the system!');return}
  let attachedProjects=db.projects.filter(p=>p.office===o.name),attachedUsers=db.users.filter(u=>u.office===o.name||(u.assignedOffices&&u.assignedOffices.includes(o.name))),fallbackOffice=offs.find(x=>x.id!==officeId&&x.type==='Division')||offs.find(x=>x.id!==officeId);
  let msg=`क्या आप सचमुच कार्यालय/शाखा "${o.name}" को Delete करना चाहते हैं?`;
  if(attachedProjects.length||attachedUsers.length){msg+=`\n\nचेतावनी: इससे जुड़े ${attachedProjects.length} प्रोजेक्ट(s) और ${attachedUsers.length} यूज़र(s) मुख्य कार्यालय ("${fallbackOffice.name}") में Re-assign कर दिए जाएँगे।`;}
  if(confirm(msg)){
    db.projects.forEach(p=>{if(p.office===o.name)p.office=fallbackOffice.name});
    db.users.forEach(u=>{
      if(u.office===o.name)u.office=fallbackOffice.name;
      if(u.assignedOffices&&Array.isArray(u.assignedOffices)){
        u.assignedOffices=u.assignedOffices.filter(x=>x!==o.name);
        if(!u.assignedOffices.length)u.assignedOffices=[fallbackOffice.name];
      }
    });
    db.letters.forEach(l=>{if(l.office===o.name)l.office=fallbackOffice.name});
    if(current.office===o.name)current.office=fallbackOffice.name;
    if(current.assignedOffices&&Array.isArray(current.assignedOffices)){
      current.assignedOffices=current.assignedOffices.filter(x=>x!==o.name);
      if(!current.assignedOffices.length)current.assignedOffices=[fallbackOffice.name];
    }
    db.offices=offs.filter(x=>x.id!==officeId);
    offices=getOfficeList();
    save();render();
  }
}
function openAssignAdminModal(officeName){
  if(current.role!=='Admin'){alert('Permission denied.');return}
  let candidates=db.users.filter(u=>u.office===officeName&&u.role!=='Admin'),currentAdmins=db.users.filter(u=>u.office===officeName&&u.role==='Admin');
  overlay(`<h3>Appoint / Manage Admin for ${esc(officeName)}</h3><p>इस कार्यालय के लिए <b>Multiple Admins</b> नियुक्त करें ताकि वे रिकॉर्ड स्वतंत्र रूप से मैनेज कर सकें।</p><div style="background:#f7fafd;border:1px solid #dce8f1;border-radius:8px;padding:12px;margin-bottom:14px"><b style="color:var(--navy);font-size:13px">Current Admin(s) for this office:</b><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${currentAdmins.map(a=>`<span class="perm-pill on" style="font-size:11px">🛡️ ${esc(a.name)} (${esc(a.designation||'Admin')})</span>`).join('')||'<span class="small" style="color:var(--muted)">No admin currently assigned to this office.</span>'}</div></div>${candidates.length?`<form onsubmit="appointUserAdmin(event,'${esc(officeName)}')"><div class="field"><label>Promote existing staff member to Admin</label><select name="userId" required>${candidates.map(c=>`<option value="${c.id}">${esc(c.name)} (${esc(c.designation||c.role)} - ${c.id})</option>`).join('')}</select></div><button class="primary" style="margin-bottom:14px">Make this User Admin</button></form>`:''}<div style="border-top:1px solid var(--line);padding-top:14px;display:flex;justify-content:space-between;align-items:center"><div><b>या नया Admin account बनाएँ:</b></div><button type="button" class="secondary" onclick="closeModal();openUserModal(null,'${esc(officeName)}','Admin')">+ Create New Admin</button></div><div class="modal-actions" style="margin-top:16px"><button type="button" class="secondary" onclick="closeModal()">Close</button></div>`);
}
function appointUserAdmin(e,officeName){
  e.preventDefault();
  let uid=new FormData(e.target).get('userId'),u=db.users.find(x=>x.id===uid);
  if(!u)return;
  u.role='Admin';
  u.permissions={view:true,upload:true,edit:true,delete:true};
  u.approved=true;
  if(!u.assignedOffices||!Array.isArray(u.assignedOffices))u.assignedOffices=[u.office];
  if(!u.assignedOffices.includes(officeName))u.assignedOffices.push(officeName);
  save();closeModal();render();
}
