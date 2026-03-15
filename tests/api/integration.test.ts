const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function testProductsAPI() {
	const response = await fetch(`${BASE_URL}/api/products`);
	const data = await response.json();
	console.log('Products API:', response.ok, Array.isArray(data));
}

async function testCartAPI() {
	const response = await fetch(`${BASE_URL}/api/cart`);
	const data = await response.json();
	console.log('Cart API:', response.ok, Array.isArray(data.items));
}

async function testAuthAPI() {
	const response = await fetch(`${BASE_URL}/api/auth/register`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: 'test@example.com' })
	});
	console.log('Auth API:', response.status === 400);
}

testProductsAPI();
testCartAPI();
testAuthAPI();
