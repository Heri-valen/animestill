<script lang="ts">
	import { authStore, cartStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let { children } = $props();
	let cartItems = 0;

	onMount(() => {
		cartStore.subscribe(cart => {
			cartItems = cart.length;
		});
	});
</script>

<!-- Header -->
<header class="bg-otaku-dark shadow-lg">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center py-4">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="OtakuTees.store" class="h-12 w-auto" />
				</a>
			</div>

			<!-- Navigation -->
			<nav class="hidden md:flex space-x-8">
				<a href="/" class="text-white hover:text-otaku-pink transition-colors">Inicio</a>
				<a href="/productos" class="text-white hover:text-otaku-pink transition-colors">Productos</a>
				<a href="/personalizar" class="text-white hover:text-otaku-pink transition-colors">Personalizar</a>
			</nav>

			<!-- User Actions -->
			<div class="flex items-center space-x-4">
				<!-- Cart -->
				<a href="/carrito" class="relative text-white hover:text-otaku-pink transition-colors">
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5m0 0l1.5 8m0 0a2 2 0 104 0m0 0a2 2 0 004 0"/>
					</svg>
					{#if cartItems > 0}
						<span class="absolute -top-2 -right-2 bg-otaku-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
							{cartItems}
						</span>
					{/if}
				</a>
				
				<!-- User Menu -->
				<div class="flex items-center space-x-2">
					<a href="/login" class="text-white hover:text-otaku-pink transition-colors">Login</a>
					<span class="text-gray-400">|</span>
					<a href="/registro" class="text-white hover:text-otaku-pink transition-colors">Registro</a>
				</div>
			</div>
		</div>
	</div>
</header>

<!-- Main Content -->
<main class="min-h-screen">
	{@render children?.()}
</main>

<!-- Footer -->
<footer class="bg-otaku-dark text-white mt-16">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<div>
				<h3 class="text-lg font-semibold mb-4">OtakuTees.store</h3>
				<p class="text-gray-400 text-sm">
					Tu tienda online de camisas y sacos personalizados con estampados de anime.
				</p>
			</div>
			
			<div>
				<h4 class="text-lg font-semibold mb-4">Productos</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li><a href="/productos/camisas" class="hover:text-otaku-pink transition-colors">Camisas</a></li>
					<li><a href="/productos/sacos" class="hover:text-otaku-pink transition-colors">Sacos</a></li>
					<li><a href="/personalizar" class="hover:text-otaku-pink transition-colors">Personalizar</a></li>
				</ul>
			</div>
			
			<div>
				<h4 class="text-lg font-semibold mb-4">Soporte</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li><a href="/ayuda" class="hover:text-otaku-pink transition-colors">Ayuda</a></li>
					<li><a href="/contacto" class="hover:text-otaku-pink transition-colors">Contacto</a></li>
				</ul>
			</div>
			
			<div>
				<h4 class="text-lg font-semibold mb-4">Síguenos</h4>
				<p class="text-gray-400 text-sm">Redes sociales próximamente</p>
			</div>
		</div>
		
		<div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
			<p>&copy; 2024 OtakuTees.store. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>
