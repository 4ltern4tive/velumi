/* ============================================================
   Velumi · Demo data
   ============================================================ */
window.MKT = window.MKT || {};

MKT.data = {
  user: { name: 'Martina Gómez', business: 'Ámbar Estudio', initials: 'MG', city: 'Pocitos, Montevideo', plan: 'Pro' },

  clients: [
    { id:'c1', name:'Lucía Fernández', email:'lucia.fernandez@gmail.com', phone:'+598 99 123 456', status:'Activo', channel:'WhatsApp', tags:['VIP','Color'], last:'Hoy, 10:24', lastShort:'hace 2 h', ltv:18400, visits:14, since:'Mar 2024', avatar:'a1', notes:'Prefiere turnos de mañana. Alérgica al amoníaco. Muy fiel: viene cada 4 semanas.' },
    { id:'c2', name:'Camila Rodríguez', email:'camila.rodriguez@gmail.com', phone:'+598 98 765 432', status:'Activo', channel:'Instagram', tags:['Recurrente'], last:'Hoy, 09:12', lastShort:'hace 5 h', ltv:12600, visits:9, since:'Jul 2024', avatar:'a2', notes:'Le encanta el rubio ceniza. Reserva siempre desde Instagram.' },
    { id:'c3', name:'Sofía Martínez', email:'sofia.martinez@gmail.com', phone:'+598 91 234 567', status:'Nuevo', channel:'WhatsApp', tags:['Novia'], last:'Ayer, 18:40', lastShort:'ayer', ltv:3200, visits:1, since:'Nov 2026', avatar:'a3', notes:'Se casa en diciembre. Consultó por peinado y maquillaje para la novia y dos acompañantes.' },
    { id:'c4', name:'Valentina Pérez', email:'valen.perez@hotmail.com', phone:'+598 94 567 890', status:'Nuevo', channel:'Instagram', tags:['Color'], last:'Ayer, 12:05', lastShort:'ayer', ltv:1800, visits:1, since:'Nov 2026', avatar:'a4', notes:'Primera visita por promo de Instagram. Quiere pasar de castaño a rubio.' },
    { id:'c5', name:'Carolina Techera', email:'caro.techera@gmail.com', phone:'+598 99 876 543', status:'Activo', channel:'WhatsApp', tags:['VIP','Membresía'], last:'14 nov, 16:30', lastShort:'hace 3 días', ltv:42600, visits:31, since:'Ene 2023', avatar:'a5', notes:'Clienta de membresía anual. Viene cada 3 semanas religiosamente. Es la que más recomienda.' },
    { id:'c6', name:'Julieta Núñez', email:'julieta.nunez@gmail.com', phone:'+598 92 345 678', status:'Activo', channel:'WhatsApp', tags:['Tratamiento'], last:'13 nov, 11:00', lastShort:'hace 4 días', ltv:21400, visits:18, since:'Ago 2023', avatar:'a6', notes:'Tratamiento de nutrición capilar mensual. Sensibilidad en el cuero cabelludo.' },
    { id:'c7', name:'Florencia Bianchi', email:'flor.bianchi@gmail.com', phone:'+598 95 678 901', status:'En riesgo', channel:'Email', tags:['Alisado'], last:'12 ago, 15:20', lastShort:'hace 3 meses', ltv:9800, visits:6, since:'Feb 2024', avatar:'a7', notes:'No vuelve desde el alisado de agosto. Recibió la campaña de reactivación pero no respondió.' },
    { id:'c8', name:'Martina López', email:'martina.lopez@gmail.com', phone:'+598 99 345 678', status:'Activo', channel:'Instagram', tags:['Nutrición'], last:'12 nov, 09:45', lastShort:'hace 5 días', ltv:15200, visits:11, since:'May 2024', avatar:'a8', notes:'Muy activa en redes. Le gusta el contenido de tips capilares.' },
    { id:'c9', name:'Agustina Silva', email:'agus.silva@gmail.com', phone:'+598 93 456 789', status:'Nuevo', channel:'WhatsApp', tags:['Pack verano'], last:'11 nov, 17:10', lastShort:'hace 6 días', ltv:4100, visits:2, since:'Oct 2026', avatar:'a2', notes:'Compró el pack verano de 3 servicios. Le interesa sumar keratina.' },
    { id:'c10', name:'Natalia Borges', email:'nati.borges@gmail.com', phone:'+598 97 567 890', status:'En riesgo', channel:'WhatsApp', tags:['Plan mamá'], last:'2 ago, 10:00', lastShort:'hace 3 meses', ltv:8700, visits:5, since:'Nov 2023', avatar:'a3', notes:'Venía con el plan mamá. Dejó de responder después de cambiar de trabajo.' },
    { id:'c11', name:'Paula Sosa', email:'paula.sosa@gmail.com', phone:'+598 99 678 901', status:'Activo', channel:'Email', tags:['Maquillaje'], last:'10 nov, 14:20', lastShort:'hace 7 días', ltv:11300, visits:8, since:'Jun 2024', avatar:'a4', notes:'Maquillaje para eventos. Casamiento de su hermana en enero.' },
    { id:'c12', name:'Belén Castro', email:'belen.castro@gmail.com', phone:'+598 94 789 012', status:'Activo', channel:'WhatsApp', tags:['Facial'], last:'9 nov, 18:00', lastShort:'hace 8 días', ltv:13200, visits:10, since:'Sep 2023', avatar:'a5', notes:'Limpieza facial cada 45 días. Pidió presupuesto de tratamiento completo.' },
    { id:'c13', name:'Romina Ferreira', email:'romina.ferreira@gmail.com', phone:'+598 92 890 123', status:'Nuevo', channel:'Instagram', tags:['Keratina'], last:'8 nov, 13:30', lastShort:'hace 9 días', ltv:2900, visits:1, since:'Nov 2026', avatar:'a6', notes:'Llegó por el post de keratina. Consultó precio de alisado brasileño sin formol.' },
    { id:'c14', name:'Mariana Acosta', email:'mariana.acosta@gmail.com', phone:'+598 96 901 234', status:'Inactivo', channel:'WhatsApp', tags:['Color'], last:'15 may, 11:30', lastShort:'hace 6 meses', ltv:7400, visits:4, since:'Feb 2024', avatar:'a7', notes:'Se mudó a Maldonado. Mantuvo el contacto por WhatsApp, no volvió a agendar.' },
    { id:'c15', name:'Gimena Pintos', email:'gime.pintos@gmail.com', phone:'+598 99 012 345', status:'Activo', channel:'WhatsApp', tags:['VIP','Novia'], last:'7 nov, 16:00', lastShort:'hace 10 días', ltv:25900, visits:22, since:'Abr 2023', avatar:'a8', notes:'Se casó en marzo, vino todo el cortejo. Ahora viene cada 5 semanas.' },
    { id:'c16', name:'Diego Olivera', email:'diego.olivera@gmail.com', phone:'+598 98 123 456', status:'Activo', channel:'Presencial', tags:['Corte'], last:'6 nov, 19:00', lastShort:'hace 11 días', ltv:6200, visits:9, since:'Mar 2025', avatar:'a1', notes:'Corte cada 4 semanas. Viene después del trabajo, casi siempre sin reserva.' },
    { id:'c17', name:'Ignacio Rivas', email:'ignacio.rivas@gmail.com', phone:'+598 91 345 678', status:'Nuevo', channel:'WhatsApp', tags:['Corte'], last:'Hoy, 11:30', lastShort:'ahora', ltv:1200, visits:1, since:'Nov 2026', avatar:'a8', notes:'Primera visita hoy. Llegó por recomendación de Diego Olivera.' },
    { id:'c18', name:'Lorena Vidal', email:'lorena.vidal@gmail.com', phone:'+598 95 890 123', status:'En riesgo', channel:'Email', tags:['Color'], last:'30 jul, 10:15', lastShort:'hace 4 meses', ltv:10300, visits:5, since:'Ene 2024', avatar:'a2', notes:'Quedó disconforme con un color en julio. Ofrecer retoque sin cargo para recuperarla.' }
  ],

  stages: [
    { id:'lead', name:'Nuevo lead', color:'#1428E8' },
    { id:'contactado', name:'Contactado', color:'#00C8FF' },
    { id:'turno', name:'Turno agendado', color:'#6D4AFF' },
    { id:'realizado', name:'Servicio realizado', color:'#B86E00' },
    { id:'ganado', name:'Ganado', color:'#0E9F6E' }
  ],

  deals: [
    { id:'d1', title:'Pack novia · Sofía Martínez', client:'Sofía Martínez', amount:12400, stage:'lead', tag:'Novia', channel:'whatsapp', days:1, hot:true },
    { id:'d2', title:'Keratina · Romina Ferreira', client:'Romina Ferreira', amount:6800, stage:'lead', tag:'Tratamiento', channel:'instagram', days:2 },
    { id:'d3', title:'Color + corte · Valentina Pérez', client:'Valentina Pérez', amount:4200, stage:'lead', tag:'Color', channel:'instagram', days:3 },
    { id:'d4', title:'Plan mamá · Natalia Borges', client:'Natalia Borges', amount:5900, stage:'lead', tag:'Membresía', channel:'email', days:4, hot:true },
    { id:'d5', title:'Tratamiento facial · Belén Castro', client:'Belén Castro', amount:3900, stage:'contactado', tag:'Facial', channel:'whatsapp', days:2 },
    { id:'d6', title:'Membresía 6 cortes · Diego Olivera', client:'Diego Olivera', amount:7200, stage:'contactado', tag:'Membresía', channel:'pres', days:5 },
    { id:'d7', title:'Maquillaje evento · Paula Sosa', client:'Paula Sosa', amount:4600, stage:'contactado', tag:'Maquillaje', channel:'email', days:1 },
    { id:'d8', title:'Pack novia · Camila Rodríguez', client:'Camila Rodríguez', amount:15800, stage:'turno', tag:'Novia', channel:'instagram', days:2, hot:true },
    { id:'d9', title:'Alisado · Florencia Bianchi', client:'Florencia Bianchi', amount:8900, stage:'turno', tag:'Alisado', channel:'whatsapp', days:3 },
    { id:'d10', title:'Color premium · Mariana Acosta', client:'Mariana Acosta', amount:6400, stage:'turno', tag:'Color', channel:'whatsapp', days:6 },
    { id:'d11', title:'Nutrición capilar · Julieta Núñez', client:'Julieta Núñez', amount:5200, stage:'realizado', tag:'Tratamiento', channel:'whatsapp', days:1 },
    { id:'d12', title:'Pack verano · Agustina Silva', client:'Agustina Silva', amount:9800, stage:'realizado', tag:'Pack', channel:'instagram', days:4 },
    { id:'d13', title:'Membresía anual · Carolina Techera', client:'Carolina Techera', amount:36000, stage:'ganado', tag:'VIP', channel:'whatsapp', days:1 },
    { id:'d14', title:'Pack novia · Gimena Pintos', client:'Gimena Pintos', amount:18200, stage:'ganado', tag:'Novia', channel:'whatsapp', days:2 }
  ],

  campaigns: [
    { id:'k1', name:'Promo Día de la Madre', channels:['whatsapp','email'], status:'Activa', segment:'VIP y recurrentes', metrics:[['1.240','Enviados'],['68%','Apertura'],['18','Ventas']], revenue:96400, goalLabel:'Meta de ventas', goalText:'$ 96.400 / $ 80.000', progress:100 },
    { id:'k2', name:'Reactivación 60 días', channels:['whatsapp'], status:'Activa', segment:'320 clientas inactivas', metrics:[['320','Enviados'],['41%','Respuestas'],['9','Turnos']], revenue:28600, goalLabel:'Meta de turnos', goalText:'9 / 10 turnos', progress:90 },
    { id:'k3', name:'Bienvenida nuevas clientas', channels:['email','whatsapp'], status:'Activa', segment:'Nuevas en los últimos 7 días', metrics:[['86','Enviados'],['72%','Apertura'],['12','Ventas']], revenue:12800, goalLabel:'Meta de ventas', goalText:'$ 12.800 / $ 12.000', progress:100 },
    { id:'k4', name:'Lanzamiento keratina verano', channels:['instagram'], status:'Borrador', segment:'Público frío 18–34', metrics:[['—','Enviados'],['—','Apertura'],['—','Ventas']], revenue:0, goalLabel:'Meta de ventas', goalText:'$ 0 / $ 40.000', progress:0 },
    { id:'k5', name:'Black Friday Ámbar', channels:['whatsapp','email','instagram'], status:'Programada', segment:'Todas las clientas', metrics:[['—','Enviados'],['25 nov','Inicio'],['—','Ventas']], revenue:0, goalLabel:'Meta de ventas', goalText:'$ 0 / $ 120.000', progress:0 },
    { id:'k6', name:'Encuesta NPS post-visita', channels:['email'], status:'Pausada', segment:'Visitó hace 7 días', metrics:[['420','Enviados'],['58%','Apertura'],['—','Respuestas']], revenue:0, goalLabel:'Meta de respuestas', goalText:'58% / 60%', progress:97 }
  ],

  projects: [
    {
      id:'p1', name:'Sitio web Ámbar', client:'Ámbar Estudio', type:'Web', status:'En curso', progress:65,
      due:'28 nov 2026', provider:'Lucía Varela', providerIni:'LV', providerColor:'a2', icon:'layout', tone:'web', budget:'USD 499',
      portal:'velumi.uy/portal/ambar-web', hired:true,
      description:'Sitio de 5 secciones con reservas por WhatsApp, galería, servicios, equipo y SEO local para Pocitos.',
      milestones:[
        { label:'Brief y arquitectura', done:true },
        { label:'Diseño aprobado', done:true },
        { label:'Desarrollo de secciones', done:true, current:true },
        { label:'Contenidos y fotos', done:false },
        { label:'QA y publicación', done:false }
      ],
      deliverables:['Diseño desktop y mobile','Sitio publicado con dominio propio','Formulario conectado a WhatsApp']
    },
    {
      id:'p2', name:'Rebranding temporada verano', client:'Ámbar Estudio', type:'Branding', status:'En revisión', progress:80,
      due:'25 nov 2026', provider:'Sofía Antúnez', providerIni:'SA', providerColor:'a5', icon:'pen-tool', tone:'brand', budget:'USD 799',
      portal:'velumi.uy/portal/ambar-brand', hired:true,
      description:'Identidad de verano: paleta cálida, tipografías, plantillas para redes y aplicaciones en local.',
      milestones:[
        { label:'Investigación y moodboard', done:true },
        { label:'Paleta y tipografías', done:true },
        { label:'Aplicaciones de marca', done:true, current:true },
        { label:'Manual de marca', done:false },
        { label:'Entrega final', done:false }
      ],
      deliverables:['Manual de marca PDF','Kit de redes en Canva','Aplicaciones para local']
    },
    {
      id:'p3', name:'Campaña Black Friday', client:'Ámbar Estudio', type:'Campaña', status:'En curso', progress:35,
      due:'24 nov 2026', provider:'Martina Gómez', providerIni:'MG', providerColor:'mg', icon:'megaphone', tone:'camp', budget:'USD 199',
      portal:'velumi.uy/portal/black-friday', hired:false,
      description:'Campaña multicanal para Black Friday: WhatsApp, email e Instagram con tres segmentos y dos variantes de copy.',
      milestones:[
        { label:'Segmentación y oferta', done:true, current:true },
        { label:'Copies y creatividades', done:false },
        { label:'Aprobación de la dueña', done:false },
        { label:'Programación', done:false },
        { label:'Envío y seguimiento', done:false }
      ],
      deliverables:['3 piezas gráficas','Copies A/B','Informe de resultados']
    },
    {
      id:'p4', name:'Sesión de fotos producto', client:'Ámbar Estudio', type:'Fotografía', status:'Por comenzar', progress:10,
      due:'2 dic 2026', provider:'Federico Paz', providerIni:'FP', providerColor:'a3', icon:'camera', tone:'foto', budget:'USD 299',
      portal:'velumi.uy/portal/fotos-ambar', hired:true,
      description:'Producción de 20 fotos de producto y ambiente para redes, web y Google Business.',
      milestones:[
        { label:'Brief y referencias', done:true, current:true },
        { label:'Rodaje en el local', done:false },
        { label:'Selección y retoque', done:false },
        { label:'Entrega en alta', done:false }
      ],
      deliverables:['20 fotos editadas','Formatos para redes','Cesión de uso comercial']
    },
    {
      id:'p5', name:'Menú QR + landing', client:'Ámbar Estudio', type:'Web', status:'Completado', progress:100,
      due:'10 nov 2026', provider:'Lucía Varela', providerIni:'LV', providerColor:'a2', icon:'layout', tone:'web', budget:'USD 199',
      portal:'velumi.uy/portal/menu-qr', hired:true,
      description:'Landing de una sección con menú QR actualizable y enlace a WhatsApp para pedidos.',
      milestones:[
        { label:'Brief', done:true },
        { label:'Diseño', done:true },
        { label:'Desarrollo', done:true },
        { label:'Publicación', done:true }
      ],
      deliverables:['Landing publicada','QR imprimible','Capacitación de uso']
    }
  ],

  flows: [
    {
      id:'f1', name:'Bienvenida WhatsApp', trigger:'Nuevo cliente', status:'Activa', tone:'wa', icon:'whatsapp',
      executions:156, response:38, revenue:'$ 48.200', desc:'Saluda en 5 minutos y agenda la primera visita.',
      nodes:[
        { type:'trigger', title:'Nuevo cliente', sub:'Se crea la ficha', icon:'zap', tone:'amber' },
        { type:'wait', title:'Esperar 5 min', sub:'Para no sonar robot', icon:'clock', tone:'gray' },
        { type:'message', title:'WhatsApp bienvenida', sub:'Plantilla aprobada', icon:'whatsapp', tone:'green' },
        { type:'condition', title:'¿Respondió?', sub:'Sí / No', icon:'branch', tone:'blue' },
        { type:'action', title:'Tarea de seguimiento', sub:'Asignar a Martina', icon:'calendar', tone:'purple' }
      ],
      message:'¡Hola, {{nombre}}! 💛 Gracias por escribirnos a Ámbar Estudio. Soy Martina y te voy a acompañar en lo que necesites. ¿Querés que te pase los horarios disponibles para esta semana?'
    },
    {
      id:'f2', name:'Seguimiento post-venta', trigger:'Servicio realizado', status:'Activa', tone:'green', icon:'message',
      executions:214, response:24, revenue:'$ 62.400', desc:'Agradece, pide feedback y ofrece el próximo turno.',
      nodes:[
        { type:'trigger', title:'Servicio realizado', sub:'Al marcar atendido', icon:'zap', tone:'amber' },
        { type:'wait', title:'Esperar 24 h', sub:'Dejar descansar', icon:'clock', tone:'gray' },
        { type:'message', title:'Agradecimiento', sub:'WhatsApp + encuesta', icon:'whatsapp', tone:'green' },
        { type:'condition', title:'¿Buena reseña?', sub:'Sí / No', icon:'branch', tone:'blue' },
        { type:'action', title:'Pedir reseña Google', sub:'Si respondió bien', icon:'star', tone:'amber' }
      ],
      message:'¡Hola, {{nombre}}! Gracias por visitarnos hoy en Ámbar ✨ ¿Cómo te sentís con el resultado? Contanos con una estrellita y, si querés, te dejo agendado el próximo turno.'
    },
    {
      id:'f3', name:'Reactivación 60 días', trigger:'Sin visita hace 60 días', status:'Activa', tone:'amber', icon:'zap',
      executions:132, response:18, revenue:'$ 28.600', desc:'Ofrece un beneficio real y recupera clientas.',
      nodes:[
        { type:'trigger', title:'Sin visita 60 días', sub:'Regla automática', icon:'zap', tone:'amber' },
        { type:'condition', title:'¿Es VIP?', sub:'Sí / No', icon:'branch', tone:'blue' },
        { type:'message', title:'WhatsApp con 15% off', sub:'Segmento adecuado', icon:'whatsapp', tone:'green' },
        { type:'action', title:'Crear turno tentativo', sub:'En 48 h', icon:'calendar', tone:'purple' }
      ],
      message:'Hola, {{nombre}} 😊 Hace un tiempo no te vemos por Ámbar y te extrañamos. Te guardamos un 15% off en tu próximo servicio hasta el 30/11. ¿Te reservo un turno?'
    },
    {
      id:'f4', name:'Cumpleaños VIP', trigger:'Fecha de cumpleaños', status:'Pausada', tone:'pink', icon:'heart',
      executions:48, response:64, revenue:'$ 9.800', desc:'Saludo personalizado con regalo para clientas VIP.',
      nodes:[
        { type:'trigger', title:'Cumpleaños', sub:'Clientas VIP', icon:'zap', tone:'amber' },
        { type:'message', title:'Saludo personalizado', sub:'WhatsApp', icon:'whatsapp', tone:'green' },
        { type:'action', title:'Regalo 20% off', sub:'Válido 15 días', icon:'heart', tone:'pink' }
      ],
      message:'¡Feliz cumple, {{nombre}}! 🎉 De parte de todo Ámbar Estudio te deseamos un día hermoso. Te dejamos un 20% off para tu próximo servicio, válido por 15 días. ¡Te esperamos! 💛'
    },
    {
      id:'f5', name:'Pedido de reseña Google', trigger:'24 h después de la visita', status:'Activa', tone:'amber', icon:'star',
      executions:61, response:52, revenue:'—', desc:'Pide una reseña en el mejor momento.',
      nodes:[
        { type:'trigger', title:'24 h post-visita', sub:'Automático', icon:'zap', tone:'amber' },
        { type:'condition', title:'¿Visitó?', sub:'Sí / No', icon:'branch', tone:'blue' },
        { type:'message', title:'Pedir reseña', sub:'Link directo', icon:'message', tone:'green' }
      ],
      message:'¿Nos ayudás con una reseña, {{nombre}}? 💛 Tu opinión ayuda a que más vecinas de Pocitos conozcan Ámbar. Te dejo el link directo: g.page/ambar-estudio'
    },
    {
      id:'f6', name:'Encuesta NPS', trigger:'48 h después de la visita', status:'Borrador', tone:'gray', icon:'file',
      executions:0, response:0, revenue:'—', desc:'Medí satisfacción y detectá clientas en riesgo.',
      nodes:[
        { type:'trigger', title:'48 h post-visita', sub:'Automático', icon:'zap', tone:'amber' },
        { type:'message', title:'Encuesta de 1 pregunta', sub:'Escala 1 a 10', icon:'message', tone:'green' },
        { type:'condition', title:'Nota menor a 7', sub:'Alerta interna', icon:'branch', tone:'blue' }
      ],
      message:'Hola, {{nombre}}. ¿Del 1 al 10, cuánto recomendarías Ámbar Estudio a una amiga? Tu respuesta nos ayuda a mejorar. ¡Gracias!'
    }
  ],

  services: [
    { id:'s1', name:'Landing page express', cat:'Web', icon:'layout', price:199, priceNote:'pago único', time:'5 días hábiles', desc:'Una página que presenta tu oferta y convierte visitas en reservas por WhatsApp.', includes:['Diseño responsive de 1 sección','Copywriting con IA + revisión','Formulario y botón de WhatsApp'], rating:4.9, projects:18, badge:'Más vendido' },
    { id:'s2', name:'Sitio web 5 secciones', cat:'Web', icon:'globe', price:499, priceNote:'pago único', time:'15 días', desc:'Tu negocio con presencia profesional: servicios, equipo, galería, contacto y SEO local.', includes:['Diseño a medida y responsive','SEO local + Google Business','Hosting y dominio el primer año'], rating:4.9, projects:12, badge:'Recomendado' },
    { id:'s3', name:'Branding esencial', cat:'Branding', icon:'pen-tool', price:799, priceNote:'pago único', time:'3 semanas', desc:'Una identidad que se reconozca en el local, en redes y en cada punto de contacto.', includes:['Logo, paleta y tipografías','Manual de marca en PDF','Plantillas para redes en Canva'], rating:5.0, projects:9, badge:'' },
    { id:'s4', name:'Pack contenido 30 días', cat:'Contenido', icon:'sparkles', price:249, priceNote:'por mes', time:'mensual', desc:'Publicaciones listas para programar, con tu voz y tu estética, todos los meses.', includes:['12 placas para redes','8 copies con IA y edición','Calendario y programación'], rating:4.8, projects:26, badge:'' },
    { id:'s5', name:'Gestión de campaña', cat:'Campañas', icon:'megaphone', price:199, priceNote:'por campaña', time:'1 campaña', desc:'Armamos, lanzamos y medimos una campaña de WhatsApp, email o Instagram por vos.', includes:['Segmentación y oferta','Creatividades y variantes A/B','Informe de resultados'], rating:4.9, projects:14, badge:'' },
    { id:'s6', name:'Sesión de fotos producto', cat:'Fotografía', icon:'camera', price:299, priceNote:'pago único', time:'1 día', desc:'Fotos profesionales de tu local y tus productos, listas para redes y Google.', includes:['20 fotos editadas','Dirección de arte y styling','Cesión de uso comercial'], rating:4.7, projects:7, badge:'' }
  ],

  tasks: [
    { id:'t1', text:'Confirmar turno de Sofía — peinado de novia', meta:'Hoy 15:30', tag:'Turno', done:false },
    { id:'t2', text:'Enviar propuesta web a Lucía', meta:'Vence hoy 18:00', tag:'Proyecto', done:false, hot:true },
    { id:'t3', text:'Aprobar copy de Black Friday', meta:'Generado con IA · 2 variantes', tag:'IA', done:false },
    { id:'t4', text:'Revisar clientas en riesgo', meta:'12 contactos sin volver hace 90 días', tag:'CRM', done:false },
    { id:'t5', text:'Publicar post de keratina', meta:'Instagram · 19:00', tag:'Marketing', done:true }
  ],

  appointments: [
    { time:'10:00', client:'Lucía Fernández', svc:'Color raíz + hidratación', status:'Confirmado', channel:'whatsapp', avatar:'a1' },
    { time:'12:30', client:'Ignacio Rivas', svc:'Corte + barba', status:'Confirmado', channel:'pres', avatar:'a8' },
    { time:'15:30', client:'Sofía Martínez', svc:'Peinado de novia', status:'Pendiente', channel:'whatsapp', avatar:'a3' },
    { time:'17:00', client:'Camila Rodríguez', svc:'Manicura semipermanente', status:'Pendiente', channel:'instagram', avatar:'a2' }
  ],

  sessions: [
    { title:'Post: Keratina & verano', kind:'Instagram · tono cercano', icon:'instagram', tone:'pink', aiTone:'Cercano', time:'ayer' },
    { title:'Reactivación 60 días · v2', kind:'WhatsApp · 3 variantes', icon:'whatsapp', tone:'green', aiTone:'Profesional', time:'12 nov' },
    { title:'Newsletter Día de la Madre', kind:'Email · tono premium', icon:'mail', tone:'blue', aiTone:'Premium', time:'8 nov' }
  ]
};
