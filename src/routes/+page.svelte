<script lang="ts">
	import { onMount } from 'svelte';
	
	let currentSlide = 0;
	const slides = [
		{
			title: "¡Personaliza tu estilo otaku!",
			description: "Crea camisas y sacos únicos con tus estampados de anime favoritos"
		},
		{
			title: "Nueva Colección Disponible",
			description: "Descubre los últimos diseños inspirados en los animes más populares"
		},
		{
			title: "Envío Gratis en Compras +$50",
			description: "Aprovecha nuestra promoción especial"
		}
	];

	onMount(() => {
		const interval = setInterval(() => {
			currentSlide = (currentSlide + 1) % slides.length;
		}, 5000);
		return () => clearInterval(interval);
	});

	function goToSlide(index: number) {
		currentSlide = index;
	}
</script>

<svelte:head>
	<title>OtakuTees.store - Inicio</title>
</svelte:head>

<!-- Hero Slider -->
<section class="relative h-96 overflow-hidden">
	{#each slides as slide, i}
		<div 
			class="absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out"
			style="transform: translateX({(i - currentSlide) * 100}%)"
		>
			<div class="relative w-full h-full bg-gradient-to-r from-otaku-dark to-otaku-purple">
				<div class="absolute inset-0 bg-black opacity-40"></div>
				<div class="relative z-10 flex items-center justify-center h-full text-white text-center px-4">
					<div class="max-w-4xl">
						<h1 class="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
						<p class="text-lg md:text-xl mb-8 text-gray-200">{slide.description}</p>
						<button class="bg-otaku-pink hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg transition-colors">
							Comenzar
						</button>
					</div>
				</div>
			</div>
		</div>
	{/each}

	<!-- Slider Controls -->
	<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
		{#each slides as _, i}
			<button
				class="w-3 h-3 rounded-full transition-colors {currentSlide === i ? 'bg-otaku-pink' : 'bg-white opacity-50'}"
				on:click={() => goToSlide(i)}
			></button>
		{/each}
	</div>
</section>

<!-- Welcome Section -->
<section class="py-16 bg-white">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
		<h2 class="text-3xl font-bold text-gray-900 mb-4">Bienvenido a OtakuTees.store</h2>
		<p class="text-lg text-gray-600 max-w-2xl mx-auto">
			Tu tienda especializada en camisas y sacos personalizados con estampados de anime.
			¡Crea tu estilo único!
		</p>
	</div>
</section>
