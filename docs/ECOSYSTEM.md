# RauGo Digital Studio — arquitectura del ecosistema

**Corte: 12/09/2026**

RauGo no necesita empezar como un “CRM gigante”. Necesita un storefront excelente y un back office de comercio digital hecho para su operación. El sistema completo combina catálogo, archivos, pagos, órdenes, clientes, descargas, contenido, marketing, analítica y facturación sin cargar desde el día uno con módulos de retail físico que no aportan valor.

## Dirección técnica recomendada

### Storefront

**Next.js + TypeScript** con diseño propio y mobile-first. El objetivo es conservar libertad visual total, SEO, performance, previews de cada cambio y componentes reutilizables.

### Backend, base de datos y administración

**Supabase / PostgreSQL** como fuente de verdad para catálogo, usuarios, órdenes, derechos de descarga, cupones, contenido y eventos de negocio.

Para RauGo esta ruta es más proporcionada que instalar desde el día uno una plataforma de comercio completa. No hay envíos físicos ni inventario tradicional y el catálogo digital puede modelarse con mucha precisión. Construiremos un `/admin` privado sólo con las funciones que RauGo realmente usa.

**Medusa 2 queda como ruta de escala**, no como dependencia obligatoria inicial. Si el catálogo, equipo, canales, promociones o reglas comerciales se vuelven mucho más complejos, su commerce engine y admin pueden incorporarse sin sacrificar el storefront.

### Archivos digitales

**Cloudflare R2** para archivos maestros privados.

Nunca publicar el ZIP/PDF/PNG comprado con una URL pública permanente. La base de datos guarda metadata y object keys; R2 guarda los bytes. La entrega usa URLs firmadas de corta duración después de validar el derecho de descarga.

Separar al menos:
- `public-assets` — thumbnails, mockups y previews;
- `private-products` — archivos comprables;
- `product-versions` — versiones históricas y actualizaciones.

### Pagos

**Stripe como proveedor inicial recomendado** por la calidad del checkout, API, webhooks y soporte para tarjetas, OXXO y métodos locales. Preparar el código con una capa de `payment_provider` para poder añadir Mercado Pago sin reescribir órdenes.

Mercado Pago sigue siendo una excelente segunda integración por familiaridad local y ecosistema mexicano. PayPal sólo se añadiría si los datos de clientes muestran demanda real.

Nunca guardar tarjetas ni datos sensibles de pago en RauGo. El PSP debe encargarse de PCI, tokenización y autenticación.

### Email

**Resend** para confirmación de orden, pago aprobado, descarga, recuperación de acceso, reembolso y actualización de producto. Marketing y correo transaccional deben conservar listas y permisos separados.

### Seguridad

- secretos sólo en variables de entorno;
- verificación criptográfica de webhooks;
- idempotencia de eventos de pago;
- Row Level Security en datos privados;
- URLs firmadas para descargas;
- rate limiting en login y descargas;
- validación MIME/tamaño de archivos al subir;
- Cloudflare Turnstile en formularios sensibles;
- log de auditoría para acciones del admin.

## Qué sistema estamos construyendo

No es sólo CRM. Las piezas reales son:

- **Storefront** — sitio público.
- **Catálogo / PIM** — productos, categorías, colecciones, tags, bundles y precios.
- **DAM** — previews y archivos maestros.
- **Commerce** — carrito, checkout, promociones, pagos y reembolsos.
- **OMS** — órdenes y estados.
- **Entitlements** — quién puede descargar qué y bajo qué reglas.
- **Customer account** — compras y biblioteca.
- **CMS** — home, banners, FAQ, páginas legales y SEO.
- **CRM / marketing** — newsletter, segmentación y campañas.
- **Analytics** — navegación, conversión y ventas.
- **Fiscal** — solicitud y relación de CFDI con la orden.

## Modelo de producto digital

Un producto no puede reducirse a `nombre + precio + archivo`.

