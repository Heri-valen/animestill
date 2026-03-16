<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	export let data;

	let collapsed = false;

	const menuItems = [
		{ icon: '📊', label: 'Dashboard', href: '/anime-admin' },
		{ icon: '📦', label: 'Productos', href: '/anime-admin/productos' },
		{ icon: '📁', label: 'Categorías', href: '/anime-admin/categorias' },
		{ icon: '🛒', label: 'Pedidos', href: '/anime-admin/pedidos' },
		{ icon: '👥', label: 'Clientes', href: '/anime-admin/clientes' },
		{ icon: '🖼️', label: 'Stamps', href: '/anime-admin/stamps' },
		{ icon: '⚙️', label: 'Configuración', href: '/anime-admin/configuracion/pago' }
	];

	$: currentPath = $page.url.pathname;
</script>

<div class="flex min-h-screen bg-gray-50">
	<aside
		class="bg-gray-900 text-white {collapsed
			? 'w-16'
			: 'w-64'} flex flex-col transition-all duration-300"
	>
		<div class="flex items-center justify-between border-b border-gray-700 p-4">
			{#if !collapsed}
				<span class="text-xl font-bold">Admin</span>
			{/if}
			<button on:click={() => (collapsed = !collapsed)} class="rounded p-2 hover:bg-gray-800">
				{collapsed ? '→' : '←'}
			</button>
		</div>

		<nav class="mt-4 flex-1">
			{#each menuItems as item}
				<a
					href={item.href}
					class="flex items-center px-4 py-3 transition-colors hover:bg-gray-800 {currentPath ===
					item.href
						? 'border-l-4 border-[#ba5258] bg-gray-800'
						: ''}"
				>
					<span class="text-xl">{item.icon}</span>
					{#if !collapsed}
						<span class="ml-3">{item.label}</span>
					{/if}
				</a>
			{/each}
		</nav>

		<!-- User Info & Logout -->
		{#if data.user}
			<div class="border-t border-gray-700 p-4">
				{#if !collapsed}
					<div class="mb-3">
						<p class="text-sm text-gray-400">Logged in as</p>
						<p class="truncate font-medium">{data.user.email}</p>
					</div>
				{/if}
				<form method="POST" action="/auth/login?/logout" use:enhance>
					<button
						type="submit"
						class="flex w-full items-center rounded p-2 text-left hover:bg-gray-800"
					>
						<span>🚪</span>
						{#if !collapsed}
							<span class="ml-3">Cerrar Sesión</span>
						{/if}
					</button>
				</form>
				<a href="/" class="mt-2 flex items-center rounded p-2 hover:bg-gray-800">
					<span>🏠</span>
					{#if !collapsed}
						<span class="ml-3">Ver Tienda</span>
					{/if}
				</a>
			</div>
		{/if}
	</aside>

	<main class="flex-1 overflow-auto p-8">
		<slot />
	</main>
</div>
