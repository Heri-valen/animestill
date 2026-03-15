import { json, type RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export async function POST({ request, cookies }: RequestEvent) {
	const { shippingAddress } = await request.json() as {
		shippingAddress: Record<string, unknown>;
	};
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		return json({ error: 'No cart session' }, { status: 400 });
	}

	const cartItems = await db.cartItem.findMany({
		where: { sessionId },
		include: { product: true }
	});

	if (cartItems.length === 0) {
		return json({ error: 'Cart is empty' }, { status: 400 });
	}

	const total = cartItems.reduce(
		(sum, item) => sum + parseFloat(String(item.product.basePrice)) * item.quantity,
		0
	);

	const order = await db.order.create({
		data: {
			userId: sessionId,
			total,
			status: 'PENDING',
			shippingInfo: JSON.stringify(shippingAddress)
		}
	});

	for (const item of cartItems) {
		await db.orderItem.create({
			data: {
				orderId: order.id,
				productId: item.productId,
				quantity: item.quantity,
				price: item.product.basePrice,
				customizations: item.customizations as object | undefined
			}
		});
	}

	await db.cartItem.deleteMany({ where: { sessionId } });

	return json({ order, items: cartItems });
}

export async function GET({ cookies }: RequestEvent) {
	const sessionId = cookies.get('session');

	if (!sessionId) {
		return json({ orders: [] });
	}

	const orders = await db.order.findMany({
		where: { userId: sessionId },
		include: { items: { include: { product: true } } },
		orderBy: { createdAt: 'desc' }
	});

	return json({ orders });
}
