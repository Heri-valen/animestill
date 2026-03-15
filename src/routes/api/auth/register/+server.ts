import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();


export async function POST({ request }: RequestEvent) {
	const { email, password, name } = await request.json();
	if (!email || !password || !name) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return json({ error: 'User already exists' }, { status: 400 });
	}
	const hashedPassword = await hash(password, 10);
	const user = await prisma.user.create({
		data: { email, password: hashedPassword, name }
	});
	return json({ user: { id: user.id, email: user.email, name: user.name } });
}
