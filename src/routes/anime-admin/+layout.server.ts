import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;

	if (!user) {
		throw redirect(303, '/auth/login?redirect=/anime-admin');
	}

	if (user.role !== 'ADMIN') {
		throw redirect(303, '/?error=unauthorized');
	}

	return {
		user
	};
};
