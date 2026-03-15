<template>
	<ZPagePanel id="settings-payment" :title="$t('pages.paymentManagement')" back-to="/settings">
		<div class="space-y-4">
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
	</ZPagePanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('pages.paymentTitle') });

const payment_navigations = computed(() => [
	// {
	// 	title: t('pages.paymentType'),
	// 	icon: ICONS.PAYMENT_METHODS,
	// 	to: '/settings/payment/types',
	// 	description: t('pages.paymentTypeDesc'),
	// },
	{
		title: t('pages.paymentMethod'),
		icon: ICONS.PAYMENT_METHODS,
		to: '/settings/payment/methods',
		description: t('pages.paymentMethodDesc'),
	},
]);
</script>

<style scoped></style>
