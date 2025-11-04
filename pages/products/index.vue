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
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.LIST" class="text-2xl text-orange-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Products & Services</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">View and manage your product catalog</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<UCard
							:to="main_navigation.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex items-start gap-4">
								<div class="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
									<UIcon :name="main_navigation.icon" class="text-2xl text-orange-600 dark:text-orange-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ main_navigation.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ main_navigation.description }}</p>
								</div>
								<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
							</div>
						</UCard>
					</div>
				</div>

				<!-- Product Attributes Section -->
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.ADDITIONAL" class="text-2xl text-purple-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Product Attributes</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">Organize and categorize your products</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<UCard
							v-for="(navigate, index) in attribute_navigations"
							:key="index"
							:to="navigate.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex flex-col gap-3">
								<div class="flex items-start justify-between">
									<div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
										<UIcon :name="navigate.icon" class="text-2xl text-purple-600 dark:text-purple-400" />
									</div>
									<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
								</div>
								<div>
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
								</div>
							</div>
						</UCard>
					</div>
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
