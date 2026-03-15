import { writable, get } from 'svelte/store';

export const cart = writable<Array<{
	id: string;
	productId: string;
	quantity: number;
	customizations?: unknown;
	product?: {
		id: string;
		name: string;
		basePrice: number;
		images: string;
	};
}>>([]);

export async function loadCart() {
	try {
		const response = await fetch('/api/cart');
		const data = await response.json();
		cart.set(data.items || []);
	} catch (error) {
		console.error('Failed to load cart:', error);
	}
}

export async function addToCart(productId: string, quantity: number, customizations?: unknown) {
	try {
		const response = await fetch('/api/cart', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ productId, quantity, customizations })
		});

		if (response.ok) {
			await loadCart();
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to add to cart:', error);
		return false;
	}
}

export async function removeFromCart(productId: string) {
	try {
		const response = await fetch(`/api/cart/${productId}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			await loadCart();
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to remove from cart:', error);
		return false;
	}
}

export async function clearCart() {
	try {
		const response = await fetch('/api/cart', {
			method: 'DELETE'
		});

		if (response.ok) {
			cart.set([]);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Failed to clear cart:', error);
		return false;
	}
}

export function getCartTotal() {
	const items = get(cart);
	return items.reduce(
		(sum, item) => sum + (item.product?.basePrice || 0) * item.quantity,
		0
	);
}
