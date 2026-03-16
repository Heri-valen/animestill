<script lang="ts">
	let { data } = $props();
	let viewMode = $state<'grid' | 'list'>('grid');

	const animeLogos = [
		'🐉',
		'🔥',
		'⚔️',
		'🌸',
		'⭐',
		'🎭',
		'👺',
		'🗡️',
		'🏮',
		'🎴',
		'🦊',
		'🐱',
		'🐲',
		'👻',
		'🤖',
		'💥',
		'🌙',
		'☀️',
		'⚡',
		'🎌'
	];
</script>

<svelte:head>
	<title>Productos - OtakuTees.store</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="relative overflow-hidden bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
		<div class="absolute inset-0 opacity-20">
			<div class="absolute top-10 left-10 animate-pulse text-6xl">🐉</div>
			<div class="absolute top-20 right-20 animate-pulse text-5xl" style="animation-delay: 0.5s">
				🔥
			</div>
			<div class="absolute top-1/4 left-1/3 animate-pulse text-4xl" style="animation-delay: 1s">
				⚔️
			</div>
			<div
				class="absolute right-1/4 bottom-20 animate-pulse text-5xl"
				style="animation-delay: 1.5s"
			>
				🌸
			</div>
			<div class="absolute bottom-10 left-20 animate-pulse text-4xl" style="animation-delay: 0.3s">
				⭐
			</div>
			<div class="absolute top-1/2 right-10 animate-pulse text-5xl" style="animation-delay: 0.8s">
				👺
			</div>
			<div class="absolute bottom-10 left-1/2 animate-pulse text-4xl" style="animation-delay: 1.2s">
				🎭
			</div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="mb-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
					<span
						class="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
					>
						Tu Estilo Otaku
					</span>
				</h1>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
					Descubre nuestra colección de playeras y sacks personalizados con los mejores diseños de
					anime
				</p>
				<div class="mb-8 flex flex-wrap justify-center gap-3 text-3xl">
					{#each animeLogos as logo, i}
						<span class="animate-bounce" style="animation-delay: {i * 0.1}s">{logo}</span>
					{/each}
				</div>
				<a
					href="#productos"
					class="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 text-lg font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30"
				>
					Ver Productos ↓
				</a>
			</div>
		</div>

		<div
			class="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
		></div>
	</div>

	<div id="productos" class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8 flex items-center justify-between">
			<h1 class="text-3xl font-bold text-gray-900">Nuestros Productos</h1>

			<div class="flex items-center space-x-2">
				<button
					onclick={() => (viewMode = 'grid')}
					class="rounded p-2 transition-colors {viewMode === 'grid'
						? 'bg-otaku-pink text-white'
						: 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
						/>
					</svg>
				</button>
				<button
					onclick={() => (viewMode = 'list')}
					class="rounded p-2 transition-colors {viewMode === 'list'
						? 'bg-otaku-pink text-white'
						: 'bg-gray-200 text-gray-600 hover:bg-gray-300'}"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>

		{#if data.products.length === 0}
			<div class="py-20 text-center">
				<div class="mb-4 text-6xl">📦</div>
				<h2 class="mb-2 text-2xl font-semibold text-gray-700">No hay productos disponibles</h2>
				<p class="text-gray-500">Pronto tendremos nuevos productos para ti</p>
			</div>
		{:else if viewMode === 'grid'}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
				{#each data.products as product}
					{@const images = Array.isArray(product.images)
						? product.images
						: JSON.parse(product.images || '[]')}
					{@const colors = Array.isArray(product.colors)
						? product.colors
						: JSON.parse(product.colors || '[]')}
					{@const sizes = Array.isArray(product.sizes)
						? product.sizes
						: JSON.parse(product.sizes || '[]')}
					<div
						class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
					>
						<div class="aspect-square bg-gray-100">
							{#if images.length > 0}
								<img src={images[0]} alt={product.name} class="h-full w-full object-cover" />
							{:else}
								<div class="flex h-full items-center justify-center text-4xl">
									{product.type === 'SHIRT' ? '👕' : '🧥'}
								</div>
							{/if}
						</div>
						<div class="p-4">
							<div class="mb-2 flex items-center justify-between">
								<span
									class="bg-otaku-pink/10 text-otaku-pink rounded-full px-3 py-1 text-xs font-medium"
								>
									{product.type === 'SHIRT' ? 'Camisa' : 'Saco'}
								</span>
								<span class="text-otaku-pink text-lg font-bold"
									>${product.basePrice.toFixed(2)}</span
								>
							</div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
							<p class="mb-4 line-clamp-2 text-sm text-gray-600">{product.description}</p>

							{#if colors.length > 0}
								<div class="mb-3 flex flex-wrap gap-1">
									{#each colors as color}
										<span
											class="h-5 w-5 rounded-full border border-gray-300"
											style="background-color: {color}"
										></span>
									{/each}
								</div>
							{/if}

							{#if sizes.length > 0}
								<p class="mb-4 text-xs text-gray-500">Tallas: {sizes.join(', ')}</p>
							{/if}

							<a
								href="/personalizar?product={product.id}"
								class="bg-otaku-pink block w-full rounded-lg py-2 text-center font-medium text-white transition-colors hover:bg-red-600"
							>
								Personalizar
							</a>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="space-y-4">
				{#each data.products as product}
					{@const images = Array.isArray(product.images)
						? product.images
						: JSON.parse(product.images || '[]')}
					{@const colors = Array.isArray(product.colors)
						? product.colors
						: JSON.parse(product.colors || '[]')}
					{@const sizes = Array.isArray(product.sizes)
						? product.sizes
						: JSON.parse(product.sizes || '[]')}
					<div class="flex rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg">
						<div class="w-48 flex-shrink-0 bg-gray-100">
							{#if images.length > 0}
								<img src={images[0]} alt={product.name} class="h-full w-full object-cover" />
							{:else}
								<div class="flex h-48 items-center justify-center text-4xl">
									{product.type === 'SHIRT' ? '👕' : '🧥'}
								</div>
							{/if}
						</div>
						<div class="flex flex-1 flex-col p-4">
							<div class="mb-2 flex items-center justify-between">
								<div>
									<span
										class="bg-otaku-pink/10 text-otaku-pink mr-2 rounded-full px-3 py-1 text-xs font-medium"
									>
										{product.type === 'SHIRT' ? 'Camisa' : 'Saco'}
									</span>
								</div>
								<span class="text-otaku-pink text-xl font-bold"
									>${product.basePrice.toFixed(2)}</span
								>
							</div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">{product.name}</h3>
							<p class="mb-auto text-sm text-gray-600">{product.description}</p>

							<div class="mt-4 flex items-center justify-between">
								<div class="flex items-center gap-4">
									{#if colors.length > 0}
										<div class="flex flex-wrap gap-1">
											{#each colors as color}
												<span
													class="h-5 w-5 rounded-full border border-gray-300"
													style="background-color: {color}"
												></span>
											{/each}
										</div>
									{/if}
									{#if sizes.length > 0}
										<span class="text-xs text-gray-500">Tallas: {sizes.join(', ')}</span>
									{/if}
								</div>
								<a
									href="/personalizar?product={product.id}"
									class="bg-otaku-pink rounded-lg px-6 py-2 font-medium text-white transition-colors hover:bg-red-600"
								>
									Personalizar
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
