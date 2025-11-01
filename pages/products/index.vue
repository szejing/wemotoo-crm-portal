<template>
	<UDashboardPanel id="products">
		<template #header>
			<UDashboardNavbar title="Services/Products Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZMenu :navigations="product_navigations" />
		</template>
	</UDashboardPanel>
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

useHead({ title: 'Wemotoo CRM - Products' });
</script>

<style scoped></style>
