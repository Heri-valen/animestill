import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../lib/server/database';

const PAYU_CHECKOUT_URL = 'https://checkout.payu.com';

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.trim().length > 0;
}

export const POST: RequestHandler = async ({ request }) => {
	let body: { orderId?: unknown; amount?: unknown; description?: unknown };

	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const { orderId, amount, description } = body;

	if (!isNonEmptyString(orderId)) {
		return json({ error: 'Order ID is required' }, { status: 400 });
	}

	const numericAmount = Number(amount);
	if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
		return json({ error: 'Amount must be a valid number' }, { status: 400 });
	}

	const order = await db.order.findUnique({
		where: { id: orderId }
	});

	if (!order) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	if (Math.abs(order.total - numericAmount) > 0.01) {
		return json({ error: 'Amount does not match order total' }, { status: 400 });
	}

	const merchantId = process.env.PAYU_MERCHANT_ID;
	const apiKey = process.env.PAYU_API_KEY;
	const accountId = process.env.PAYU_ACCOUNT_ID;
	const baseUrl = process.env.BASE_URL;

	if (!merchantId || !apiKey || !accountId || !baseUrl) {
		return json({ error: 'PayU is not configured' }, { status: 500 });
	}

	const payuData = {
		merchantId,
		apiKey,
		accountId,
		referenceCode: orderId,
		amount: numericAmount.toFixed(2),
		currency: 'COP',
		description: isNonEmptyString(description) ? description.trim() : `Pedido ${orderId}`,
		responseUrl: `${baseUrl}/api/payu/callback`,
		confirmationUrl: `${baseUrl}/api/payu/callback`
	};

	await db.order.update({
		where: { id: orderId },
		data: {
			paymentStatus: 'PENDING'
		}
	});

	return json({
		paymentUrl: PAYU_CHECKOUT_URL,
		referenceCode: payuData.referenceCode,
		amount: numericAmount,
		currency: payuData.currency,
		description: payuData.description
	});
};
