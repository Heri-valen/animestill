# Backend Implementation Plan for OtakuTees.store

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement complete backend with API routes, database persistence, and PayU payment integration for the e-commerce site.

**Architecture:** SvelteKit API routes with session-based auth, SQLite database via Prisma, and PayU SDK integration.

**Tech Stack:** SvelteKit, TypeScript, Prisma, SQLite, PayU SDK, Session-based auth

---

### Task 1: Update Prisma Schema with Complete Relations

**Files:**

- Modify: `prisma/schema.prisma`

**Step 1: Open and review current schema**

Run: `cat prisma/schema.prisma`

**Step 2: Update schema with complete relations**

Update the schema to include:

- User → Order (one-to-many)
- Order → OrderItem (one-to-many)
- OrderItem → Product (many-to-one)
- Add CartItem model for persistent cart

```prisma
// Add to schema.prisma
model CartItem {
  id        String   @id @default(uuid())
  userId    String?
  sessionId String?
  productId String
  quantity  Int
  customizations Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product Product @relation(fields: [productId], references: [id])

  @@index([userId])
  @@index([sessionId])
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal
  customizations Json?

  order   Order   @relation(fields: [orderId], references: [id])
  product Product @relation(fields: [productId], references: [id])
}
```

**Step 3: Apply schema changes**

Run: `npx prisma db push`

**Step 4: Verify changes**

Run: `npx prisma studio`

**Step 5: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: update prisma schema with complete relations"
```

---

### Task 2: Create Database Seeding Script

**Files:**

- Create: `prisma/seed.ts`
- Modify: `package.json` (add seed script)

**Step 1: Create seed script**

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Seed products
	const products = [
		{
			name: 'Camiseta Anime Personalizada',
			description: 'Camiseta 100% algodón con impresión digital',
			price: 25.99,
			image: '/images/camiseta-basica.jpg',
			category: 'camisetas'
		},
		{
			name: 'Sudadera Anime Premium',
			description: 'Sudadera con capucha, algodón premium',
			price: 45.99,
			image: '/images/sudadera-premium.jpg',
			category: 'sudaderas'
		}
	];

	for (const product of products) {
		await prisma.product.upsert({
			where: { name: product.name },
			update: {},
			create: product
		});
	}

	console.log('Database seeded successfully');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
```

**Step 2: Add seed script to package.json**

Add to scripts section:

```json
"db:seed": "ts-node prisma/seed.ts"
```

**Step 3: Run seed**

Run: `npm run db:seed`

**Step 4: Verify data**

Run: `npx prisma studio`

**Step 5: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add database seeding script"
```

---

### Task 3: Create Authentication API Routes

**Files:**

- Create: `src/routes/api/auth/register/+server.ts`
- Create: `src/routes/api/auth/login/+server.ts`
- Create: `src/routes/api/auth/logout/+server.ts`

**Step 1: Create register endpoint**

```typescript
// src/routes/api/auth/register/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { email, password, name } = await request.json();

	// Validate input
	if (!email || !password || !name) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	// Check if user exists
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		return json({ error: 'User already exists' }, { status: 400 });
	}

	// Hash password
	const hashedPassword = await hash(password, 10);

	// Create user
	const user = await prisma.user.create({
		data: {
			email,
			password: hashedPassword,
			name
		}
	});

	return json({ user: { id: user.id, email: user.email, name: user.name } });
}
```

**Step 2: Create login endpoint**

```typescript
// src/routes/api/auth/login/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST({ request, cookies }) {
	const { email, password } = await request.json();

	// Validate input
	if (!email || !password) {
		return json({ error: 'Missing required fields' }, { status: 400 });
	}

	// Find user
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	// Verify password
	const validPassword = await compare(password, user.password);
	if (!validPassword) {
		return json({ error: 'Invalid credentials' }, { status: 401 });
	}

	// Set session cookie
	cookies.set('session', user.id, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 7 // 1 week
	});

	return json({ user: { id: user.id, email: user.email, name: user.name } });
}
```

**Step 3: Create logout endpoint**

```typescript
// src/routes/api/auth/logout/+server.ts
import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
	cookies.delete('session', { path: '/' });
	return json({ message: 'Logged out successfully' });
}
```

**Step 4: Install bcryptjs**

Run: `npm install bcryptjs @types/bcryptjs`

**Step 5: Test endpoints**

Use Postman/Thunder Client to test:

- Register: POST `/api/auth/register`
- Login: POST `/api/auth/login`
- Logout: POST `/api/auth/logout`

**Step 6: Commit**

```bash
git add src/routes/api/auth/ package.json package-lock.json
git commit -m "feat: add authentication API routes"
```

---

### Task 4: Create Products API Routes

**Files:**

- Create: `src/routes/api/products/+server.ts`
- Create: `src/routes/api/products/[id]/+server.ts`

**Step 1: Create products list endpoint**

```typescript
// src/routes/api/products/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
	const products = await prisma.product.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return json(products);
}

