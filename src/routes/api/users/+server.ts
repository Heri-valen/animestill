import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const GET: RequestHandler = async () => {
	const users = await db.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			createdAt: true,
			password: false
		},
		orderBy: { createdAt: 'desc' }
	});

	return json(users);
};
