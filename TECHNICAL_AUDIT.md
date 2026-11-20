# MKTify · Auditoría Técnica Detallada

## Arquitectura Actual

```
index.html          -> Entry point con landing + app shell
assets/styles.css   -> Design system, layout, components
assets/app.js       -> Core logic, navigation, rendering, event handlers
assets/data.js      -> Demo data (clients, deals, campaigns, etc.)
assets/charts.js    -> SVG charts (sparkline, lineChart)
```

### Flujos de Datos
- Todos los datos son estáticos (window.MKT.data)
- El estado se mantiene en `MKT.state` objeto global
- Renderizado: funciones puras que toman `state` y devuelven HTML
- No hay capa de backend - todo es client-side simulación

### Navegación
- `navigate(view)`: muestra/oculta vistas por ID (`view-home`, `view-clientes`, etc.)
- Hash routing: `location.hash` controla la vista actual
- `showLanding()` / `showLogin()`: transiciones entre landing y app
- No hay validación de permisos por rol en la navegación

---

## Hallazgos Críticos

### 1. Autenticación (APP.JS:96-122)
**Problema**: `login()` y `logout()` solo togglean `state.loggedIn` y muestran/ocultan elementos HTML.
- No hay verificación real de credenciales
- El "demo" usa cualquier email/password
- Al recargar página, el estado se pierde
- No hay sistema de tokens o sesión

**Impacto**: Cualquier usuario puede acceder al panel completo sin autenticación real.

**Solución propuesta**:
- Implementar `localStorage` persistence
- Crear `AuthService` module
- Hashear credenciales de demo o usar token simulado
- Proteger navegación: si !loggedIn y view !== 'landing'/'login', mostrar landing

### 2. Persistencia de Datos (APP.JS:52-54, DATA.JS)
**Problema**: `state.clients = D.clients.map(c => ({ ...c }))` hace una copia superficial al init.
- Cualquier creación/edición/borrado se pierde al recargar
- No hay `sync()` a localStorage
- `state.tasks`, `state.campaigns`, etc. inicializan desde datos hardcodeados

**Impacto**: El usuario trabaja con datos que desaparecen al refrescar.

**Solución propuesta**:
```javascript
// En init():
const stored = localStorage.getItem('mktify-state');
state = stored ? JSON.parse(stored) : defaultState;
window.addEventListener('beforeunload', () => localStorage.setItem('mktify-state', JSON.stringify(state)));
```

### 3. Race Conditions en Renderizado (APP.JS:varias)
**Problema**: Multiple render functions acceden a `state` global sin protección.
- `renderClients()` y `renderFlows()` pueden ejecutarse concurrentemente
- `renderHome()` llama a `MKT.charts.lineChart()` que reescribe `innerHTML`
- `renderCampaigns()` y `renderProjects()` compiten por el mismo container en views diferentes

**Impacto**: UI parpadeante, datos desactualizados, errores de "cannot read property of undefined".

**Solución propuesta**:
- Queue de renders o flags `isRendering`
- `requestAnimationFrame` batching
- State management más explícito (quizás simple state tree)

### 4. Search Global (APP.JS:648-666)
**Problema**: `runSearch()` filtra sobre `state.clients`, `state.campaigns`, `state.projects` separadamente.
- No hay búsqueda unificada con scoring
- Resultados limitados a 3 clients + 2 campaigns + 2 projects
- No respeta `clientSearch` state actual cuando se cambia de vista

**Impacto**: Experiencia de búsqueda inconsistente.

### 5. Performance en Listas Large (APP.JS:240-287)
**Problema**: `renderClients()` construye HTML string con `.map()` sobre todos los clientes.
- Sin virtualización ni limitación realista
- Pager calcula `Math.ceil(total / pageSize)` pero el HTML se genera completo
- `clientSearch` filtra en JS sobre array completo - OK para 18 items, pero no scalable

**Impacto**: Lento si se tuvieran 500+ clientes (aunque con 18 es instantáneo).

### 6. Modal System (APP.JS:669-756)
**Problema**: `openModal()` reemplaza `modalRoot.innerHTML` completamente.
- No hay gestión de stack de modales (puede anular modales abiertos)
- `closeModal()` limpia todo, pero no hay way to close specific modal
- Focus trap no implementado

