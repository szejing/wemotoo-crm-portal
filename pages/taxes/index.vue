<template>
	<div class="space-y-8">
		<h2 class="font-bold">Tax Management</h2>
		<ZMenu :navigations="tax_navigations" />
	</div>
</template>

<script lang="ts" setup>
const tax_navigations = [
	{
		title: 'Tax Codes',
		icon: ICONS.TAX,
		to: '/taxes/codes',
	},
	{
		title: 'Tax Groups',
		icon: ICONS.TAX,
		to: '/taxes/groups',
	},
	{
		title: 'Tax Rules',
		icon: ICONS.TAX,
		to: '/taxes/rules',
	},
];
</script>

<style scoped lang="postcss"></style>
