const siteSelect = document.getElementById('siteSelect');
const floorWrap  = document.getElementById('floorWrap');
const floorSelect= document.getElementById('floorSelect');
const btnPlano   = document.getElementById('btnPlano');
const btnMapa    = document.getElementById('btnMapa');

const emGrid     = document.getElementById('emGrid');

const viewer     = document.getElementById('viewer');
const viewerTitle= document.getElementById('viewerTitle');
const viewerSubtitle = document.getElementById('viewerSubtitle');
const btnClose   = document.getElementById('btnClose');
const contentWrap= document.getElementById('contentWrap');
const viewerFooter = document.getElementById('viewerFooter');

const btnZoomIn  = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const btnOpenImg = document.getElementById('btnOpenImg');

const btnInfo    = document.getElementById('btnInfo');
const infoDialog = document.getElementById('infoDialog');
const btnInfoClose = document.getElementById('btnInfoClose');
const btnOk      = document.getElementById('btnOk');

let zoom = 1;

const labels = {
  sede_principal: "Sede Principal (Av. Granaderos 3.250)",
  subsede_logistica_prevencion: "Subsede Logística y Prevención (Argentina 3.392)",
  subsede_mantenimiento_plantas_mineras: "Subsede Mant. Plantas Mineras (Granaderos 3.479)",
  subsede_maquinaria_pesada: "Subsede Maquinaria Pesada (Granaderos 3.685)",
  centro_de_negocios: "Centro de Negocios (Granaderos 3.005)",
};

const emergencies = [
{ id:'incendio', icon:'🔥', name:'Incendio', desc:'Avisar y evacuar si está fuera de control.',
    bullets:[
      'Si es un fuego incipiente: avisa de inmediato a seguridad/monitores.',
      'Si el fuego está declarado (fuera de control): interrumpe actividades y evacúa hacia zona de seguridad.',
      'No te devuelvas hasta que la autoridad lo indique.'
    ]
  },
  { id:'sismo', icon:'🌎', name:'Sismo / Terremoto', desc:'Protégete de caídas y evacúa cuando se indique.',
    bullets:[
      'Permanece en el lugar y evalúa la intensidad.',
      'Protégete de la caída de elementos (luminarias, cielo falso u objetos en altura).',
      'Evacúa cuando lo indique el Jefe de Emergencia/monitores hacia la zona de seguridad.'
    ]
  },
  { id:'gas', icon:'🧯', name:'Fuga de gas', desc:'Cortar suministros y evacuar.',
    bullets:[
      'Se debe controlar la fuga: cortar suministros de gas y electricidad (personal autorizado).',
      'Evacuar la totalidad del recinto.',
      'Tomar contacto con compañía de gas (lo coordina la sede).'
    ]
  },
  { id:'electrica', icon:'⚡', name:'Emergencia eléctrica', desc:'Cortar suministros y evacuar.',
    bullets:[
      'Se debe controlar la emergencia: cortar suministros de electricidad y gas (personal autorizado).',
      'Evacuar la totalidad del recinto.',
      'Tomar contacto con compañía eléctrica (lo coordina la sede).'
    ]
  },
  { id:'bomba', icon:'💣', name:'Amenaza de bomba', desc:'Mantener calma, avisar y evacuar.',
    bullets:[
      'Mantener la calma.',
      'Avisar a Carabineros para que tome control de la emergencia.',
      'Evacuar el edificio.',
      'Solo volver cuando la autoridad lo determine.'
    ]
  },
  { id:'vecina', icon:'🏭', name:'Emergencia vecina', desc:'Atento a incidentes externos.',
    bullets:[
      'Mantenerse atento a situaciones en instalaciones vecinas.',
      'Seguir instrucciones: la emergencia es manejada por Jefe de Emergencia con Prevención de Riesgos.',
      'Si se indica, evacuar hacia zonas alejadas del evento.',
      'Reingresar solo cuando la autoridad lo indique.'
    ]
  },
  { id:'medica', icon:'🚑', name:'Emergencia médica', desc:'Calma, no aglomerar, pedir ayuda.',
    bullets:[
      'Guardar calma y evitar aglomerarse alrededor de la persona.',
      'Avisar a docentes/monitores/seguridad para activar apoyo.',
      '📞 <a class="callBtn" href="tel:131">Llamar SAMU 131</a> (entregar ubicación y antecedentes).',
      'No dejar sola a la persona hasta que llegue ayuda.'
    ],
    note:'Nota: “accidente del trabajo” lo gestiona el personal responsable (no aplica como gestión del estudiante).'
  },

  {
    id:'balacera',
    icon:'🔫',
    name:'Balacera / violencia externa',
    desc:'Refúgiate, agáchate y cúbrete. No evacúes sin instrucción.',
    bullets:[
      'Mantén la calma.',
      'Refúgiate dentro de una sala o espacio seguro.',
      'Aléjate de ventanas, puertas y zonas abiertas.',
      'Agáchate y cúbrete la cabeza.',
      'Si es posible, bloquea o asegura la puerta.',
      'Permanece en silencio y sigue instrucciones del personal de la sede.',
      'No evacúes hasta recibir instrucciones de Seguridad/Prevención.'
    ],
    note:'Clave: Escóndete – Agáchate – Cúbrete – Silencio.'
  }
];

