<script lang="ts">
	import { onMount } from 'svelte';

	let products = $state<any[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingProduct = $state<any>(null);
	let isEditing = $state(false);

	let productForm = $state({
		name: '',
		description: '',
		basePrice: 0,
		type: 'SHIRT',
		sizes: '',
		colors: '',
		active: true
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
			...productForm,
			sizes: JSON.stringify(
				productForm.sizes
					.split(',')
					.map((s: string) => s.trim())
					.filter((s: string) => s)
			),
			colors: JSON.stringify(
				productForm.colors
					.split(',')
					.map((c: string) => c.trim())
					.filter((c: string) => c)
			)
		};

		try {
			let res;
			if (isEditing && editingProduct) {
				res = await fetch(`/api/products/${editingProduct.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
			} else {
				res = await fetch('/api/products', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(data)
				});
			}

			if (res.ok) {
				const savedProduct = await res.json();
				if (isEditing && editingProduct) {
					products = products.map((p) => (p.id === savedProduct.id ? savedProduct : p));
				} else {
					products = [...products, savedProduct];
				}
				closeModal();
			}
		} catch (e) {
			console.error('Failed to save product:', e);
		}
	}

	async function deleteProduct(id: string) {
		if (!confirm('¿Estás seguro de eliminar este producto?')) return;

		try {
			const res = await fetch(`/api/products/${id}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				products = products.filter((p) => p.id !== id);
			}
		} catch (e) {
			console.error('Failed to delete product:', e);
		}
	}

	function openEditModal(product: any) {
		editingProduct = product;
		isEditing = true;
		productForm = {
			name: product.name,
			description: product.description,
			basePrice: product.basePrice,
			type: product.type,
			sizes: JSON.parse(product.sizes || '[]').join(', '),
			colors: JSON.parse(product.colors || '[]').join(', '),
			active: product.active
		};
		showModal = true;
	}

	function openNewModal() {
		editingProduct = null;
		isEditing = false;
		productForm = {
			name: '',
			description: '',
			basePrice: 0,
			type: 'SHIRT',
			sizes: '',
			colors: '',
			active: true
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProduct = null;
		isEditing = false;
	}
</script>

<svelte:head>
	<title>Productos - Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Productos</h1>
	<button
		onclick={openNewModal}
		class="rounded-lg bg-[#ba5258] px-4 py-2 font-medium text-white hover:bg-red-600"
	>
		+ Nuevo Producto
	</button>
</div>

{#if loading}
	<div class="py-8 text-center">Cargando...</div>
{:else if products.length === 0}
	<div class="rounded-lg bg-white p-8 text-center shadow">
		<div class="mb-4 text-6xl">📦</div>
		<p class="text-gray-500">No hay productos todavía</p>
		<p class="mt-2 text-sm text-gray-400">Crea tu primer producto para comenzar</p>
	</div>
{:else}
	<div class="overflow-hidden rounded-lg bg-white shadow">
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
						<td class="px-6 py-4">
							<span class="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
								{product.type === 'SHIRT' ? 'Camiseta' : 'Sudadera'}
							</span>
						</td>
						<td class="px-6 py-4 font-medium">${product.basePrice.toFixed(2)}</td>
						<td class="px-6 py-4">
							<button
								onclick={async () => {
									product.active = !product.active;
									await fetch(`/api/products/${product.id}`, {
										method: 'PUT',
										headers: { 'Content-Type': 'application/json' },
										body: JSON.stringify({ active: product.active })
									});
								}}
								class="cursor-pointer rounded-full px-2 py-1 text-xs {product.active
									? 'bg-green-100 text-green-800'
									: 'bg-gray-100 text-gray-800'} hover:opacity80"
							>
								{product.active ? 'Activo' : 'Inactivo'}
							</button>
						</td>
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<button
									onclick={() => openEditModal(product)}
									class="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
									Editar
								</button>
								<button
									onclick={() => deleteProduct(product.id)}
									class="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									Eliminar
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
		<div class="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
			<h2 class="mb-4 text-xl font-bold">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium">Nombre *</label>
					<input
						type="text"
						bind:value={productForm.name}
						required
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium">Descripción</label>
					<textarea
						bind:value={productForm.description}
						rows="2"
						class="w-full rounded-lg border p-2"
					></textarea>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="mb-1 block text-sm font-medium">Tipo</label>
						<select bind:value={productForm.type} class="w-full rounded-lg border p-2">
							<option value="SHIRT">Camiseta</option>
							<option value="JACKET">Sudadera</option>
						</select>
					</div>
					<div>
						<label class="mb-1 block text-sm font-medium">Precio *</label>
						<input
							type="number"
							bind:value={productForm.basePrice}
							step="0.01"
							min="0"
							required
							class="w-full rounded-lg border p-2"
						/>
					</div>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium">Tallas (separadas por coma)</label>
					<input
						type="text"
						bind:value={productForm.sizes}
						placeholder="S, M, L, XL"
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium">Colores (separados por coma o hex)</label>
					<input
						type="text"
						bind:value={productForm.colors}
						placeholder="Negro, Blanco, #ff0000"
						class="w-full rounded-lg border p-2"
					/>
				</div>
				{#if isEditing}
					<div class="flex items-center gap-2">
						<input type="checkbox" id="active" bind:checked={productForm.active} class="h-4 w-4" />
						<label for="active" class="text-sm font-medium">Producto activo</label>
					</div>
				{/if}
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded-lg border px-4 py-2 hover:bg-gray-50"
					>Cancelar</button
				>
				<button
					onclick={saveProduct}
					class="rounded-lg bg-[#ba5258] px-4 py-2 text-white hover:bg-red-600"
				>
					{isEditing ? 'Actualizar' : 'Crear'}
				</button>
			</div>
		</div>
	</div>
{/if}
