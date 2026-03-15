import type { Product, ProductType } from '@prisma/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../lib/server/database.js';

type AdminLocals = {
	user?: {
		isAdmin?: boolean;
		role?: string;
	};
};

type CreateProductPayload = {
	name?: unknown;
	description?: unknown;
	price?: unknown;
	basePrice?: unknown;
	image?: unknown;
	images?: unknown;
	category?: unknown;
	type?: unknown;
	sizes?: unknown;
	colors?: unknown;
	active?: unknown;
};

function parseStringArray(value: string): string[] {
	try {
		const parsed = JSON.parse(value);
		return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
	} catch {
		return [];
	}
}

function normalizeProductType(value: unknown): ProductType | null {
	if (typeof value !== 'string') {
		return null;
	}

	const normalizedValue = value.trim().toUpperCase();

	if (normalizedValue === 'SHIRT' || normalizedValue === 'CAMISA') {
		return 'SHIRT';
	}

	if (normalizedValue === 'JACKET' || normalizedValue === 'SACO') {
		return 'JACKET';
	}

	return null;
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

function toOptionalStringArray(value: unknown): string[] {
	return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

export const GET: RequestHandler = async () => {
	const products = await db.product.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return json(products.map(toProductResponse));
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const { user } = locals as AdminLocals;
	const isAdmin = Boolean(user?.isAdmin || user?.role === 'ADMIN');

	if (!isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	let payload: CreateProductPayload;

	try {
		payload = (await request.json()) as CreateProductPayload;
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const name = typeof payload.name === 'string' ? payload.name.trim() : '';
	const description = typeof payload.description === 'string' ? payload.description.trim() : '';
	const rawPrice = payload.price ?? payload.basePrice;
	const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
	const type = normalizeProductType(payload.category ?? payload.type);

	if (!name || !description || !Number.isFinite(price) || !type) {
		return json({ error: 'Invalid product payload' }, { status: 422 });
	}

	const primaryImage = typeof payload.image === 'string' ? payload.image.trim() : '';
	const images = toOptionalStringArray(payload.images);
	const product = await db.product.create({
		data: {
			name,
			description,
			basePrice: price,
			type,
			sizes: JSON.stringify(toOptionalStringArray(payload.sizes)),
			colors: JSON.stringify(toOptionalStringArray(payload.colors)),
			images: JSON.stringify(images.length > 0 ? images : primaryImage ? [primaryImage] : []),
			active: typeof payload.active === 'boolean' ? payload.active : true
		}
	});

	return json(toProductResponse(product), { status: 201 });
};
