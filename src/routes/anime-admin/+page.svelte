<script lang="ts">
	import { onMount } from 'svelte';

	let stats = $state([
		{ label: 'Productos', value: '6', icon: '📦', color: 'blue' },
		{ label: 'Pedidos', value: '0', icon: '🛒', color: 'green' },
		{ label: 'Clientes', value: '0', icon: '👥', color: 'purple' },
		{ label: 'Ingresos', value: '$0', icon: '💰', color: 'yellow' }
	]);

	let recentOrders = $state<any[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const res = await fetch('/api/orders');
			const data = await res.json();
			recentOrders = (data.orders || []).slice(0, 5);
			stats[1].value = String(data.orders?.length || 0);
		} catch (e) {
			console.error('Failed to load stats:', e);
		} finally {
			loading = false;
		}
	});

	function getColorClass(color: string) {
		const colors: Record<string, string> = {
			blue: 'bg-blue-100 text-blue-600',
			green: 'bg-green-100 text-green-600',
			purple: 'bg-purple-100 text-purple-600',
			yellow: 'bg-yellow-100 text-yellow-600'
		};
		return colors[color] || colors.blue;
	}
</script>

<svelte:head>
	<title>Dashboard - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Dashboard</h1>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
	{#each stats as stat}
		<div class="bg-white rounded-lg shadow p-6">
			<div class="flex items-center gap-4">
				<div class="w-12 h-12 rounded-lg {getColorClass(stat.color)} flex items-center justify-center text-2xl">
					{stat.icon}
				</div>
				<div>
					<p class="text-sm text-gray-500">{stat.label}</p>
					<p class="text-2xl font-bold">{stat.value}</p>
				</div>
			</div>
		</div>
	{/each}
</div>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
	<div class="bg-white rounded-lg shadow p-6">
		<h2 class="text-lg font-semibold mb-4">Pedidos Recientes</h2>
		{#if recentOrders.length === 0}
			<p class="text-gray-500 text-center py-4">No hay pedidos todavía</p>
		{:else}
			<div class="space-y-3">
				{#each recentOrders as order}
					<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
						<div>
							<p class="font-medium">#{order.id?.slice(0, 8)}</p>
							<p class="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
						</div>
						<div class="text-right">
							<p class="font-medium">${order.total}</p>
							<span class="text-xs px-2 py-1 rounded-full bg-gray-200">{order.status}</span>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="bg-white rounded-lg shadow p-6">
		<h2 class="text-lg font-semibold mb-4">Accesos Rápidos</h2>
		<div class="grid grid-cols-2 gap-3">
			<a href="/admin/productos" class="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center">
				<div class="text-2xl mb-1">📦</div>
				<p class="text-sm font-medium">Productos</p>
			</a>
			<a href="/admin/pedidos" class="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center">
				<div class="text-2xl mb-1">🛒</div>
				<p class="text-sm font-medium">Pedidos</p>
			</a>
			<a href="/admin/stamps" class="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center">
				<div class="text-2xl mb-1">🖼️</div>
				<p class="text-sm font-medium">Stamps</p>
			</a>
			<a href="/admin/configuracion/pago" class="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition text-center">
				<div class="text-2xl mb-1">⚙️</div>
				<p class="text-sm font-medium">Pago</p>
			</a>
		</div>
	</div>
</div>
