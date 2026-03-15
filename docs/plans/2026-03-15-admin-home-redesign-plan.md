# Admin Panel & Home Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a WordPress-like admin panel and modern anime-themed home page for OtakuTees.store e-commerce

**Architecture:** SvelteKit pages with component-based structure. Admin uses sidebar layout with data tables. Home uses section-based layout with animations.

**Tech Stack:** SvelteKit, Svelte 5, Tailwind CSS, TypeScript

---

## Phase 1: Admin Panel - Core

### Task 1: Create Admin Layout with Sidebar

**Files:**
- Modify: `src/routes/admin/+layout.svelte` (create)
- Modify: `src/routes/admin/+page.svelte`

**Step 1: Create admin layout**

```svelte
<!-- src/routes/admin/+layout.svelte -->
<script>
  let collapsed = false;
  const menuItems = [
    { icon: 'home', label: 'Dashboard', href: '/admin' },
    { icon: 'box', label: 'Productos', href: '/admin/productos' },
    { icon: 'shopping-cart', label: 'Pedidos', href: '/admin/pedidos' },
    { icon: 'users', label: 'Clientes', href: '/admin/clientes' },
    { icon: 'image', label: 'Stamps', href: '/admin/stamps' },
    { icon: 'settings', label: 'Configuración', href: '/admin/configuracion' }
  ];
</script>

<div class="flex min-h-screen bg-gray-50">
  <!-- Sidebar -->
  <aside class="bg-gray-900 text-white {collapsed ? 'w-16' : 'w-64'} transition-all">
    <div class="p-4 font-bold text-xl">Admin</div>
    <nav class="mt-4">
      {#each menuItems as item}
        <a href={item.href} class="block px-4 py-3 hover:bg-gray-800">
          {item.label}
        </a>
      {/each}
    </nav>
  </aside>
  
  <!-- Content -->
  <main class="flex-1 p-8">
    <slot />
  </main>
</div>
```

**Step 2: Test in browser**

Run: `npm run dev`
Navigate to: http://localhost:5173/admin

**Step 3: Commit**

```bash
git add src/routes/admin/+layout.svelte
git commit -m "feat: create admin layout with sidebar"
```

---

### Task 2: Admin Dashboard with Stats

**Files:**
- Modify: `src/routes/admin/+page.svelte`

**Step 1: Replace dashboard content**

```svelte
<script>
  const stats = [
    { label: 'Productos', value: '24', icon: 'box', color: 'blue' },
    { label: 'Pedidos', value: '156', icon: 'cart', color: 'green' },
    { label: 'Clientes', value: '89', icon: 'users', color: 'purple' },
    { label: 'Ingresos', value: '$4,320', icon: 'dollar', color: 'yellow' }
  ];
  
  const recentOrders = [
    { id: 'ORD-001', cliente: 'Juan Pérez', total: 89.99, estado: 'pendiente' },
    { id: 'ORD-002', cliente: 'Maria García', total: 145.50, estado: 'enviado' }
  ];
</script>

<div class="grid grid-cols-4 gap-6 mb-8">
  {#each stats as stat}
    <div class="bg-white rounded-lg shadow p-6">
      <div class="text-3xl font-bold">{stat.value}</div>
      <div class="text-gray-500">{stat.label}</div>
    </div>
  {/each}
</div>
```

**Step 2: Commit**

```bash
git commit -m "feat: add admin dashboard with stats"
```

---

### Task 3: Products Admin Page

**Files:**
- Create: `src/routes/admin/productos/+page.svelte`

**Step 1: Create products page**

```svelte
<script>
  let products = []; // Fetch from API
  let showModal = false;
</script>

<div class="flex justify-between mb-6">
  <h1 class="text-2xl font-bold">Productos</h1>
  <button class="bg-blue-600 text-white px-4 py-2 rounded">
    + Nuevo Producto
  </button>
</div>

<table class="w-full bg-white rounded-lg shadow">
  <thead>
    <tr class="border-b">
      <th class="p-4 text-left">Nombre</th>
      <th class="p-4 text-left">Precio</th>
      <th class="p-4 text-left">Stock</th>
      <th class="p-4 text-left">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each products as product}
      <tr class="border-b">
        <td class="p-4">{product.name}</td>
        <td class="p-4">${product.basePrice}</td>
        <td class="p-4">{product.stock || '∞'}</td>
        <td class="p-4">
          <button class="text-blue-600 mr-2">Editar</button>
          <button class="text-red-600">Eliminar</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
```

**Step 2: Commit**

```bash
git add src/routes/admin/productos/
git commit -m "feat: add products admin page"
```

---

### Task 4: Orders Admin Page

**Files:**
- Create: `src/routes/admin/pedidos/+page.svelte`

**Step 1: Create orders page**

