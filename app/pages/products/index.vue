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
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Services & Products Management</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your inventory, categories, and product attributes</p>
				</div>

				<!-- Main Products Section -->
				<div class="space-y-4">
					<ZMenu
						:title="main_navigation.title"
						:icon="main_navigation.icon"
						:description="main_navigation.description"
						color="primary"
						:navigations="[main_navigation]"
					/>
				</div>

				<!-- Product Attributes Section -->
				<div class="space-y-4">
					<ZMenu
						:title="attribute_navigation.title"
						:icon="attribute_navigation.icon"
						:description="attribute_navigation.description"
						color="purple"
						:navigations="attribute_navigations"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Products' });

// Main product listing
const main_navigation = {
	title: 'Services/Products',
	icon: ICONS.LIST,
	to: '/products/listing',
	description: 'Browse, add, edit, and manage all your products and services in one place',
};

// Product attributes and organizational tools
const attribute_navigation = {
	title: 'Product Attributes',
	icon: ICONS.ADDITIONAL,
	to: '/products/attributes',
	description: 'Organize and categorize your products',
};

const attribute_navigations = [
	{
		title: 'Categories',
		icon: ICONS.CATEGORY,
		to: '/products/categories',
		description: 'Organize products into categories and subcategories',
	},
	{
		title: 'Tags',
		icon: ICONS.ADDITIONAL,
		to: '/products/tags',
		description: 'Create tags to label and filter products',
	},
	{
		title: 'Brands',
		icon: ICONS.ADDITIONAL,
		to: '/products/brands',
		description: 'Manage product brands and manufacturers',
	},
	{
		title: 'Options',
		icon: ICONS.ADDITIONAL,
		to: '/products/options',
		description: 'Define product variants like size, color, and more',
	},
	// {
	// 	title: 'Types',
	// 	icon: ICONS.ADDITIONAL,
	// 	to: '/products/types',
	// 	description: 'Manage product types and classifications',
	// },
];
</script>

<style scoped></style>
