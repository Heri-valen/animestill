import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();
		const category = await db.category.update({
			where: { id: params.id },
			data: {
				name: body.name,
				slug: body.slug,
				image: body.image,
				order: body.order,
				active: body.active
			}
		});
		return json(category);
	} catch (e) {
		return json({ error: 'Failed to update category' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await db.category.delete({ where: { id: params.id } });
		return json({ success: true });
	} catch (e) {
		return json({ error: 'Failed to delete category' }, { status: 500 });
	}
};
