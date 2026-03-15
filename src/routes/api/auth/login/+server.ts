import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST({ request, cookies }: RequestEvent) {
	const { email, password } = await request.json();
	if (!email || !password) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}
	const validPassword = await compare(password, user.password);
	if (!validPassword) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}
	cookies.set('session', user.id, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7
	});
	return json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}
