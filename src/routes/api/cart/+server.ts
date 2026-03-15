import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export async function GET({ cookies }: RequestEvent) {
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		return json({ items: [] });
	}

	const cartItems = await db.cartItem.findMany({
		where: { sessionId },
		include: { product: true }
	});

	return json({ items: cartItems });
}

export async function POST({ request, cookies }: RequestEvent) {
	const body = await request.json() as {
		productId: string;
		quantity: number;
		customizations?: unknown;
	};
	const { productId, quantity, customizations } = body;
	let sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		sessionId = crypto.randomUUID();
		cookies.set('cart-session', sessionId, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30,
			path: '/'
		});
	}

	const existingItem = await db.cartItem.findUnique({
		where: { sessionId_productId: { sessionId, productId } }
	});

	if (existingItem) {
		const cartItem = await db.cartItem.update({
			where: { id: existingItem.id },
			data: { quantity: { increment: quantity } },
			include: { product: true }
		});
		return json(cartItem);
	}

	const cartItem = await db.cartItem.create({
		data: {
			sessionId,
			productId,
			quantity,
			customizations: customizations as object
		},
		include: { product: true }
	});

	return json(cartItem);
}

export async function DELETE({ cookies }: RequestEvent) {
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (sessionId) {
		await db.cartItem.deleteMany({ where: { sessionId } });
	}

	return json({ message: 'Cart cleared' });
}
