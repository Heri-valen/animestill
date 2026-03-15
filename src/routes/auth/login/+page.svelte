<script lang="ts">
	let email = $state('');
	let password = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleLogin(e: Event) {
		e.preventDefault();
		loading = true;
		error = '';
		
		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Error al iniciar sesión';
				return;
			}

			success = true;
			window.location.href = '/';
		} catch (err) {
			error = 'Error de conexión';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Iniciar Sesión - OtakuTees.store</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<a href="/" class="text-4xl font-black text-white">
				Otaku<span class="text-pink-500">Tees</span>
			</a>
			<p class="text-gray-400 mt-2">Inicia sesión para continuar</p>
		</div>

		<div class="bg-gray-800 rounded-2xl p-8 shadow-2xl">
			{#if success}
				<div class="text-center py-8">
					<div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-white mb-2">¡Bienvenido!</h2>
					<p class="text-gray-400">Redireccionando...</p>
				</div>
			{:else}
				<form onsubmit={handleLogin} class="space-y-6">
					{#if error}
						<div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					{/if}

					<div>
						<label for="email" class="block text-sm font-medium text-gray-300 mb-2">
							Email
						</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
							placeholder="tu@email.com"
						/>
					</div>

					<div>
						<label for="password" class="block text-sm font-medium text-gray-300 mb-2">
							Contraseña
						</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Iniciando...' : 'Iniciar Sesión'}
					</button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-gray-400">
						¿No tienes cuenta?
						<a href="/auth/registro" class="text-pink-500 hover:text-pink-400 font-medium">
							Regístrate aquí
						</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