function isSedePrincipal(){ return siteSelect.value === 'sede_principal'; }

function syncUI(){
  floorWrap.hidden = !isSedePrincipal();
  localStorage.setItem('pe_site', siteSelect.value);
  localStorage.setItem('pe_floor', floorSelect.value);
}

function planKey(){
  if(isSedePrincipal()){
    const f = floorSelect.value;
    if(f === 'piso1') return 'sede_principal_piso1';
    if(f === 'piso2') return 'sede_principal_piso2';
    if(f === 'piso3') return 'sede_principal_piso3';
    return 'sede_principal_subterraneo';
  }
  return siteSelect.value;
}

function planTitle(){
  if(isSedePrincipal()){
    const f = floorSelect.value;
    const piso = (f === 'subterraneo') ? 'Subterráneo' : f.replace('piso','Piso ');
    return `Plano Evacuación – ${labels.sede_principal} – ${piso}`;
  }
  return `Plano Evacuación – ${labels[siteSelect.value]}`;
}

function openViewerAsImage(src, title, subtitle=""){
  viewer.hidden = false;
  viewerTitle.textContent = title;
  viewerSubtitle.textContent = subtitle;

  contentWrap.innerHTML = `
    <div class="imgWrap">
      <img id="viewerImg" alt="${title}" loading="lazy" />
    </div>
  `;
  const viewerImg = document.getElementById('viewerImg');
  viewerImg.src = src;

  viewerFooter.hidden = false;
  btnOpenImg.href = src;
  zoom = 1;
  viewerImg.style.transform = `scale(${zoom})`;

  viewer.scrollIntoView({behavior:'smooth', block:'start'});
}

function openViewerAsText(title, subtitle, bullets, note){
  viewer.hidden = false;
  viewerTitle.textContent = title;
  viewerSubtitle.textContent = subtitle || "";

  const items = bullets.map(b=>`<li>${b}</li>`).join('');
  contentWrap.innerHTML = `
    <h3>Cómo actuar</h3>
    <ul>${items}</ul>
    ${note ? `<div class="note">${note}</div>` : ``}
  `;

  viewerFooter.hidden = true;
  viewer.scrollIntoView({behavior:'smooth', block:'start'});
}

function closeViewer(){ viewer.hidden = true; }

function renderEmergencies(){
  emGrid.innerHTML = '';
  emergencies.forEach(e=>{
    const btn = document.createElement('button');
    btn.className = 'emBtn';
    btn.type = 'button';
    btn.innerHTML = `
      <div class="emIcon" aria-hidden="true">${e.icon}</div>
      <div>
        <div class="emName">${e.name}</div>
        <div class="emDesc">${e.desc}</div>
      </div>
    `;
    btn.addEventListener('click', ()=>{
      openViewerAsText(`${e.icon} ${e.name}`, e.desc, e.bullets, e.note);
    });
    emGrid.appendChild(btn);
  });
}

