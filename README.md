# Catalogo Digital Automatizado

Boilerplate mobile-first para un catalogo digital de comercios locales, construido con Next.js App Router, React, Tailwind CSS y Supabase.

Incluye catalogo publico, carrito con pedido por WhatsApp, login de administrador y backoffice para gestionar productos con imagenes en Supabase Storage.

## Stack

- Next.js 16 con App Router
- React 19
- TypeScript
- Tailwind CSS 3
- Supabase Auth, Database y Storage

## Funcionalidades

- Catalogo publico responsive.
- Cards de producto con stock, precio ARS y consulta por WhatsApp.
- Carrito flotante con cantidades, total y confirmacion por WhatsApp.
- Login de administrador con Supabase Auth.
- Backoffice para crear, editar, eliminar y cambiar stock de productos.
- Carga de imagenes al bucket `imagenes-productos`.
- Datos persistidos en la tabla `productos`.

## Rutas

- `/`: catalogo publico.
- `/admin/login`: login del administrador.
- `/admin/dashboard`: panel de administracion.
- `/admin`: redirecciona a `/admin/dashboard`.

## Estructura principal

```text
src/app/page.tsx                    Catalogo publico
src/app/admin/login/page.tsx        Login admin
src/app/admin/dashboard/page.tsx    Backoffice
src/components/ProductCard.tsx      Card de producto
src/components/CartDrawer.tsx       Carrito flotante
src/components/AdminDashboard.tsx   Panel de administracion
src/components/ProductForm.tsx      Formulario de producto
src/components/LoginForm.tsx        Formulario de login
src/lib/supabaseClient.ts           Cliente Supabase
src/lib/productsApi.ts              API de productos y storage
```

