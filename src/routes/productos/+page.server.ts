import { db } from '$lib/server/database';

export const load = async () => {
	const products = await db.product.findMany({
		where: { active: true },
		orderBy: { createdAt: 'desc' }
	});

	return { products };
};
