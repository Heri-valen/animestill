import type { Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database.js';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session');

	if (sessionId) {
		const user = await db.user.findUnique({
			where: { id: sessionId },
			select: { id: true, email: true, name: true, role: true }
		});

		if (user) {
			event.locals.user = {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
				isAdmin: user.role === 'ADMIN'
			};
		}
	}

	return resolve(event);
};
