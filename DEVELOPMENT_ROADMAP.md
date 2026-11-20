# MKTify · Plan de Desarrollo Continuo

## Fase 1: Correcciónes Críticas y Estabilidad (Semanas 1-2)

### 1.1 Autenticación y Estado
- [ ] Implementar persistencia real en localStorage/sessionStorage
- [ ] Crear sistema de sesión real con token
- [ ] Proteger rutas sensibles (solo loggedIn pueden acceder al appShell)
- [ ] Agregar logout que limpie estado completamente

### 1.2 Datos y API Mock
- [ ] Crear módulo `api.js` que simule llamadas a backend
- [ ] Migrar `MKT.data` a ser consumido por el API
- [ ] Implementar CRUD básico: create/read/delete para clientes, campañas, proyectos
- [ ] Agregar `syncClientTabs()` que actualice las pestañas de estado

### 1.3 Corrección de Bugs Identificados
- [ ] `renderClients()`: el pager no funciona correctamente cuando hay 0 clientes
- [ ] `renderFlows()`: el detalle del flujo siempre muestra el primer flujo aún al navegar
- [ ] `renderKanban()`: las estadísticas del pipeline no actualizan al filtrar
- [ ] `openClientForm()`: las etiquetas por defecto no respetan el canal seleccionado

## Fase 2: Módulos del MVP (Semanas 3-8)

### 2.1 Módulo WhatsApp Business (Alto Prioridad)
- [ ] Integrar con Meta Cloud API (estructurar endpoints)
- [ ] Crear plantillas de mensajes aprobadas
- [ ] Implementar webhooks para webhook de callbacks
- [ ] Panel de historial de conversaciones por cliente
- [ ] Estadísticas de apertura y respuesta de WhatsApp

### 2.2 IA de Contenido (Medio-Alto)
- [ ] API wrapper para OpenAI/Azure OpenAI
- [ ] Generador de copy para: Instagram, WhatsApp, Email, Landing pages
- [ ] Sistema de variantes A/B automáticas (50 versiones → test)
- [ ] Generación de placas simples para redes a partir de plantillas
- [ ] Soporte para tono rioplatense/latino

### 2.3 Integración Mercado Pago
- [ ] Crear cliente SDK Mercado Pago
- [ ] Links de pago de suscripción
- [ ] Webhooks de pago aprobado/rechazado
- [ ] Facturación electrónica DGI integration
- [ ] Reportes de ingresos por cliente

### 2.4 Módulo de Reportes Mejorado
- [ ] Comparación mes a mes con año anterior
- [ ] Filtros por campaña, segmento, canal
- [ ] Exportación a CSV/PDF
- [ ] KPIs: CAC, LTV, churn, ROI por campaña

## Fase 3: Experiencia de Usuario y Accesibilidad (Semanas 9-10)

### 3.1 Accessibility (a11y)
- [ ] Agregar ARIA labels a todos los componentes interactivos
- [ ] Contraste de colores adecuado (revisar combinaciones actual)
- [ ] Navegación con teclado mejorada (Ctrl+K, Escape)
- [ ] Screen reader support para tablas y gráficos
- [ ] focus-visible states en todos los botones

### 3.2 UI/UX Mejoras
- [ ] Loading states en todas las operaciones async
- [ ] Empty states diseñados para cada vista
- [ ] Skeletons mientras cargan los datos
- [ ] ToolTips en icons e elementos interactivos
- [ ] Mejor feedback en acciones exitosas/erróneas

### 3.3 Responsive Design
- [ ] Probar y fijar breakpoints en: 320px, 375px, 425px, 768px, 1024px, 1440px
- [ ] Mobile-first redesign de: campaign grid, project grid, services grid
- [ ] Sidebar collapse/expand en mobile
- [ ] Topbar optimizada para touch devices

## Fase 4: Features Avanzadas y Scale (Semanas 11-16)

### 4.1 Multi-tenant Architecture
- [ ] Agregar `tenant_id` a todos los modelos de datos
- [ ] Isolación de datos por cliente/empresa
- [ ] Configuración por tenant: monedas, horarios, canales

### 4.2 Marketplace de Servicios (Versión Future)
- [ ] Carrito de contratación de servicios
- [ ] Integración con pasarela de pagos por proyecto
- [ ] Sistema de reseñas para proveedores
- [ ] Panel de proveedores y proveedores verificados

### 4.3 API Pública
- [ ] Documentación OpenAPI 3.0
- [ ] Endpoints para: clientes, campañas, pedidos
- [ ] Webhooks para integraciones externas
- [ ] Rate limiting y auth tokens

### 4.4 Marketplace y Ecosistema
- [ ] Integración con Google Business
- [ ] Conector con Mesas (restaurantes uruguayos)
- [ ] Integración con Google Calendar
- [ ] Sistema de referidos por partners

## Fase 5: Observabilidad y Mantenimiento (Continuo)

### 5.1 Monitoring
- [ ] Dashboard de errores en consola
- [ ] Track de uso de features por cliente
- [ ] Métricas de rendimiento (TTI, FCP, LCP)
- [ ] Logs de operaciones críticas

### 5.2 Testing
- [ ] Unit tests para funciones utilities (fmt, esc, initials, etc.)
- [ ] Integration tests para flujos principales
- [ ] E2E tests con Cypress o Playwright
- [ ] Tests de accesibilidad automatizados

### 5.3 Documentation
- [ ] README con setup y scripts
- [ ] API documentation (OpenAPI)
- [ ] Comentario de código estándar
- [ ] Guía de contribución

---

## 🎯 Prioridades Inmediatas (Próximas 2 Semanas)

1. **Fix authentication flow** - login/logout debe persistir estado
2. **Implementar CRUD básico** - crear/editar/borrar clientes y campañas
3. **Mejorar rendering de lists** - performance en lists grandes (>50 items)
4. **Add loading states** - en todas las operaciones que tomen tiempo
5. **Accessibility audit** - mínimo viable: ARIA labels y contrast

### 📝 Próximos Archivos a Crear/Modificar
- `assets/api.js` - Módulo de simulación de backend
- `assets/components.js` - Componentes reutilizables (tabla, card, form)
- `assets/routes.js` - Enrutamiento más robusto
- `assets/filters.js` - Filtros y ordenamiento centralizados

---

## 💡 Ideas de Mejora Adicionales

1. **Modo oscuro / claro** - toggle con preferencia del sistema
2. **Atalhos de teclado** - `n` para nuevo cliente, `c` para nueva campaña, `/` para foco search
3. **Plantillas de campañas predefinidas** - con métricas esperadas
4. **Recordatorios automáticos** - notificaciones del navegador para tareas pendientes
5. **Integración calendario** - Google Calendar / Outlook para turnos
6. **Recordatorio de cumpleaños** - con mensaje automático
7. **Geo-localización** - negocios cercanos / mapa con ubicaciones
8. **Estadísticas predictivas** - IA pronóstico de ventas próximo mes

---
*Documento vivo: actualizar al cierre de cada sprint.*