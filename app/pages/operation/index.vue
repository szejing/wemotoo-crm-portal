<template>
	<UDashboardPanel id="operation">
		<template #header>
			<UDashboardNavbar :title="$t('nav.operation')" :ui="{ right: 'gap-3' }">
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
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.operationManagement') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.operationManagementDesc') }}</p>
				</div>

				<!-- Operation Options Section -->
				<div class="space-y-4">
					<ZMenu
						:title="$t('pages.operationOptions')"
						:icon="operation_navigation.icon"
						:description="$t('pages.operationOptionsDesc')"
						color="primary"
						:navigations="operation_navigations"
					/>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('pages.operationTitle') });

const operation_navigation = computed(() => ({
	title: t('nav.operation'),
	icon: ICONS.USER_GROUP_ROUNDED,
	to: '/operation',
	description: t('pages.operationManagementDesc'),
}));

const operation_navigations = computed(() => [
	{
		title: t('nav.staffs'),
		icon: ICONS.USER_GROUP_ROUNDED,
		to: '/operation/staff',
		description: t('pages.staffDesc'),
	},
	{
		title: t('nav.outlets'),
		icon: ICONS.OUTLET,
		to: '/operation/outlets',
		description: t('pages.outletsDesc'),
	},
]);
</script>

<style scoped></style>