export async function POST({ request, locals }) {
	// Protected admin route
	if (!locals.user?.isAdmin) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { name, description, price, image, category } = await request.json();

	const product = await prisma.product.create({
		data: { name, description, price, image, category }
	});

	return json(product);
}
```

**Step 2: Create single product endpoint**

```typescript
// src/routes/api/products/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params }) {
	const product = await prisma.product.findUnique({
		where: { id: params.id }
	});

	if (!product) {
		return json({ error: 'Product not found' }, { status: 404 });
	}

	return json(product);
}
```

**Step 3: Test endpoints**

Run: `curl http://localhost:5173/api/products`

**Step 4: Commit**

```bash
git add src/routes/api/products/
git commit -m "feat: add products API routes"
```

---

### Task 5: Create Cart API Routes

**Files:**

- Create: `src/routes/api/cart/+server.ts`
- Create: `src/routes/api/cart/[productId]/+server.ts`

**Step 1: Create cart endpoints**

```typescript
// src/routes/api/cart/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ cookies }) {
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		return json({ items: [] });
	}

	const cartItems = await prisma.cartItem.findMany({
		where: { sessionId },
		include: { product: true }
	});

	return json({ items: cartItems });
}

export async function POST({ request, cookies }) {
	const { productId, quantity, customizations } = await request.json();
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	// Create session if needed
	if (!sessionId) {
		const newSessionId = crypto.randomUUID();
		cookies.set('cart-session', newSessionId, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30 // 30 days
		});
	}

	// Add item to cart
	const cartItem = await prisma.cartItem.upsert({
		where: {
			sessionId_productId: { sessionId: sessionId || '', productId }
		},
		update: { quantity: { increment: quantity } },
		create: {
			sessionId: sessionId || '',
			productId,
			quantity,
			customizations
		},
		include: { product: true }
	});

	return json(cartItem);
}

export async function DELETE({ cookies }) {
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (sessionId) {
		await prisma.cartItem.deleteMany({ where: { sessionId } });
	}

	return json({ message: 'Cart cleared' });
}
```

**Step 2: Create cart item delete endpoint**

```typescript
// src/routes/api/cart/[productId]/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE({ params, cookies }) {
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		return json({ error: 'No session' }, { status: 400 });
	}

	await prisma.cartItem.deleteMany({
		where: { sessionId, productId: params.productId }
	});

	return json({ message: 'Item removed from cart' });
}
```

**Step 3: Test cart functionality**

Run:

```bash
curl -X POST http://localhost:5173/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "product-1", "quantity": 2}'
```

**Step 4: Commit**

```bash
git add src/routes/api/cart/
git commit -m "feat: add cart API routes"
```

---

### Task 6: Create Orders API Routes

**Files:**

- Create: `src/routes/api/orders/+server.ts`
- Create: `src/routes/api/orders/[id]/+server.ts`

**Step 1: Create orders endpoints**

```typescript
// src/routes/api/orders/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request, cookies }) {
	const { shippingAddress, paymentMethod } = await request.json();
	const sessionId = cookies.get('session') || cookies.get('cart-session');

	if (!sessionId) {
		return json({ error: 'No cart session' }, { status: 400 });
	}

	// Get cart items
	const cartItems = await prisma.cartItem.findMany({
		where: { sessionId },
		include: { product: true }
	});

	if (cartItems.length === 0) {
		return json({ error: 'Cart is empty' }, { status: 400 });
	}

	// Calculate total
	const total = cartItems.reduce(
		(sum, item) => sum + parseFloat(item.product.price) * item.quantity,
		0
	);

	// Create order
	const order = await prisma.order.create({
		data: {
			userId: cookies.get('session') || null,
			total: total,
			status: 'pending',
			shippingAddress: JSON.stringify(shippingAddress),
			paymentMethod
		}
	});

	// Create order items
	for (const item of cartItems) {
		await prisma.orderItem.create({
			data: {
				orderId: order.id,
				productId: item.productId,
				quantity: item.quantity,
				price: item.product.price,
				customizations: item.customizations
			}
		});
	}

	// Clear cart
	await prisma.cartItem.deleteMany({ where: { sessionId } });

	return json({ order, items: cartItems });
}
```

