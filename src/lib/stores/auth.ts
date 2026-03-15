import { writable } from 'svelte/store';
import type { User } from '@prisma/client';

interface AuthState {
	user: User | null;
	loading: boolean;
}

export const authStore = writable<AuthState>({
	user: null,
	loading: true
});

export const cartStore = writable<any[]>([]);

export function addToCart(item: any) {
	cartStore.update(cart => [...cart, item]);
}

export function removeFromCart(itemId: string) {
	cartStore.update(cart => cart.filter(item => item.id !== itemId));
}

export function clearCart() {
	cartStore.set([]);
}
