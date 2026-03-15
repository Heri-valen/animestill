<script lang="ts">
	let config = $state({
		merchantId: '',
		apiKey: '',
		accountId: '',
		testMode: true
	});

	let saving = $state(false);
	let saved = $state(false);

	async function saveConfig() {
		saving = true;
		await new Promise(r => setTimeout(r, 1000));
		saving = false;
		saved = true;
		setTimeout(() => saved = false, 3000);
	}
</script>

<svelte:head>
	<title>Configuración de Pago - Admin</title>
</svelte:head>

<h1 class="text-2xl font-bold mb-6">Configuración de Pago</h1>

<div class="grid gap-6 max-w-2xl">
	<div class="bg-white rounded-lg shadow p-6">
		<div class="flex items-center gap-3 mb-6">
			<div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
				💳
			</div>
			<div>
				<h2 class="text-lg font-semibold">PayU</h2>
				<p class="text-sm text-gray-500">Configura tu pasarela de pagos</p>
			</div>
		</div>

		<div class="space-y-4">
			<div>
				<label class="block text-sm font-medium mb-2">Merchant ID</label>
				<input 
					type="text" 
					bind:value={config.merchantId} 
					placeholder="Tu Merchant ID de PayU"
					class="w-full p-3 border rounded-lg"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">API Key</label>
				<input 
					type="password" 
					bind:value={config.apiKey} 
					placeholder="Tu API Key de PayU"
					class="w-full p-3 border rounded-lg"
				/>
			</div>
			<div>
				<label class="block text-sm font-medium mb-2">Account ID</label>
				<input 
					type="text" 
					bind:value={config.accountId} 
					placeholder="Tu Account ID de PayU"
					class="w-full p-3 border rounded-lg"
				/>
			</div>
			<div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
				<input 
					type="checkbox" 
					bind:checked={config.testMode}
					id="testMode"
					class="w-5 h-5"
				/>
				<label for="testMode" class="flex-1">
					<span class="font-medium">Modo de prueba (Sandbox)</span>
					<p class="text-sm text-gray-500">Usa las credenciales de prueba de PayU</p>
				</label>
				<span class="px-3 py-1 rounded-full text-sm {config.testMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
					{config.testMode ? 'Prueba' : 'Producción'}
				</span>
			</div>
		</div>

		<div class="mt-6 flex items-center gap-4">
			<button 
				on:click={saveConfig}
				disabled={saving}
				class="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium disabled:opacity-50"
			>
				{saving ? 'Guardando...' : 'Guardar Configuración'}
			</button>
			{#if saved}
				<span class="text-green-600">✓ Configuración guardada</span>
			{/if}
		</div>
	</div>

	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
		<h3 class="font-medium text-blue-900 mb-2">📋 Información de Webhook</h3>
		<p class="text-sm text-blue-700 mb-2">Usa esta URL para los webhooks de PayU:</p>
		<code class="block bg-white p-2 rounded text-sm text-blue-800 break-all">
			https://tu-dominio.com/api/payu/callback
		</code>
	</div>
</div>
