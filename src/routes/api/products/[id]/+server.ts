import type { Product } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../../lib/server/database.js';

function parseStringArray(value: string): string[] {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed)
			? parsed.filter((item): item is string => typeof item === 'string')
			: [];
	} catch {
		return [];
	}
}

function toProductResponse(product: Product) {
	const images = parseStringArray(product.images);

	return {
		...product,
		price: product.basePrice,
		image: images[0] ?? null,
		category: product.type,
		sizes: parseStringArray(product.sizes),
		colors: parseStringArray(product.colors),
		images
	};
}

export const GET: RequestHandler = async ({ params }) => {
	const product = await db.product.findUnique({
		where: { id: params.id }
	});

	if (!product) {
		return json({ error: 'Product not found' }, { status: 404 });
	}

	return json(toProductResponse(product));
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();

		const product = await db.product.update({
			where: { id: params.id },
			data: {
				name: body.name,
				description: body.description,
				basePrice: body.basePrice,
				type: body.type,
				sizes: typeof body.sizes === 'string' ? body.sizes : JSON.stringify(body.sizes || []),
				colors: typeof body.colors === 'string' ? body.colors : JSON.stringify(body.colors || []),
				active: body.active
			}
		});

		return json(toProductResponse(product));
	} catch (e) {
		return json({ error: 'Failed to update product' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await db.product.delete({
			where: { id: params.id }
		});

		return json({ success: true });
	} catch (e) {
		return json({ error: 'Failed to delete product' }, { status: 500 });
	}
};
