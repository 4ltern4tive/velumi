# PLAN DE ACCIÓN PROFESIONAL
## MKTify — SaaS de CRM, Marketing y Diseño para Pymes de Montevideo

**Versión:** 1.0 · **Fecha:** Noviembre 2026 · **Horizonte:** 12 meses
**Nombre provisorio:** MKTify (a validar con registro de marca)

---

## 1. RESUMEN EJECUTIVO

MKTify es un SaaS uruguayo pensado para que **el propio pequeño negocio** gestione su marketing y sus ventas: CRM de sus clientes, gestión de sus campañas y proyectos, automatización por WhatsApp/Email, contenido con IA y servicios de diseño web contratables dentro de la plataforma.

**Propuesta de valor:** *"El sistema operativo comercial de tu pyme: captás, vendés y fidelizás sin contratar un equipo de marketing."*

**Modelo:** suscripción mensual + fee de implementación + proyectos de diseño/web a precio fijo.

**Mercado inicial:** pymes de servicios y retail en Pocitos, Punta Carretas, Carrasco, Ciudad Vieja y Centro (peluquerías, estética, gastronomía, gimnasios, clínicas dentales, inmobiliarias pequeñas).

**Meta a 12 meses:** 150 cuentas activas, MRR de USD 8.000, churn < 5% mensual.

**Inversión inicial requerida:** USD 8.000 – 12.000.

---

## 2. ESTRUCTURA LEGAL Y FORMAL (Semanas 1–3)

### 2.1 Constitución de la SAS

La **SAS (Sociedad por Acciones Simplificada)** uruguaya (Ley 19.820) es la figura ideal: sin capital mínimo, constitución 100% digital, sin escribano.

| Paso | Detalle | Plazo | Costo aprox. |
|------|---------|-------|--------------|
| 1 | Reserva de nombre y objeto social | 1–3 días | Bajo |
| 2 | Constitución online de la SAS (plataforma digital del MEF / Ventanilla Única) | 3–7 días | Bajo |
| 3 | Obtención de RUT y registro en DGI | 2–5 días | Gratuito |
| 4 | Alta en BPS (aportes) y BSE (seguro de accidentes) | 2–5 días | Según nómina |
| 5 | Alta en MTSS | 2–5 días | Gratuito |
| 6 | Cuenta bancaria empresarial (BROU o banco privado) | 5–10 días | Según banco |
| 7 | Habilitación municipal (si hay oficina física) | 1–2 semanas | Según superficie |

**Objeto social sugerido (redacción amplia):** desarrollo de software, servicios de marketing digital, publicidad, diseño gráfico y web, consultoría comercial, y actividades conexas.

**Recomendaciones:**
- Constituir con 1–2 socios y **pacto de socios por escrito** (vesting, salida, propiedad intelectual).
- Nombrar contador desde el día 1 (USD 120–180/mes). Es obligatorio llevar contabilidad y emitir **CFE (facturación electrónica)**.
- Registrar la marca "MKTify" en DNPI (clase 35 y 42) antes de invertir en marketing.

### 2.2 Régimen fiscal

| Concepto | Tratamiento |
|----------|-------------|
| IVA servicios digitales locales | 22% |
| IRAE (impuesto a la renta) | 25% sobre utilidad |
| Exportación de servicios software | IVA 0% (exportación) — evaluar con contador |
| Facturación electrónica | Obligatoria vía proveedor certificado por DGI |
| Datos personales | Registro de base de datos ante URCDP (Ley 18.331) + política de privacidad |

**Decisión clave:** si en el año 2 apuntás a clientes de Argentina/Chile, conviene estructurar la exportación de servicios desde el inicio (IVA 0%) — consultar con contador antes de facturar.

---

## 3. PRODUCTO: MVP Y ROADMAP

### 3.1 Alcance del MVP (12 semanas)

**Módulo 1 — CRM (núcleo)**
- Ficha de cliente con historial de interacciones, etiquetas y valor de vida.
- Pipeline visual (Kanban) con etapas configurables.
- Recordatorios y tareas asignables.
- Importación de contactos desde Excel/Google Contacts.

**Módulo 2 — Gestión de proyectos**
- Proyectos con hitos, entregables y fechas críticas.
- Vista "cronograma crítico" (qué bloquea qué).
- Portal de proyectos (link público con avance y aprobaciones de entregables).
- Plantillas de proyecto reutilizables (web, branding, campaña).

**Módulo 3 — Automatización de marketing**
- Flujos pre-armados: bienvenida, seguimiento post-venta, reactivación 30/60/90 días.
- Integración **WhatsApp Business Cloud API** (el canal rey en Uruguay).
- Email transaccional y campañas simples.
- Disparadores por comportamiento (no responde, abre, hace clic).

