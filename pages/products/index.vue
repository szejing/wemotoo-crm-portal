<template>
	<div>
		<h2 class="font-bold">Services/Products Management</h2>
		<ZMenu :navigations="product_navigations" />
	</div>
</template>

<script lang="ts" setup>
const product_navigations = [
	{
		title: 'Services/Products',
		icon: ICONS.LIST,
		to: '/products/listing',
	},
	{
		title: 'Categories',
		icon: ICONS.CATEGORY,
		to: '/products/categories',
	},
	{
		title: 'Tags',
		icon: ICONS.ADDITIONAL,
		to: '/products/tags',
	},
	{
		title: 'Brands',
		icon: ICONS.ADDITIONAL,
		to: '/products/brands',
	},
	{
		title: 'Options',
		icon: ICONS.ADDITIONAL,
		to: '/products/options',
	},
	// {
	// 	title: 'Types',
	// 	icon: ICONS.ADDITIONAL,
	// 	to: '/products/types',
	// },
];
</script>

<style scoped lang="postcss"></style>
