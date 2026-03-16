<script lang="ts">
	import { addToCart } from '$lib/stores/auth';
	import { page } from '$app/stores';

	let selectedProduct = $state('shirt');
	let selectedSize = $state('M');
	let selectedColor = $state('#ffffff');
	let uploadedImage: File | null = $state(null);
	let imagePreview = $state('');
	let customization = $state({
		front: { image: '', position: { x: 50, y: 40 }, size: 40 },
		back: { image: '', position: { x: 50, y: 40 }, size: 40 },
		leftSleeve: { image: '', position: { x: 50, y: 50 }, size: 25 },
		rightSleeve: { image: '', position: { x: 50, y: 50 }, size: 25 }
	});
	let activeArea = $state('front');

	const products = {
		shirt: { name: 'Camisa', basePrice: 25, preview: '👕' },
		jacket: { name: 'Saco', basePrice: 45, preview: '🧥' }
	};

	const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

	const colorOptions = [
		{ name: 'Blanco', value: '#ffffff' },
		{ name: 'Negro', value: '#1a1a1a' },
		{ name: 'Gris', value: '#6b7280' },
		{ name: 'Azul Marino', value: '#1e3a5f' },
		{ name: 'Rojo', value: '#dc2626' },
		{ name: 'Rosa', value: '#ec4899' },
		{ name: 'Morado', value: '#7c3aed' }
	];

	const exampleDesigns = [
		{ emoji: '🐉', title: 'Dragón', color: 'from-red-500 to-orange-500' },
		{ emoji: '🌸', title: 'Sakura', color: 'from-pink-400 to-purple-400' },
		{ emoji: '⚔️', title: 'Espadas', color: 'from-gray-600 to-gray-800' },
		{ emoji: '🦊', title: 'Kitsune', color: 'from-orange-400 to-red-500' },
		{ emoji: '🌙', title: 'Luna', color: 'from-blue-400 to-purple-600' },
		{ emoji: '🔥', title: 'Fuego', color: 'from-orange-500 to-red-600' }
	];

	function handleImageUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (file) {
			uploadedImage = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result as string;
				customization[activeArea as keyof typeof customization].image = imagePreview;
			};
			reader.readAsDataURL(file);
		}
	}

	function setActiveArea(area: string) {
		activeArea = area;
	}

	function updatePosition(axis: 'x' | 'y', value: number) {
		customization[activeArea as keyof typeof customization].position[axis] = value;
	}

	function updateSize(value: number) {
		customization[activeArea as keyof typeof customization].size = value;
	}

	function applyExample(design: (typeof exampleDesigns)[0]) {
		customization[activeArea as keyof typeof customization].image = design.emoji;
		imagePreview = design.emoji;
	}

	function calculatePrice() {
		const basePrice = products[selectedProduct as keyof typeof products].basePrice;
		const stampPrice = Object.values(customization).filter((c: any) => c.image).length * 8;
		return basePrice + stampPrice;
	}

	function addToCartHandler() {
		const item = {
			id: Date.now().toString(),
			productType: selectedProduct,
			size: selectedSize,
			color: selectedColor,
			customization: customization,
			price: calculatePrice(),
			quantity: 1
		};
		addToCart(item);
		alert('¡Producto agregado al carrito!');
	}
</script>