**Módulo 4 — IA de contenido**
- Generación de copy para redes, emails y landing pages en español rioplatense.
- Variantes A/B automáticas (50 versiones → test).
- Generación de placas simples para redes a partir de plantillas.

**Módulo 5 — Cobros e integración local**
- Suscripciones y cobros con **Mercado Pago** (link + recurrencia).
- Facturación electrónica vía proveedor certificado por DGI.
- Reportes de ingresos por cliente.

### 3.2 Stack técnico recomendado

| Capa | Tecnología | Motivo |
|------|-----------|--------|
| Frontend | Next.js + Tailwind | Rápido, SEO, un solo lenguaje |
| Backend | Next.js API / NestJS | Menos infraestructura al inicio |
| Base de datos | PostgreSQL (Supabase o Neon) | Multi-tenant con RLS |
| Auth | Supabase Auth / Clerk | Seguridad sin reinventar |
| WhatsApp | Meta Cloud API + proveedor BSP | Oficial y escalable |
| IA | OpenAI API (o equivalente) | Costo variable controlado |
| Pagos | Mercado Pago API | Adopción local |
| Facturación | Proveedor CFE certificado | Cumplimiento DGI |
| Infra | Vercel + Supabase | Bajo mantenimiento |

**Arquitectura multi-tenant** desde el día 1 (una base, `tenant_id` en todas las tablas). Evita reescribir todo al escalar.

### 3.3 Roadmap de 12 meses

| Trimestre | Entregas |
|-----------|----------|
| Q1 (M1–3) | MVP: CRM + proyectos + WhatsApp básico. Beta cerrada con 15 negocios. |
| Q2 (M4–6) | IA de contenido, Mercado Pago, facturación electrónica. Lanzamiento público. |
| Q3 (M7–9) | Portal del cliente, reportes, plantillas por rubro, app móvil PWA. |
| Q4 (M10–12) | Marketplace de servicios (diseño, fotografía, ads) con proveedores verificados, API pública, integraciones (Mesa, Google Business). |

---

## 4. MODELO DE NEGOCIO Y PRECIOS

### 4.1 Estructura de ingresos (4 capas)

| Fuente | Precio | Cuándo se cobra |
|--------|--------|-----------------|
| **Fee de implementación** | USD 99–199 (una vez) | Al onboarding: migración, configuración, capacitación |
| **Suscripción mensual** | USD 29 / 79 / 149 | Recurrente |
| **Proyectos de diseño y web** | Desde USD 199 (precio fijo) | Cuando el negocio contrata una web, branding o campaña |
| **Add-ons** | USD 19–49/mes | Pack de contenido IA, campañas gestionadas, reputación online |

### 4.2 Planes

| Plan | Precio/mes | Incluye | Cliente objetivo |
|------|-----------|---------|------------------|
| **Emprende** | USD 29 | 1 usuario, hasta 100 contactos, CRM + 2 flujos | Negocio unipersonal |
| **Pro** | USD 79 | 3 usuarios, 1.000 contactos, IA de contenido, 10 flujos | Pyme de 2–10 personas |
| **Negocio** | USD 149 | 10 usuarios, contactos ilimitados, portal de proyectos, reportes | Pyme consolidada |
| **Integral** | USD 249 | Plan Negocio + 2 piezas de diseño/mes + gestión de 1 campaña | Negocio que quiere delegar todo |

**Descuento por pago anual:** 2 meses gratis (mejora caja y reduce churn).

### 4.3 Palancas de monetización agresivas pero legítimas

> **Advertencia estratégica:** en un mercado chico como Montevideo, la reputación es el activo principal. Las tácticas engañosas (cargos ocultos, cancelación trabada, promesas falsas) generan churn, reseñas negativas y boicot por boca a boca. La "agresividad" rentable es comercial, no engañosa.

Palancas recomendadas:
1. **Anclaje de precios:** mostrar siempre el plan Negocio primero; el Pro parece barato.
2. **Fee de implementación no reembolsable:** filtra curiosos y cubre el costo de onboarding.
3. **Límites que obligan a subir de plan:** contactos, usuarios y flujos. El cliente crece → upgrade natural.
4. **Contratos anuales con descuento:** caja inmediata y retención.
5. **Upsell en el momento de valor:** al crear su primera campaña exitosa, ofrecer pack de contenido IA.
6. **Escasez real:** cupos limitados de onboarding asistido por mes (no falsos).
7. **Bundle "todo incluido"** con margen alto: suscripción + 2 piezas de diseño/mes.
8. **Servicios de diseño con margen alto:** cuando el negocio pide algo que no está en el plan, MKTify lo ejecuta con su red de freelancers verificados y cobra el proyecto a precio fijo con 30–40% de margen.

---

## 5. ESTRATEGIA COMERCIAL (GO-TO-MARKET)

