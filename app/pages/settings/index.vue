<template>
	<UDashboardPanel id="settings">
		<template #header>
			<UDashboardNavbar title="Settings" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your store profile and system configuration</p>
				</div>

				<!-- Settings Options -->
				<ZMenu
					title="Settings"
					:icon="ICONS.SETTINGS_ROUNDED"
					description="Store profile and system configuration"
					color="slate"
					:navigations="settings_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

useHead({ title: 'Wemotoo CRM - Settings' });

const settings_navigations = [
	{
		title: 'Store Profile',
		icon: ICONS.OUTLET,
		to: '/settings/store-profile',
		description: 'Manage your merchant info, address, and contact details',
	},
	{
		title: 'Configuration',
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings/configuration',
		description: 'Configure system settings and preferences',
	},
];
</script>

<style scoped></style>
