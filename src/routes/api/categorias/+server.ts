import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const categories = await db.category.findMany({
		orderBy: { order: 'asc' }
	});
	return json(categories);
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const category = await db.category.create({
			data: {
				name: body.name,
				slug: body.slug || body.name.toLowerCase().replace(/\s+/g, '-'),
				image: body.image || null,
				order: body.order || 0,
				active: body.active ?? true
			}
		});
		return json(category, { status: 201 });
	} catch (e) {
		return json({ error: 'Failed to create category' }, { status: 500 });
	}
};
