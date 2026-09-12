# RauGo Digital Studio

Tienda propia de productos digitales. El repositorio arranca con un prototipo responsive del Home basado en la dirección visual aprobada y servirá como base para el storefront y el ecosistema de comercio.

## Preview inmediato

https://raw.githack.com/roshcode21/raugo/main/index.html

> Este preview usa raw.githack únicamente para revisión durante desarrollo. Producción deberá desplegarse en un host real con dominio propio.

## Estado actual

- Home responsive desktop / tablet / mobile.
- Navegación móvil.
- Buscador visual de muestra.
- Cards de categorías y productos.
- Favoritos de muestra.
- Newsletter de muestra.
- Sin checkout ni backend todavía.
- Sin archivos de producto reales todavía.

## Importante sobre los visuales

La captura de referencia sirve para fijar dirección de arte, jerarquía y composición. En este primer prototipo las ilustraciones son construidas con CSS/SVG y no se extrajeron imágenes raster de la captura. Para una implementación final necesitamos los assets originales de RauGo: logo, hero, mockups de producto, ilustraciones de categorías, íconos y cualquier textura.

## Arquitectura

Ver [`docs/ECOSYSTEM.md`](docs/ECOSYSTEM.md).

## Desarrollo local

No requiere build en esta fase. Abre `index.html` con un servidor local simple para evitar diferencias de navegador.

Más adelante el storefront migrará a Next.js + TypeScript y el comercio se conectará a un backend real.
