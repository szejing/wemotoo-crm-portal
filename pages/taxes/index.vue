<template>
	<div class="space-y-8">
		<h2 class="font-bold">Payment Management</h2>
		<ZMenu :navigations="payment_navigations" />
	</div>
</template>

<script lang="ts" setup>
const payment_navigations = [
	{
		title: 'Tax Codes',
		icon: ICONS.TAX,
		to: '/tax-codes',
	},
	{
		title: 'Tax Groups',
		icon: ICONS.TAX,
		to: '/tax-groups',
	},
	{
		title: 'Tax Rules',
		icon: ICONS.TAX,
		to: '/tax-rules',
	},
];
</script>

<style scoped lang="postcss"></style>
