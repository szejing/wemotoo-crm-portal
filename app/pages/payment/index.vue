<template>
	<UDashboardPanel id="payment">
		<template #header>
			<UDashboardNavbar :title="$t('pages.paymentManagement')" :ui="{ right: 'gap-3' }">
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
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('pages.paymentManagement') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.paymentManagementDesc') }}</p>
				</div>

				<!-- Payment Configuration Section -->
				<ZMenu
					:title="$t('pages.paymentConfiguration')"
					:icon="ICONS.PAYMENT_METHODS"
					:description="$t('pages.paymentConfigurationDesc')"
					color="green"
					:navigations="payment_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('pages.paymentTitle') });

const payment_navigations = computed(() => [
	{
		title: t('pages.paymentType'),
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
		description: t('pages.paymentTypeDesc'),
	},
	{
		title: t('pages.paymentMethod'),
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
		description: t('pages.paymentMethodDesc'),
	},
]);
</script>

<style scoped></style>
