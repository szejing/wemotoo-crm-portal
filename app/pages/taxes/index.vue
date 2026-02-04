<template>
	<UDashboardPanel id="taxes">
		<template #header>
			<UDashboardNavbar :title="$t('pages.taxManagement')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.taxManagement') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.taxManagementDesc') }}</p>
				</div>

				<!-- Tax Configuration Section -->
				<ZMenu
					:title="$t('pages.taxConfiguration')"
					:icon="ICONS.TAX"
					:description="$t('pages.taxConfigurationDesc')"
					color="red"
					:navigations="tax_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('pages.taxesTitle') });

const tax_navigations = computed(() => [
	{
		title: t('nav.taxCodes'),
		icon: ICONS.TAX,
		to: '/taxes/codes',
		description: t('pages.taxCodesDesc'),
	},
	{
		title: t('nav.taxRules'),
		icon: ICONS.TAX,
		to: '/taxes/rules',
		description: t('pages.taxRulesDesc'),
	},
]);
</script>

<style scoped></style>
