<script lang="ts">
	import { page } from '$app/stores';

	let collapsed = false;
	
	const menuItems = [
		{ icon: '📊', label: 'Dashboard', href: '/admin' },
		{ icon: '📦', label: 'Productos', href: '/admin/productos' },
		{ icon: '🛒', label: 'Pedidos', href: '/admin/pedidos' },
		{ icon: '👥', label: 'Clientes', href: '/admin/clientes' },
		{ icon: '🖼️', label: 'Stamps', href: '/admin/stamps' },
		{ icon: '⚙️', label: 'Configuración', href: '/admin/configuracion' }
	];

	$: currentPath = $page.url.pathname;
</script>

<div class="flex min-h-screen bg-gray-50">
	<aside class="bg-gray-900 text-white {collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col">
		<div class="p-4 flex items-center justify-between border-b border-gray-700">
			{#if !collapsed}
				<span class="font-bold text-xl">Admin</span>
			{/if}
			<button 
				on:click={() => collapsed = !collapsed}
				class="p-2 hover:bg-gray-800 rounded"
			>
				{collapsed ? '→' : '←'}
			</button>
		</div>
		
		<nav class="flex-1 mt-4">
			{#each menuItems as item}
				<a 
					href={item.href}
					class="flex items-center px-4 py-3 hover:bg-gray-800 transition-colors {currentPath === item.href ? 'bg-gray-800 border-l-4 border-pink-500' : ''}"
				>
					<span class="text-xl">{item.icon}</span>
					{#if !collapsed}
						<span class="ml-3">{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<div class="p-4 border-t border-gray-700">
			<a href="/" class="flex items-center hover:bg-gray-800 p-2 rounded">
				<span>🏠</span>
				{#if !collapsed}
					<span class="ml-3">Ver Tienda</span>
				{/if}
			</a>
		</div>
	</aside>
	
	<main class="flex-1 p-8 overflow-auto">
		<slot />
	</main>
</div>
