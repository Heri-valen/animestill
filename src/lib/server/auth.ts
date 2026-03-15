import bcrypt from 'bcryptjs';
import { db } from './database.js';
import type { User } from '@prisma/client';

export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export async function createUser(email: string, password: string, name: string, role: 'USER' | 'ADMIN' = 'USER') {
	const hashedPassword = await hashPassword(password);
	
	return await db.user.create({
		data: {
			email,
			password: hashedPassword,
			name,
			role
		}
	});
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
	const user = await db.user.findUnique({
		where: { email }
	});

	if (!user) {
		return null;
	}

	const isValidPassword = await verifyPassword(password, user.password);
	if (!isValidPassword) {
		return null;
	}

	return user;
}

export async function getUserById(id: string): Promise<User | null> {
	return await db.user.findUnique({
		where: { id }
	});
}
