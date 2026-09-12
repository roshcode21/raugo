# RauGo Digital Studio — arquitectura del ecosistema

**Corte: 12/09/2026**

Este documento define la dirección técnica de RauGo. El objetivo no es convertir el sitio en un conjunto de páginas sueltas, sino construir una tienda de productos digitales con administración real, entrega segura, pagos, clientes, órdenes, analítica y crecimiento sin sacrificar el diseño del storefront.

## 1. Qué sistema estamos construyendo

No es únicamente un CRM. El ecosistema completo combina varias capas:

- **Storefront** — lo que ve y usa el cliente.
- **Commerce engine** — carrito, precios, promociones, pagos, órdenes, reembolsos y estados.
- **PIM / catálogo** — productos, categorías, colecciones, tags, variantes, bundles y metadatos.
- **DAM / archivos** — previews, mockups y archivos maestros descargables.
- **OMS** — gestión de órdenes, pagos, devoluciones y entrega.
- **Customer account** — historial de compras y biblioteca de descargas.
- **CMS** — textos editoriales, home, banners, páginas informativas y SEO.
- **CRM / marketing** — segmentación, newsletters y automatizaciones. Puede crecer después.
- **Analytics** — adquisición, navegación, embudo, ventas y producto.
- **Fiscal** — datos para facturación CFDI y conciliación.

## 2. Arquitectura recomendada

### Storefront

**Next.js + TypeScript**, desplegado en Vercel.

Razones:
- control visual completo;
- mobile-first real;
- excelente SEO;
- renderizado rápido;
- componentes reutilizables;
- previews automáticos por cada cambio del repositorio;
- no amarra la identidad de RauGo a una plantilla de tienda.

### Commerce / back office

**Medusa 2** como primera opción para el backend de comercio.

Medusa ya resuelve buena parte de lo difícil: catálogo, carrito, precios, promociones, clientes, órdenes y administración. Para productos digitales se agrega el módulo de archivos y fulfillment digital. Así evitamos programar desde cero lógica comercial que parece sencilla hasta que llegan reembolsos, bundles, cupones, pagos duplicados, estados incompletos y conciliaciones.

Alternativa ligera si el catálogo permanece pequeño: **Supabase + lógica custom**. Es más barato al inicio, pero nos hace responsables de construir casi todo el commerce engine.

### Base de datos

**PostgreSQL**.

Debe ser la fuente de verdad para productos, clientes, órdenes, derechos de descarga, cupones y eventos de negocio.

### Archivos digitales

**Cloudflare R2** para archivos maestros privados.

Nunca se debe publicar el ZIP/PDF/PNG maestro con una URL pública permanente. La descarga debe generarse sólo después de validar una compra y usar URLs firmadas o un endpoint de descarga que expire.

Separar:
- `public-assets` — thumbnails, mockups, imágenes para la tienda;
- `private-products` — archivos que se compran;
- `product-versions` — historial de versiones de un archivo.

### Pagos

Implementar primero **un proveedor principal** y preparar una interfaz para añadir un segundo.

Recomendación inicial:
1. **Mercado Pago** si el volumen principal está en México y queremos OXXO / ecosistema local.
2. **Stripe** si priorizamos checkout muy pulido, tarjetas, wallets y expansión internacional.
3. Añadir el segundo proveedor después de estabilizar órdenes y fulfillment.

Nunca guardar datos de tarjeta en RauGo. El proveedor de pagos debe manejar PCI y la tokenización.

### Correo transaccional

**Resend** para:
- confirmación de orden;
- pago aprobado;
- enlace de descarga;
- recuperación de acceso;
- reembolso;
- aviso de actualización de archivo.

El newsletter de marketing debe mantenerse conceptualmente separado del correo transaccional.

### Seguridad / antispam

- Cloudflare Turnstile en login, registro y formularios sensibles.
- Verificación de firma en todos los webhooks.
- Idempotencia para impedir órdenes o entregas duplicadas.
- Rate limiting en login y descargas.
- Row-level permissions / roles en back office.
- Secretos exclusivamente en variables de entorno, nunca en GitHub.

### Analítica

Inicio:
- analítica de ecommerce;
- conversión por producto;
- add-to-cart → checkout → pago;
- búsquedas sin resultado;
- productos más vistos;
- origen de tráfico;
- cupones;
- abandono.

PostHog es una opción útil si queremos eventos + funnels + session replay sin mezclarlo con la lógica transaccional.

## 3. Modelo de producto digital

Un producto no debe ser sólo `nombre + precio + archivo`.

Campos base:
- título;
- slug;
- descripción corta y larga;
- estado: draft / active / archived;
- categoría;
- colección;
- tags;
- precio y moneda;
- compare-at price opcional;
- cover;
- galería / mockups;
- tipo de archivo;
- dimensiones / páginas / formato;
- compatibilidad;
- licencia de uso;
- instrucciones;
- archivos incluidos;
- versión del archivo;
- fecha de actualización;
- productos relacionados;
- SEO title / description;
- featured;
- orden manual;
- bundle components, si aplica.

