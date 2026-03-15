import { writable, derived } from 'svelte/store';
import type { User } from '@prisma/client';

export type UserRole = 'USER' | 'ADMIN';

interface AuthState {
	user: User | null;
	loading: boolean;
}

export const authStore = writable<AuthState>({
	user: null,
	loading: true
});

export const cartStore = writable<any[]>([]);

export const userRole = derived(authStore, ($auth) => ($auth.user?.role as UserRole) || 'USER');

export const isAdmin = derived(authStore, ($auth) => ($auth.user?.role as UserRole) === 'ADMIN');
export const isLoggedIn = derived(authStore, ($auth) => !!$auth.user);

export function addToCart(item: any) {
	cartStore.update((cart) => [...cart, item]);
}

export function removeFromCart(itemId: string) {
	cartStore.update((cart) => cart.filter((item) => item.id !== itemId));
}

export function clearCart() {
	cartStore.set([]);
}

export function setUser(user: User | null) {
	authStore.update((state) => ({ ...state, user, loading: false }));
}

export function logout() {
	authStore.set({ user: null, loading: false });
}