```svelte
<script>
  let orders = [];
  const estados = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
</script>

<div class="flex justify-between mb-6">
  <h1 class="text-2xl font-bold">Pedidos</h1>
</div>

<table class="w-full bg-white rounded-lg shadow">
  <thead>
    <tr class="border-b">
      <th class="p-4 text-left">ID</th>
      <th class="p-4 text-left">Cliente</th>
      <th class="p-4 text-left">Total</th>
      <th class="p-4 text-left">Estado</th>
      <th class="p-4 text-left">Fecha</th>
    </tr>
  </thead>
  <tbody>
    {#each orders as order}
      <tr class="border-b">
        <td class="p-4">{order.id}</td>
        <td class="p-4">{order.userId}</td>
        <td class="p-4">${order.total}</td>
        <td class="p-4">
          <span class="px-2 py-1 rounded text-sm {order.status === 'pendiente' ? 'bg-yellow-100' : 'bg-green-100'}">
            {order.status}
          </span>
        </td>
        <td class="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
      </tr>
    {/each}
  </tbody>
</table>
```

**Step 2: Commit**

```bash
git add src/routes/admin/pedidos/
git commit -m "feat: add orders admin page"
```

---

### Task 5: Payment (PayU) Configuration

**Files:**
- Create: `src/routes/admin/configuracion/pago/+page.svelte`

**Step 1: Create payment settings page**

```svelte
<script>
  let config = {
    merchantId: '',
    apiKey: '',
    accountId: '',
    testMode: true
  };
</script>

<h1 class="text-2xl font-bold mb-6">Configuración de Pago</h1>

<div class="bg-white rounded-lg shadow p-6 max-w-2xl">
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">Merchant ID</label>
      <input type="text" bind:value={config.merchantId} class="w-full p-2 border rounded" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">API Key</label>
      <input type="password" bind:value={config.apiKey} class="w-full p-2 border rounded" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-2">Account ID</label>
      <input type="text" bind:value={config.accountId} class="w-full p-2 border rounded" />
    </div>
    <div class="flex items-center">
      <input type="checkbox" bind:checked={config.testMode} id="testMode" class="mr-2" />
      <label for="testMode">Modo de prueba (Sandbox)</label>
    </div>
    <button class="bg-blue-600 text-white px-4 py-2 rounded">
      Guardar Configuración
    </button>
  </div>
</div>
```

**Step 2: Commit**

```bash
git add src/routes/admin/configuracion/pago/
git commit -m "feat: add PayU configuration page"
```

---

## Phase 2: Home Redesign

### Task 6: Hero Section with Slider

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Update hero section**

```svelte
<section class="relative h-[600px] overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-800 to-red-700">
    <!-- Animated background elements -->
  </div>
  <div class="relative z-10 flex items-center justify-center h-full">
    <div class="text-center text-white">
      <h1 class="text-5xl font-bold mb-4">
        Personaliza Tu Estilo Otaku
      </h1>
      <p class="text-xl mb-8">
        Camisas, sudaderas y más con tus animes favoritos
      </p>
      <div class="flex gap-4 justify-center">
        <a href="/personalizar" class="bg-pink-500 hover:bg-pink-600 px-8 py-3 rounded-full font-bold">
          Personalizar Ahora
        </a>
        <a href="#categorias" class="bg-white text-purple-900 px-8 py-3 rounded-full font-bold">
          Ver Catálogo
        </a>
      </div>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git commit -m "feat: redesign hero section"
```

---

### Task 7: Categories Section

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Add categories**

```svelte
<section id="categorias" class="py-16 bg-gray-900">
  <h2 class="text-3xl font-bold text-center text-white mb-12">Categorías</h2>
  <div class="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
    <div class="bg-gray-800 rounded-xl p-8 text-center hover:scale-105 transition">
      <div class="text-6xl mb-4">👕</div>
      <h3 class="text-xl font-bold text-white">Camisetas</h3>
    </div>
    <div class="bg-gray-800 rounded-xl p-8 text-center hover:scale-105 transition">
      <div class="text-6xl mb-4">🧥</div>
      <h3 class="text-xl font-bold text-white">Sudaderas</h3>
    </div>
    <div class="bg-gray-800 rounded-xl p-8 text-center hover:scale-105 transition">
      <div class="text-6xl mb-4">🎒</div>
      <h3 class="text-xl font-bold text-white">Accesorios</h3>
    </div>
  </div>
</section>
```

**Step 2: Commit**

```bash
git commit -m "feat: add categories section"
```

---

### Task 8: Featured Products Section

**Files:**
- Modify: `src/routes/+page.svelte`

**Step 1: Add products grid**

```svelte
<section class="py-16">
  <h2 class="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
  <div class="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
    {#each products as product}
      <div class="bg-white rounded-lg shadow hover:shadow-lg transition">
        <div class="aspect-square bg-gray-200">
          <img src={product.images?.[0]} alt={product.name} />
        </div>
        <div class="p-4">
          <h3 class="font-bold">{product.name}</h3>
          <p class="text-pink-600 font-bold">${product.basePrice}</p>
          <a href="/personalizar?product={product.id}" 
             class="mt-2 block text-center bg-pink-500 text-white py-2 rounded">
            Personalizar
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
```

**Step 2: Commit**

```bash
git commit -m "feat: add featured products section"
```

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-03-15-admin-home-redesign-plan.md`. Two execution options:**

1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

2. **Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
