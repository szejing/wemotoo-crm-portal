<template>
	<UDashboardPanel id="products">
		<template #header>
			<UDashboardNavbar :title="$t('pages.servicesProductsManagement')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.servicesProductsManagement') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.servicesProductsManagementDesc') }}</p>
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
const { t } = useI18n();
useHead({ title: () => t('pages.productsTitle') });

const main_navigation = computed(() => ({
	title: t('pages.servicesProducts'),
	icon: ICONS.LIST,
	to: '/products/listing',
	description: t('pages.servicesProductsDesc'),
}));

const attribute_navigation = computed(() => ({
	title: t('pages.productAttributes'),
	icon: ICONS.ADDITIONAL,
	to: '/products/attributes',
	description: t('pages.productAttributesDesc'),
}));

const attribute_navigations = computed(() => [
	{
		title: t('nav.categories'),
		icon: ICONS.CATEGORY,
		to: '/products/categories',
		description: t('pages.categoriesDesc'),
	},
	{
		title: t('nav.tags'),
		icon: ICONS.ADDITIONAL,
		to: '/products/tags',
		description: t('pages.tagsDesc'),
	},
	{
		title: t('nav.brands'),
		icon: ICONS.ADDITIONAL,
		to: '/products/brands',
		description: t('pages.brandsManufacturersDesc'),
	},
	{
		title: t('nav.options'),
		icon: ICONS.ADDITIONAL,
		to: '/products/options',
		description: t('pages.optionsVariantsDesc'),
	},
]);
</script>

<style scoped></style>