btnPlano.addEventListener('click', ()=>{
  const key = planKey();
  const src = `assets/planos/${key}.png`;
  openViewerAsImage(src, planTitle(), "Desliza para ver detalles. Usa Zoom si lo necesitas.");
});

btnMapa.addEventListener('click', ()=>{
  openViewerAsImage('assets/mapa_emplazamiento.png', 'Mapa de ubicaciones (Sede y Subsedes)', "Útil para ubicar a qué recinto pertenece tu dirección.");
});

btnClose.addEventListener('click', closeViewer);

btnZoomIn.addEventListener('click', ()=>{
  const viewerImg = document.getElementById('viewerImg');
  if(!viewerImg) return;
  zoom = Math.min(3, +(zoom + 0.25).toFixed(2));
  viewerImg.style.transform = `scale(${zoom})`;
});

btnZoomOut.addEventListener('click', ()=>{
  const viewerImg = document.getElementById('viewerImg');
  if(!viewerImg) return;
  zoom = Math.max(1, +(zoom - 0.25).toFixed(2));
  viewerImg.style.transform = `scale(${zoom})`;
});

siteSelect.addEventListener('change', syncUI);
floorSelect.addEventListener('change', syncUI);

btnInfo.addEventListener('click', ()=> infoDialog.showModal());
btnInfoClose.addEventListener('click', ()=> infoDialog.close());
btnOk.addEventListener('click', ()=> infoDialog.close());

// Restore selection
const savedSite = localStorage.getItem('pe_site');
const savedFloor = localStorage.getItem('pe_floor');
if(savedSite) siteSelect.value = savedSite;
if(savedFloor) floorSelect.value = savedFloor;
syncUI();
renderEmergencies();

// Register service worker (offline)
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}


const btnSimulacro = document.getElementById('btnSimulacro');
const btnMapaGeneral = document.getElementById('btnMapaGeneral');

if(btnSimulacro){
  btnSimulacro.addEventListener('click', ()=>{
    openViewerAsText(
      "Modo Simulacro",
      "Práctica de evacuación",
      [
        "Escucha la alarma o indicación del instructor.",
        "Evacúa por las rutas señalizadas.",
        "Camina en fila india y sin correr.",
        "Dirígete al punto de encuentro.",
        "Espera instrucciones antes de volver al edificio."
      ]
    );
  });
}

if(btnMapaGeneral){
  btnMapaGeneral.addEventListener('click', ()=>{
    openViewerAsImage('assets/mapa_emplazamiento.png',
      'Mapa completo de la sede',
      'Ubicación general de edificios y subsedes');
  });
}

const btnEmergencia = document.getElementById('btnEmergencia');
if(btnEmergencia){
  btnEmergencia.addEventListener('click', ()=>{
    const target = document.getElementById('emSection') || document.getElementById('emGrid');
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
  });
}


// --- Mejoras v5: acceso rápido + ubicación recordada + simulacro + mapa general ---
const quickGrid = document.getElementById('quickGrid');
function renderQuick(){
  if(!quickGrid) return;
  quickGrid.innerHTML = '';
  emergencies.forEach(e=>{
    const btn = document.createElement('button');
    btn.className = 'quickBtn';
    btn.type = 'button';
    btn.innerHTML = `
      <div class="qIcon" aria-hidden="true">${e.icon}</div>
      <div>
        <div class="qName">${e.name}</div>
        <div class="qDesc">${e.desc}</div>
      </div>
    `;
    btn.addEventListener('click', ()=>{
      openViewerAsText(`${e.icon} ${e.name}`, e.desc, e.bullets, e.note);
    });
    quickGrid.appendChild(btn);
  });
}