**Impacto**: Accessibility issue, potential modal stacking bugs.

### 7. Event Delegation (APP.JS:635-639)
**Problema**: `document.addEventListener('click', ...)` verifica `e.target.closest()` pero muchos handlers están inline en el HTML o registrados después.
- Algunos eventos como `data-action="open-login"` funcionan por data-attributes
- Pero `data-submit="client"` en forms necesita `form.addEventListener('submit', ...)` (línea 538)
- Inconsistencia en el patrón de event handling

### 8. CSS / Design System (STYLES.CSS)
**Observaciones**:
- Good use of CSS variables for theming
- Responsive breakpoints bien definidos
- Shadow system consistente
- Falta: modo oscuro, variables de estado (success/error warning info)
- Algunos colores no tienen contrasteAA en modo dark

### 9. SVG Icons (APP.JS:4-61, INDEX.HTML:17-83)
**Fortaleza**: Sprite system con 67 símbolos icónicos.
- `icon(name)` helper func evita duplicación
- Todos los icons son `currentColor` - heredan el color contextual
- Buena accessibility con `aria-hidden="true"` y títulos en circles

### 10. Accessibility Gaps (Varias)
- Missing `aria-label` en muchos botones icon-only
- `tablist` en client tabs no tiene `role="tablist"` ni `aria-selected`
- `progress bars` sin `aria-valuemin/aria-valuemax/aria-valuenow`
- `forms` sin `label` asociado explícito (usar `for=id` está bien, pero algunos inputs en modals carecen)
- `data-table` sin `scope` en headers

---

## 📈 Roadmap de Correcciones Prioritarias

### Sprint 1 (Semana 1)
- [ ] Persistencia localStorage → datos sobreviven refresh
- [ ] Guardar/ restaurar state en `beforeunload`
- [ ] Proteger navigation: blocked si !loggedIn

### Sprint 2 (Semana 2-3)
- [ ] API mock module → CRUD básico funciona
- [ ] Create/Update/Delete para clientes y campañas
- [ ] `syncClientTabs()` implementado
- [ ] Error handling en operaciones

### Sprint 3 (Semana 4-5)
- [ ] Accessibility fixes mínimo:
  - ARIA labels en 20+ botones/iconos
  - focus-visible styles
  - label association en forms
  - aria-live en messages/toasts
- [ ] Loading states en operaciones async

### Sprint 4 (Semana 6-7)
- [ ] Performance: debounce en search input
- [ ] Render optimization: sólo renderizar lo visible
- [ ] Error boundaries try/catch en renders

### Sprint 5 (Semana 8)
- [ ] Testing básico: unit tests para utilities (fmt, esc, initials, statusPill)
- [ ] Integration tests para login → navigate → create client → view client
- [ ] E2E feliz path

---

## 🧩 Módulos Faltantes (Según Plan de Acción)

Del `plan-accion-mktify.md` sección 3.1 (Alcance del MVP):

| Módulo | Estado Actual | Faltante |
|--------|--------------|----------|
| CRM (ficha, pipeline, tareas) | Parcial (render + some nav) | WhatsApp integration, IA triggers |
| Gestión proyectos | Render OK | Portal público, plantillas reutilizables |
| Automatización marketing | 6 flows básicos | Webhooks, behavior triggers, BSP API |
| IA de contenido | Nota en modal | API OpenAI wrapper, 50 variantes A/B |
| Cobros e integración local | Referenciado solo | Mercado Pago API, links de suscripción, facturación DGI |

---

## 🎯 Próximos Pasos Inmediatos

1. **Crear `assets/api.js`** - Module que simula backend y persiste en localStorage
2. **Refactorizar `init()` en `app.js`** - Usar estado persistente
3. **Implementar `protectRoute()`** - Middleware de auth
4. **Fix `renderClients()` pager** - Para 0 clientes y páginas extremas
5. **Add ARIA labels** - Crítico para accessibility compliance

---
*Usar este documento como checklist mientras se implementa la Fase 1 del plan de desarrollo.*