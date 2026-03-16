<script lang="ts">
	import { onMount } from 'svelte';

	let customers = $state<any[]>([]);
	let loading = $state(true);
	let showModal = $state(false);
	let editingCustomer = $state<any>(null);

	let customerForm = $state({
		name: '',
		email: '',
		role: 'USER'
	});

	onMount(async () => {
		try {
			const res = await fetch('/api/users');
			if (res.ok) {
				customers = await res.json();
			}
		} catch (e) {
			console.error('Failed to load customers:', e);
		} finally {
			loading = false;
		}
	});

	async function saveCustomer() {
		try {
			let res;
			if (editingCustomer) {
				res = await fetch(`/api/users/${editingCustomer.id}`, {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(customerForm)
				});
			}

			if (res?.ok) {
				const updated = await res.json();
				customers = customers.map((c) => (c.id === updated.id ? updated : c));
				closeModal();
			}
		} catch (e) {
			console.error('Failed to save customer:', e);
		}
	}

	async function deleteCustomer(id: string) {
		if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

		try {
			const res = await fetch(`/api/users/${id}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				customers = customers.filter((c) => c.id !== id);
			}
		} catch (e) {
			console.error('Failed to delete customer:', e);
		}
	}

	function openEditModal(customer: any) {
		editingCustomer = customer;
		customerForm = {
			name: customer.name,
			email: customer.email,
			role: customer.role
		};
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCustomer = null;
	}
</script>

<svelte:head>
	<title>Clientes - Admin</title>
</svelte:head>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-2xl font-bold">Clientes</h1>
	<span class="text-sm text-gray-500">{customers.length} clientes registrados</span>
</div>

{#if loading}
	<div class="py-8 text-center">Cargando...</div>
{:else if customers.length === 0}
	<div class="rounded-lg bg-white p-8 text-center shadow">
		<div class="mb-4 text-6xl">👥</div>
		<p class="text-gray-500">No hay clientes todavía</p>
		<p class="mt-2 text-sm text-gray-400">Los clientes se registrarán al hacer compras</p>
	</div>
{:else}
	<div class="overflow-hidden rounded-lg bg-white shadow">
		<table class="w-full">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
					<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-200">
				{#each customers as customer}
					<tr class="hover:bg-gray-50">
						<td class="px-6 py-4 font-medium">{customer.name}</td>
						<td class="px-6 py-4 text-gray-600">{customer.email}</td>
						<td class="px-6 py-4">
							<span
								class="rounded-full px-2 py-1 text-xs {customer.role === 'ADMIN'
									? 'bg-purple-100 text-purple-800'
									: 'bg-blue-100 text-blue-800'}"
							>
								{customer.role}
							</span>
						</td>
						<td class="px-6 py-4 text-sm text-gray-500">
							{new Date(customer.createdAt).toLocaleDateString('es-ES')}
						</td>
						<td class="px-6 py-4">
							<div class="flex items-center gap-2">
								<button
									onclick={() => openEditModal(customer)}
									class="flex items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
										/>
									</svg>
									Editar
								</button>
								<button
									onclick={() => deleteCustomer(customer.id)}
									class="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
								>
									<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
									Eliminar
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
		<div class="w-full max-w-md rounded-xl bg-white p-6">
			<h2 class="mb-4 text-xl font-bold">Editar Cliente</h2>
			<div class="space-y-4">
				<div>
					<label class="mb-1 block text-sm font-medium">Nombre</label>
					<input type="text" bind:value={customerForm.name} class="w-full rounded-lg border p-2" />
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium">Email</label>
					<input
						type="email"
						bind:value={customerForm.email}
						disabled
						class="w-full rounded-lg border bg-gray-100 p-2"
					/>
					<p class="mt-1 text-xs text-gray-500">El email no se puede cambiar</p>
				</div>
				<div>
					<label class="mb-1 block text-sm font-medium">Rol</label>
					<select bind:value={customerForm.role} class="w-full rounded-lg border p-2">
						<option value="USER">Usuario</option>
						<option value="ADMIN">Administrador</option>
					</select>
				</div>
			</div>
			<div class="mt-6 flex justify-end gap-3">
				<button onclick={closeModal} class="rounded-lg border px-4 py-2 hover:bg-gray-50"
					>Cancelar</button
				>
				<button
					onclick={saveCustomer}
					class="rounded-lg bg-[#ba5258] px-4 py-2 text-white hover:bg-red-600"
				>
					Actualizar
				</button>
			</div>
		</div>
	</div>
{/if}
