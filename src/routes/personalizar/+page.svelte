<script lang="ts">
	import { addToCart } from '$lib/stores/auth';

	let selectedProduct = 'shirt';
	let selectedSize = 'M';
	let selectedColor = 'white';
	let uploadedImage: File | null = null;
	let imagePreview = '';
	let customization = {
		front: { image: '', position: { x: 50, y: 50 }, size: 50 },
		back: { image: '', position: { x: 50, y: 50 }, size: 50 },
		leftSleeve: { image: '', position: { x: 50, y: 50 }, size: 30 },
		rightSleeve: { image: '', position: { x: 50, y: 50 }, size: 30 }
	};
	let activeArea = 'front';

	const products = {
		shirt: { name: 'Camisa', basePrice: 25 },
		jacket: { name: 'Saco', basePrice: 45 }
	};

	const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
	const colors = ['white', 'black', 'gray', 'navy', 'red'];

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

	function calculatePrice() {
		const basePrice = products[selectedProduct as keyof typeof products].basePrice;
		const stampPrice = Object.values(customization).filter((c) => c.image).length * 8;
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

<div class="mx-auto max-w-7xl px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold">Personaliza tu Producto</h1>

	<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
		<!-- Product Preview -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold">Vista Previa</h2>

			<!-- Product Type Selector -->
			<div class="mb-4">
				<label class="mb-2 block text-sm font-medium">Tipo de Producto:</label>
				<select bind:value={selectedProduct} class="w-full rounded border p-2">
					<option value="shirt">Camisa - $25</option>
					<option value="jacket">Saco - $45</option>
				</select>
			</div>

			<!-- Size & Color Selectors -->
			<div class="mb-4 grid grid-cols-2 gap-4">
				<div>
					<label class="mb-2 block text-sm font-medium">Talla:</label>
					<select bind:value={selectedSize} class="w-full rounded border p-2">
						{#each sizes as size}
							<option value={size}>{size}</option>
						{/each}
					</select>
				</div>
				<div>
					<label class="mb-2 block text-sm font-medium">Color:</label>
					<select bind:value={selectedColor} class="w-full rounded border p-2">
						{#each colors as color}
							<option value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Product Area Selector -->
			<div class="mb-4">
				<label class="mb-2 block text-sm font-medium">Área a personalizar:</label>
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded px-4 py-2 {activeArea === 'front'
							? 'bg-otaku-pink text-white'
							: 'bg-gray-200'}"
						on:click={() => setActiveArea('front')}
					>
						Frente
					</button>
					<button
						class="rounded px-4 py-2 {activeArea === 'back'
							? 'bg-otaku-pink text-white'
							: 'bg-gray-200'}"
						on:click={() => setActiveArea('back')}
					>
						Espalda
					</button>
					{#if selectedProduct === 'jacket'}
						<button
							class="rounded px-4 py-2 {activeArea === 'leftSleeve'
								? 'bg-otaku-pink text-white'
								: 'bg-gray-200'}"
							on:click={() => setActiveArea('leftSleeve')}
						>
							Manga Izq
						</button>
						<button
							class="rounded px-4 py-2 {activeArea === 'rightSleeve'
								? 'bg-otaku-pink text-white'
								: 'bg-gray-200'}"
							on:click={() => setActiveArea('rightSleeve')}
						>
							Manga Der
						</button>
					{/if}
				</div>
			</div>

			<!-- Product Visualization -->
			<div class="relative mb-4 flex h-64 items-center justify-center rounded-lg bg-gray-100">
				<div class="text-center">
					<div
						class="h-40 w-32 bg-{selectedColor} relative mx-auto mb-2 overflow-hidden rounded border-2 border-gray-300"
					>
						{#if customization[activeArea as keyof typeof customization].image}
							<img
								src={customization[activeArea as keyof typeof customization].image}
								alt="Stamp"
								class="absolute transition-all duration-200"
								style="
									left: {customization[activeArea as keyof typeof customization].position.x}%; 
									top: {customization[activeArea as keyof typeof customization].position.y}%; 
									width: {customization[activeArea as keyof typeof customization].size}%;
									transform: translate(-50%, -50%);
								"
							/>
						{/if}
					</div>
					<p class="text-sm text-gray-600">
						{products[selectedProduct as keyof typeof products].name} - {activeArea}
					</p>
				</div>
			</div>
		</div>

		<!-- Customization Panel -->
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-4 text-xl font-semibold">Personalización</h2>

			<!-- Image Upload -->
			<div class="mb-6">
				<label class="mb-2 block text-sm font-medium">Subir Imagen:</label>
				<input
					type="file"
					accept="image/*"
					on:change={handleImageUpload}
					class="w-full rounded border p-2"
				/>
				{#if imagePreview}
					<img src={imagePreview} alt="Preview" class="mt-2 h-auto max-w-32 rounded" />
				{/if}
			</div>

			{#if customization[activeArea as keyof typeof customization].image}
				<!-- Position Controls -->
				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium">Posición Horizontal:</label>
					<input
						type="range"
						min="10"
						max="90"
						value={customization[activeArea as keyof typeof customization].position.x}
						on:input={(e) => updatePosition('x', parseInt((e.target as HTMLInputElement).value))}
						class="w-full"
					/>
				</div>

				<div class="mb-4">
					<label class="mb-2 block text-sm font-medium">Posición Vertical:</label>
					<input
						type="range"
						min="10"
						max="90"
						value={customization[activeArea as keyof typeof customization].position.y}
						on:input={(e) => updatePosition('y', parseInt((e.target as HTMLInputElement).value))}
						class="w-full"
					/>
				</div>

				<div class="mb-6">
					<label class="mb-2 block text-sm font-medium">Tamaño:</label>
					<input
						type="range"
						min="10"
						max="80"
						value={customization[activeArea as keyof typeof customization].size}
						on:input={(e) => updateSize(parseInt((e.target as HTMLInputElement).value))}
						class="w-full"
					/>
				</div>
			{/if}

			<!-- Price Summary -->
			<div class="mb-6 rounded bg-gray-50 p-4">
				<h3 class="mb-2 font-semibold">Resumen de Precio:</h3>
				<div class="flex justify-between text-sm">
					<span>Producto base:</span>
					<span>${products[selectedProduct as keyof typeof products].basePrice}</span>
				</div>
				<div class="flex justify-between text-sm">
					<span>Estampados ({Object.values(customization).filter((c) => c.image).length}):</span>
					<span>${Object.values(customization).filter((c) => c.image).length * 8}</span>
				</div>
				<div class="mt-2 flex justify-between border-t pt-2 font-bold">
					<span>Total:</span>
					<span>${calculatePrice()}</span>
				</div>
			</div>

			<!-- Add to Cart Button -->
			<button
				on:click={addToCartHandler}
				class="bg-otaku-pink w-full rounded-lg px-4 py-3 font-bold text-white transition-colors hover:bg-red-600"
			>
				Agregar al Carrito
			</button>
		</div>
	</div>
</div>
