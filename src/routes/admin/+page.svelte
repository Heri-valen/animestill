<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentTab = 'products';
	let products = [
		{ id: 1, name: 'Camisa Base', type: 'SHIRT', price: 25, active: true },
		{ id: 2, name: 'Saco Base', type: 'JACKET', price: 45, active: true }
	];
	
	let promotions = [
		{ id: 1, title: '¡Personaliza tu estilo otaku!', active: true, order: 1 },
		{ id: 2, title: 'Nueva Colección', active: true, order: 2 },
		{ id: 3, title: 'Envío Gratis +$50', active: true, order: 3 }
	];
	
	let newProduct = { name: '', type: 'SHIRT', price: 0 };
	let newPromotion = { title: '', description: '', active: true };

	function addProduct() {
		if (newProduct.name && newProduct.price > 0) {
			products = [...products, {
				id: Date.now(),
				...newProduct,
				active: true
			}];
			newProduct = { name: '', type: 'SHIRT', price: 0 };
		}
	}

	function toggleProductStatus(productId: number) {
		products = products.map(p => 
			p.id === productId ? { ...p, active: !p.active } : p
		);
	}

	function addPromotion() {
		if (newPromotion.title) {
			promotions = [...promotions, {
				id: Date.now(),
				...newPromotion,
				order: promotions.length + 1
			}];
			newPromotion = { title: '', description: '', active: true };
		}
	}

	function togglePromotionStatus(promotionId: number) {
		promotions = promotions.map(p => 
			p.id === promotionId ? { ...p, active: !p.active } : p
		);
	}

	function updatePrice(productId: number, newPrice: number) {
		products = products.map(p => 
			p.id === productId ? { ...p, price: newPrice } : p
		);
	}
</script>

