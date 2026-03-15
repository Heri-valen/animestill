# Diseño de Implementación del Backend para OtakuTees.store

## Objetivo

Implementar las funcionalidades críticas de backend faltantes: API, persistencia de base de datos e integración de pagos real con PayU.

## Stack Tecnológico

- **Frontend**: SvelteKit, TypeScript, Tailwind CSS (existente)
- **Backend**: API Routes de SvelteKit (server-side)
- **Base de datos**: SQLite con Prisma (existente)
- **Autenticación**: Session-based con cookies (SvelteKit Auth)
- **Pagos**: PayU Integration SDK

## Arquitectura

### 1. Base de Datos (Prisma)

Mantener el esquema existente en `prisma/schema.prisma` pero asegurar relaciones completas:

- **User**: Auth data, dirección de envío
- **Product**: Productos existentes + personalización
- **Order**: Pedidos con relación a User y Product
- **CartItem**: Items del carrito (persistente por sesión/usuario)

### 2. API Routes

Crear rutas de API en `src/routes/api/`:

| Ruta                 | Método          | Función                     |
| -------------------- | --------------- | --------------------------- |
| `/api/products`      | GET             | Listar productos            |
| `/api/products/[id]` | GET             | Obtener producto específico |
| `/api/cart`          | GET/POST/DELETE | Gestión del carrito         |
| `/api/orders`        | POST            | Crear pedido                |
| `/api/orders/[id]`   | GET             | Consultar pedido            |
| `/api/auth/register` | POST            | Registro usuario            |
| `/api/auth/login`    | POST            | Login usuario               |
| `/api/auth/logout`   | POST            | Cerrar sesión               |

### 3. Integración de Pagos (PayU)

- Usar SDK oficial de PayU
- Implementar flujo de checkout completo:
  1. Crear orden en PayU
  2. Redirigir a página de pago de PayU
  3. Callback de confirmación
  4. Actualización de estado en base de datos

### 4. Frontend Updates

- **Cart Store**: Actualizar para usar API en lugar de memoria local
- **Auth Store**: Conectar con endpoints de autenticación
- **Personalización**: Persistir datos de customización en base de datos

## Implementación por Fases

### Fase 1: Base de Datos y API Básica (Día 1)

1. Actualizar esquema Prisma con relaciones
2. Crear seed data de productos
3. Implementar API de productos
4. Testear endpoints con Postman/Thunder Client

### Fase 2: Autenticación y Carrito Persistente (Día 2)

1. Implementar endpoints de auth (registro/login)
2. Conectar stores de frontend con API
3. Persistir carrito en base de datos por sesión/usuario

### Fase 3: Integración de Pagos (Día 3)

1. Configurar cuenta de PayU
2. Implementar flujo de checkout
3. Integrar confirmación de pagos
4. Actualizar estado de órdenes

## Consideraciones de Seguridad

- Sanitizar inputs de usuario
- Validar permisos en endpoints protegidos
- No exponer datos sensibles en frontend
- HTTPS en producción

## Pruebas

- Testear endpoints API con Postman
- Verificar integración con PayU en modo sandbox
- Testear flujos completos de compra

## Próximos Pasos

Una vez aprobado este diseño, proceder con la creación del plan de implementación detallado.