### 5.1 Nicho de entrada

Elegir **un solo vertical** para los primeros 50 clientes: **estudios de estética y peluquerías** (alto volumen de turnos, WhatsApp intensivo, baja digitalización, ticket accesible).

Ventaja: mismos flujos, mismas plantillas, mismos argumentos → ventas repetibles y CAC bajo.

### 5.2 Embudo de adquisición

```
Contenido (Instagram/TikTok/LinkedIn)
        ↓
Diagnóstico digital gratis (15 min)
        ↓
Demo personalizada (30 min)
        ↓
Prueba de 14 días con onboarding asistido
        ↓
Cierre con fee de implementación + suscripción
```

### 5.3 Canales (orden de prioridad)

1. **Outbound por WhatsApp** a negocios del nicho (lista de 300 prospectos por mes).
2. **Contenido orgánico:** 3 posts/semana con casos reales y tips accionables.
3. **Partners:** contadores, fotógrafos, agencias de hosting, imprentas → comisión por referido (10% primer año).
4. **Google Business + reseñas:** pedir reseña a cada cliente satisfecho (prueba social local).
5. **Eventos y ferias de pymes** (Cámara de Comercio, ANDE, ferias barriales).
6. **Ads:** recién en mes 6, cuando el embudo orgánico esté probado.

### 5.4 Metas comerciales

| Métrica | Objetivo |
|---------|----------|
| Demos por semana | 10 (mes 3) → 25 (mes 12) |
| Tasa demo → cliente | ≥ 25% |
| CAC | < USD 150 |
| Payback CAC | < 4 meses |
| Churn mensual | < 5% |
| NPS | > 40 |

---

## 6. PLAN FINANCIERO

### 6.1 Inversión inicial

| Rubro | USD |
|-------|-----|
| Constitución SAS + contador (3 meses) | 700 |
| Marca y diseño de identidad | 500 |
| Desarrollo MVP (si se terceriza parte) | 4.000 – 7.000 |
| Herramientas y APIs (3 meses) | 600 |
| Marketing inicial (contenido + ads) | 1.500 |
| Colchón operativo (3 meses) | 1.500 |
| **Total** | **8.800 – 11.800** |

### 6.2 Costos operativos mensuales (año 1)

| Rubro | USD/mes |
|-------|---------|
| Infraestructura (hosting, DB, APIs IA/WhatsApp) | 150 – 400 |
| Contador | 150 |
| Herramientas (CRM propio, diseño, email) | 100 |
| Marketing | 300 – 800 |
| Sueldos (fundadores + 1 CS a partir del mes 7) | variable |
| **Fijos sin sueldos** | **~700 – 1.450** |

### 6.3 Proyección conservadora

| Mes | Cuentas | MRR (USD) | Ingresos totales* |
|-----|---------|-----------|-------------------|
| 3 | 15 (beta) | 600 | 1.200 |
| 6 | 45 | 2.100 | 4.000 |
| 9 | 90 | 4.800 | 8.500 |
| 12 | 150 | 8.200 | 14.000 |

*Incluye fees de implementación y comisiones.

**Punto de equilibrio:** mes 8–10 (con sueldos de fundadores modestos).

**Márgenes:** bruto 75–80% (costo variable de IA/WhatsApp ~15–20% del ingreso).

### 6.4 Unit economics objetivo

- ARPU: USD 55/mes
- LTV (18 meses promedio): ~USD 990
- CAC: USD 150
- **LTV/CAC: 6.6x** (sano; objetivo > 3x)

---

## 7. EQUIPO Y OPERACIONES

### 7.1 Equipo mínimo viable

| Rol | Dedicación | Cuándo |
|-----|-----------|--------|
| Fundador comercial (CEO) | Full-time | Día 1 |
| Fundador técnico (CTO) o dev senior | Full-time | Día 1 |
| Diseñador de producto + marketing | Part-time | Día 1 |
| Diseñador de proyectos (web/branding) | Part-time | Mes 2 |
| Customer Success | Full-time | Mes 7 |
| Ventas (SDR) | Full-time | Mes 10 |

### 7.2 Procesos clave a documentar desde el inicio

1. **Onboarding en 7 días:** checklist de migración, configuración de 2 flujos, capacitación de 1 hora, primer reporte.
2. **Soporte:** WhatsApp con SLA de 4 horas hábiles; base de conocimiento.
3. **Éxito del cliente:** revisión mensual de métricas (mensajes enviados, citas generadas, ventas atribuidas).
4. **Control de calidad:** plantillas aprobadas, revisión de contenido IA antes de publicar.

---

