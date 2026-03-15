<script lang="ts">
	import { onMount } from 'svelte';

	let stamps = $state<any[]>([]);
	let loading = $state(true);
	let showModal = $state(false);

	let newStamp = $state({
		name: '',
		description: '',
		imageUrl: '',
		price: 0,
		category: ''
	});

	onMount(async () => {
		loading = false;
	});
</script>

<svelte:head>
	<title>Stamps - Admin</title>
</svelte:head>

<div class="flex justify-between items-center mb-6">
	<h1 class="text-2xl font-bold">Stamps (Estampados)</h1>
	<button 
		on:click={() => showModal = true}
		class="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium"
	>
		+ Nuevo Stamp
	</button>
</div>

<div class="bg-white rounded-lg shadow p-8 text-center">
	<div class="text-6xl mb-4">🖼️</div>
	<p class="text-gray-500">Galería de estampados</p>
	<p class="text-sm text-gray-400 mt-2">Sube imágenes de anime para usar en la personalización</p>
</div>

{#if showModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg">
			<h2 class="text-xl font-bold mb-4">Nuevo Stamp</h2>
			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium mb-1">Nombre</label>
					<input type="text" bind:value={newStamp.name} class="w-full p-2 border rounded-lg" />
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Descripción</label>
					<textarea bind:value={newStamp.description} rows="2" class="w-full p-2 border rounded-lg"></textarea>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">URL de Imagen</label>
					<input type="text" bind:value={newStamp.imageUrl} class="w-full p-2 border rounded-lg" />
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium mb-1">Precio Extra</label>
						<input type="number" bind:value={newStamp.price} step="0.01" class="w-full p-2 border rounded-lg" />
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Categoría</label>
						<input type="text" bind:value={newStamp.category} class="w-full p-2 border rounded-lg" />
					</div>
				</div>
			</div>
			<div class="flex justify-end gap-3 mt-6">
				<button on:click={() => showModal = false} class="px-4 py-2 border rounded-lg">Cancelar</button>
				<button class="px-4 py-2 bg-pink-600 text-white rounded-lg">Guardar</button>
			</div>
		</div>
	</div>
{/if}
