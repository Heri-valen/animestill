<script lang="ts">
	import { cartStore, removeFromCart, clearCart } from '$lib/stores/auth';
	import { onMount } from 'svelte';

	let cartItems: any[] = [];
	let total = 0;

	onMount(() => {
		cartStore.subscribe((items) => {
			cartItems = items;
			total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
		});
	});

	function updateQuantity(itemId: string, newQuantity: number) {
		if (newQuantity <= 0) {
			removeFromCart(itemId);
		} else {
			cartStore.update((items) =>
				items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
			);
		}
	}

	function proceedToPayment() {
		if (cartItems.length === 0) {
			alert('Tu carrito está vacío');
			return;
		}
		window.location.href = '/pago';
	}
</script>

<svelte:head>
	<title>Carrito de Compras - OtakuTees.store</title>
</svelte:head>

<div class="bg-gray-50">
	<div class="relative overflow-hidden bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
		<div class="absolute inset-0 opacity-30">
			<div class="absolute top-10 left-10 animate-pulse text-6xl">🛒</div>
			<div class="absolute top-20 right-20 animate-pulse text-5xl" style="animation-delay: 0.5s">
				🛍️
			</div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="mb-4 text-4xl font-extrabold text-white sm:text-5xl">
					<span
						class="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
					>
						Tu Carrito
					</span>
				</h1>
				<p class="mx-auto max-w-2xl text-lg text-gray-300">
					Revisa tus productos personalizados antes de proceder al pago
				</p>
			</div>
		</div>

		<div
			class="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
		></div>
	</div>
</div>

