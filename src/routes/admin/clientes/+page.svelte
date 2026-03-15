<script lang="ts">
	import { onMount } from 'svelte';

	let customers = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		loading = false;
	});
</script>

<svelte:head>
	<title>Clientes - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Clientes</h1>

<div class="bg-white rounded-lg shadow p-8 text-center">
	<div class="text-6xl mb-4">👥</div>
	<p class="text-gray-500">Gestión de clientes</p>
	<p class="text-sm text-gray-400 mt-2">Los clientes se registrarán automáticamente al hacer compras</p>
</div>
