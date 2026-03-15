<script lang="ts">
	import { cartStore, clearCart } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	
	let cartItems: any[] = [];
	let total = 0;
	let paymentData = {
		email: '',
		name: '',
		phone: '',
		address: '',
		city: '',
		country: 'Colombia'
	};
	let processing = false;

	onMount(() => {
		cartStore.subscribe(items => {
			cartItems = items;
			total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
		});
	});

	function calculateFinalTotal() {
		const shipping = total >= 50 ? 0 : 5;
		const tax = total * 0.1;
		return total + shipping + tax;
	}

	async function processPayment() {
		if (cartItems.length === 0) {
			alert('Tu carrito está vacío');
			return;
		}

		if (!paymentData.email || !paymentData.name || !paymentData.address) {
			alert('Por favor completa todos los campos obligatorios');
			return;
		}

		processing = true;

		try {
			// Simular integración con PayU
			// En una implementación real, aquí crearías la transacción con PayU
			const payuData = {
				merchantId: '508029', // ID de prueba de PayU
				accountId: '512321',  // Account ID de prueba
				description: `Compra OtakuTees - ${cartItems.length} productos`,
				referenceCode: `OT-${Date.now()}`,
				amount: calculateFinalTotal(),
				currency: 'USD',
				buyerEmail: paymentData.email,
				buyerFullName: paymentData.name,
				shippingAddress: paymentData.address,
				shippingCity: paymentData.city,
				shippingCountry: paymentData.country,
				telephone: paymentData.phone,
				// URLs de respuesta
				responseUrl: window.location.origin + '/pago/respuesta',
				confirmationUrl: window.location.origin + '/api/payu/confirmation'
			};

			// Simular respuesta exitosa (en implementación real usar SDK de PayU)
			setTimeout(() => {
				processing = false;
				alert('¡Pago procesado exitosamente! Recibirás un email de confirmación.');
				clearCart();
				window.location.href = '/pedido-confirmado';
			}, 2000);

		} catch (error) {
			processing = false;
			alert('Error al procesar el pago. Inténtalo nuevamente.');
		}
	}
</script>

<svelte:head>
	<title>Pago - OtakuTees.store</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8">Finalizar Compra</h1>

	{#if cartItems.length === 0}
		<div class="text-center py-16">
			<p class="text-xl text-gray-600 mb-4">No hay productos en tu carrito</p>
			<a href="/personalizar" class="bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
				Ir a Personalizar
			</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Payment Form -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-6">Información de Pago</h2>
				
				<div class="space-y-4">
					<div>
						<label class="block text-sm font-medium mb-2">Email *</label>
						<input 
							type="email" 
							bind:value={paymentData.email}
							required
							class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
							placeholder="tu@email.com"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Nombre Completo *</label>
						<input 
							type="text" 
							bind:value={paymentData.name}
							required
							class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
							placeholder="Tu nombre completo"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Teléfono</label>
						<input 
							type="tel" 
							bind:value={paymentData.phone}
							class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
							placeholder="+57 300 123 4567"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium mb-2">Dirección de Envío *</label>
						<textarea 
							bind:value={paymentData.address}
							required
							rows="3"
							class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
							placeholder="Dirección completa para el envío"
						></textarea>
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-2">Ciudad *</label>
							<input 
								type="text" 
								bind:value={paymentData.city}
								required
								class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
								placeholder="Tu ciudad"
							/>
						</div>

						<div>
							<label class="block text-sm font-medium mb-2">País</label>
							<select 
								bind:value={paymentData.country}
								class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-otaku-pink"
							>
								<option value="Colombia">Colombia</option>
								<option value="México">México</option>
								<option value="Perú">Perú</option>
								<option value="Chile">Chile</option>
							</select>
						</div>
					</div>
				</div>

				<!-- PayU Integration Info -->
				<div class="mt-6 p-4 bg-blue-50 rounded-lg">
					<h3 class="font-semibold text-blue-800 mb-2">Métodos de Pago Disponibles</h3>
					<div class="flex flex-wrap gap-2">
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">💳 Tarjetas de Crédito</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">💳 Tarjetas Débito</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">🏦 PSE</span>
						<span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">💰 Efecty</span>
					</div>
					<p class="text-sm text-blue-600 mt-2">Procesado de forma segura por PayU</p>
				</div>
			</div>

			<!-- Order Summary -->
			<div class="bg-white rounded-lg shadow p-6">
				<h2 class="text-xl font-semibold mb-6">Resumen del Pedido</h2>
				
				<!-- Items -->
				<div class="space-y-3 mb-6">
					{#each cartItems as item}
						<div class="flex justify-between items-center">
							<div class="flex-1">
								<h4 class="font-medium">
									{item.productType === 'shirt' ? 'Camisa' : 'Saco'} Personalizada
								</h4>
								<p class="text-sm text-gray-600">
									{item.size} - {item.color} × {item.quantity}
								</p>
							</div>
							<span class="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
						</div>
					{/each}
				</div>

				<!-- Totals -->
				<div class="border-t pt-4 space-y-2">
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
					<div class="flex justify-between font-bold text-lg border-t pt-2">
						<span>Total:</span>
						<span class="text-otaku-pink">${calculateFinalTotal().toFixed(2)}</span>
					</div>
				</div>

				<!-- Payment Button -->
				<button 
					on:click={processPayment}
					disabled={processing}
					class="w-full mt-6 bg-otaku-pink hover:bg-red-600 disabled:bg-gray-400 text-white font-bold py-4 px-4 rounded-lg transition-colors"
				>
					{#if processing}
						<div class="flex items-center justify-center">
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Procesando...
						</div>
					{:else}
						Pagar con PayU - ${calculateFinalTotal().toFixed(2)}
					{/if}
				</button>

				<!-- Security Info -->
				<div class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600 text-center">
					🔒 Tu información está protegida con encriptación SSL
				</div>
			</div>
		</div>
	{/if}
</div>