<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	{#if cartItems.length === 0}
		<div class="py-16 text-center">
			<svg
				class="mx-auto mb-4 h-24 w-24 text-gray-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5m0 0l1.5 8m0 0a2 2 0 104 0m0 0a2 2 0 004 0"
				/>
			</svg>
			<h2 class="mb-2 text-2xl font-bold text-gray-600">Tu carrito está vacío</h2>
			<p class="mb-8 text-gray-500">Agrega algunos productos para comenzar tu compra</p>
			<a
				href="/personalizar"
				class="bg-otaku-pink rounded-lg px-6 py-3 font-bold text-white transition-colors hover:bg-red-600"
			>
				Personalizar Productos
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Cart Items -->
			<div class="space-y-4 lg:col-span-2">
				{#each cartItems as item}
					<div class="overflow-hidden rounded-xl bg-white shadow-lg">
						<div class="flex flex-col md:flex-row">
							<!-- Product Preview -->
							<div class="relative h-48 w-full flex-shrink-0 bg-gray-100 md:h-auto md:w-48">
								<div class="absolute inset-0 flex items-center justify-center">
									{#if item.productType === 'shirt'}
										<svg viewBox="0 0 200 260" class="h-full w-full" fill="none">
											<path
												d="M40 30 L70 30 L85 60 L115 60 L130 30 L160 30 L170 80 L155 90 L145 70 L145 240 L55 240 L55 70 L45 90 L30 80 Z"
												fill={item.color || '#ffffff'}
												stroke="rgba(0,0,0,0.3)"
												stroke-width="2"
											/>
										</svg>
									{:else}
										<svg viewBox="0 0 220 280" class="h-full w-full" fill="none">
											<path
												d="M30 20 L60 20 L75 50 L100 35 L125 50 L140 20 L170 20 L185 80 L165 95 L160 70 L160 260 L60 260 L60 70 L55 95 L35 80 Z"
												fill={item.color || '#ffffff'}
												stroke="rgba(0,0,0,0.3)"
												stroke-width="2"
											/>
										</svg>
									{/if}
								</div>
								{#if item.customization?.front?.image}
									<img
										src={item.customization.front.image}
										alt="Frente"
										class="pointer-events-none absolute"
										style="left: 50%; top: 40%; width: 35%; transform: translate(-50%, -50%);"
									/>
								{/if}
								{#if item.customization?.back?.image}
									<img
										src={item.customization.back.image}
										alt="Espalda"
										class="pointer-events-none absolute"
										style="left: 50%; top: 40%; width: 35%; transform: translate(-50%, -50%);"
									/>
								{/if}
							</div>

							<!-- Item Details -->
							<div class="flex-1 p-6">
								<div class="mb-4 flex items-start justify-between">
									<div>
										<div class="mb-1 flex items-center gap-2">
											<span class="text-2xl">{item.productType === 'shirt' ? '👕' : '🧥'}</span>
											<h3 class="text-lg font-semibold">
												{item.productType === 'shirt' ? 'Camisa' : 'Saco'} Personalizada
											</h3>
										</div>
										<p class="text-gray-600">
											Talla: <span class="font-medium">{item.size}</span> | Color:
											<span class="font-medium" style="color: {item.color}">●</span>
										</p>

										{#if item.customization}
											<div class="mt-3">
												<p class="mb-2 text-sm font-medium text-gray-700">Personalizaciones:</p>
												<div class="flex flex-wrap gap-2">
													{#if item.customization.front?.image}
														<div
															class="flex items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-2 py-1 text-xs text-white"
														>
															<img
																src={item.customization.front.image}
																alt="Frente"
																class="h-4 w-4 rounded-full object-cover"
															/>
															Frente
														</div>
													{/if}
													{#if item.customization.back?.image}
														<div
															class="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 px-2 py-1 text-xs text-white"
														>
															<img
																src={item.customization.back.image}
																alt="Espalda"
																class="h-4 w-4 rounded-full object-cover"
															/>
															Espalda
														</div>
													{/if}
													{#if item.customization.leftSleeve?.image}
														<div
															class="flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-2 py-1 text-xs text-white"
														>
															<img
																src={item.customization.leftSleeve.image}
																alt="Manga Izq"
																class="h-4 w-4 rounded-full object-cover"
															/>
															Manga Izq
														</div>
													{/if}
													{#if item.customization.rightSleeve?.image}
														<div
															class="flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-1 text-xs text-white"
														>
															<img
																src={item.customization.rightSleeve.image}
																alt="Manga Der"
																class="h-4 w-4 rounded-full object-cover"
															/>
															Manga Der
														</div>
													{/if}
												</div>
											</div>
										{/if}
									</div>

									<button
										onclick={() => removeFromCart(item.id)}
										class="p-2 text-red-500 hover:text-red-700"
									>
										<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
											/>
										</svg>
									</button>
								</div>

								<div class="flex items-center justify-between">
									<div class="flex items-center space-x-3">
										<label class="text-sm font-medium">Cantidad:</label>
										<div class="flex items-center rounded-lg border">
											<button
												onclick={() => updateQuantity(item.id, item.quantity - 1)}
												class="rounded-l-lg px-3 py-1 hover:bg-gray-100"
											>
												-
											</button>
											<span class="border-x bg-gray-50 px-4 py-1">{item.quantity}</span>
											<button
												onclick={() => updateQuantity(item.id, item.quantity + 1)}
												class="rounded-r-lg px-3 py-1 hover:bg-gray-100"
											>
												+
											</button>
										</div>
									</div>

									<div class="text-right">
										<p class="text-xl font-bold text-[#ba5258]">
											${(item.price * item.quantity).toFixed(2)}
										</p>
										<p class="text-sm text-gray-500">${item.price} c/u</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="sticky top-4 rounded-lg bg-white p-6 shadow">
					<h2 class="mb-4 text-xl font-semibold">Resumen del Pedido</h2>

					<div class="mb-4 space-y-2">
						<div class="flex justify-between">
							<span>Subtotal:</span>
							<span>${total.toFixed(2)}</span>
						</div>
						<div class="flex justify-between">
							<span>Envío:</span>
							<span>{total >= 50 ? 'Gratis' : '$5.00'}</span>
						</div>
						<div class="flex justify-between">
							<span>Impuestos:</span>
							<span>${(total * 0.1).toFixed(2)}</span>
						</div>
					</div>

					<div class="mb-6 border-t pt-4">
						<div class="flex justify-between text-lg font-bold">
							<span>Total:</span>
							<span class="text-otaku-pink">
								${(total + (total >= 50 ? 0 : 5) + total * 0.1).toFixed(2)}
							</span>
						</div>
					</div>

					{#if total >= 50}
						<div class="mb-4 rounded border border-green-300 bg-green-100 p-3">
							<p class="text-sm font-medium text-green-800">
								🎉 ¡Felicitaciones! Tienes envío gratis
							</p>
						</div>
					{:else}
						<div class="mb-4 rounded border border-yellow-300 bg-yellow-100 p-3">
							<p class="text-sm text-yellow-800">
								Agrega ${(50 - total).toFixed(2)} más para envío gratis
							</p>
						</div>
					{/if}

					<button
						onclick={proceedToPayment}
						class="bg-otaku-pink mb-3 w-full rounded-lg px-4 py-3 font-bold text-white transition-colors hover:bg-red-600"
					>
						Proceder al Pago
					</button>

					<button
						onclick={() => clearCart()}
						class="w-full rounded bg-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-400"
					>
						Vaciar Carrito
					</button>

					<div class="mt-6">
						<a
							href="/personalizar"
							class="text-otaku-pink block text-center font-medium hover:text-red-600"
						>
							← Continuar Comprando
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
