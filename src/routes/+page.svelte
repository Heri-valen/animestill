<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentSlide = $state(0);
	let products = $state<Array<{
		id: string;
		name: string;
		basePrice: number;
		images: string;
		type: string;
	}>>([]);

	const slides = [
		{
			title: "¡Personaliza Tu Estilo Otaku!",
			description: "Crea prendas únicas con tus animes favoritos",
			cta: "Personalizar Ahora",
			link: "/personalizar",
			gradient: "from-purple-900 via-pink-800 to-red-700"
		},
		{
			title: "Nueva Colección 2026",
			description: "Los diseños más populares del año",
			cta: "Ver Catálogo",
			link: "/productos",
			gradient: "from-blue-900 via-cyan-700 to-teal-600"
		},
		{
			title: "Envío Gratis +$50",
			description: "Solo por tiempo limitado",
			cta: "Aprovechar",
			link: "/carrito",
			gradient: "from-green-900 via-emerald-700 to-teal-500"
		}
	];

	const categories = [
		{ icon: "👕", label: "Camisetas", desc: "Estampado digital", link: "/personalizar?type=shirt" },
		{ icon: "🧥", label: "Sudaderas", desc: "Premium quality", link: "/personalizar?type=jacket" },
		{ icon: "🎒", label: "Accesorios", desc: "Bolsos y más", link: "/productos?category=accesorios" }
	];

	onMount(() => {
		const interval = setInterval(() => {
			currentSlide = (currentSlide + 1) % slides.length;
		}, 5000);
		
		products = [
			{ id: "1", name: "Camiseta Anime Premium", basePrice: 25.99, images: "/images/camiseta-basica.jpg", type: "SHIRT" },
			{ id: "2", name: "Sudadera Otaku", basePrice: 45.99, images: "/images/sudadera-premium.jpg", type: "JACKET" },
			{ id: "3", name: "Crop Top Anime", basePrice: 19.99, images: "/images/crop-top.jpg", type: "SHIRT" },
			{ id: "4", name: "Hoodie Zippered", basePrice: 52.99, images: "/images/hoodie-zip.jpg", type: "JACKET" }
		];
		
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>OtakuTees.store - Tu Estilo Otaku, Personalizado</title>
	<meta name="description" content="Compra camisetas, sudaderas y accesorios personalizables con tus animes favoritos. Envío a toda Colombia." />
</svelte:head>

<!-- Hero Section -->
<section class="relative h-[600px] overflow-hidden">
	{#each slides as slide, i}
		<div 
			class="absolute inset-0 w-full h-full transition-all duration-700 ease-in-out"
			style="transform: translateX({(i - currentSlide) * 100}%); opacity: {i === currentSlide ? 1 : 0}"
		>
			<div class="relative w-full h-full bg-gradient-to-r {slide.gradient}">
				<div class="absolute inset-0 bg-black/30"></div>
				<div class="absolute inset-0 overflow-hidden">
					<div class="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
					<div class="absolute bottom-20 right-10 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
				</div>
				<div class="relative z-10 flex items-center justify-center h-full">
					<div class="text-center text-white px-4 max-w-4xl">
						<h1 class="text-5xl md:text-7xl font-black mb-6 tracking-tight">
							{slide.title}
						</h1>
						<p class="text-xl md:text-2xl mb-8 text-white/90 font-light">
							{slide.description}
						</p>
						<a 
							href={slide.link}
							class="inline-block bg-white text-gray-900 hover:bg-pink-500 hover:text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
						>
							{slide.cta}
						</a>
					</div>
				</div>
			</div>
		</div>
	{/each}

	<!-- Hero Navigation Dots -->
	<div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
		{#each slides as _, i}
			<button
				class="w-3 h-3 rounded-full transition-all duration-300 {currentSlide === i ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}"
				onclick={() => currentSlide = i}
				aria-label="Go to slide {i + 1}"
			></button>
		{/each}
	</div>
</section>

<!-- Categories Section -->
<section id="categorias" class="py-20 bg-gray-900">
	<div class="max-w-7xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center text-white mb-4">
			Explora <span class="text-pink-500">Categorías</span>
		</h2>
		<p class="text-gray-400 text-center mb-12 text-lg">Elige el tipo de prenda que quieres personalizar</p>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			{#each categories as cat}
				<a 
					href={cat.link}
					class="group bg-gray-800 rounded-2xl p-8 text-center hover:bg-gray-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20"
				>
					<div class="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
						{cat.icon}
					</div>
					<h3 class="text-2xl font-bold text-white mb-2">{cat.label}</h3>
					<p class="text-gray-400">{cat.desc}</p>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Featured Products -->
<section class="py-20 bg-gradient-to-b from-gray-900 to-gray-800">
	<div class="max-w-7xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center text-white mb-4">
			Productos <span class="text-cyan-400">Destacados</span>
		</h2>
		<p class="text-gray-400 text-center mb-12 text-lg">Los diseños más populares de la temporada</p>
		
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each products as product}
				<div class="group bg-gray-800 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2">
					<div class="aspect-square bg-gray-700 relative overflow-hidden">
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
							<a 
								href="/personalizar?product={product.id}" 
								class="bg-pink-500 text-white px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
							>
								Personalizar
							</a>
						</div>
						<div class="w-full h-full flex items-center justify-center text-6xl">
							{product.type === 'SHIRT' ? '👕' : '🧥'}
						</div>
					</div>
					<div class="p-4">
						<h3 class="font-bold text-white text-lg mb-1 truncate">{product.name}</h3>
						<p class="text-cyan-400 font-bold text-xl">${product.basePrice}</p>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="text-center mt-12">
			<a 
				href="/personalizar"
				class="inline-block bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300"
			>
				Ver Todos los Productos
			</a>
		</div>
	</div>
</section>

<!-- How It Works -->
<section class="py-20 bg-gray-800">
	<div class="max-w-7xl mx-auto px-4">
		<h2 class="text-4xl font-bold text-center text-white mb-4">
			Cómo <span class="text-pink-500">Funciona</span>
		</h2>
		<p class="text-gray-400 text-center mb-12 text-lg">Personaliza tu prenda en 3 simples pasos</p>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="text-center">
				<div class="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
					1
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Elige tu Prenda</h3>
				<p class="text-gray-400">Selecciona el tipo de prenda y tamaño</p>
			</div>
			<div class="text-center">
				<div class="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
					2
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Personaliza</h3>
				<p class="text-gray-400">Sube tu imagen o elige un diseño</p>
			</div>
			<div class="text-center">
				<div class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
					3
				</div>
				<h3 class="text-xl font-bold text-white mb-2">Recibe en Casa</h3>
				<p class="text-gray-400">Te lo enviamos a cualquier lugar</p>
			</div>
		</div>
	</div>
</section>

<!-- CTA Banner -->
<section class="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
	<div class="max-w-4xl mx-auto px-4 text-center">
		<h2 class="text-3xl md:text-4xl font-bold text-white mb-4">
			¿Listo para destacar?
		</h2>
		<p class="text-white/90 text-lg mb-8">
			Crea tu propio estilo con tus personajes favoritos
		</p>
		<a 
			href="/personalizar"
			class="inline-block bg-white text-pink-600 hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
		>
			Comenzar Ahora
		</a>
	</div>
</section>
