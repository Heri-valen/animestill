# OtakuTees.store 🎌

Una tienda online especializada en camisas y sacos personalizados con estampados de anime. Los usuarios pueden subir sus propias imágenes y posicionarlas en diferentes áreas de las prendas.

## 🚀 Características

### ✨ Funcionalidades Principales

- **Personalización Completa**: Los usuarios pueden subir imágenes y posicionarlas en:
  - **Camisas**: Frente y espalda
  - **Sacos**: Frente, espalda, manga izquierda y manga derecha
- **Carrito de Compras**: Gestión completa con cálculo automático de precios
- **Pasarela de Pagos**: Integración con PayU para pagos seguros
- **Panel de Administración**: Gestión de productos, precios y promociones
- **Slider Promocional**: Promociones programables en la página principal
- **Diseño Responsive**: Optimizado para dispositivos móviles

### 🎯 Características Técnicas

- **Framework**: SvelteKit
- **Base de Datos**: SQLite con Prisma ORM
- **Estilos**: Tailwind CSS
- **Autenticación**: Sistema propio con bcrypt
- **TypeScript**: Tipado estático completo

## 🛠️ Instalación

### Prerrequisitos

- Node.js (versión 20 o superior recomendada)
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Configurar la base de datos**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Visitar la aplicación**
   ```
   http://localhost:5173
   ```

## 🎨 Paleta de Colores

La aplicación utiliza una paleta inspirada en el estilo anime/otaku:

- **Otaku Dark**: `#1a1a2e` - Color principal oscuro
- **Otaku Purple**: `#16213e` - Color secundario
- **Otaku Pink**: `#ff6b6b` - Color de acento principal
- **Otaku Cyan**: `#4ecdc4` - Color complementario
- **Otaku Blue**: `#45b7d1` - Color de información
- **Otaku Green**: `#96ceb4` - Color de éxito

## 💾 Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema (clientes y administradores)
- **Product**: Productos base (camisas y sacos)
- **Stamp**: Estampados disponibles
- **Order**: Pedidos de los usuarios
- **OrderItem**: Items específicos de cada pedido
- **Promotion**: Promociones para el slider

## 🛒 Flujo de Compra

1. **Personalización**: El usuario selecciona un producto y sube imágenes
2. **Configuración**: Posiciona las imágenes en las áreas deseadas
3. **Carrito**: Agrega el producto personalizado al carrito
4. **Checkout**: Proporciona información de envío
5. **Pago**: Procesa el pago a través de PayU
6. **Confirmación**: Recibe confirmación del pedido

## 🔐 Autenticación

El sistema incluye:

- **Registro de usuarios** con validación de email
- **Login seguro** con encriptación bcrypt
- **Roles de usuario** (USER/ADMIN)
- **Sesiones persistentes**

## 💳 Integración PayU

La aplicación está preparada para integración con PayU:

- **Ambiente de prueba** configurado
- **URLs de respuesta** implementadas
- **Manejo de callbacks** para confirmación de pagos

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: Experiencia completa
- **Tablet**: Navegación adaptada
- **Mobile**: Diseño táctil optimizado

## 🚀 Despliegue

### Producción

1. **Build del proyecto**
   ```bash
   npm run build
   ```

2. **Migrar base de datos**
   ```bash
   npx prisma migrate deploy
   ```

---

**OtakuTees.store** - *Tu estilo otaku, personalizado* 🎌✨