const btnMiPlano = document.getElementById('btnMiPlano');
if(btnMiPlano){
  btnMiPlano.addEventListener('click', ()=>{
    const key = planKey();
    const src = `assets/planos/${key}.png`;
    openViewerAsImage(src, planTitle(), "Desliza para ver detalles. Usa Zoom si lo necesitas.");
  });
}

const lastLocation = document.getElementById('lastLocation');
function updateLastLocation(){
  if(!lastLocation) return;
  const site = siteSelect?.value;
  const floor = floorSelect?.value;
  if(!site) return;
  let txt = '';
  if(site === 'sede_principal'){
    const piso = (floor === 'subterraneo') ? 'Subterráneo' : floor.replace('piso','Piso ');
    txt = `📍 Última ubicación seleccionada: <b>${labels.sede_principal}</b> – <b>${piso}</b>`;
  } else {
    txt = `📍 Última ubicación seleccionada: <b>${labels[site]}</b>`;
  }
  lastLocation.innerHTML = txt;
  lastLocation.hidden = false;
}

const btnSimulacro = document.getElementById('btnSimulacro');
if(btnSimulacro){
  btnSimulacro.addEventListener('click', ()=>{
    openViewerAsText(
      "🎓 Modo Simulacro",
      "Práctica de evacuación (para capacitaciones)",
      [
        "Escucha la alarma o indicación del instructor/docente.",
        "Evacúa por las rutas señalizadas.",
        "Camina en fila india y sin correr; usa pasamanos.",
        "Dirígete al punto de encuentro.",
        "Permanece hasta la autorización de reingreso."
      ]
    );
  });
}

const btnMapaGeneral = document.getElementById('btnMapaGeneral');
if(btnMapaGeneral){
  btnMapaGeneral.addEventListener('click', ()=>{
    openViewerAsImage('assets/mapa_emplazamiento.png', '🗺 Mapa general de la sede', 'Ubicación general de edificios y subsedes.');
  });
}

renderQuick();
updateLastLocation();
siteSelect?.addEventListener('change', updateLastLocation);
floorSelect?.addEventListener('change', updateLastLocation);


// --- Mejoras v6: alerta activa + reportar emergencia + confirmación zona segura ---
const alertBar = document.getElementById('alertBar');
const alertTitle = document.getElementById('alertTitle');
const alertMsg = document.getElementById('alertMsg');
const btnAlertClose = document.getElementById('btnAlertClose');

function setAlertVisible(show){
  if(!alertBar) return;
  alertBar.hidden = !show;
}

if(btnAlertClose){
  btnAlertClose.addEventListener('click', ()=>{
    setAlertVisible(false);
    localStorage.setItem('pe_alert_dismissed_at', String(Date.now()));
  });
}

async function pollAlert(){
  try{
    const res = await fetch('/.netlify/functions/alert-get', {cache:'no-store'});
    if(!res.ok) return;
    const data = await res.json();
    if(!data || !data.active) { setAlertVisible(false); return; }

    const dismissedAt = Number(localStorage.getItem('pe_alert_dismissed_at') || 0);
    if(dismissedAt && (Date.now() - dismissedAt) < 10*60*1000){
      return;
    }

    alertTitle.textContent = `🚨 ${data.title || 'Alerta en curso'}`;
    alertMsg.textContent = data.message || '';
    setAlertVisible(true);
  }catch(e){}
}
pollAlert();
setInterval(pollAlert, 30000);

function currentLocationLabel(){
  const site = siteSelect?.value;
  const floor = floorSelect?.value;
  if(!site) return '';
  if(site === 'sede_principal'){
    const piso = (floor === 'subterraneo') ? 'Subterráneo' : floor.replace('piso','Piso ');
    return `${labels.sede_principal} – ${piso}`;
  }
  return labels[site] || '';
}

const reportUbicacion = document.getElementById('reportUbicacion');
const safeUbicacion = document.getElementById('safeUbicacion');

