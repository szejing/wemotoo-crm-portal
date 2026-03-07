<template>
	<UDashboardPanel id="marketing-coupons">
		<template #header>
			<UDashboardNavbar :title="$t('nav.coupons')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>
			</UDashboardNavbar>
		</template>
		<template #body>
			<div class="space-y-4">
				<h2 class="text-2xl font-semibold text-gray-900 dark:text-white">{{ $t('nav.coupons') }}</h2>
				<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.comingSoon') || 'Coming soon' }}</p>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const { t } = useI18n();
useHead({ title: () => t('nav.coupons') });
</script>
