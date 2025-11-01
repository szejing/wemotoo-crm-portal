<template>
	<UDashboardPanel id="payment">
		<template #header>
			<UDashboardNavbar title="Payment Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZMenu :navigations="payment_navigations" />
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const payment_navigations = [
	{
		title: 'Payment Type',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
	},
	{
		title: 'Payment Method',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
	},
];

useHead({ title: 'Wemotoo CRM - Payment' });
</script>

<style scoped></style>
