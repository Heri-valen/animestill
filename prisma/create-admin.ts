import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
	const hashedPassword = await bcrypt.hash('admin123', 10);

	const admin = await prisma.user.upsert({
		where: { email: 'admin@animestill.store' },
		update: {},
		create: {
			email: 'admin@animestill.store',
			password: hashedPassword,
			name: 'Administrador',
			role: 'ADMIN'
		}
	});

	console.log('Admin user created:', admin.email);
	console.log('Password: admin123');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
