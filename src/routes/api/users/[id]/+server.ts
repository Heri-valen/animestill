import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const body = await request.json();

		const user = await db.user.update({
			where: { id: params.id },
			data: {
				name: body.name,
				role: body.role
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				createdAt: true
			}
		});

		return json(user);
	} catch (e) {
		return json({ error: 'Failed to update user' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await db.user.delete({
			where: { id: params.id }
		});

		return json({ success: true });
	} catch (e) {
		return json({ error: 'Failed to delete user' }, { status: 500 });
	}
};
