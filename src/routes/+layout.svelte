<script lang="ts">
	import { authStore, cartStore } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	let { children, data } = $props();
	let cartItems = $state(0);
	let showDropdown = $state(false);
	let dropdownRef: HTMLDivElement;

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	onMount(() => {
		cartStore.subscribe((cart) => {
			cartItems = cart.length;
		});

		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
				showDropdown = false;
			}
		}

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<!-- Header -->
<header class="bg-otaku-dark shadow-lg">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between py-4">
			<!-- Logo -->
			<div class="flex items-center">
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="OtakuTees.store" class="h-12 w-auto" />
				</a>
			</div>

			<!-- Navigation -->
			<nav class="hidden space-x-8 md:flex">
				<a href="/" class="hover:text-otaku-pink text-white transition-colors">Inicio</a>
				<a href="/productos" class="hover:text-otaku-pink text-white transition-colors">Productos</a
				>
				<a href="/personalizar" class="hover:text-otaku-pink text-white transition-colors"
					>Personalizar</a
				>
			</nav>

			<!-- User Actions -->
			<div class="flex items-center space-x-4">
		
				<!-- User Menu -->
				<div class="flex items-center space-x-4">
					<!-- Cart -->
					<a href="/carrito" class="hover:text-otaku-pink relative text-white transition-colors">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5m0 0l1.5 8m0 0a2 2 0 104 0m0 0a2 2 0 004 0"
							/>
						</svg>
						{#if cartItems > 0}
							<span
								class="bg-otaku-pink absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
							>
								{cartItems}
							</span>
						{/if}
					</a>

					{#if data.user}
						<!-- Logged in user dropdown -->
						<div class="relative" bind:this={dropdownRef}>
							<button
								onclick={toggleDropdown}
								class="hover:text-otaku-pink flex items-center space-x-2 text-white transition-colors"
							>
								<span class="font-medium">{data.user.name || data.user.email}</span>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{#if showDropdown}
								<div
									class="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black"
								>
									<div class="py-1">
										{#if data.user.isAdmin}
											<a
												href="/anime-admin"
												class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											>
												Panel Admin
											</a>
										{/if}
										<form method="POST" action="/auth/login?/logout" use:enhance>
											<button
												type="submit"
												class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
											>
												Cerrar Sesión
											</button>
										</form>
									</div>
								</div>
							{/if}
						</div>
					{:else}
						<!-- Guest user - show login/register -->
						<div class="flex items-center space-x-2">
							<a href="/auth/login" class="hover:text-otaku-pink text-white transition-colors"
								>Login</a
							>
							<span class="text-gray-400">|</span>
							<a href="/auth/registro" class="hover:text-otaku-pink text-white transition-colors"
								>Registro</a
							>
						</div>
					{/if}
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
<footer class="bg-otaku-dark mt-16 text-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div>
				<h3 class="mb-4 text-lg font-semibold">OtakuTees.store</h3>
				<p class="text-sm text-gray-400">
					Tu tienda online de camisas y sacos personalizados con estampados de anime.
				</p>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-semibold">Productos</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li>
						<a href="/productos/camisas" class="hover:text-otaku-pink transition-colors">Camisas</a>
					</li>
					<li>
						<a href="/productos/sacos" class="hover:text-otaku-pink transition-colors">Sacos</a>
					</li>
					<li>
						<a href="/personalizar" class="hover:text-otaku-pink transition-colors">Personalizar</a>
					</li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-semibold">Soporte</h4>
				<ul class="space-y-2 text-sm text-gray-400">
					<li><a href="/ayuda" class="hover:text-otaku-pink transition-colors">Ayuda</a></li>
					<li><a href="/contacto" class="hover:text-otaku-pink transition-colors">Contacto</a></li>
				</ul>
			</div>

			<div>
				<h4 class="mb-4 text-lg font-semibold">Síguenos</h4>
				<p class="text-sm text-gray-400">Redes sociales próximamente</p>
			</div>
		</div>

		<div class="mt-8 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
			<p>&copy; 2026 OtakuTees.store. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>
