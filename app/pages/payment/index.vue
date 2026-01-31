<template>
	<UDashboardPanel id="payment">
		<template #header>
			<UDashboardNavbar title="Payment Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Payment Management</h2>
					<p class="text-gray-600 dark:text-gray-400">Configure payment types and methods for your business</p>
				</div>

				<!-- Payment Configuration Section -->
				<ZMenu
					title="Payment Configuration"
					:icon="ICONS.PAYMENT_METHODS"
					description="Configure payment types and methods for your business"
					color="green"
					:navigations="payment_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Payment' });

const payment_navigations = [
	{
		title: 'Payment Type',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
		description: 'Define payment types like cash, credit card, digital wallet',
	},
	{
		title: 'Payment Method',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
		description: 'Configure specific payment methods and providers',
	},
];
</script>

<style scoped></style>