function updateFormPrefill(){
  const loc = currentLocationLabel();
  if(reportUbicacion && loc) reportUbicacion.value = loc;
  if(safeUbicacion && loc) safeUbicacion.value = loc;
}
updateFormPrefill();
siteSelect?.addEventListener('change', updateFormPrefill);
floorSelect?.addEventListener('change', updateFormPrefill);

function hookForm(formId, successMsg){
  const form = document.getElementById(formId);
  if(!form) return;
  form.addEventListener('submit', ()=>{
    setTimeout(()=>{ alert(successMsg); }, 200);
  });
}
hookForm('reportForm', '✅ Reporte enviado. Gracias. Emergencia real: si hay riesgo vital, avisa a personal y llama a SAMU 131.');
hookForm('safeForm', '✅ Confirmación registrada. Gracias.');

// --- v7 Panel Admin (mantén presionado el encabezado 5s) ---
const adminModal = document.getElementById('adminModal');
const btnAdminClose = document.getElementById('btnAdminClose');
const btnAdminActivate = document.getElementById('btnAdminActivate');
const btnAdminDeactivate = document.getElementById('btnAdminDeactivate');
const adminPass = document.getElementById('adminPass');
const adminTitleInput = document.getElementById('adminTitleInput');
const adminMsgInput = document.getElementById('adminMsgInput');
const adminStatus = document.getElementById('adminStatus');

function openAdmin(){
  if(!adminModal) return;
  adminModal.hidden = false;
  adminStatus.textContent = '';
  setTimeout(()=>adminPass?.focus(), 50);
}
function closeAdmin(){
  if(!adminModal) return;
  adminModal.hidden = true;
}
btnAdminClose?.addEventListener('click', closeAdmin);
adminModal?.addEventListener('click', (e)=>{ if(e.target === adminModal) closeAdmin(); });

let pressTimer = null;
const headerEl = document.querySelector('header');
if(headerEl){ headerEl.addEventListener('contextmenu', (e)=>e.preventDefault()); }

if(headerEl){
  headerEl.addEventListener('touchstart', ()=>{
    pressTimer = setTimeout(openAdmin, 5000);
  }, {passive:true});
  headerEl.addEventListener('touchend', ()=>{ if(pressTimer) clearTimeout(pressTimer); }, {passive:true});
  headerEl.addEventListener('touchmove', ()=>{ if(pressTimer) clearTimeout(pressTimer); }, {passive:true});
  headerEl.addEventListener('mousedown', ()=>{
    pressTimer = setTimeout(openAdmin, 5000);
  });
  headerEl.addEventListener('mouseup', ()=>{ if(pressTimer) clearTimeout(pressTimer); });
  headerEl.addEventListener('mouseleave', ()=>{ if(pressTimer) clearTimeout(pressTimer); });
}

async function setAlert(active){
  const pass = adminPass?.value || '';
  const title = (adminTitleInput?.value || '').trim();
  const message = (adminMsgInput?.value || '').trim();

  if(!pass){
    adminStatus.textContent = '⚠️ Ingresa la contraseña.';
    return;
  }
  if(active && (!title || !message)){
    adminStatus.textContent = '⚠️ Completa título y mensaje.';
    return;
  }

  adminStatus.textContent = 'Enviando…';

  try{
    const res = await fetch('/.netlify/functions/alert-set', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        password: pass,
        active: !!active,
        title: active ? title : '',
        message: active ? message : ''
      })
    });
    const data = await res.json().catch(()=>({}));
    if(!res.ok){
      adminStatus.textContent = `❌ ${data.error || 'No se pudo actualizar la alerta.'}`;
      return;
    }
    adminStatus.textContent = active ? '✅ Alerta ACTIVADA.' : '✅ Alerta finalizada.';
    pollAlert();
  }catch(e){
    adminStatus.textContent = '❌ Error de conexión.';
  }
}

btnAdminActivate?.addEventListener('click', ()=>setAlert(true));
btnAdminDeactivate?.addEventListener('click', ()=>setAlert(false));
