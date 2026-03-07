<template>
	<UDashboardPanel id="settings-system">
		<template #header>
			<UDashboardNavbar :title="$t('nav.systemSettings')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>
		<template #body>
			<div class="space-y-8">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('nav.systemSettings') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.settingsDesc') }}</p>
				</div>
				<ZMenu
					:title="$t('nav.systemSettings')"
					:icon="ICONS.SETTINGS_ROUNDED"
					:description="$t('pages.settingsMenuDesc')"
					color="slate"
					:navigations="system_navigations"
				/>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('nav.systemSettings') });

const system_navigations = computed(() => [
	{
		title: t('nav.storeProfile'),
		icon: ICONS.OUTLET,
		to: '/settings/store-profile',
		description: t('pages.storeProfileDesc'),
	},
	{
		title: t('nav.configuration'),
		icon: ICONS.SETTINGS_ROUNDED,
		to: '/settings/configuration',
		description: t('pages.configurationMenuDesc'),
	},
]);
</script>
