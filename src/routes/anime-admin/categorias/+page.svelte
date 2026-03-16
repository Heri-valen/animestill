<script lang="ts">
	import { onMount } from 'svelte';

	let categories = $state<any[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingCategory = $state<any>(null);
	let isEditing = $state(false);

	let categoryForm = $state({
		name: '',
		slug: '',
		order: 0,
		active: true
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/categorias');
			if (res.ok) {
				categories = await res.json();
			}
		} catch (e) {
			console.error('Failed to load categories:', e);
		} finally {
			loading = false;
		}
	});

	async function saveCategory() {
		try {
			let res;
			if (isEditing && editingCategory) {
				res = await fetch(`/api/categorias/${editingCategory.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(categoryForm)
				});
			} else {
				res = await fetch('/api/categorias', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(categoryForm)
				});
			}

			if (res.ok) {
				const saved = await res.json();
				if (isEditing) {
					categories = categories.map((c) => (c.id === saved.id ? saved : c));
				} else {
					categories = [...categories, saved];
				}
				closeModal();
			}
		} catch (e) {
			console.error('Failed to save category:', e);
		}
	}

	async function deleteCategory(id: string) {
		if (!confirm('¿Eliminar esta categoría?')) return;
		try {
			const res = await fetch(`/api/categorias/${id}`, { method: 'DELETE' });
			if (res.ok) {
				categories = categories.filter((c) => c.id !== id);
			}
		} catch (e) {
			console.error('Failed to delete category:', e);
		}
	}

	async function toggleActive(category: any) {
		category.active = !category.active;
		await fetch(`/api/categorias/${category.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ active: category.active })
		});
		categories = [...categories];
	}

	function openEditModal(category: any) {
		editingCategory = category;
		isEditing = true;
		categoryForm = {
			name: category.name,
			slug: category.slug,
			order: category.order || 0,
			active: category.active
		};
		showModal = true;
	}

	function openNewModal() {
		editingCategory = null;
		isEditing = false;
		categoryForm = { name: '', slug: '', order: categories.length + 1, active: true };
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCategory = null;
		isEditing = false;
	}
</script>

<svelte:head>
	<title>Categorías - Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Categorías</h1>
	<button
		onclick={openNewModal}
		class="rounded-lg bg-[#ba5258] px-4 py-2 font-medium text-white hover:bg-red-600"
	>
		+ Nueva Categoría
	</button>
</div>

{#if loading}
	<div class="py-8 text-center">Cargando...</div>
{:else if categories.length === 0}
	<div class="rounded-lg bg-white p-8 text-center shadow">
		<div class="mb-4 text-6xl">📁</div>
		<p class="text-gray-500">No hay categorías todavía</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each categories as category}
			<div class="overflow-hidden rounded-xl bg-white shadow-lg">
				<div
					class="flex h-32 items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]"
				>
					{#if category.image}
						<img src={category.image} alt={category.name} class="h-full w-full object-cover" />
					{:else}
						<span class="text-5xl">📦</span>
					{/if}
				</div>
				<div class="p-4">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-semibold">{category.name}</h3>
						<button
							onclick={() => toggleActive(category)}
							class="rounded-full px-3 py-1 text-xs font-medium {category.active
								? 'bg-green-100 text-green-800'
								: 'bg-gray-100 text-gray-800'}"
						>
							{category.active ? 'Activo' : 'Inactivo'}
						</button>
					</div>
					<p class="text-sm text-gray-500">/{category.slug}</p>
					<p class="mt-1 text-xs text-gray-400">Orden: {category.order}</p>
					<div class="mt-4 flex gap-2">
						<button
							onclick={() => openEditModal(category)}
							class="flex-1 rounded-lg bg-blue-100 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
						>
							Editar
						</button>
						<button
							onclick={() => deleteCategory(category.id)}
							class="flex-1 rounded-lg bg-red-100 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
						>
							Eliminar
						</button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-md rounded-xl bg-white p-6">
			<h2 class="mb-4 text-xl font-bold">{isEditing ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
			<div class="space-y-4">
				<div>
					<label for="cat-name" class="mb-1 block text-sm font-medium">Nombre *</label>
					<input
						id="cat-name"
						type="text"
						bind:value={categoryForm.name}
						required
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="cat-slug" class="mb-1 block text-sm font-medium">Slug (URL)</label>
					<input
						id="cat-slug"
						type="text"
						bind:value={categoryForm.slug}
						placeholder="camisas"
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div>
					<label for="cat-order" class="mb-1 block text-sm font-medium">Orden</label>
					<input
						id="cat-order"
						type="number"
						bind:value={categoryForm.order}
						class="w-full rounded-lg border p-2"
					/>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="checkbox"
						id="cat-active"
						bind:checked={categoryForm.active}
						class="h-4 w-4"
					/>
					<label for="cat-active" class="text-sm font-medium">Categoría activa</label>
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded-lg border px-4 py-2 hover:bg-gray-50"
					>Cancelar</button
				>
				<button
					onclick={saveCategory}
					class="rounded-lg bg-[#ba5258] px-4 py-2 text-white hover:bg-red-600"
				>
					{isEditing ? 'Actualizar' : 'Crear'}
				</button>
			</div>
		</div>
	</div>
{/if}
