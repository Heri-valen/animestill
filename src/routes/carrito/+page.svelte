<script lang="ts">
	import { cartStore, removeFromCart, clearCart } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	
	let cartItems: any[] = [];
	let total = 0;

	onMount(() => {
		cartStore.subscribe(items => {
			cartItems = items;
			total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
		});
	});

	function updateQuantity(itemId: string, newQuantity: number) {
		if (newQuantity <= 0) {
			removeFromCart(itemId);
		} else {
			cartStore.update(items => 
				items.map(item => 
					item.id === itemId ? { ...item, quantity: newQuantity } : item
				)
			);
		}
	}

	function proceedToPayment() {
		if (cartItems.length === 0) {
			alert('Tu carrito está vacío');
			return;
		}
		// Redirect to payment
		window.location.href = '/pago';
	}
</script>

<svelte:head>
	<title>Carrito de Compras - OtakuTees.store</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Carrito de Compras</h1>

	{#if cartItems.length === 0}
		<div class="text-center py-16">
			<svg class="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5m0 0l1.5 8m0 0a2 2 0 104 0m0 0a2 2 0 004 0"/>
			</svg>
			<h2 class="text-2xl font-bold text-gray-600 mb-2">Tu carrito está vacío</h2>
			<p class="text-gray-500 mb-8">Agrega algunos productos para comenzar tu compra</p>
			<a href="/personalizar" class="bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
				Personalizar Productos
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Cart Items -->
			<div class="lg:col-span-2 space-y-4">
				{#each cartItems as item}
					<div class="bg-white rounded-lg shadow p-6">
						<div class="flex justify-between items-start mb-4">
							<div class="flex-1">
								<h3 class="text-lg font-semibold">
									{item.productType === 'shirt' ? 'Camisa' : 'Saco'} Personalizada
								</h3>
								<p class="text-gray-600">
									Talla: {item.size} | Color: {item.color}
								</p>
								
								<!-- Customization Preview -->
								{#if item.customization}
									<div class="mt-2">
										<p class="text-sm font-medium text-gray-700">Personalizaciones:</p>
										<div class="flex flex-wrap gap-2 mt-1">
											{#if item.customization.front?.image}
												<span class="px-2 py-1 bg-otaku-cyan text-white text-xs rounded">Frente</span>
											{/if}
											{#if item.customization.back?.image}
												<span class="px-2 py-1 bg-otaku-cyan text-white text-xs rounded">Espalda</span>
											{/if}
											{#if item.customization.leftSleeve?.image}
												<span class="px-2 py-1 bg-otaku-cyan text-white text-xs rounded">Manga Izq</span>
											{/if}
											{#if item.customization.rightSleeve?.image}
												<span class="px-2 py-1 bg-otaku-cyan text-white text-xs rounded">Manga Der</span>
											{/if}
										</div>
									</div>
								{/if}
							</div>
							
							<button 
								on:click={() => removeFromCart(item.id)}
								class="text-red-500 hover:text-red-700 ml-4"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
								</svg>
							</button>
						</div>

						<div class="flex justify-between items-center">
							<div class="flex items-center space-x-3">
								<label class="text-sm font-medium">Cantidad:</label>
								<div class="flex items-center border rounded">
									<button 
										on:click={() => updateQuantity(item.id, item.quantity - 1)}
										class="px-3 py-1 hover:bg-gray-100"
									>
										-
									</button>
									<span class="px-3 py-1 border-x">{item.quantity}</span>
									<button 
										on:click={() => updateQuantity(item.id, item.quantity + 1)}
										class="px-3 py-1 hover:bg-gray-100"
									>
										+
									</button>
								</div>
							</div>
							
							<div class="text-right">
								<p class="text-lg font-bold text-otaku-pink">${(item.price * item.quantity).toFixed(2)}</p>
								<p class="text-sm text-gray-500">${item.price} c/u</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Order Summary -->
			<div class="lg:col-span-1">
				<div class="bg-white rounded-lg shadow p-6 sticky top-4">
					<h2 class="text-xl font-semibold mb-4">Resumen del Pedido</h2>
					
					<div class="space-y-2 mb-4">
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
					
					<div class="border-t pt-4 mb-6">
						<div class="flex justify-between font-bold text-lg">
							<span>Total:</span>
							<span class="text-otaku-pink">
								${(total + (total >= 50 ? 0 : 5) + (total * 0.1)).toFixed(2)}
							</span>
						</div>
					</div>

					{#if total >= 50}
						<div class="bg-green-100 border border-green-300 rounded p-3 mb-4">
							<p class="text-green-800 text-sm font-medium">
								🎉 ¡Felicitaciones! Tienes envío gratis
							</p>
						</div>
					{:else}
						<div class="bg-yellow-100 border border-yellow-300 rounded p-3 mb-4">
							<p class="text-yellow-800 text-sm">
								Agrega ${(50 - total).toFixed(2)} más para envío gratis
							</p>
						</div>
					{/if}

					<button 
						on:click={proceedToPayment}
						class="w-full bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors mb-3"
					>
						Proceder al Pago
					</button>
					
					<button 
						on:click={() => clearCart()}
						class="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
					>
						Vaciar Carrito
					</button>
					
					<div class="mt-6">
						<a href="/personalizar" class="block text-center text-otaku-pink hover:text-red-600 font-medium">
							← Continuar Comprando
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
