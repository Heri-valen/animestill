<script lang="ts">
	import { onMount } from 'svelte';

	let products = $state<any[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingProduct = $state<any>(null);

	let newProduct = $state({
		name: '',
		description: '',
		basePrice: 0,
		type: 'SHIRT',
		sizes: '',
		colors: ''
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/products');
			products = await res.json();
		} catch (e) {
			console.error('Failed to load products:', e);
		} finally {
			loading = false;
		}
	});

	async function saveProduct() {
		const data = {
			...newProduct,
			sizes: JSON.stringify(newProduct.sizes.split(',').map(s => s.trim())),
			colors: JSON.stringify(newProduct.colors.split(',').map(c => c.trim()))
		};
		
		try {
			const res = await fetch('/api/products', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			});
			if (res.ok) {
				const product = await res.json();
				products = [...products, product];
				showModal = false;
				resetForm();
			}
		} catch (e) {
			console.error('Failed to save product:', e);
		}
	}

	function resetForm() {
		newProduct.name = '';
		newProduct.description = '';
		newProduct.basePrice = 0;
		newProduct.type = 'SHIRT';
		newProduct.sizes = '';
		newProduct.colors = '';
	}
</script>

<svelte:head>
	<title>Productos - Admin</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-2xl font-bold">Productos</h1>
	<button 
		on:click={() => showModal = true}
		class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium"
	>
		+ Nuevo Producto
	</button>
</div>

{#if loading}
	<div class="text-center py-8">Cargando...</div>
{:else}
	<div class="bg-white rounded-lg shadow overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each products as product}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4">{product.name}</td>
						<td class="px-6 py-4">{product.type}</td>
						<td class="px-6 py-4">${product.basePrice}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-1 text-xs rounded-full {product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
								{product.active ? 'Activo' : 'Inactivo'}
							</span>
						</td>
						<td class="px-6 py-4">
							<button class="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
							<button class="text-red-600 hover:text-red-800">Eliminar</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg">
			<h2 class="text-xl font-bold mb-4">Nuevo Producto</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Nombre</label>
					<input type="text" bind:value={newProduct.name} class="w-full p-2 border rounded-lg" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Descripción</label>
					<textarea bind:value={newProduct.description} rows="2" class="w-full p-2 border rounded-lg"></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1">Tipo</label>
						<select bind:value={newProduct.type} class="w-full p-2 border rounded-lg">
							<option value="SHIRT">Camiseta</option>
							<option value="JACKET">Sudadera</option>
						</select>
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Precio</label>
						<input type="number" bind:value={newProduct.basePrice} step="0.01" class="w-full p-2 border rounded-lg" />
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Tallas (separadas por coma)</label>
					<input type="text" bind:value={newProduct.sizes} placeholder="S, M, L, XL" class="w-full p-2 border rounded-lg" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Colores (separados por coma)</label>
					<input type="text" bind:value={newProduct.colors} placeholder="Negro, Blanco, Rojo" class="w-full p-2 border rounded-lg" />
				</div>
			</div>
			<div class="flex justify-end gap-3 mt-6">
				<button on:click={() => { showModal = false; resetForm(); }} class="px-4 py-2 border rounded-lg">Cancelar</button>
				<button on:click={saveProduct} class="px-4 py-2 bg-pink-600 text-white rounded-lg">Guardar</button>
			</div>
		</div>
	</div>
{/if}