### Inventario en productos digitales

No existe stock físico salvo que queramos imponer escasez comercial. En su lugar debemos controlar:
- disponibilidad;
- fecha de lanzamiento;
- retiro de catálogo;
- cantidad máxima de ventas opcional;
- licencia;
- límite de descargas opcional;
- expiración de enlaces;
- versión del archivo;
- derecho a actualizaciones futuras.

## 4. Flujo de una compra

1. Cliente agrega producto al carrito.
2. Backend calcula precios y descuentos.
3. Se crea una orden `pending` antes del pago.
4. Se crea la sesión/preferencia con Stripe o Mercado Pago.
5. Cliente paga en el checkout seguro.
6. El proveedor manda un **webhook firmado**.
7. Backend confirma el estado consultando al proveedor y marca la orden `paid`.
8. Se generan los derechos de descarga por cada line item.
9. Se manda el email transaccional.
10. El cliente puede entrar a `Mi biblioteca` y volver a descargar según las reglas.
11. Si hay reembolso o contracargo, el derecho de descarga cambia de estado según política.

El navegador del cliente nunca debe ser la fuente de verdad para decidir que un pago fue exitoso.

## 5. Back office que necesitamos

### Dashboard
- ventas hoy / semana / mes;
- órdenes recientes;
- productos top;
- pagos fallidos;
- reembolsos;
- incidencias de descarga.

### Productos
- alta / edición / duplicado;
- borrador y publicación;
- carga de portada y galería;
- carga de archivos maestros;
- versiones;
- bundles;
- categorías / colecciones / tags;
- precios y descuentos;
- SEO.

### Órdenes
- estado comercial;
- estado del pago;
- proveedor de pago;
- reembolso total o parcial;
- reenvío de correo;
- regenerar descarga;
- notas internas;
- timeline de eventos.

### Clientes
- perfil;
- compras;
- biblioteca;
- soporte;
- reembolsos;
- consentimiento de marketing.

### Marketing
- códigos de descuento;
- campañas;
- productos destacados;
- banners;
- colecciones temporales;
- newsletter.

### Contenido
- home;
- Sobre mí;
- FAQ;
- políticas;
- bloques promocionales.

### Fiscal
- solicitud de factura;
- RFC y datos fiscales;
- relación orden ↔ CFDI;
- estado de factura;
- XML/PDF cuando exista integración.

## 6. Página / rutas objetivo

- `/` Home
- `/tienda`
- `/categoria/[slug]`
- `/producto/[slug]`
- `/carrito`
- `/checkout`
- `/gracias/[order]`
- `/cuenta`
- `/cuenta/compras`
- `/cuenta/descargas`
- `/buscar`
- `/sobre-mi`
- `/contacto`
- `/preguntas-frecuentes`
- `/licencias`
- `/privacidad`
- `/terminos`
- `/reembolsos`
- `/facturacion`

## 7. Fases

### Fase 0 — prototipo visual
Home responsive en HTML/CSS/JS para fijar composición, escala, jerarquía y comportamiento móvil.

### Fase 1 — design system + storefront real
Migrar el prototipo a componentes de Next.js. Definir tokens, tipografía, spacing, cards, botones, forms, estados y accesibilidad.

### Fase 2 — catálogo y back office
Commerce engine, productos, categorías, assets y administración.

### Fase 3 — checkout y fulfillment
Integrar primer proveedor de pago, webhooks, órdenes, emails y descarga privada.

### Fase 4 — cuentas y biblioteca
Registro/login, historial, re-descarga y actualizaciones.

### Fase 5 — fiscal + marketing + analytics
Facturación, newsletter, cupones, eventos y dashboards.

### Fase 6 — hardening
Pruebas E2E, performance, accesibilidad, backups, antifraude, errores, observabilidad y políticas.

## 8. Decisiones que faltan antes de producción

- ¿Quién es legalmente el vendedor y bajo qué RFC se cobra?
- ¿El precio mostrado incluye IVA?
- ¿Sólo México o venta internacional desde el lanzamiento?
- ¿Se requiere factura automática o sólo bajo solicitud?
- ¿Descarga ilimitada para compradores o límites?
- ¿Los compradores reciben actualizaciones futuras del archivo?
- ¿Política exacta de reembolso para bienes digitales?
- ¿Existe licencia personal, comercial o ambas?
- ¿Habrá cuentas obligatorias o compra como invitado?
- ¿Mercado Pago, Stripe o ambos al lanzamiento?

Estas decisiones afectan la base de datos y el flujo de pago, así que deben cerrarse antes de conectar producción.
