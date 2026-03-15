import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '../../../../lib/server/database';

async function parseCallbackRequest(request: Request) {
	const contentType = request.headers.get('content-type') ?? '';

	if (contentType.includes('application/json')) {
		const body = await request.json();

		return {
			transactionState: typeof body?.transactionState === 'string' ? body.transactionState : undefined,
			referenceCode: typeof body?.referenceCode === 'string' ? body.referenceCode : undefined,
			transactionId: typeof body?.transactionId === 'string' ? body.transactionId : undefined
		};
	}

	if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
		const formData = await request.formData();

		return {
			transactionState: formData.get('transactionState')?.toString(),
			referenceCode: formData.get('referenceCode')?.toString(),
			transactionId: formData.get('transactionId')?.toString()
		};
	}

	return {
		transactionState: undefined,
		referenceCode: undefined,
		transactionId: undefined
	};
}

export const POST: RequestHandler = async ({ request }) => {
	const { transactionState, referenceCode, transactionId } = await parseCallbackRequest(request);

	if (!transactionState || !referenceCode) {
		return json({ error: 'transactionState and referenceCode are required' }, { status: 400 });
	}

	const order = await db.order.findUnique({
		where: { id: referenceCode }
	});

	if (!order) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	if (transactionState === 'APPROVED') {
		await db.order.update({
			where: { id: referenceCode },
			data: {
				status: 'PROCESSING',
				paymentStatus: 'APPROVED',
				paymentId: transactionId ?? order.paymentId
			}
		});
	} else if (transactionState === 'DECLINED') {
		await db.order.update({
			where: { id: referenceCode },
			data: {
				status: 'CANCELLED',
				paymentStatus: 'DECLINED',
				paymentId: transactionId ?? order.paymentId
			}
		});
	} else {
		await db.order.update({
			where: { id: referenceCode },
			data: {
				paymentStatus: transactionState,
				paymentId: transactionId ?? order.paymentId
			}
		});
	}

	return json({ success: true });
};