<svelte:head>
	<title>Panel de Administración - OtakuTees.store</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">Panel de Administración</h1>
		<p class="text-gray-600 mt-2">Gestiona productos, precios y promociones</p>
	</div>

	<!-- Tabs -->
	<div class="border-b border-gray-200 mb-8">
		<nav class="flex space-x-8">
			<button 
				class="py-2 px-1 border-b-2 {currentTab === 'products' ? 'border-otaku-pink text-otaku-pink' : 'border-transparent text-gray-500 hover:text-gray-700'}"
				on:click={() => currentTab = 'products'}
			>
				Productos
			</button>
			<button 
				class="py-2 px-1 border-b-2 {currentTab === 'promotions' ? 'border-otaku-pink text-otaku-pink' : 'border-transparent text-gray-500 hover:text-gray-700'}"
				on:click={() => currentTab = 'promotions'}
			>
				Promociones
			</button>
			<button 
				class="py-2 px-1 border-b-2 {currentTab === 'orders' ? 'border-otaku-pink text-otaku-pink' : 'border-transparent text-gray-500 hover:text-gray-700'}"
				on:click={() => currentTab = 'orders'}
			>
				Pedidos
			</button>
		</nav>
	</div>

	<!-- Products Tab -->
	{#if currentTab === 'products'}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Products List -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Productos Existentes</h2>
				<div class="space-y-4">
					{#each products as product}
						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div class="flex-1">
								<h3 class="font-medium">{product.name}</h3>
								<p class="text-sm text-gray-600">
									{product.type === 'SHIRT' ? 'Camisa' : 'Saco'} - 
									<span class="font-semibold">${product.price}</span>
								</p>
							</div>
							<div class="flex items-center space-x-2">
								<input 
									type="number" 
									value={product.price}
									on:change={(e) => updatePrice(product.id, parseFloat(e.target.value))}
									class="w-20 p-1 border rounded text-sm"
								/>
								<button
									on:click={() => toggleProductStatus(product.id)}
									class="px-3 py-1 text-xs rounded {product.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
								>
									{product.active ? 'Activo' : 'Inactivo'}
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Add New Product -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Agregar Nuevo Producto</h2>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Nombre del Producto</label>
						<input 
							type="text" 
							bind:value={newProduct.name}
							class="w-full p-3 border rounded-lg"
							placeholder="Ej: Camisa Premium"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">Tipo</label>
						<select bind:value={newProduct.type} class="w-full p-3 border rounded-lg">
							<option value="SHIRT">Camisa</option>
							<option value="JACKET">Saco</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">Precio Base ($)</label>
						<input 
							type="number" 
							bind:value={newProduct.price}
							min="0"
							step="0.01"
							class="w-full p-3 border rounded-lg"
							placeholder="25.00"
						/>
					</div>
					<button 
						on:click={addProduct}
						class="w-full bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
					>
						Agregar Producto
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Promotions Tab -->
	{#if currentTab === 'promotions'}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Promotions List -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Promociones del Slider</h2>
				<div class="space-y-4">
					{#each promotions as promotion}
						<div class="flex items-center justify-between p-4 border rounded-lg">
							<div class="flex-1">
								<h3 class="font-medium">{promotion.title}</h3>
								<p class="text-sm text-gray-600">Orden: {promotion.order}</p>
							</div>
							<div class="flex items-center space-x-2">
								<button
									on:click={() => togglePromotionStatus(promotion.id)}
									class="px-3 py-1 text-xs rounded {promotion.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}"
								>
									{promotion.active ? 'Activa' : 'Inactiva'}
								</button>
								<button class="text-gray-400 hover:text-red-600">
									<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Add New Promotion -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-4">Agregar Nueva Promoción</h2>
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Título</label>
						<input 
							type="text" 
							bind:value={newPromotion.title}
							class="w-full p-3 border rounded-lg"
							placeholder="Título de la promoción"
						/>
					</div>
					<div>
						<label class="block text-sm font-medium mb-2">Descripción</label>
						<textarea 
							bind:value={newPromotion.description}
							rows="3"
							class="w-full p-3 border rounded-lg"
							placeholder="Descripción de la promoción"
						></textarea>
					</div>
					<div class="flex items-center">
						<input 
							type="checkbox" 
							bind:checked={newPromotion.active}
							id="promotionActive"
							class="mr-2"
						/>
						<label for="promotionActive" class="text-sm font-medium">Activar inmediatamente</label>
					</div>
					<button 
						on:click={addPromotion}
						class="w-full bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
					>
						Agregar Promoción
					</button>
				</div>
			</div>
		</div>
	{/if}

	<!-- Orders Tab -->
	{#if currentTab === 'orders'}
		<div class="bg-white rounded-lg shadow p-6">
			<h2 class="text-xl font-semibold mb-4">Pedidos Recientes</h2>
			<div class="text-center py-8">
				<svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
				</svg>
				<p class="text-gray-500">No hay pedidos todavía</p>
				<p class="text-sm text-gray-400 mt-2">Los pedidos aparecerán aquí una vez que los clientes hagan compras</p>
			</div>
		</div>
	{/if}

	<!-- Quick Stats -->
	<div class="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-otaku-pink bg-opacity-10 rounded-lg">
					<svg class="w-6 h-6 text-otaku-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Productos Activos</p>
					<p class="text-2xl font-semibold text-gray-900">{products.filter(p => p.active).length}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-otaku-cyan bg-opacity-10 rounded-lg">
					<svg class="w-6 h-6 text-otaku-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Promociones Activas</p>
					<p class="text-2xl font-semibold text-gray-900">{promotions.filter(p => p.active).length}</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-otaku-blue bg-opacity-10 rounded-lg">
					<svg class="w-6 h-6 text-otaku-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Pedidos Completados</p>
					<p class="text-2xl font-semibold text-gray-900">0</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center">
				<div class="p-2 bg-otaku-green bg-opacity-10 rounded-lg">
					<svg class="w-6 h-6 text-otaku-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
					</svg>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600">Ingresos Totales</p>
					<p class="text-2xl font-semibold text-gray-900">$0.00</p>
				</div>
			</div>
		</div>
	</div>
</div>
