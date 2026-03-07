<template>
	<UDashboardPanel id="settings">
		<template #header>
			<UDashboardNavbar :title="$t('nav.settings')" :ui="{ right: 'gap-3' }">
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
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('nav.settings') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.settingsDesc') }}</p>
				</div>

				<!-- Settings Options -->
				<ZMenu
					:title="$t('nav.settings')"
					:icon="ICONS.SETTINGS_ROUNDED"
					:description="$t('pages.settingsMenuDesc')"
					color="slate"
					:navigations="settings_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

const { t } = useI18n();

useHead({ title: () => t('pages.settingsTitle') });

const settings_navigations = computed(() => [
	{
		title: t('nav.paymentSettings'),
		icon: ICONS.PAYMENT_METHODS,
		to: '/settings/payment',
		description: t('pages.paymentManagementDesc'),
	},
	{
		title: t('nav.taxSettings'),
		icon: ICONS.TAX,
		to: '/settings/taxes',
		description: t('pages.taxManagementDesc'),
	},
	// {
	// 	title: t('nav.shippingSettings'),
	// 	icon: ICONS.SETTINGS_ROUNDED,
	// 	to: '/settings/shipping',
	// 	description: t('pages.settingsMenuDesc'),
	// },
	// {
	// 	title: t('nav.rolesPermissions'),
	// 	icon: ICONS.USER_GROUP_ROUNDED,
	// 	to: '/settings/roles-permissions',
	// 	description: t('pages.settingsMenuDesc'),
	// },
	{
		title: t('nav.systemSettings'),
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings/system',
		description: t('pages.settingsMenuDesc'),
	},
]);
</script>

<style scoped></style>