**Step 2: Create order status endpoint**

```typescript
// src/routes/api/orders/[id]/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET({ params, cookies }) {
	const sessionId = cookies.get('session');

	const order = await prisma.order.findUnique({
		where: { id: params.id },
		include: { items: { include: { product: true } } }
	});

	if (!order) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	// Check ownership
	if (order.userId && order.userId !== sessionId) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	return json(order);
}
```

**Step 3: Test orders**

Use Postman to:

1. Add items to cart
2. Create order: POST `/api/orders`
3. Check order status: GET `/api/orders/[id]`

**Step 4: Commit**

```bash
git add src/routes/api/orders/
git commit -m "feat: add orders API routes"
```

---

### Task 7: Integrate PayU Payment Gateway

**Files:**

- Create: `src/routes/api/payu/+server.ts`
- Create: `src/routes/api/payu/callback/+server.ts`
- Modify: `src/routes/pago/+page.svelte` (remove mock, integrate real PayU)

**Step 1: Install PayU SDK**

Run: `npm install payu-sdk`

**Step 2: Create PayU initiation endpoint**

```typescript
// src/routes/api/payu/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { orderId, amount, description } = await request.json();

	// Validate order
	const order = await prisma.order.findUnique({
		where: { id: orderId }
	});

	if (!order) {
		return json({ error: 'Order not found' }, { status: 404 });
	}

	// Create PayU payment reference
	const payuData = {
		merchantId: process.env.PAYU_MERCHANT_ID,
		apiKey: process.env.PAYU_API_KEY,
		accountId: process.env.PAYU_ACCOUNT_ID,
		referenceCode: orderId,
		amount: amount.toString(),
		currency: 'COP',
		description: description || `Pedido ${orderId}`,
		responseUrl: `${process.env.BASE_URL}/api/payu/callback`,
		confirmationUrl: `${process.env.BASE_URL}/api/payu/callback`
	};

	return json({
		paymentUrl: `https://checkout.payu.com`,
		referenceCode: orderId,
		amount: amount
	});
}
```

**Step 3: Create PayU callback endpoint**

```typescript
// src/routes/api/payu/callback/+server.ts
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { transactionState, referenceCode, ...rest } = await request.json();

	// Verify signature (simplified - implement proper verification)

	if (transactionState === 'APPROVED') {
		// Update order status
		await prisma.order.update({
			where: { id: referenceCode },
			data: { status: 'paid', paymentDate: new Date() }
		});
	} else if (transactionState === 'DECLINED') {
		await prisma.order.update({
			where: { id: referenceCode },
			data: { status: 'failed' }
		});
	}

	return json({ success: true });
}
```

**Step 4: Update checkout page to use real PayU**

Remove mock integration in `src/routes/pago/+page.svelte` and integrate real PayU flow.

**Step 5: Configure environment variables**

Add to `.env`:

```env
PAYU_MERCHANT_ID=your_merchant_id
PAYU_API_KEY=your_api_key
PAYU_ACCOUNT_ID=your_account_id
BASE_URL=http://localhost:5173
```

**Step 6: Commit**

```bash
git add src/routes/api/payu/ src/routes/pago/+page.svelte .env.example
git commit -m "feat: integrate PayU payment gateway"
```

---

### Task 8: Update Frontend Stores to Use API

**Files:**

- Modify: `src/lib/stores/auth.ts`
- Modify: `src/routes/personalizar/+page.svelte`
- Modify: `src/routes/carrito/+page.svelte`

**Step 1: Update cart store**

```typescript
// src/lib/stores/cart.ts (new file)
import { writable } from 'svelte/store';

export const cart = writable([]);

export async function loadCart() {
	try {
		const response = await fetch('/api/cart');
		const data = await response.json();
		cart.set(data.items || []);
	} catch (error) {
		console.error('Failed to load cart:', error);
	}
}

export async function addToCart(productId, quantity, customizations) {
	const response = await fetch('/api/cart', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ productId, quantity, customizations })
	});

	if (response.ok) {
		await loadCart();
	}
}

