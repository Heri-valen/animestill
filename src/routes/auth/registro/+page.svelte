<script lang="ts">
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	async function handleRegister(e: Event) {
		e.preventDefault();
		
		if (password !== confirmPassword) {
			error = 'Las contraseñas no coinciden';
			return;
		}

		if (password.length < 6) {
			error = 'La contraseña debe tener al menos 6 caracteres';
			return;
		}

		loading = true;
		error = '';

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				error = data.error || 'Error al registrar';
				return;
			}

			success = true;
			setTimeout(() => {
				window.location.href = '/auth/login';
			}, 2000);
		} catch (err) {
			error = 'Error de conexión';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Registrarse - OtakuTees.store</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
	<div class="max-w-md w-full">
		<div class="text-center mb-8">
			<a href="/" class="text-4xl font-black text-white">
				Otaku<span class="text-pink-500">Tees</span>
			</a>
			<p class="text-gray-400 mt-2">Crea tu cuenta</p>
		</div>

		<div class="bg-gray-800 rounded-2xl p-8 shadow-2xl">
			{#if success}
				<div class="text-center py-8">
					<div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
						</svg>
					</div>
					<h2 class="text-2xl font-bold text-white mb-2">¡Cuenta creada!</h2>
					<p class="text-gray-400">Serás redirigido al login...</p>
				</div>
			{:else}
				<form onsubmit={handleRegister} class="space-y-5">
					{#if error}
						<div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
							{error}
						</div>
					{/if}

					<div>
						<label for="name" class="block text-sm font-medium text-gray-300 mb-2">
							Nombre completo
						</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							required
							class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
							placeholder="Tu nombre"
						/>
					</div>

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
							minlength="6"
							class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
							placeholder="Mínimo 6 caracteres"
						/>
					</div>

					<div>
						<label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
							Confirmar contraseña
						</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							required
							class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
							placeholder="Repite tu contraseña"
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						class="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Creando cuenta...' : 'Crear Cuenta'}
					</button>
				</form>

				<div class="mt-6 text-center">
					<p class="text-gray-400">
						¿Ya tienes cuenta?
						<a href="/auth/login" class="text-pink-500 hover:text-pink-400 font-medium">
							Inicia sesión
						</a>
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
