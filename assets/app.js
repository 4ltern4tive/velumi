/* ============================================================
   Velumi · App core + vistas
   ============================================================ */
(function () {
  const D = MKT.data;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = n => '$ ' + Number(n || 0).toLocaleString('es-UY');
  const icon = (name, cls = '') => `<svg class="icon ${cls}"><use href="#i-${name}"/></svg>`;
  const initials = name => String(name || '?').trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&', '<': '<', '>': '>', '"': '"', "'": '&#39;' }[c]));

  const CH = {
    whatsapp: { icon: 'whatsapp', cls: 'wa', label: 'WhatsApp' },
    instagram: { icon: 'instagram', cls: 'ig', label: 'Instagram' },
    email: { icon: 'mail', cls: 'em', label: 'Email' },
    pres: { icon: 'user', cls: 'pres', label: 'Presencial' }
  };
  const STATUS_TONE = {
    Activo: 'green', Nuevo: 'blue', 'En riesgo': 'amber', Inactivo: 'gray',
    Activa: 'green', Borrador: 'gray', Programada: 'blue', Pausada: 'amber',
    'En curso': 'blue', 'En revisión': 'amber', 'Por comenzar': 'gray', Completado: 'green',
    Pendiente: 'amber', Confirmado: 'green'
  };
  const statusPill = s => `<span class="pill ${STATUS_TONE[s] || 'gray'}"><span class="dot"></span>${esc(s)}</span>`;
  const clientByName = name => MKT.data.clients.find(c => c.name === name);
  const clientAvatar = name => {
    const c = clientByName(name);
    return { cls: c ? c.avatar : 'a1', ini: initials(name) };
  };

  // ── Persistence helpers ─────────────────────────────────────
  const STORAGE_KEY = 'velumi-state-v2';
  const LEGACY_STORAGE_KEY = 'mktify-state-v2';
  const loadState = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn('Velumi: failed to load state from localStorage', e);
      return null;
    }
  };
  const saveState = state => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Velumi: failed to save state to localStorage', e);
    }
  };

  const defaultState = {
    view: 'home',
    loggedIn: false,
    clients: [],
    clientStatus: 'Todos',
    clientSearch: '',
    clientSort: 'recent',
    clientPage: 1,
    pageSize: 8,
    deals: [],
    pipeFilter: 'all',
    campaigns: [],
    campFilter: 'Todas',
    projects: [],
    projFilter: 'Todos',
    flows: [],
    activeFlow: 'f1',
    services: [],
    svcFilter: 'Todos',
    tasks: [],
    sessions: [],
    ai: { type: 'instagram', tone: 'Cercano', variant: 0, variants: [] }
  };

  // Initialize state from storage or defaults
  let state = loadState() || { ...defaultState };

  // If no clients/campaigns/projects/etc. in state, populate from demo data
  if (!state.clients || state.clients.length === 0) {
    state.clients = D.clients.map(c => ({ ...c }));
  }
  if (!state.deals || state.deals.length === 0) {
    state.deals = D.deals.map(d => ({ ...d }));
  }
  if (!state.campaigns || state.campaigns.length === 0) {
    state.campaigns = D.campaigns.map(c => ({ ...c }));
  }
  if (!state.projects || state.projects.length === 0) {
    state.projects = D.projects.map(p => ({ ...p }));
  }
  if (!state.flows || state.flows.length === 0) {
    state.flows = D.flows.map(f => ({ ...f }));
  }
  if (!state.services || state.services.length === 0) {
    state.services = D.services.map(s => ({ ...s }));
  }
  if (!state.tasks || state.tasks.length === 0) {
    state.tasks = D.tasks.map(t => ({ ...t }));
  }
  if (!state.sessions || state.sessions.length === 0) {
    state.sessions = D.sessions;
  }

  // Re-set MKT.state reference after population
  MKT.state = state;

  // Persist on unload (best-effort)
  try {
    window.addEventListener('beforeunload', () => saveState(state));
  } catch (e) {
    console.warn('Velumi: could not add beforeunload listener', e);
  }

  // Export utilities
  MKT.fmt = fmt;
  MKT.icon = icon;
  MKT.esc = esc;
  MKT.initials = initials;
  MKT.CH = CH;
  MKT.statusPill = statusPill;

  // Core state management
  const setState = partial => {
    state = { ...state, ...partial };
    saveState(state);
    // Re-render views that might be affected
    if (partial.clients !== undefined) MKT.render.clients();
    if (partial.campaigns !== undefined) MKT.render.campaigns();
    if (partial.projects !== undefined) MKT.render.projects();
    if (partial.flows !== undefined) MKT.render.flows();
  };

  // ── Navigation ──────────────────────────────────────────────
  const LANDING_SECTIONS = { '/productos': 'sf-productos', '/precios': 'sf-precios', '/faq': 'sf-faq', '/demo': 'sf-demo' };
  function scrollToLandingSection(path, push) {
    const id = LANDING_SECTIONS[path];
    if (!id) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    if (push) { try { history.pushState({ landing: path }, '', path); } catch (e) {} }
    requestAnimationFrame(() => { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(true); } });
    return true;
  }
  function navigate(view) {
    try {
      if (view === 'landing') { showLanding(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      if (view === 'login') { showLogin(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
      const vPath = view && view.charAt(0) === '/' ? view : ('/' + view);
      if (LANDING_SECTIONS[vPath]) {
        if (!state.loggedIn) { showLanding(); scrollToLandingSection(vPath, true); return; }
      }
      if (!document.getElementById('view-' + view)) return;
      if (!state.loggedIn) {
        showLanding();
        return;
      }
      state.view = view;
      $$('.view').forEach(v => v.classList.toggle('is-active', v.id === 'view-' + view));
      $$('.nav-item').forEach(n => n.classList.toggle('is-active', n.dataset.view === view));
      closeMenus();
      closeSidebar();
      try { history.replaceState(null, '', '#' + view); } catch (e) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (view === 'home') renderHome();
      if (view === 'informes') renderReports();
    } catch (e) {
      console.error('Navigate error:', e);
    }
  }
  function showLanding() {
    try {
      state.loggedIn = false;
      const ls = $('#landingShell');
      const as = $('#appShell');
      if (ls) ls.hidden = false;
      if (as) as.hidden = true;
      $$('.view').forEach(v => v.classList.remove('is-active'));
      const lv = $('#view-landing');
      const loginv = $('#view-login');
      if (lv) { lv.hidden = false; lv.classList.add('is-active'); }
      if (loginv) loginv.hidden = true;
      state.view = 'landing';
      try { history.replaceState(null, '', window.location.pathname + window.location.search); } catch (e) {}
    } catch (e) {
      console.error('showLanding error:', e);
    }
  }
  function showLogin() {
    try {
      state.loggedIn = false;
      const ls = $('#landingShell');
      const as = $('#appShell');
      if (ls) ls.hidden = false;
      if (as) as.hidden = true;
      $$('.view').forEach(v => v.classList.remove('is-active'));
      const lv = $('#view-landing');
      const loginv = $('#view-login');
      if (lv) lv.hidden = true;
      if (loginv) { loginv.hidden = false; loginv.classList.add('is-active'); }
      state.view = 'login';
      try { history.replaceState(null, '', '#login'); } catch (e) {}
    } catch (e) {
      console.error('showLogin error:', e);
    }
  }
  function login() {
    try {
      state.loggedIn = true;
      const ls = $('#landingShell');
      const as = $('#appShell');
      if (ls) ls.hidden = true;
      if (as) as.hidden = false;
      MKT.toast('Bienvenido a Velumi', { sub: 'Martina Gómez · Ámbar Estudio', type: 'ai' });
      navigate('home');
    } catch (e) {
      console.error('Login error:', e);
      alert('Error al iniciar sesión: ' + e.message);
    }
    return false;
  }
  function logout() {
    state.loggedIn = false;
    showLanding();
    MKT.toast('Sesión cerrada', { sub: 'Demo Velumi · volvé cuando quieras.' });
  }
  function closeMenus(except) {
    $$('.popover').forEach(p => {
      if (p !== except) p.hidden = true;
    });
    $$('[aria-expanded="true"]').forEach(b => {
      if (!except || !except.contains(b)) b.setAttribute('aria-expanded', 'false');
    });
    const sr = $('#searchResults');
    if (sr) sr.hidden = true;
  }
  function closeSidebar() {
    $('#sidebar')?.classList.remove('open');
    $('#sideBackdrop')?.classList.remove('show');
  }
  MKT.navigate = navigate;
  MKT.showLanding = showLanding;
  MKT.showLogin = showLogin;
  MKT.login = login;
  MKT.logout = logout;
  MKT.closeMenus = closeMenus;
  MKT.closeSidebar = closeSidebar;
  MKT.setState = setState;

  /* ---------------- Home ---------------- */
  function renderTasks() {
    const host = $('#taskList');
    if (!host) return;
    host.innerHTML = state.tasks.map(t => `
      <button class="task ${t.done ? 'done' : ''}" data-task="${t.id}" style="width:100%;text-align:left;background:none">
        <span class="check">${icon('check')}</span>
        <span class="flex1">
          <span class="t-text">${esc(t.text)}</span>
          <span class="t-meta"><span class="t-tag ${t.hot ? 'hot' : ''}">${esc(t.tag)}</span>${esc(t.meta)}</span>
        </span>
        <span class="t-ic">${icon('chevron-right')}</span>
      </button>`).join('');
    const done = state.tasks.filter(t => t.done).length;
    const total = state.tasks.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const bar = $('#taskBar');
    if (bar) bar.style.width = pct + '%';
    const txt = $('#taskProgressText');
    if (txt) txt.textContent = pct + '% completado';
    const badge = $('#taskBadge');
    if (badge) badge.textContent = `${done} de ${total}`;
  }

  function renderAppointments() {
    const host = $('#apptList');
    if (!host) return;
    host.innerHTML = D.appointments.map(a => {
      const ch = CH[a.channel] || CH.whatsapp;
      return `<div class="appt" data-appt-client="${esc(a.client)}">
        <span class="appt-time">${a.time}<small>hs</small></span>
        <span class="appt-ava"><span class="avatar ${a.avatar}" style="width:30px;height:30px">${initials(a.client)}</span>
          <span class="ch-badge channel ${ch.cls}">${icon(ch.icon)}</span></span>
        <div class="flex1" style="min-width:0"><span class="appt-name">${esc(a.client)}</span><span class="appt-svc">${esc(a.svc)}</span></div>
        <span class="appt-status">${statusPill(a.status)}</span>
      </div>`;
    }).join('');
  }

  function renderHome() {
    $$('.spark').forEach(MKT.charts.sparkline);
    if (state.deals && state.deals.length > 0) {
      MKT.charts.lineChart('homeRevenue', {
        height: 236,
        labels: ['Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov'],
        series: [{ values: [43, 52, 47, 61, 72, 84.5], color: '#0E7DFB', fill: true, dots: true }],
        target: 90,
        max: 100,
        aria: 'Ingresos de los últimos seis meses'
      });
    }
    renderTasks();
    renderAppointments();
  }

  /* ---------------- Clientes ---------------- */
  function filteredClients() {
    let list = state.clients.slice();
    if (state.clientStatus !== 'Todos') list = list.filter(c => c.status === state.clientStatus);
    const q = state.clientSearch.trim().toLowerCase();
    if (q) {
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (state.clientSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (state.clientSort === 'ltv') list.sort((a, b) => b.ltv - a.ltv);
    return list;
  }

  function renderClientBadges() {
    const all = state.clients;
    const counts = {
      Todos: all.length,
      Activo: all.filter(c => c.status === 'Activo').length,
      'En riesgo': all.filter(c => c.status === 'En riesgo').length,
      Nuevo: all.filter(c => c.status === 'Nuevo').length,
      Inactivo: all.filter(c => c.status === 'Inactivo').length
    };
    const set = (id, v) => { const el = $('#' + id); if (el) el.textContent = v; };
    set('clientsCountPill', counts.Todos);
    set('ctAll', counts.Todos);
    set('ctActivo', counts.Activo);
    set('ctRiesgo', counts['En riesgo']);
    set('ctNuevo', counts.Nuevo);
    set('ctInactivo', counts.Inactivo);
    set('csTotal', counts.Todos);
    set('csActive', counts.Activo);
    set('csRisk', counts['En riesgo']);
    set('sideClientCount', counts.Todos);
    const avg = all.length ? Math.round(all.reduce((s, c) => s + (c.ltv || 0), 0) / all.length) : 0;
    set('csLtv', fmt(avg));
  }

  function renderClients() {
    const host = $('#clientsTableHost');
    if (!host) return;
    renderClientBadges();
    const list = filteredClients();
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / state.pageSize));
    if (state.clientPage > pages) state.clientPage = pages;
    const start = (state.clientPage - 1) * state.pageSize;
    const slice = list.slice(start, start + state.pageSize);

    if (!total) {
      host.innerHTML = `<div class="empty">${icon('search')}<b>Sin resultados</b><p>Probá con otro nombre, email o etiqueta.</p></div>`;
    } else {
      host.innerHTML = `<table class="tbl list">
        <thead><tr>
          <th style="width:32px"><input class="checkbox" type="checkbox" aria-label="Seleccionar todos"></th>
          <th>Cliente</th><th>Estado</th><th>Canal</th><th>Etiquetas</th>
          <th>Último contacto</th><th class="r">Valor de vida</th><th style="width:26px"></th>
        </tr></thead>
        <tbody>${slice.map(c => {
          const ch = CH[(c.channel || '').toLowerCase()] || CH.whatsapp;
          const tags = c.tags.slice(0, 2).map(t => `<span class="tag ${t === 'VIP' ? 'vip' : t === 'Color' ? 'color' : ''}">${esc(t)}</span>`).join('') +
            (c.tags.length > 2 ? `<span class="tag">+${c.tags.length - 2}</span>` : '');
          return `<tr data-client="${c.id}">
            <td><input class="checkbox" type="checkbox" aria-label="Seleccionar ${esc(c.name)}"></td>
            <td><div class="client-cell"><span class="avatar ${c.avatar}" style="width:30px;height:30px">${initials(c.name)}</span>
              <span style="min-width:0"><span class="name">${esc(c.name)}</span><span class="mail">${esc(c.email)}</span></span></div></td>
            <td>${statusPill(c.status)}</td>
            <td><span class="channel ${ch.cls}">${icon(ch.icon)}${ch.label}</span></td>
            <td><div class="row row-wrap" style="gap:4px">${tags}</div></td>
            <td><span style="font-size:11px;color:#5B647C">${esc(c.last)}</span></td>
            <td class="r bold mono">${fmt(c.ltv)}</td>
            <td class="r" style="color:#A4ABC4">${icon('chevron-right')}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`;
    }

    const range = $('#clientRange');
    if (range) range.textContent = total ? `Mostrando ${start + 1}–${Math.min(start + state.pageSize, total)} de ${total} cliente${total === 1 ? '' : 's'}` : 'Sin clientes';
    const pager = $('#clientPager');
    if (pager) {
      pager.innerHTML = `<button class="page-btn" data-page="${state.clientPage - 1}" ${state.clientPage === 1 ? 'disabled' : ''} aria-label="Anterior">${icon('chevron-left')}</button>` +
        Array.from({ length: pages }, (_, i) => `<button class="page-btn ${i + 1 === state.clientPage ? 'on' : ''}" data-page="${i + 1}">${i + 1}</button>`).join('') +
        `<button class="page-btn" data-page="${state.clientPage + 1}" ${state.clientPage === pages ? 'disabled' : ''} aria-label="Siguiente">${icon('chevron-right')}</button>`;
    }
  }

  /* ---------------- Pipeline ---------------- */
  function renderKanban() {
    const host = $('#kanbanBoard');
    if (!host) return;
    const visible = state.deals.filter(d => {
      if (state.pipeFilter === 'hot') return d.hot;
      return true;
    });
    host.innerHTML = D.stages.map(stage => {
      const ds = visible.filter(d => d.stage === stage.id);
      const sum = ds.reduce((s, d) => s + d.amount, 0);
      return `<div class="kcol" data-stage="${stage.id}">
        <div class="kcol-head"><span class="kdot" style="background:${stage.color}"></span><b>${stage.name}</b><span class="kcount">${ds.length}</span></div>
        <div class="kcol-sum">${fmt(sum)}</div>
        ${ds.map(d => {
          const av = clientAvatar(d.client);
          const ch = CH[d.channel] || CH.whatsapp;
          return `<div class="kcard" draggable="true" data-deal="${d.id}">
            <div class="k-title">${esc(d.title)}</div>
            <div class="k-client">${icon(ch.icon)}${esc(d.client)}</div>
            <div class="k-amt">${fmt(d.amount)}</div>
            <div class="k-tags"><span class="tag">${esc(d.tag)}</span>${d.hot ? '<span class="tag" style="background:#FDECEF;color:#D92D4A">Prioridad</span>' : ''}</div>
            <div class="k-foot"><span class="avatar ${av.cls}" style="width:21px;height:21px;font-size:8px">${av.ini}</span>
              <span class="k-time">${icon('clock')}${d.stage === 'ganado' ? 'cerrado' : `hace ${d.days} d`}</span></div>
          </div>`;
        }).join('')}
        <button class="kadd" data-new="deal" data-stage="${stage.id}">${icon('plus')}Agregar negocio</button>
      </div>`;
    }).join('');

    const total = state.deals.reduce((s, d) => s + d.amount, 0);
    const won = state.deals.filter(d => d.stage === 'ganado');
    const openDeals = state.deals.filter(d => d.stage !== 'ganado');
    const openSum = openDeals.reduce((s, d) => s + d.amount, 0);
    const set = (id, v) => { const el = $('#' + id); if (el) el.textContent = v; };
    set('pipeTotal', fmt(total));
    set('pipeOpen', fmt(openSum));
    set('pipeAvg', state.deals.length ? fmt(Math.round(total / state.deals.length)) : fmt(0));
    const statSmalls = $$('#view-pipeline .stat-strip .st small');
    if (statSmalls[0]) statSmalls[0].textContent = `${state.deals.length} negocios`;
    if (statSmalls[1]) statSmalls[1].textContent = `${openDeals.length} negocios sin cerrar`;
    if (statSmalls[2]) statSmalls[2].textContent = `por negocio · ${won.length} ganados`;
  }

  /* ---------------- Campañas ---------------- */
  function campIcon(c) {
    const primary = c.channels[0];
    return primary === 'whatsapp' ? { cls: 'wa', icon: 'whatsapp' }
      : primary === 'instagram' ? { cls: 'ig', icon: 'instagram' }
      : primary === 'email' ? { cls: 'em', icon: 'mail' }
      : { cls: 'multi', icon: 'megaphone' };
  }
  function renderCampaigns() {
    const host = $('#campaignGrid');
    if (!host) return;
    const list = state.campFilter === 'Todas' ? state.campaigns : state.campaigns.filter(c => c.status === state.campFilter);
    $$('#campaignFilters .fchip').forEach(b => {
      const f = b.dataset.campFilter;
      const n = f === 'Todas' ? state.campaigns.length : state.campaigns.filter(c => c.status === f).length;
      const el = b.querySelector('.n');
      if (el) el.textContent = n;
      b.classList.toggle('on', f === state.campFilter);
    });
    const pill = $('#campaignCountPill');
    if (pill) pill.textContent = state.campaigns.length;
    if (!list.length) {
      host.innerHTML = `<div class="card empty" style="grid-column:1/-1">${icon('megaphone')}<b>No hay campañas en este estado</b><p>Creá una nueva campaña para empezar.</p></div>`;
      return;
    }
    host.innerHTML = list.map(c => {
      const ic = campIcon(c);
      const chips = c.channels.map(ch => `<span class="ch-chip ${CH[ch].cls}" title="${esc(CH[ch].label)}">${icon(CH[ch].icon)}</span>`).join('');
      const chLabel = c.channels.map(ch => CH[ch].label).join(' · ');
      const note = c.revenue ? fmt(c.revenue) + ' atribuidos' : c.status === 'Programada' ? 'Inicia 25 nov' : 'Sin envíos';
      const barCls = c.progress >= 100 ? 'green' : c.status === 'Borrador' ? '' : '';
      return `<div class="card camp-card">
        <div class="camp-top">
          <span class="camp-icon ${ic.cls}">${icon(ic.icon)}</span>
          <div class="camp-titles">
            <span class="camp-type">${esc(chLabel)}</span>
            <h4>${esc(c.name)}</h4>
            <p>${icon('users', 'icon-xs')}${esc(c.segment)}</p>
          </div>
          <div class="camp-status">${statusPill(c.status)}</div>
        </div>
        <div class="camp-metrics">${c.metrics.map(m => `<div class="cm"><b>${esc(m[0])}</b><span>${esc(m[1])}</span></div>`).join('')}</div>
        <div class="camp-goal">
          <div class="camp-goal-head"><span>${esc(c.goalLabel)}</span><b>${esc(c.goalText)}</b></div>
          <div class="bar ${barCls}"><i style="width:${Math.max(0, Math.min(100, c.progress || 0))}%"></i></div>
        </div>
        <div class="camp-foot">
          <div class="channel-chips">${chips}<span class="camp-rev">${esc(note)}</span></div>
          <button class="link-btn" data-campaign="${c.id}">Ver informe ${icon('arrow-up-right')}</button>
        </div>
      </div>`;
    }).join('');
  }

  /* ---------------- Proyectos ---------------- */
  function renderProjects() {
    const host = $('#projectGrid');
    if (!host) return;
    const list = state.projFilter === 'Todos' ? state.projects : state.projects.filter(p => p.status === state.projFilter);
    const pill = $('#projectsCountPill');
    if (pill) pill.textContent = state.projects.length;
    $$('#projectFilters .fchip').forEach(b => b.classList.toggle('on', b.dataset.projFilter === state.projFilter));
    if (!list.length) {
      host.innerHTML = `<div class="card empty" style="grid-column:1/-1">${icon('kanban')}<b>No hay proyectos en este estado</b><p>Contratá un servicio o creá un proyecto nuevo.</p></div>`;
      return;
    }
    host.innerHTML = list.map(p => {
      const ms = (p.milestones || []).slice(0, 3).map(m => `<li class="ms-item ${m.done ? 'done' : ''} ${m.current && !m.done ? 'current' : ''}"><span class="ms-mark">${m.done ? icon('check') : m.current ? icon('play') : ''}</span><span class="ms-label">${esc(m.label)}</span></li>`).join('');
      const providerCls = p.providerColor === 'mg' ? 'avatar-mg' : (p.providerColor || 'avatar-a1');
      const barCls = p.status === 'Completado' ? 'green' : p.status === 'En revisión' ? 'amber' : '';
      return `<div class="card proj-card" data-project="${p.id}" tabindex="0" role="button" aria-label="Abrir ${esc(p.name)}">
        <div class="proj-top">
          <span class="proj-ic tone-${esc(p.tone || 'blue')}">${icon(p.icon || 'kanban')}</span>
          <div class="proj-titles">
            <span class="proj-type">${esc(p.type || 'Proyecto')}</span>
            <h4>${esc(p.name)}</h4>
            <p>${icon('users', 'icon-xs')}${esc(p.client)}</p>
          </div>
          <div class="proj-status">${statusPill(p.status)}</div>
        </div>
        <div class="proj-progress">
          <div class="proj-progress-head"><span>Avance</span><b>${p.progress || 0}%</b></div>
          <div class="bar ${barCls}"><i style="width:${Math.max(0, Math.min(100, p.progress || 0))}%"></i></div>
        </div>
        <div class="proj-milestones">
          <span class="proj-section-label">Hitos</span>
          <ul class="milestones">${ms || '<li class="ms-item"><span class="ms-mark"></span><span class="ms-label muted">Sin hitos definidos</span></li>'}</ul>
        </div>
        <div class="proj-foot">
          <span class="proj-meta">${icon('calendar')}${esc(p.due)}</span>
          <span class="provider"><span class="avatar ${esc(providerCls)}" style="width:22px;height:22px;font-size:8px">${esc(p.providerIni || '')}</span>${esc(p.provider)}</span>
        </div>
      </div>`;
    }).join('');
  }

  /* ---------------- Automatizaciones ---------------- */
  const FLOW_TONES = { wa: 'wa', green: 'green', amber: 'amber', pink: 'pink', gray: 'gray' };
  function flowIconBox(f) {
    const cls = f.tone === 'wa' ? 'background:#E7F8F1;color:#1FA855' :
      f.tone === 'green' ? 'background:#E7F8F1;color:#0E9F6E' :
      f.tone === 'amber' ? 'background:#FFF6E8;color:#B86E00' :
      f.tone === 'pink' ? 'background:#FDEBF4;color:#D63384' : 'background:#EEF1FA;color:#606A82';
    return `<span class="flow-ic" style="${cls}">${icon(f.icon)}</span>`;
  }
  function renderFlows() {
    const host = $('#flowList');
    if (!host) return;
    const activeCount = state.flows.filter(f => f.status === 'Activa').length;
    const activePill = $('#flowsActivePill');
    if (activePill) activePill.innerHTML = `<span class="dot"></span>${activeCount} flujo${activeCount === 1 ? '' : 's'} activo${activeCount === 1 ? '' : 's'}`;
    const countPill = $('#flowsCountPill');
    if (countPill) countPill.textContent = `${state.flows.length} flujos`;
    host.innerHTML = state.flows.map(f => `
      <div class="card flow-card ${f.id === state.activeFlow ? 'selected' : ''}" data-flow="${f.id}">
        ${flowIconBox(f)}
        <div class="flow-body">
          <h4>${esc(f.name)} ${f.status === 'Activa' ? '' : f.status === 'Borrador' ? '<span class="pill gray">Borrador</span>' : '<span class="pill amber">Pausado</span>'}</h4>
          <p>${icon('zap', 'icon-xs')}${esc(f.trigger)}<span class="sep">·</span>${esc(f.desc)}</p>
          <div class="flow-stats">
            <div class="fs"><b>${f.executions}</b><span>Ejecuciones</span></div>
            <div class="fs"><b>${f.response}%</b><span>Respuesta</span></div>
            <div class="fs"><b>${esc(f.revenue)}</b><span>Ingresos</span></div>
          </div>
        </div>
        <button class="switch ${f.status === 'Activa' ? 'on' : ''}" data-flow-toggle="${f.id}" aria-label="${f.status === 'Activa' ? 'Pausar' : 'Activar'} ${esc(f.name)}" aria-pressed="${f.status === 'Activa'}"></button>
      </div>`).join('');

    const flow = state.flows.find(f => f.id === state.activeFlow) || state.flows[0];
    const detail = $('#flowDetail');
    if (!detail || !flow) return;
    const nodes = flow.nodes.map((n, i) => {
      const toneMap = { trigger: 'amber', wait: 'gray', message: 'green', condition: 'blue', action: 'purple' };
      const icCls = n.tone || toneMap[n.type] || 'blue';
      return `<div class="fnode"><span class="fn-tag">${n.type === 'trigger' ? 'Trigger' : n.type === 'wait' ? 'Wait' : n.type === 'message' ? 'Message' : n.type === 'condition' ? 'If/Else' : 'Action'}</span>
        <span class="fn-ic ic ${icCls}">${icon(n.icon || 'zap')}</span>
        <b>${esc(n.title)}</b><span>${esc(n.sub)}</span></div>${i < flow.nodes.length - 1 ? '<span class="fconnector"></span>' : ''}`;
    }).join('');
    const msg = flow.message.replace('{{nombre}}', 'Lucía');
    detail.innerHTML = `<div class="card flow-detail">
      <div class="card-head">
        <div><h3>${esc(flow.name)} ${statusPill(flow.status)}</h3><p>${esc(flow.desc)}</p></div>
        <button class="btn btn-secondary btn-sm" data-action="edit-flow">${icon('edit')}Editar</button>
      </div>
      <div class="flow-canvas"><div class="flow-nodes">${nodes}</div></div>
      <div class="between" style="padding:0 17px 7px"><span class="tiny" style="font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#77809E">Vista previa del mensaje</span><span class="pill green"><span class="dot"></span>WhatsApp Business</span></div>
      <div class="wa-preview">
        <div class="wa-head"><span class="avatar">Á</span><div class="flex1"><b>Ámbar Estudio</b><span>en línea</span></div>${icon('phone')}${icon('dots')}</div>
        <div class="wa-body"><div class="wa-bubble">${esc(msg)}<span class="wa-time">10:24 ${icon('check')}${icon('check')}</span></div></div>
      </div>
      <div class="flow-perf">
        <div class="fp"><b>${flow.executions}</b><span>Ejecuciones</span></div>
        <div class="fp"><b>${flow.response}%</b><span>Tasa de respuesta</span></div>
        <div class="fp"><b>${esc(flow.revenue)}</b><span>Ingresos atribuidos</span></div>
        <div class="fp"><b>hace 12 min</b><span>Última ejecución</span></div>
      </div>
      <div class="card-foot"><span>Flujo ${flow.status.toLowerCase()} · ${flow.nodes.length} pasos</span><button class="link-arrow" data-action="duplicate-flow">Duplicar flujo ${icon('copy')}</button></div>
    </div>`;
  }

  /* ---------------- Servicios ---------------- */
  const SVC_ICON = { layout: 'web', globe: 'web', 'pen-tool': 'brand', sparkles: 'content', megaphone: 'camp', camera: 'foto' };
  function renderServices() {
    const host = $('#servicesGrid');
    if (!host) return;
    const list = state.svcFilter === 'Todos' ? state.services : state.services.filter(s => s.cat === state.svcFilter);
    $$('#serviceFilters .fchip').forEach(b => b.classList.toggle('on', b.dataset.svcFilter === state.svcFilter));
    host.innerHTML = list.map(s => `<div class="card svc-card">
      ${s.badge ? `<span class="svc-badge">${esc(s.badge)}</span>` : ''}
      <div class="svc-top"><span class="svc-icon ${SVC_ICON[s.icon] || 'web'}">${icon(s.icon)}</span>
        <div class="svc-titles"><h4>${esc(s.name)}</h4><span>${esc(s.cat)}</span></div></div>
      <p class="svc-desc">${esc(s.desc)}</p>
      <ul class="svc-list">${s.includes.map(i => `<li>${icon('check')}${esc(i)}</li>`).join('')}</ul>
      <div class="svc-extra">
        <span class="svc-rating">${icon('star')}${s.rating} <span style="font-weight:500;color:#98A2BA">· ${s.projects} proyectos</span></span>
        <span class="svc-time">${icon('clock')}${esc(s.time)}</span>
      </div>
      <div class="svc-foot">
        <div class="price"><b>USD ${s.price}</b><span>${esc(s.priceNote)}</span></div>
        <button class="btn btn-primary btn-sm" data-hire="${s.id}">Contratar</button>
      </div>
    </div>`).join('');
  }

  /* ---------------- Informes ---------------- */
  function renderReports() {
    MKT.charts.lineChart('reportRevenue', {
      height: 246,
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov'],
      series: [
        { values: [5.1, 5.6, 6.2, 6.8, 7.1, 7.4, 6.9, 8.2, 8.8, 9.4, 11.2], color: '#0E7DFB', fill: true, dots: false },
        { values: [3.9, 4.3, 4.7, 5.0, 5.4, 5.8, 5.6, 6.2, 6.7, 7.1, 7.8], color: '#C9D2EC', dashed: true, width: 1.8 }
      ],
      max: 12,
      aria: 'Comparación de ventas 2026 vs 2025'
    });

    const top = state.clients.slice().sort((a, b) => (b.ltv || 0) - (a.ltv || 0)).slice(0, 5);
    const body = $('#topClientsBody');
    if (body) {
      body.innerHTML = top.map(c => `<tr data-client="${c.id}">
        <td><div class="client-cell" style="min-width:150px"><span class="avatar ${c.avatar}" style="width:27px;height:27px">${initials(c.name)}</span>
          <span><span class="name">${esc(c.name)}</span><span class="mail">${esc(c.channel)}</span></span></div></td>
        <td><div class="row row-wrap" style="gap:3px">${c.tags.map(t => `<span class="tag ${t === 'VIP' ? 'vip' : ''}">${esc(t)}</span>`).join('')}</div></td>
        <td class="r mono">${c.visits}</td>
        <td class="r bold mono">${fmt(c.ltv)}</td>
      </tr>`).join('');
    }
  }

  /* ---------------- Init ---------------- */
  function init() {
    try { renderHome(); } catch (e) { console.error('renderHome error:', e); }
    try { renderClients(); } catch (e) { console.error('renderClients error:', e); }
    try { renderKanban(); } catch (e) { console.error('renderKanban error:', e); }
    try { renderCampaigns(); } catch (e) { console.error('renderCampaigns error:', e); }
    try { renderProjects(); } catch (e) { console.error('renderProjects error:', e); }
    try { renderFlows(); } catch (e) { console.error('renderFlows error:', e); }
    try { renderServices(); } catch (e) { console.error('renderServices error:', e); }
    try { renderReports(); } catch (e) { console.error('renderReports error:', e); }
    const hash = (location.hash || '').replace('#', '');
    const path = (location.pathname || '/').replace(/\/+$/, '') || '/';
    const HASH_SECTIONS = { 'sf-productos': '/productos', 'sf-precios': '/precios', 'sf-faq': '/faq', 'sf-demo': '/demo' };
    if (hash === 'login') { showLogin(); return; }
    if (HASH_SECTIONS[hash]) {
      showLanding();
      const p = HASH_SECTIONS[hash];
      try { history.replaceState(null, '', p); } catch (e) {}
      setTimeout(() => scrollToLandingSection(p, false), 80);
      return;
    }
    if (LANDING_SECTIONS[path]) {
      showLanding();
      setTimeout(() => scrollToLandingSection(path, false), 80);
      return;
    }
    if (!hash || hash === 'landing' || hash === 'view-landing') { showLanding(); return; }
    state.loggedIn = true;
    const ls = $('#landingShell'); const as = $('#appShell');
    if (ls) ls.hidden = true; if (as) as.hidden = false;
    if (document.getElementById('view-' + hash)) navigate(hash);
    else navigate('home');
  }
  MKT.render = {
    tasks: renderTasks,
    appointments: renderAppointments,
    home: renderHome,
    clients: renderClients,
    kanban: renderKanban,
    campaigns: renderCampaigns,
    projects: renderProjects,
    flows: renderFlows,
    services: renderServices,
    reports: renderReports
  };
  MKT.scrollToLandingSection = scrollToLandingSection;
  MKT.LANDING_SECTIONS = LANDING_SECTIONS;

  window.addEventListener('popstate', () => {
    const p = (location.pathname || '/').replace(/\/+$/, '') || '/';
    if (!state.loggedIn && LANDING_SECTIONS[p]) {
      showLanding();
      setTimeout(() => scrollToLandingSection(p, false), 0);
      return;
    }
    if (!state.loggedIn && (p === '/' || p === '')) {
      showLanding();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* ============================================================
   Velumi · Interacciones, formularios y modales
   ============================================================ */
(function () {
  const D = MKT.data;
  const state = MKT.state;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const icon = MKT.icon;
  const esc = MKT.esc;
  const fmt = MKT.fmt;
  const modalRoot = $('#modalRoot');
  const modalHead = (title, sub, ic, tone = 'blue') =>
    `<div class="modal-head"><div style="display:flex;gap:10px;align-items:flex-start">
      <span class="ic ${tone}" style="width:34px;height:34px;border-radius:9px;display:grid;place-items:center">${icon(ic)}</span>
      <div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div></div>
      <button class="modal-close" data-close aria-label="Cerrar">${icon('close')}</button></div>`;

  /* ---------------- Toast ---------------- */
  function toast(msg, opts = {}) {
    const host = $('#toasts');
    if (!host) return;
    const el = document.createElement('div');
    el.className = 'toast ' + (opts.type || '');
    const ic = opts.type === 'error' ? 'alert' : opts.type === 'ai' ? 'sparkles' : 'check';
    el.innerHTML = `<span class="t-ic">${icon(ic)}</span><div><b>${esc(msg)}</b>${opts.sub ? `<span>${esc(opts.sub)}</span>` : ''}</div>`;
    host.appendChild(el);
    while (host.children.length > 3) host.removeChild(host.firstElementChild);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 220);
    }, opts.duration || 3400);
  }
  MKT.toast = toast;

  /* ---------------- Menús ---------------- */
  function bindMenu(btnId, menuId) {
    const btn = $(btnId), menu = $(menuId);
    if (!btn || !menu) return;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const willOpen = menu.hidden;
      MKT.closeMenus();
      if (willOpen) {
        menu.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }
  bindMenu('#appsBtn', '#appsMenu');
  bindMenu('#quickCreateBtn', '#createMenu');
  bindMenu('#bellBtn', '#notifMenu');
  bindMenu('#profileBtn', '#profileMenu');

  $('#markRead')?.addEventListener('click', e => {
    e.stopPropagation();
    $$('#notifMenu .unread').forEach(el => el.remove());
    const dot = $('.notif-dot');
    if (dot) dot.style.display = 'none';
    const foot = $('#notifMenu .apps-foot span');
    if (foot) foot.textContent = 'Todo al día';
    toast('Notificaciones marcadas como leídas');
  });

  $('#helpBtn')?.addEventListener('click', e => {
    e.stopPropagation();
    MKT.closeMenus();
    openHelpModal();
  });

  document.addEventListener('click', e => {
    const inMenu = e.target.closest('.popover') || e.target.closest('.global-search') ||
      e.target.closest('#appsBtn, #bellBtn, #profileBtn, #quickCreateBtn');
    if (!inMenu) MKT.closeMenus();

    // Landing section links (clean URLs)
    const landEl = e.target.closest('[data-landing-path]');
    if (landEl) {
      const pth = landEl.getAttribute('data-landing-path') || landEl.getAttribute('href') || '';
      const norm = pth.replace(/\/+$/, '') || '/';
      if (MKT.LANDING_SECTIONS && MKT.LANDING_SECTIONS[norm]) {
        e.preventDefault();
        MKT.closeMenus();
        if (!MKT.state.loggedIn) MKT.showLanding();
        MKT.scrollToLandingSection(norm, true);
        return;
      }
    }

    // Handle data-view clicks (navigation)
  const viewEl = e.target.closest('[data-view]');
  if (viewEl) {
    const view = viewEl.dataset.view;
    if (view && document.getElementById('view-' + view)) {
      MKT.navigate(view);
    }
  }

  // Handle data-new clicks (create new items)
  const newEl = e.target.closest('[data-new]');
  if (newEl) {
    const type = newEl.dataset.new;
    MKT.closeMenus();
    if (type === 'client') MKT.openClientForm();
    else if (type === 'campaign') MKT.openCampaignForm();
    else if (type === 'project') MKT.openProjectForm();
    else if (type === 'deal') MKT.openDealForm(newEl.dataset.stage || 'lead');
    else if (type === 'flow') MKT.openFlowForm();
    else if (type === 'task') MKT.openTaskForm();
    else if (type === 'ai') { MKT.navigate('ia'); }
  }

  // Handle data-page clicks (pagination)
  const pageEl = e.target.closest('[data-page]');
  if (pageEl && !pageEl.disabled) {
    const page = parseInt(pageEl.dataset.page);
    if (!isNaN(page) && page >= 1) {
      MKT.state.clientPage = page;
      MKT.render.clients();
    }
  }

  // Handle data-task clicks (toggle task done)
  const taskEl = e.target.closest('[data-task]');
  if (taskEl) {
    const taskId = taskEl.dataset.task;
    const task = MKT.state.tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      MKT.render.tasks();
    }
  }

  // Handle data-client clicks (open client detail)
  const clientEl = e.target.closest('[data-client]');
  if (clientEl) {
    const clientId = clientEl.dataset.client;
    if (typeof openClient === 'function') openClient(clientId);
    else if (typeof MKT.openClient === 'function') MKT.openClient(clientId);
  }

  // Handle data-project clicks (open project detail)
  const projectEl = e.target.closest('[data-project]');
  if (projectEl) {
    // Open project detail (toast for now)
    const projectId = projectEl.dataset.project;
    const project = MKT.state.projects.find(p => p.id === projectId);
    if (project) MKT.toast(project.name, { sub: project.status + ' · ' + project.progress + '%' });
  }

  // Handle data-hire clicks (hire service)
  const hireEl = e.target.closest('[data-hire]');
  if (hireEl) {
    const serviceId = hireEl.dataset.hire;
    const service = MKT.state.services.find(s => s.id === serviceId);
    if (service) MKT.toast('Servicio contratado', { sub: service.name + ' · USD ' + service.price, type: 'ai' });
  }

  // Handle data-camp-filter clicks
  const campFilterEl = e.target.closest('[data-camp-filter]');
  if (campFilterEl) {
    MKT.state.campFilter = campFilterEl.dataset.campFilter;
    MKT.render.campaigns();
  }

  // Handle data-proj-filter clicks
  const projFilterEl = e.target.closest('[data-proj-filter]');
  if (projFilterEl) {
    MKT.state.projFilter = projFilterEl.dataset.projFilter;
    MKT.render.projects();
  }

  // Handle data-svc-filter clicks
  const svcFilterEl = e.target.closest('[data-svc-filter]');
  if (svcFilterEl) {
    MKT.state.svcFilter = svcFilterEl.dataset.svcFilter;
    MKT.render.services();
  }

  // Handle data-status clicks (client status tabs)
  const statusEl = e.target.closest('[data-status]');
  if (statusEl && statusEl.closest('#clientTabs')) {
    MKT.state.clientStatus = statusEl.dataset.status;
    MKT.state.clientPage = 1;
    MKT.render.clients();
    // Update active tab
    document.querySelectorAll('#clientTabs .tab').forEach(t => t.classList.remove('is-active'));
    statusEl.classList.add('is-active');
  }

  // Handle data-flow clicks (select flow)
  const flowEl = e.target.closest('[data-flow]');
  if (flowEl) {
    MKT.state.activeFlow = flowEl.dataset.flow;
    MKT.render.flows();
  }

  // Handle data-campaign clicks (view campaign report)
  const campEl = e.target.closest('[data-campaign]');
  if (campEl) {
    const campId = campEl.dataset.campaign;
    const camp = MKT.state.campaigns.find(c => c.id === campId);
    if (camp) MKT.toast(camp.name, { sub: camp.status + ' · ' + camp.metrics[1][0] + ' ' + camp.metrics[1][1] });
  }

  // Handle data-deal clicks (placeholder)
  const dealEl = e.target.closest('[data-deal]');
  if (dealEl) {
    const dealId = dealEl.dataset.deal;
    const deal = MKT.state.deals.find(d => d.id === dealId);
    if (deal) MKT.toast(deal.title, { sub: deal.client + ' · ' + MKT.fmt(deal.amount) });
  }

  // Handle data-sr clicks (search results)
  const srEl = e.target.closest('[data-sr]');
  if (srEl) {
    const type = srEl.dataset.sr;
    const id = srEl.dataset.id;
    MKT.closeMenus();
    if (type === 'client') {
      if (typeof openClient === 'function') openClient(id);
    } else if (type === 'campaign') {
      const camp = MKT.state.campaigns.find(c => c.id === id);
      if (camp) MKT.toast(camp.name, { sub: camp.status });
    } else if (type === 'project') {
      const proj = MKT.state.projects.find(p => p.id === id);
      if (proj) MKT.toast(proj.name, { sub: proj.status });
    }
  }

  // Handle data-flow-toggle clicks (already handled separately above)
  // Handle data-appt-client clicks
  const apptEl = e.target.closest('[data-appt-client]');
  if (apptEl) {
    const clientName = apptEl.dataset.apptClient;
    const client = MKT.state.clients.find(c => c.name === clientName);
    if (client) {
      if (typeof openClient === 'function') openClient(client.id);
    }
  }

  // Handle login form submit (delegated) - only when submit button is clicked
  const loginSubmitBtn = e.target.closest('#loginForm button[type="submit"]');
  if (loginSubmitBtn) {
    e.preventDefault();
    e.stopPropagation();
    MKT.login();
  }

  // Handle data-action clicks
  const actionEl = e.target.closest('[data-action]');
  if (actionEl) {
    const action = actionEl.dataset.action;
    switch (action) {
        case 'open-login':
          MKT.showLogin();
          break;
        case 'close-login':
          MKT.showLanding();
          break;
        case 'logout':
          MKT.logout();
          break;
        case 'plan':
          MKT.toast('Plan y facturación', { sub: 'Próximamente: gestión de suscripción' });
          break;
        case 'settings':
          MKT.toast('Configuración', { sub: 'Próximamente: ajustes de cuenta' });
          break;
        case 'agenda':
          MKT.toast('Agenda', { sub: 'Próximamente: calendario de turnos' });
          break;
        case 'reactivate':
          MKT.toast('Reactivación', { sub: '12 clientas en riesgo detectadas', type: 'ai' });
          break;
        case 'import':
          MKT.toast('Importar contactos', { sub: 'Próximamente: importación desde Excel' });
          break;
        case 'filter':
          MKT.toast('Filtros', { sub: 'Próximamente: filtros avanzados' });
          break;
        case 'refresh':
          MKT.toast('Actualizado', { sub: 'Datos refrescados' });
          if (MKT.state.view === 'home') MKT.render.home();
          if (MKT.state.view === 'clientes') MKT.render.clients();
          break;
        case 'edit-flow':
          MKT.toast('Editar flujo', { sub: 'Próximamente: editor visual de flujos' });
          break;
        case 'duplicate-flow':
          // handled separately below
          break;
        case 'mail-client': {
          const name = actionEl.dataset.name;
          MKT.toast('Email enviado', { sub: 'A ' + name });
          break;
        }
        case 'wa-client': {
          const name = actionEl.dataset.name;
          MKT.toast('WhatsApp enviado', { sub: 'A ' + name, type: 'ai' });
          break;
        }
      }
    }
  });

  $('#menuToggle')?.addEventListener('click', () => {
    $('#sidebar')?.classList.toggle('open');
    $('#sideBackdrop')?.classList.toggle('show');
  });
  $('#sideClose')?.addEventListener('click', () => MKT.closeSidebar());
  $('#sideBackdrop')?.addEventListener('click', MKT.closeSidebar);

  /* ---------------- Buscador global ---------------- */
  const searchInput = $('#globalSearch');
  const searchResults = $('#searchResults');
  function runSearch(q) {
    if (!searchResults) return;
    q = q.trim().toLowerCase();
    if (!q) { searchResults.hidden = true; searchResults.innerHTML = ''; return; }
    const clients = state.clients.filter(c => (c.name + ' ' + c.email + ' ' + c.tags.join(' ')).toLowerCase().includes(q)).slice(0, 3);
    const campaigns = state.campaigns.filter(c => (c.name + ' ' + c.segment).toLowerCase().includes(q)).slice(0, 2);
    const projects = state.projects.filter(p => (p.name + ' ' + p.type).toLowerCase().includes(q)).slice(0, 2);
    let html = '';
    if (clients.length) html += `<div class="sr-group">Clientes</div>` + clients.map(c => `<button class="sr-item" data-sr="client" data-id="${c.id}"><span class="sr-ic">${icon('user')}</span><span><b>${esc(c.name)}</b><span>${esc(c.email)}</span></span></button>`).join('');
    if (campaigns.length) html += `<div class="sr-group">Campañas</div>` + campaigns.map(c => `<button class="sr-item" data-sr="campaign" data-id="${c.id}"><span class="sr-ic" style="background:#FFF6E8;color:#B86E00">${icon('megaphone')}</span><span><b>${esc(c.name)}</b><span>${esc(c.status)} · ${esc(c.segment)}</span></span></button>`).join('');
    if (projects.length) html += `<div class="sr-group">Proyectos</div>` + projects.map(p => `<button class="sr-item" data-sr="project" data-id="${p.id}"><span class="sr-ic" style="background:#EFEBFF;color:#6D4AFF">${icon('kanban')}</span><span><b>${esc(p.name)}</b><span>${esc(p.status)} · ${esc(p.provider)}</span></span></button>`).join('');
    if (!html) html = `<div class="sr-empty">No encontramos resultados para «${esc(q)}».</div>`;
    searchResults.innerHTML = html;
    searchResults.hidden = false;
  }
  searchInput?.addEventListener('input', e => runSearch(e.target.value));
  searchInput?.addEventListener('focus', e => { if (e.target.value) runSearch(e.target.value); });

  /* ---------------- Modales base ---------------- */
  function openModal(html, opts = {}) {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-modal-backdrop>
      <div class="modal ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true">${html}</div></div>`;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const first = modalRoot.querySelector('input:not([type="checkbox"]), textarea, select, button.btn-primary');
      first?.focus({ preventScroll: true });
    }, 60);
  }
  function closeModal() {
    modalRoot.innerHTML = '';
    document.body.style.overflow = '';
  }
  MKT.openModal = openModal;
  MKT.closeModal = closeModal;
  MKT.openClientForm = openClientForm;
  MKT.openCampaignForm = openCampaignForm;
  MKT.openProjectForm = openProjectForm;
  MKT.openDealForm = openDealForm;
  MKT.openFlowForm = openFlowForm;
  MKT.openTaskForm = openTaskForm;
  MKT.openHelpModal = openHelpModal;
  MKT.openClient = openClient;
  modalRoot.addEventListener('click', e => {
    const submitBtn = e.target.closest('[data-submit]');
    if (submitBtn) {
      submitForm(submitBtn.dataset.submit, submitBtn);
      return;
    }
    if (e.target.matches('[data-modal-backdrop]') || e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modalRoot.innerHTML) closeModal();
      else { MKT.closeMenus(); MKT.closeSidebar(); searchInput?.blur(); }
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      MKT.closeMenus();
      searchInput?.focus();
    }
  });

  /* ---------------- Cliente: ficha ---------------- */
  function openClient(id) {
    const c = state.clients.find(x => x.id === id);
    if (!c) { toast('No encontramos ese cliente', { type: 'error' }); return; }
    const ch = MKT.CH[(c.channel || '').toLowerCase()] || MKT.CH.whatsapp;
    const nextAppt = D.appointments.find(a => a.client === c.name);
    const project = state.projects.find(p => p.status !== 'Completado');
    const campaign = state.campaigns.find(k => k.status === 'Activa');
    const tags = c.tags.map(t => `<span class="tag ${t === 'VIP' ? 'vip' : t === 'Color' ? 'color' : ''}">${esc(t)}</span>`).join(' ');
    openModal(`
      <div class="record-head">
        <span class="avatar ${c.avatar} lg">${MKT.initials(c.name)}</span>
        <div class="record-info">
          <h2>${esc(c.name)} ${MKT.statusPill(c.status)}</h2>
          <div class="rec-sub"><span class="channel ${ch.cls}">${icon(ch.icon)}${ch.label}</span><span>·</span><span>Cliente desde ${esc(c.since)}</span><span>·</span><span>${c.visits} visitas</span><span>·</span><div class="row" style="gap:4px">${tags}</div></div>
        </div>
        <div class="record-actions">
          <button class="btn btn-secondary btn-sm" data-action="mail-client" data-name="${esc(c.name)}">${icon('mail')}Email</button>
          <button class="btn btn-primary btn-sm" data-action="wa-client" data-name="${esc(c.name)}">${icon('whatsapp')}WhatsApp</button>
          <button class="modal-close" data-close aria-label="Cerrar">${icon('close')}</button>
        </div>
      </div>
      <div class="record-tabs"><button class="tab is-active">Resumen</button><button class="tab">Actividad</button><button class="tab">Proyectos</button><button class="tab">Campañas</button></div>
      <div class="record-body">
        <div class="record-main">
          <div class="detail-card">
            <h4>Detalles del cliente</h4>
            <div class="detail-grid">
              <div class="df"><span>Teléfono / WhatsApp</span><b>${esc(c.phone)}</b></div>
              <div class="df"><span>Email</span><b>${esc(c.email)}</b></div>
              <div class="df"><span>Canal preferido</span><b>${ch.label}</b></div>
              <div class="df"><span>Último contacto</span><b>${esc(c.last)}</b></div>
              <div class="df"><span>Visitas</span><b>${c.visits} en total</b></div>
              <div class="df"><span>Valor de vida</span><b class="ltv-big" style="font-size:14px">${fmt(c.ltv)}</b></div>
            </div>
            <div style="margin-top:11px;padding-top:10px;border-top:1px solid #F2F5FC">
              <h4 style="margin-bottom:4px">Notas internas</h4>
              <p class="rec-notes">${esc(c.notes || 'Sin notas por ahora.')}</p>
            </div>
          </div>
          <div class="related-cards">
            <div class="rel-card"><div class="rc-top">${icon('calendar')}Próximo turno</div><b>${nextAppt ? nextAppt.time + ' hs · ' + esc(nextAppt.svc) : 'Sin turno agendado'}</b><span>${nextAppt ? esc(nextAppt.status) : 'Ofrecer disponibilidad'}</span></div>
            <div class="rel-card"><div class="rc-top">${icon('kanban')}Proyecto activo</div><b>${project ? esc(project.name) : 'Sin proyectos'}</b><span>${project ? project.progress + '% · ' + esc(project.status) : 'Contratar un servicio'}</span></div>
            <div class="rel-card"><div class="rc-top">${icon('megaphone')}Campaña reciente</div><b>${campaign ? esc(campaign.name) : 'Sin campañas'}</b><span>${campaign ? campaign.metrics[1][0] + ' de apertura' : 'Crear campaña'}</span></div>
            <div class="rel-card"><div class="rc-top">${icon('star')}Reputación</div><b>Reseña 5★ en Google</b><span>«Atención impecable»</span></div>
          </div>
        </div>
        <aside class="rec-timeline">
          <h4>Actividad reciente</h4>
          <div class="act"><span class="act-ic" style="background:#E7F8F1;color:#1FA855">${icon('whatsapp')}</span><div class="act-body"><p>Mensaje de bienvenida enviado por el flujo automático.</p><time>${esc(c.lastShort)}</time></div></div>
          <div class="act"><span class="act-ic" style="background:#EAF3FF;color:#0E7DFB">${icon('calendar')}</span><div class="act-body"><p>Turno reservado: ${nextAppt ? esc(nextAppt.svc) : 'consulta de servicios'}.</p><time>${nextAppt ? 'Hoy, ' + nextAppt.time : 'Sin fecha'}</time></div></div>
          <div class="act"><span class="act-ic" style="background:#FFF6E8;color:#B86E00">${icon('megaphone')}</span><div class="act-body"><p>Abrió la campaña <b>Promo Día de la Madre</b>.</p><time>hace 4 días</time></div></div>
          <div class="act"><span class="act-ic" style="background:#EFEBFF;color:#6D4AFF">${icon('star')}</span><div class="act-body"><p>Dejó una reseña de 5 estrellas en Google Business.</p><time>hace 2 semanas</time></div></div>
        </aside>
      </div>
      <div class="modal-foot"><span class="small muted" style="margin-right:auto">Propietaria: Martina Gómez · Ámbar Estudio</span><button class="btn btn-secondary" data-close>Cerrar</button></div>
    `, { wide: true });
  }

  /* ---------------- Formularios ---------------- */
  function clientOptions(selected) {
    return state.clients.map(c => `<option value="${esc(c.name)}" ${c.name === selected ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
  }

  function openNew(type, extra = {}) {
    if (type === 'client') return openClientForm();
    if (type === 'campaign') return openCampaignForm();
    if (type === 'project') return openProjectForm();
    if (type === 'deal') return openDealForm(extra.stage);
    if (type === 'flow') return openFlowForm();
    if (type === 'task') return openTaskForm();
    if (type === 'ai') { MKT.navigate('ia'); setTimeout(() => { $('#aiTopic')?.focus(); }, 250); return; }
    return openClientForm();
  }

  function openClientForm() {
    openModal(`
      ${modalHead('Nuevo cliente', 'Sumá una ficha a tu CRM. Podés completar el resto después.', 'user-plus')}
      <div class="modal-body">
        <div class="form-grid">
          <div class="field full"><label for="ncName">Nombre completo *</label><input class="input" id="ncName" placeholder="Ej: Juliana Etcheverry"></div>
          <div class="field"><label for="ncPhone">Teléfono / WhatsApp *</label><input class="input" id="ncPhone" placeholder="+598 99 123 456"></div>
          <div class="field"><label for="ncEmail">Email</label><input class="input" id="ncEmail" type="email" placeholder="nombre@email.com"></div>
          <div class="field"><label for="ncChannel">Canal preferido</label><select class="select" id="ncChannel"><option>WhatsApp</option><option>Instagram</option><option>Email</option><option>Presencial</option></select></div>
          <div class="field"><label for="ncStatus">Estado</label><select class="select" id="ncStatus"><option>Nuevo</option><option>Activo</option><option>En riesgo</option><option>Inactivo</option></select></div>
          <div class="field full"><label for="ncTags">Etiquetas</label><input class="input" id="ncTags" placeholder="VIP, Color, Novia (separadas por coma)"><div class="hint">Las etiquetas te ayudan a segmentar campañas.</div></div>
          <div class="field full"><label for="ncNotes">Notas</label><textarea class="textarea" id="ncNotes" placeholder="Preferencias, alergias, historial..."></textarea></div>
        </div>
        <div class="modal-note">${icon('lock')} Cumplimos la Ley 18.331 de Protección de Datos Personales. Registrá solo datos con consentimiento.</div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="client">${icon('plus')}Crear cliente</button></div>
    `);
  }

  function openCampaignForm() {
    openModal(`
      ${modalHead('Nueva campaña', 'WhatsApp, email o Instagram. Podés usar una plantilla o crear desde cero.', 'megaphone', 'amber')}
      <div class="modal-body">
        <div class="form-grid">
          <div class="field full"><label for="kName">Nombre de la campaña *</label><input class="input" id="kName" placeholder="Ej: Promo Navidad Ámbar"></div>
          <div class="field"><label for="kChannel">Canal principal</label><select class="select" id="kChannel"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="instagram">Instagram</option><option value="multi">Multicanal</option></select></div>
          <div class="field"><label for="kSegment">Segmento</label><select class="select" id="kSegment"><option>Todas las clientas</option><option>VIP y recurrentes</option><option>Clientas en riesgo</option><option>Nuevas en los últimos 30 días</option><option>Sin visita hace 60 días</option></select></div>
          <div class="field full"><label for="kMessage">Mensaje principal</label><textarea class="textarea" id="kMessage" placeholder="Escribí el mensaje o generá una propuesta con Velumi AI..."></textarea></div>
          <div class="field full"><label for="kGoal">Meta de ventas (UYU)</label><input class="input" id="kGoal" type="number" placeholder="80000" value="40000"></div>
        </div>
        <div class="modal-note">${icon('sparkles')} ¿Querés el copy resuelto? Generá variantes en <b>Contenido IA</b> y volvé con el texto listo.</div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="campaign">${icon('megaphone')}Crear campaña</button></div>
    `);
  }

  function openProjectForm() {
    openModal(`
      ${modalHead('Nuevo proyecto', 'Organizá un proyecto propio o contratá un servicio desde Diseño y Web.', 'kanban', 'purple')}
      <div class="modal-body">
        <div class="form-grid">
          <div class="field full"><label for="pName">Nombre del proyecto *</label><input class="input" id="pName" placeholder="Ej: Campaña Día del Padre"></div>
          <div class="field"><label for="pType">Tipo</label><select class="select" id="pType"><option>Web</option><option>Branding</option><option>Campaña</option><option>Fotografía</option></select></div>
          <div class="field"><label for="pDue">Fecha de entrega</label><input class="input" id="pDue" type="date"></div>
          <div class="field"><label for="pClient">Cliente</label><select class="select" id="pClient">${clientOptions('Ámbar Estudio')}</select></div>
          <div class="field"><label for="pBudget">Presupuesto</label><input class="input" id="pBudget" placeholder="USD 199"></div>
          <div class="field full"><label for="pDesc">Descripción</label><textarea class="textarea" id="pDesc" placeholder="Alcance, objetivos y entregables del proyecto..."></textarea></div>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="project">${icon('plus')}Crear proyecto</button></div>
    `);
  }

  function openDealForm(stage = 'lead') {
    openModal(`
      ${modalHead('Nuevo negocio', 'Agregá una oportunidad al pipeline para no perderle el rastro.', 'funnel', 'teal')}
      <div class="modal-body">
        <div class="form-grid">
          <div class="field full"><label for="dTitle">Título del negocio *</label><input class="input" id="dTitle" placeholder="Ej: Pack novia · Lucía Fernández"></div>
          <div class="field"><label for="dClient">Cliente</label><select class="select" id="dClient">${clientOptions('Sofía Martínez')}</select></div>
          <div class="field"><label for="dAmount">Monto (UYU) *</label><input class="input" id="dAmount" type="number" min="0" placeholder="12000"></div>
          <div class="field"><label for="dStage">Etapa</label><select class="select" id="dStage">${D.stages.map(s => `<option value="${s.id}" ${s.id === stage ? 'selected' : ''}>${s.name}</option>`).join('')}</select></div>
          <div class="field"><label for="dTag">Etiqueta</label><select class="select" id="dTag"><option>Novia</option><option>Color</option><option>Tratamiento</option><option>Membresía</option><option>Facial</option><option>Maquillaje</option></select></div>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="deal">${icon('plus')}Agregar al pipeline</button></div>
    `);
  }

  function openFlowForm() {
    openModal(`
      ${modalHead('Nuevo flujo automático', 'Elegí un disparador y Velumi arma la base. Después podés personalizar cada paso.', 'zap', 'green')}
      <div class="modal-body">
        <div class="form-grid">
          <div class="field full"><label for="fName">Nombre del flujo *</label><input class="input" id="fName" placeholder="Ej: Seguimiento 30 días"></div>
          <div class="field"><label for="fTrigger">Disparador</label><select class="select" id="fTrigger"><option>Nuevo cliente</option><option>Servicio realizado</option><option>Sin visita hace 60 días</option><option>Fecha de cumpleaños</option><option>24 h después de la visita</option></select></div>
          <div class="field"><label for="fChannel">Canal</label><select class="select" id="fChannel"><option value="whatsapp">WhatsApp</option><option value="email">Email</option></select></div>
          <div class="field full"><label for="fMessage">Mensaje inicial</label><textarea class="textarea" id="fMessage" placeholder="¡Hola, {{nombre}}! 💛 ..."></textarea><div class="hint">Usá {{nombre}} para personalizar el mensaje.</div></div>
        </div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="flow">${icon('zap')}Crear flujo</button></div>
    `);
  }

  function openTaskForm() {
    openModal(`
      ${modalHead('Nueva tarea', 'Anotá lo que no te querés olvidar. Aparece en Mi día.', 'check-circle', 'green')}
      <div class="modal-body">
        <div class="field"><label for="tText">¿Qué hay que hacer? *</label><input class="input" id="tText" placeholder="Ej: Llamar a Florencia por la reactivación"></div>
        <div class="field"><label for="tMeta">Cuándo</label><input class="input" id="tMeta" placeholder="Hoy 16:00"></div>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-submit="task">${icon('plus')}Agregar tarea</button></div>
    `);
  }

  /* ---------------- Submit (form handling) ---------------- */
  function submitForm(kind, el) {
    if (kind === 'client') {
      const name = ($('#ncName')?.value || '').trim();
      const phone = ($('#ncPhone')?.value || '').trim();
      if (!name || !phone) { toast('Faltan datos obligatorios', { type: 'error', sub: 'Completá nombre y teléfono.' }); return; }
      const tags = ($('#ncTags')?.value || '').split(',').map(t => t.trim()).filter(Boolean);
      const c = {
        id: 'c' + Date.now(), name, phone,
        email: ($('#ncEmail')?.value || '').trim() || 'sin-email@velumi.uy',
        status: $('#ncStatus')?.value || 'Nuevo',
        channel: $('#ncChannel')?.value || 'WhatsApp',
        tags: tags.length ? tags : ['Nuevo'],
        last: 'Ahora', lastShort: 'ahora', ltv: 0, visits: 0, since: 'Nov 2026',
        avatar: 'a' + (1 + Math.floor(Math.random() * 8)),
        notes: ($('#ncNotes')?.value || '').trim()
      };
      // Add to state (already in state from init, persist via save)
      state.clients.unshift(c);
      state.clientStatus = 'Todos'; state.clientSearch = ''; state.clientPage = 1;
      syncClientTabs();
      if ($('#clientSearch')) $('#clientSearch').value = '';
      MKT.render.clients();
      closeModal(); MKT.navigate('clientes');
      toast('Cliente creado', { sub: name + ' ya está en tu CRM.' });
      return;
    }
    if (kind === 'campaign') {
      const name = ($('#kName')?.value || '').trim();
      if (!name) { toast('Ponele un nombre a la campaña', { type: 'error' }); return; }
      const chan = $('#kChannel')?.value || 'whatsapp';
      const channels = chan === 'multi' ? ['whatsapp', 'email', 'instagram'] : [chan];
      state.campaigns.unshift({
        id: 'k' + Date.now(), name, channels, status: 'Borrador',
        segment: $('#kSegment')?.value || 'Todas las clientas',
        metrics: [['—', 'Enviados'], ['—', 'Apertura'], ['—', 'Ventas']],
        revenue: 0, goalLabel: 'Meta de ventas',
        goalText: '$ 0 / ' + fmt(Number($('#kGoal')?.value || 0)), progress: 0
      });
      state.campFilter = 'Todas';
      MKT.render.campaigns();
      closeModal(); MKT.navigate('campanas');
      toast('Campaña creada como borrador', { sub: name + ' · lista para editar.' });
      return;
    }
    if (kind === 'project') {
      const name = ($('#pName')?.value || '').trim();
      if (!name) { toast('Falta el nombre del proyecto', { type: 'error' }); return; }
      const msAll = [];
      const pData = {
        id: 'p' + Date.now(), name,
        client: $('#pClient')?.value || 'Ámbar Estudio',
        type: $('#pType')?.value || 'Web',
        due: $('#pDue')?.value || '',
        budget: $('#pBudget')?.value || 'USD 199',
        status: 'Borrador', progress: 0,
        icon: 'kanban', tone: 'purple',
        milestones: msAll, // store all, but only show first 3
        deliverables: [],
        currentMsIndex: 0
      };
      state.projects.unshift(pData);
      MKT.render.projects();
      closeModal(); MKT.navigate('proyectos');
      toast('Proyecto creado', { sub: name + ' ya está en tus proyectos.' });
      return;
    }
    if (kind === 'deal') {
      const title = ($('#dTitle')?.value || '').trim();
      if (!title) { toast('Faltan el título del negocio', { type: 'error' }); return; }
      const client = ($('#dClient')?.value || 'Sofía Martínez');
      const amount = Number($('#dAmount')?.value || 0);
      const stage = $('#dStage')?.value || 'lead';
      const tag = $('#dTag')?.value || 'Novia';
      const newDeal = {
        id: 'd' + Date.now(), title, client, amount, stage, tag,
        channel: 'whatsapp', days: 1, hot: false
      };
      state.deals.unshift(newDeal);
      MKT.render.kanban();
      closeModal(); MKT.navigate('pipeline');
      toast('Negocio agregado al pipeline', { sub: title });
      return;
    }
    if (kind === 'flow') {
      const fName = ($('#fName')?.value || '').trim();
      if (!fName) { toast('Faltan el nombre del flujo', { type: 'error' }); return; }
      const fTrigger = $('#fTrigger')?.value || 'Nuevo cliente';
      const fChannel = $('#fChannel')?.value || 'whatsapp';
      const fMessage = ($('#fMessage')?.value || '').trim();
      const newFlow = {
        id: 'f' + Date.now(), name: fName, trigger: fTrigger, channel: fChannel,
        status: 'Borrador', tone: 'green', icon: 'zap',
        executions: 0, response: 0, revenue: '$ 0',
        desc: fTrigger,
        nodes: [
          { type: 'trigger', title: fTrigger, sub: 'Disparador automático', icon: 'zap', tone: 'amber' },
          { type: 'message', title: 'Mensaje inicial', sub: fMessage || 'Mensaje de bienvenida', icon: 'whatsapp', tone: 'green' }
        ],
        message: fMessage || '¡Hola, {{nombre}}! 💛 Gracias por escribirnos a Ámbar Estudio. Soy Martina y te voy a acompañar en lo que necesites.'
      };
      state.flows.unshift(newFlow);
      MKT.render.flows();
      closeModal(); MKT.navigate('automatizaciones');
      toast('Flujo creado como borrador', { sub: fName });
      return;
    }
    if (kind === 'task') {
      const tText = ($('#tText')?.value || '').trim();
      if (!tText) { toast('Falta la descripción de la tarea', { type: 'error' }); return; }
      const tMeta = ($('#tMeta')?.value || 'Hoy').trim();
      const newTask = {
        id: 't' + Date.now(), text: tText, meta: tMeta,
        tag: 'Tarea', done: false, hot: false
      };
      state.tasks.unshift(newTask);
      MKT.render.tasks();
      closeModal(); MKT.navigate('home');
      toast('Tarea agregada', { sub: tText });
      return;
    }
    toast('Acción no reconocida', { type: 'error' });
  }

  /* ---------------- Flow toggle (activate/pause) ---------------- */
  document.addEventListener('click', e => {
    const flowToggle = e.target.closest('[data-flow-toggle]');
    if (flowToggle) {
      const flowId = flowToggle.dataset.flowToggle;
      const flow = state.flows.find(f => f.id === flowId);
      if (!flow) return;
      flow.status = flow.status === 'Activa' ? 'Pausada' : 'Activa';
      flow.response = Math.round(Math.random() * 30 + 10); // simulated
      flow.executions = Math.floor(Math.random() * 200 + 50); // simulated
      if (flow.status === 'Activa') flow.revenue = `$ ${Math.floor(Math.random() * 50000 + 10000)}`;
      else flow.revenue = '$ 0';
      MKT.render.flows();
      MKT.toast(`Flujo ${flow.status === 'Activa' ? 'activado' : 'pausado'}`);
    }
  });

  /* ---------------- Channel toggle en client card ---------------- */
  document.addEventListener('click', e => {
    const waClient = e.target.closest('[data-action="wa-client"]');
    if (waClient) {
      const name = waClient.dataset.name;
      const c = state.clients.find(x => x.name === name);
      if (!c) { toast('No encontramos ese cliente'); return; }
      // Simular envío por WhatsApp
      MKT.toast(`WhatsApp enviado a ${name} 📲`, { sub: 'Mensaje de bienvenida o seguimiento', type: 'ai' });
    }
  });

  /* ---------------- Flow: duplicate ---------------- */
  document.addEventListener('click', e => {
    const dupFlow = e.target.closest('[data-action="duplicate-flow"]');
    if (dupFlow) {
      const flowLabel = dupFlow.dataset.action; // text includes "Duplicar flujo"
      const flowId = e.target.closest('.flow-card')?.dataset.flow || state.activeFlow;
      const flow = state.flows.find(f => f.id === flowId);
      if (!flow) return;
      // Duplicate with status Borrador
      const duplicated = {
        ...flow, id: 'f' + Date.now(), status: 'Borrador',
        executions: 0, response: 0, revenue: '$ 0',
        nodes: flow.nodes.map(n => ({ ...n, id: 'fnode' + Date.now() }))
      };
      state.flows.unshift(duplicated);
      MKT.render.flows();
      MKT.toast('Flujo duplicado como borrador');
    }
  });

  /* ---------------- Open help modal ---------------- */
  function openHelpModal() {
    openModal(`
      ${modalHead('Ayuda Velumi', 'Consultá la guía rápida para comenzar.', 'question')}
      <div class="modal-body" style="max-height:500px;overflow:auto">
        <h3>Primeros pasos</h3>
        <ol style="line-height:1.8">
          <li>Ingresá con tus credenciales o usá la demo.</li>
          <li>Explorá el menú lateral: Clientes, Campañas, Proyectos.</li>
          <li>Creá tu primer cliente usando el botón +.</li>
          <li>Probá crear una campaña por WhatsApp.</li>
          <li>Visitá la sección de Automatizaciones para configurar flujos.</li>
        </ol>
        <h3>Atajos de teclado</h3>
        <ul style="line-height:1.8">
          <li><kbd>Ctrl</k> + <kbd>K</k>: Foco en búsqueda global.</li>
          <li><kbd>Escape</k>: Cerrar modal o menú abierto.</li>
          <li><kbd>N</k>: Nuevo cliente (cuando estés en Ventas).</li>
        </ul>
      </div>
      <div class="modal-foot"><button class="btn btn-secondary" data-close>Cerrar</button></div>
    `);
  }

  /* ---------------- Client tab sync ---------------- */
  function syncClientTabs() {
    // Update the pill count and tabs when clients change
    const all = state.clients;
    const counts = {
      Todos: all.length,
      Activo: all.filter(c => c.status === 'Activo').length,
      'En riesgo': all.filter(c => c.status === 'En riesgo').length,
      Nuevo: all.filter(c => c.status === 'Nuevo').length,
      Inactivo: all.filter(c => c.status === 'Inactivo').length
    };
    const set = (id, v) => { const el = $('#' + id); if (el) el.textContent = v; };
    set('clientsCountPill', counts.Todos);
    set('ctAll', counts.Todos);
    set('ctActivo', counts.Activo);
    set('ctRiesgo', counts['En riesgo']);
    set('ctNuevo', counts.Nuevo);
    set('ctInactivo', counts.Inactivo);
    set('sideClientCount', counts.Todos);
    const avg = all.length ? Math.round(all.reduce((s, c) => s + (c.ltv || 0), 0) / all.length) : 0;
    set('csLtv', fmt(avg));
  }

  /* ---------------- Flow: edit ---------------- */
  // (handled inline in renderFlows - button data-action="edit-flow")

})();