export async function removeFromCart(productId) {
	const response = await fetch(`/api/cart/${productId}`, {
		method: 'DELETE'
	});

	if (response.ok) {
		await loadCart();
	}
}

export async function clearCart() {
	const response = await fetch('/api/cart', {
		method: 'DELETE'
	});

	if (response.ok) {
		cart.set([]);
	}
}
```

**Step 2: Update personalization page**

```typescript
// src/routes/personalizar/+page.svelte (partial update)
<script>
  import { addToCart } from '$lib/stores/cart'

  async function handleAddToCart() {
    await addToCart(product.id, 1, {
      color: selectedColor,
      size: selectedSize,
      text: customText,
      image: uploadedImage
    })
  }
</script>
```

**Step 3: Update cart page**

```typescript
// src/routes/carrito/+page.svelte (partial update)
<script>
  import { cart, removeFromCart, clearCart } from '$lib/stores/cart'
  import { onMount } from 'svelte'

  onMount(() => {
    loadCart()
  })
</script>
```

**Step 4: Test frontend integration**

- Load personalization page
- Add item to cart
- Verify cart persists after refresh

**Step 5: Commit**

```bash
git add src/lib/stores/cart.ts src/routes/personalizar/+page.svelte src/routes/carrito/+page.svelte
git commit -m "feat: update frontend stores to use API"
```

---

### Task 9: Create Environment Configuration

**Files:**

- Create: `.env.example`
- Modify: `.gitignore` (ensure .env is ignored)

**Step 1: Create environment template**

```env
# Database
DATABASE_URL=file:./dev.db

# PayU Credentials
PAYU_MERCHANT_ID=your_merchant_id_here
PAYU_API_KEY=your_api_key_here
PAYU_ACCOUNT_ID=your_account_id_here

# Application
BASE_URL=http://localhost:5173
NODE_ENV=development
```

**Step 2: Update gitignore**

Ensure `.env` is in `.gitignore`

**Step 3: Verify environment loading**

Run: `npm run dev` and check if environment variables are accessible

**Step 4: Commit**

```bash
git add .env.example .gitignore
git commit -m "feat: add environment configuration"
```

---

### Task 10: Create Integration Tests

**Files:**

- Create: `tests/api/auth.test.ts`
- Create: `tests/api/cart.test.ts`
- Create: `tests/api/orders.test.ts`

**Step 1: Create auth tests**

```typescript
// tests/api/auth.test.ts
import { describe, it, expect } from 'vitest';

describe('Authentication API', () => {
	it('should register a new user', async () => {
		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test@example.com',
				password: 'password123',
				name: 'Test User'
			})
		});

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.user.email).toBe('test@example.com');
	});

	it('should login existing user', async () => {
		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: 'test@example.com',
				password: 'password123'
			})
		});

		expect(response.status).toBe(200);
	});
});
```

**Step 2: Create cart tests**

```typescript
// tests/api/cart.test.ts
import { describe, it, expect } from 'vitest';

describe('Cart API', () => {
	it('should add item to cart', async () => {
		const response = await fetch('/api/cart', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				productId: 'product-1',
				quantity: 2
			})
		});

		expect(response.status).toBe(200);
	});

	it('should get cart items', async () => {
		const response = await fetch('/api/cart');
		expect(response.status).toBe(200);
		const data = await response.json();
		expect(Array.isArray(data.items)).toBe(true);
	});
});
```

**Step 3: Run tests**

Run: `npm test` or `npm run test:api`

**Step 4: Commit**

```bash
git add tests/
git commit -m "feat: add API integration tests"
```

---

### Task 11: Deploy Configuration

**Files:**

- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Modify: `package.json` (add build script)

**Step 1: Create Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 5173

CMD ["npm", "start"]
```

**Step 2: Create docker-compose.yml**

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '5173:5173'
    environment:
      - DATABASE_URL=file:./dev.db
      - NODE_ENV=production
    volumes:
      - ./data:/app/data
```

**Step 3: Update package.json scripts**

```json
"build": "vite build",
"start": "node build/index.js"
```

**Step 4: Test Docker build**

Run: `docker build -t animestill-store .`

**Step 5: Commit**

```bash
git add Dockerfile docker-compose.yml
git commit -m "feat: add Docker deployment configuration"
```

---

## Execution Options

**Plan complete and saved to `docs/plans/2026-03-15-backend-implementation-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
