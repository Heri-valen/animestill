<script lang="ts">
	import { onMount } from 'svelte';

	let orders = $state<any[]>([]);
	let loading = $state(true);

	const estados = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

	onMount(async () => {
		try {
			const res = await fetch('/api/orders');
			const data = await res.json();
			orders = data.orders || [];
		} catch (e) {
			console.error('Failed to load orders:', e);
		} finally {
			loading = false;
		}
	});

	function getEstadoColor(estado: string) {
		const colors: Record<string, string> = {
			PENDING: 'bg-yellow-100 text-yellow-800',
			PROCESSING: 'bg-blue-100 text-blue-800',
			SHIPPED: 'bg-purple-100 text-purple-800',
			DELIVERED: 'bg-green-100 text-green-800',
			CANCELLED: 'bg-red-100 text-red-800'
		};
		return colors[estado] || 'bg-gray-100 text-gray-800';
	}
</script>

<svelte:head>
	<title>Pedidos - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Pedidos</h1>

{#if loading}
	<div class="text-center py-8">Cargando...</div>
{:else if orders.length === 0}
	<div class="bg-white rounded-lg shadow p-8 text-center">
		<div class="text-6xl mb-4">📦</div>
		<p class="text-gray-500">No hay pedidos todavía</p>
	</div>
{:else}
	<div class="bg-white rounded-lg shadow overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each orders as order}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
						<td class="px-6 py-4">{order.userId?.slice(0, 8) || 'Guest'}</td>
						<td class="px-6 py-4 font-medium">${order.total}</td>
						<td class="px-6 py-4">
							<span class="px-2 py-1 text-xs rounded-full {getEstadoColor(order.status)}">
								{order.status}
							</span>
						</td>
						<td class="px-6 py-4 text-gray-500">
							{new Date(order.createdAt).toLocaleDateString()}
						</td>
						<td class="px-6 py-4">
							<button class="text-blue-600 hover:text-blue-800">Ver Detalles</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