## 8. RIESGOS Y MITIGACIÓN

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Churn alto en pymes | Alto | Onboarding asistido, contratos anuales, alertas de riesgo, revisión mensual de valor |
| Dependencia de Meta/WhatsApp | Alto | Multi-canal (email, SMS), revisar políticas, tener BSP alternativo |
| Competencia global (HubSpot, Canva, Trello) | Medio | Moat local: integración Mercado Pago, WhatsApp nativo, soporte rioplatense, precio en pesos |
| Estacionalidad (enero, verano) | Medio | Planes anuales, campañas de temporada, servicios de diseño en meses flojos |
| Incumplimiento de datos personales | Alto | Política de privacidad, consentimiento explícito, registro URCDP, DPA con clientes |
| Fundadores sin rol claro | Medio | Pacto de socios, roles definidos, revisión trimestral |
| Precio bajo que no cubre soporte | Alto | Fee de implementación, límites por plan, no aceptar clientes fuera de nicho |

---

## 9. CRONOGRAMA DE 90 DÍAS (PASO A PASO)

### Semanas 1–2: Validación y formalización
- [ ] 15 entrevistas a dueños de negocios del nicho (preguntar por dolor, no por la solución).
- [ ] Definir propuesta de valor en 1 frase y precios tentativos.
- [ ] Constituir SAS, RUT, DGI, BPS, BSE, MTSS.
- [ ] Abrir cuenta bancaria empresarial.
- [ ] Registrar marca en DNPI.
- [ ] Contratar contador y proveedor de facturación electrónica.

### Semanas 3–6: Construcción del MVP
- [ ] Auth + multi-tenant + modelo de datos.
- [ ] CRM: clientes, pipeline, tareas, importación.
- [ ] Proyectos: hitos, plantillas, portal público.
- [ ] Landing page con propuesta de valor y agenda de demos.
- [ ] Identidad visual y perfiles sociales.
- [ ] 10 demos de validación (aunque el producto esté incompleto).

### Semanas 7–10: Integraciones y beta
- [ ] WhatsApp Cloud API + plantillas aprobadas.
- [ ] Flujos de automatización (bienvenida, post-venta, reactivación).
- [ ] Mercado Pago (links y suscripciones).
- [ ] Módulo IA de contenido con límites por plan.
- [ ] Onboarding de 15 negocios beta (fee reducido a cambio de feedback y caso de éxito).

### Semanas 11–14: Lanzamiento
- [ ] Iterar según feedback de beta (priorizar fricción de onboarding).
- [ ] Publicar 3 casos de éxito con métricas reales.
- [ ] Lanzamiento público con oferta de fundador (primeros 30 clientes con precio congelado).
- [ ] Activar partners (contadores, fotógrafos, hostings).
- [ ] Definir dashboard semanal: MRR, altas, bajas, activación, NPS.

---

## 10. PRIMEROS 7 DÍAS (CHECKLIST INMEDIATO)

1. **Día 1:** listar 50 negocios del nicho en Montevideo con nombre, dueño, Instagram y WhatsApp.
2. **Día 1:** escribir la propuesta de valor en una frase y el guion de entrevista (10 preguntas).
3. **Día 2:** contactar 10 negocios para entrevistas (presencial o WhatsApp).
4. **Día 2:** abrir cuenta en la plataforma de constitución de SAS y revisar requisitos.
5. **Día 3:** definir los 3 flujos de automatización que darán valor inmediato.
6. **Día 3:** elegir stack y crear repositorio + entorno de staging.
7. **Día 4:** diseñar wireframes del CRM y del portal del cliente.
8. **Día 5:** entrevistar 5 negocios; registrar citas textuales de dolor.
9. **Día 6:** ajustar propuesta y precios según lo escuchado.
10. **Día 7:** publicar landing provisional y agendar las primeras 5 demos.

---

## 11. KPIs DEL NEGOCIO (revisión semanal)

| KPI | Meta año 1 |
|-----|-----------|
| MRR | USD 8.000 (mes 12) |
| Nuevas cuentas/mes | 20 (mes 12) |
| Churn mensual | < 5% |
| Activación (primer flujo en 7 días) | > 60% |
| CAC | < USD 150 |
| NPS | > 40 |
| Margen bruto | > 75% |
| Caja (runway) | > 6 meses |

---

## 12. DECISIONES PENDIENTES (a resolver en 30 días)

1. ¿Sociedad con 1 o 2 socios? Definir roles y vesting.
2. ¿Construcción propia o tercerizada del MVP?
3. ¿Nicho inicial: estética/peluquerías o gastronomía?
4. ¿Precio en USD o UYU? (recomendado: USD con referencia en pesos)
5. ¿Incluir servicios de diseño desde el día 1 o solo en mes 3?
6. ¿Buscar capital (ANDE, ángeles) o bootstrapping?

---

*Documento vivo: revisar y actualizar al cierre de cada mes.*