Debe contemplar título, slug, descripción corta y larga, estado, categoría, colección, tags, precio, moneda, precio anterior opcional, cover, galería, tipo de archivo, páginas/dimensiones, compatibilidad, licencia, instrucciones, archivos incluidos, versión, fecha de actualización, relacionados, SEO, featured, orden manual y composición de bundle cuando aplique.

### Inventario digital

No hay stock físico salvo que queramos imponer un límite comercial. El “inventario” real controla disponibilidad, lanzamiento, retiro, máximo de ventas opcional, licencia, límite de descargas, vigencia del enlace, versión del archivo y derecho a futuras actualizaciones.

## Flujo de compra correcto

1. Cliente arma carrito.
2. Backend calcula precio, descuentos e impuestos aplicables.
3. RauGo crea una orden `pending`.
4. Se crea la sesión de pago en el proveedor.
5. El cliente paga fuera o dentro de un componente seguro del PSP.
6. El PSP envía un webhook firmado.
7. El backend verifica el evento y marca la orden `paid` de manera idempotente.
8. Se crean derechos de descarga para cada producto comprado.
9. Se envía el correo transaccional.
10. El cliente descarga desde un enlace temporal o desde `Mi biblioteca`.
11. Reembolsos o contracargos actualizan el derecho de descarga según la política vigente.

La redirección del navegador nunca es prueba suficiente de pago.

## Back office

### Dashboard
Ventas hoy/semana/mes, órdenes recientes, productos top, pagos fallidos, reembolsos e incidencias de descarga.

### Productos
Alta, edición, duplicado, draft/publicado, categorías, colecciones, precios, cupones, SEO, portada, galería, archivo maestro, versiones y bundles.

### Órdenes
Estado, pago, proveedor, timeline, reembolso, reenvío de email, regeneración de acceso y notas internas.

### Clientes
Perfil, compras, descargas, reembolsos, soporte y consentimiento de marketing.

### Contenido y marketing
Home, banners, productos destacados, FAQ, páginas informativas, códigos, newsletter y campañas.

### Fiscal
Solicitud de factura, RFC/datos fiscales, relación orden–CFDI, estado y XML/PDF cuando exista integración automática.

## Rutas objetivo

`/` · `/tienda` · `/categoria/[slug]` · `/producto/[slug]` · `/carrito` · `/checkout` · `/gracias/[order]` · `/cuenta` · `/cuenta/compras` · `/cuenta/descargas` · `/buscar` · `/sobre-mi` · `/contacto` · `/preguntas-frecuentes` · `/licencias` · `/privacidad` · `/terminos` · `/reembolsos` · `/facturacion` · `/admin`

## Fases

### Fase 0 — prototipo visual
Home responsive en HTML/CSS/JS para fijar jerarquía, composición y comportamiento móvil.

### Fase 1 — design system y storefront real
Migrar a Next.js, definir tokens, componentes, estados, accesibilidad y performance.

### Fase 2 — catálogo y admin
Supabase, productos, categorías, assets, versiones y administración privada.

### Fase 3 — checkout y entrega
Stripe, webhooks, órdenes, correo y descargas privadas.

### Fase 4 — cuentas
Login, historial, biblioteca y re-descarga.

### Fase 5 — fiscal, marketing y analytics
Facturación, cupones, newsletter, eventos y dashboards.

### Fase 6 — hardening
Pruebas E2E, backups, observabilidad, antifraude, accesibilidad, performance y políticas.

## Decisiones antes de producción

- vendedor legal / RFC;
- precios con o sin IVA;
- México solamente o internacional;
- factura automática o bajo solicitud;
- descarga ilimitada o limitada;
- acceso a futuras versiones;
- licencia personal/comercial;
- política de reembolso digital;
- cuenta obligatoria o guest checkout;
- métodos de pago del lanzamiento.

Estas decisiones deben cerrarse antes de conectar credenciales reales y cobrar producción.
