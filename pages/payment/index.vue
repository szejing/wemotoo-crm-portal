<template>
	<div class="space-y-8">
		<h2 class="font-bold">Payment Management</h2>
		<ZMenu :navigations="payment_navigations" />
	</div>
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

<style scoped lang="postcss"></style>