<svelte:head>
	<title>Personalizar - OtakuTees.store</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="relative overflow-hidden bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f0f23]">
		<div class="absolute inset-0 opacity-30">
			<div class="absolute top-10 left-10 animate-pulse text-6xl">🎨</div>
			<div class="absolute top-20 right-20 animate-pulse text-5xl" style="animation-delay: 0.5s">
				✏️
			</div>
			<div class="absolute top-1/4 left-1/3 animate-pulse text-4xl" style="animation-delay: 1s">
				🖼️
			</div>
			<div
				class="absolute right-1/4 bottom-20 animate-pulse text-5xl"
				style="animation-delay: 1.5s"
			>
				🎌
			</div>
		</div>

		<div class="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
			<div class="text-center">
				<h1 class="mb-4 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
					<span
						class="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent"
					>
						Crea Tu Propio Diseño
					</span>
				</h1>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
					Sube tu imagen favorita y personaliza tu playera o saco con tu estilo otaku único
				</p>
			</div>
		</div>

		<div
			class="absolute right-0 bottom-0 left-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"
		></div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<div class="mb-8">
			<h2 class="mb-4 text-2xl font-bold text-gray-900">Ejemplos de Personalización</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
				{#each exampleDesigns as design}
					<button
						onclick={() => applyExample(design)}
						class="group relative overflow-hidden rounded-xl bg-white p-4 shadow-md transition-all hover:scale-105 hover:shadow-lg"
					>
						<div
							class="bg-gradient-to-r {design.color} mb-2 flex h-16 items-center justify-center rounded-lg text-4xl"
						>
							{design.emoji}
						</div>
						<p class="text-sm font-medium text-gray-700">{design.title}</p>
						<div
							class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<span class="rounded-full bg-white px-3 py-1 text-sm font-medium text-gray-900"
								>Usar</span
							>
						</div>
					</button>
				{/each}
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<h2 class="mb-6 flex items-center text-xl font-semibold">
					<span class="mr-2">👔</span> Configura tu Producto
				</h2>

				<div class="mb-6">
					<label class="mb-3 block text-sm font-medium text-gray-700">Tipo de Producto:</label>
					<div class="grid grid-cols-2 gap-4">
						<button
							onclick={() => (selectedProduct = 'shirt')}
							class="flex flex-col items-center rounded-xl border-2 p-4 transition-all {selectedProduct ===
							'shirt'
								? 'border-[#ba5258] bg-red-50'
								: 'border-gray-200 hover:border-gray-300'}"
						>
							<span class="mb-2 text-4xl">👕</span>
							<span class="font-medium">Camisa</span>
							<span class="text-sm text-gray-500">$25.00</span>
						</button>
						<button
							onclick={() => (selectedProduct = 'jacket')}
							class="flex flex-col items-center rounded-xl border-2 p-4 transition-all {selectedProduct ===
							'jacket'
								? 'border-[#ba5258] bg-red-50'
								: 'border-gray-200 hover:border-gray-300'}"
						>
							<span class="mb-2 text-4xl">🧥</span>
							<span class="font-medium">Saco</span>
							<span class="text-sm text-gray-500">$45.00</span>
						</button>
					</div>
				</div>

				<div class="mb-6 grid grid-cols-2 gap-4">
					<div>
						<label class="mb-3 block text-sm font-medium text-gray-700">Talla:</label>
						<div class="grid grid-cols-3 gap-2">
							{#each sizes as size}
								<button
									onclick={() => (selectedSize = size)}
									class="rounded-lg border-2 py-2 text-center text-sm font-medium transition-all {selectedSize ===
									size
										? 'border-[#ba5258] bg-[#ba5258] text-white'
										: 'border-gray-200 hover:border-gray-300'}"
								>
									{size}
								</button>
							{/each}
						</div>
					</div>
					<div>
						<label class="mb-3 block text-sm font-medium text-gray-700">Color:</label>
						<div class="flex flex-wrap gap-2">
							{#each colorOptions as color}
								<button
									onclick={() => (selectedColor = color.value)}
									class="h-8 w-8 rounded-full border-2 transition-all hover:scale-110 {selectedColor ===
									color.value
										? 'border-[#ba5258] ring-2 ring-[#ba5258]/30'
										: 'border-gray-300'}"
									style="background-color: {color.value}"
									title={color.name}
								></button>
							{/each}
						</div>
					</div>
				</div>

				<div class="mb-6">
					<label class="mb-3 block text-sm font-medium text-gray-700">Área a personalizar:</label>
					<div class="flex flex-wrap gap-2">
						<button
							onclick={() => setActiveArea('front')}
							class="rounded-full px-4 py-2 text-sm font-medium transition-all {activeArea ===
							'front'
								? 'bg-[#ba5258] text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							Frente
						</button>
						<button
							onclick={() => setActiveArea('back')}
							class="rounded-full px-4 py-2 text-sm font-medium transition-all {activeArea ===
							'back'
								? 'bg-[#ba5258] text-white'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
						>
							Espalda
						</button>
						{#if selectedProduct === 'jacket'}
							<button
								onclick={() => setActiveArea('leftSleeve')}
								class="rounded-full px-4 py-2 text-sm font-medium transition-all {activeArea ===
								'leftSleeve'
									? 'bg-[#ba5258] text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								Manga Izq
							</button>
							<button
								onclick={() => setActiveArea('rightSleeve')}
								class="rounded-full px-4 py-2 text-sm font-medium transition-all {activeArea ===
								'rightSleeve'
									? 'bg-[#ba5258] text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
							>
								Manga Der
							</button>
						{/if}
					</div>
				</div>
			</div>

			<div class="rounded-2xl bg-white p-6 shadow-lg">
				<h2 class="mb-6 flex items-center text-xl font-semibold">
					<span class="mr-2">🎯</span> Vista Previa
				</h2>

				<div class="relative mb-6 flex justify-center">
					<div class="relative">
						<div
							class="relative mx-auto overflow-hidden rounded-xl bg-gray-100 shadow-xl transition-all"
							style="width: 280px; height: 350px;"
						>
							{#if selectedProduct === 'shirt'}
								<svg viewBox="0 0 200 260" class="h-full w-full" fill="none">
									<path
										d="M40 30 L70 30 L85 60 L115 60 L130 30 L160 30 L170 80 L155 90 L145 70 L145 240 L55 240 L55 70 L45 90 L30 80 Z"
										fill={selectedColor}
										stroke="rgba(0,0,0,0.3)"
										stroke-width="2"
									/>
									<path d="M85 60 L115 60 L115 80 L85 80 Z" fill="rgba(0,0,0,0.1)" />
								</svg>
							{:else}
								<svg viewBox="0 0 220 280" class="h-full w-full" fill="none">
									<path
										d="M30 20 L60 20 L75 50 L100 35 L125 50 L140 20 L170 20 L185 80 L165 95 L160 70 L160 260 L60 260 L60 70 L55 95 L35 80 Z"
										fill={selectedColor}
										stroke="rgba(0,0,0,0.3)"
										stroke-width="2"
									/>
									<path d="M60 70 L30 80 L30 100 L55 90 Z" fill="rgba(0,0,0,0.15)" />
									<path d="M160 70 L190 80 L190 100 L165 90 Z" fill="rgba(0,0,0,0.15)" />
									<path d="M100 35 L100 50" stroke="rgba(0,0,0,0.2)" stroke-width="1" />
								</svg>
							{/if}

							{#if activeArea === 'front' && customization.front.image}
								<img
									src={customization.front.image}
									alt="Diseño"
									class="pointer-events-none absolute"
									style="
										left: {customization.front.position.x}%;
										top: {customization.front.position.y}%;
										width: {customization.front.size}%;
										max-width: 120px;
										transform: translate(-50%, -50%);
									"
								/>
							{/if}

							{#if activeArea === 'back' && customization.back.image}
								<img
									src={customization.back.image}
									alt="Diseño"
									class="pointer-events-none absolute"
									style="
										left: {customization.back.position.x}%;
										top: {customization.back.position.y}%;
										width: {customization.back.size}%;
										max-width: 120px;
										transform: translate(-50%, -50%);
									"
								/>
							{/if}

							{#if activeArea === 'leftSleeve' && customization.leftSleeve.image && selectedProduct === 'jacket'}
								<img
									src={customization.leftSleeve.image}
									alt="Diseño"
									class="pointer-events-none absolute"
									style="
										left: {customization.leftSleeve.position.x}%;
										top: {customization.leftSleeve.position.y}%;
										width: {customization.leftSleeve.size}%;
										max-width: 50px;
										transform: translate(-50%, -50%);
									"
								/>
							{/if}

							{#if activeArea === 'rightSleeve' && customization.rightSleeve.image && selectedProduct === 'jacket'}
								<img
									src={customization.rightSleeve.image}
									alt="Diseño"
									class="pointer-events-none absolute"
									style="
										left: {customization.rightSleeve.position.x}%;
										top: {customization.rightSleeve.position.y}%;
										width: {customization.rightSleeve.size}%;
										max-width: 50px;
										transform: translate(-50%, -50%);
									"
								/>
							{/if}
						</div>
					</div>
				</div>

				{#if customization[activeArea as keyof typeof customization].image}
					<div class="mb-4 space-y-4 rounded-xl bg-gray-50 p-4">
						<div>
							<label
								class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700"
							>
								Posición Horizontal
								<span class="text-[#ba5258]"
									>{customization[activeArea as keyof typeof customization].position.x}%</span
								>
							</label>
							<input
								type="range"
								min="10"
								max="90"
								value={customization[activeArea as keyof typeof customization].position.x}
								oninput={(e) => updatePosition('x', parseInt((e.target as HTMLInputElement).value))}
								class="w-full cursor-pointer accent-[#ba5258]"
							/>
						</div>

						<div>
							<label
								class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700"
							>
								Posición Vertical
								<span class="text-[#ba5258]"
									>{customization[activeArea as keyof typeof customization].position.y}%</span
								>
							</label>
							<input
								type="range"
								min="10"
								max="90"
								value={customization[activeArea as keyof typeof customization].position.y}
								oninput={(e) => updatePosition('y', parseInt((e.target as HTMLInputElement).value))}
								class="w-full cursor-pointer accent-[#ba5258]"
							/>
						</div>

						<div>
							<label
								class="mb-2 flex items-center justify-between text-sm font-medium text-gray-700"
							>
								Tamaño
								<span class="text-[#ba5258]"
									>{customization[activeArea as keyof typeof customization].size}%</span
								>
							</label>
							<input
								type="range"
								min="10"
								max="80"
								value={customization[activeArea as keyof typeof customization].size}
								oninput={(e) => updateSize(parseInt((e.target as HTMLInputElement).value))}
								class="w-full cursor-pointer accent-[#ba5258]"
							/>
						</div>
					</div>
				{/if}

				<div class="mb-6">
					<label class="mb-3 block text-sm font-medium text-gray-700">Sube tu propia imagen:</label>
					<div class="relative">
						<input
							type="file"
							accept="image/*"
							onchange={handleImageUpload}
							class="absolute inset-0 w-full cursor-pointer opacity-0"
						/>
						<div
							class="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-[#ba5258] hover:bg-red-50"
						>
							<span class="mb-2 text-4xl">📤</span>
							<span class="text-sm text-gray-500">Click para subir imagen</span>
						</div>
					</div>
					{#if imagePreview}
						<div class="mt-3 flex items-center gap-3 rounded-lg bg-gray-50 p-2">
							<img src={imagePreview} alt="Preview" class="h-12 w-12 rounded-lg object-cover" />
							<span class="text-sm text-gray-600">Imagen cargada ✓</span>
						</div>
					{/if}
				</div>

				<div class="rounded-xl bg-gradient-to-r from-[#1a1a2e] to-[#16213e] p-4 text-white">
					<h3 class="mb-3 font-semibold">Resumen del Precio:</h3>
					<div class="flex justify-between text-sm text-gray-300">
						<span>Producto base ({products[selectedProduct as keyof typeof products].name}):</span>
						<span>${products[selectedProduct as keyof typeof products].basePrice}</span>
					</div>
					<div class="flex justify-between text-sm text-gray-300">
						<span
							>Estampados ({Object.values(customization).filter((c: any) => c.image).length}):</span
						>
						<span>${Object.values(customization).filter((c: any) => c.image).length * 8}</span>
					</div>
					<div class="mt-3 flex justify-between border-t border-gray-600 pt-3 text-lg font-bold">
						<span>Total:</span>
						<span class="text-[#ba5258]">${calculatePrice()}</span>
					</div>
				</div>

				<button
					onclick={addToCartHandler}
					class="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ba5258] to-red-600 py-4 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
				>
					🛒 Agregar al Carrito
				</button>
			</div>
		</div>
	</div>
</div>
