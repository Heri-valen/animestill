import { PrismaClient, ProductType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const products = [
		{
			name: 'Camiseta Anime Personalizada',
			description: 'Camiseta 100% algodón con impresión digital de alta calidad',
			basePrice: 25.99,
			type: ProductType.SHIRT,
			sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
			colors: JSON.stringify(['Negro', 'Blanco', 'Gris', 'Azul', 'Rosa']),
			images: JSON.stringify(['/images/camiseta-basica.jpg']),
			active: true
		},
		{
			name: 'Sudadera Anime Premium',
			description: 'Sudadera con capucha, algodón premium',
			basePrice: 45.99,
			type: ProductType.JACKET,
			sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
			colors: JSON.stringify(['Negro', 'Gris', 'Azul Marino']),
			images: JSON.stringify(['/images/sudadera-premium.jpg']),
			active: true
		},
		{
			name: 'T-Shirt Oversized Anime',
			description: 'Estilo oversized para un look moderno',
			basePrice: 32.99,
			type: ProductType.SHIRT,
			sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
			colors: JSON.stringify(['Negro', 'Blanco', 'Beige']),
			images: JSON.stringify(['/images/tshirt-oversized.jpg']),
			active: true
		},
		{
			name: 'Crop Top Anime',
			description: 'Crop top trendy con diseños exclusivos',
			basePrice: 19.99,
			type: ProductType.SHIRT,
			sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
			colors: JSON.stringify(['Negro', 'Blanco', 'Rosa', 'Verde']),
			images: JSON.stringify(['/images/crop-top.jpg']),
			active: true
		},
		{
			name: 'Hoodie Zippered Anime',
			description: 'Sudadera con cierre, ideal para todas las temporadas',
			basePrice: 52.99,
			type: ProductType.JACKET,
			sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
			colors: JSON.stringify(['Negro', 'Gris', 'Azul Marino', 'Verde']),
			images: JSON.stringify(['/images/hoodie-zip.jpg']),
			active: true
		},
		{
			name: 'Manga Larga Anime',
			description: 'Camiseta de manga larga, perfecta para layering',
			basePrice: 29.99,
			type: ProductType.SHIRT,
			sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
			colors: JSON.stringify(['Negro', 'Blanco', 'Gris', 'Azul']),
			images: JSON.stringify(['/images/manga-larga.jpg']),
			active: true
		}
	];

	for (const product of products) {
		await prisma.product.create({ data: product });
	}

	console.log('Database seeded successfully');
	console.log(`Created ${products.length} products`);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
