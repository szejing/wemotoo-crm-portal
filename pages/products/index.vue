<template>
	<UContainer class="space-y-4 mt-8">
		<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
			<UButton v-for="(navigate, index) in product_navigations" :key="index" variant="ghost" color="gray" :to="navigate.to">
				<div class="flex flex-col items-center gap-2 mx-auto text-center">
					<UIcon size="24" :name="navigate.icon" />
					<span>{{ navigate.title }}</span>
				</div>
			</UButton>
		</div>
	</UContainer>
</template>

<script lang="ts" setup>
const product_navigations = [
	{
		title: 'Products',
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
