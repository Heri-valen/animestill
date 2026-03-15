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

			if (data.user.role === 'ADMIN') {
				window.location.href = '/admin';
			} else {
				window.location.href = '/';
			}
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

<div class="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-12">
	<div class="w-full max-w-md">
		<div class="mb-8 text-center">
			<a href="/" class="text-4xl font-black text-white">
				Otaku<span class="text-pink-500">Tees</span>
			</a>
			<p class="mt-2 text-gray-400">Inicia sesión para continuar</p>
		</div>

		<div class="rounded-2xl bg-gray-800 p-8 shadow-2xl">
			{#if success}
				<div class="py-8 text-center">
					<div
						class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500"
					>
						<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h2 class="mb-2 text-2xl font-bold text-white">¡Bienvenido!</h2>
					<p class="text-gray-400">Redireccionando...</p>
				</div>
			{:else}
				<form onsubmit={handleLogin} class="space-y-6">
					{#if error}
						<div
							class="rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-500"
						>
							{error}
						</div>
					{/if}

					<div>
						<label for="email" class="mb-2 block text-sm font-medium text-gray-300"> Email </label>
						<input
							type="email"
							id="email"
							bind:value={email}
							required
							class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
							placeholder="tu@email.com"
						/>
					</div>

					<div>
						<label for="password" class="mb-2 block text-sm font-medium text-gray-300">
							Contraseña
						</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							class="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-3 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 focus:outline-none"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full rounded-lg bg-pink-500 px-4 py-3 font-bold text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{loading ? 'Iniciando...' : 'Iniciar Sesión'}
					</button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-gray-400">
						¿No tienes cuenta?
						<a href="/auth/registro" class="font-medium text-pink-500 hover:text-pink-400">
							Regístrate aquí
						</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
