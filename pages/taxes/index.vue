<template>
	<UDashboardPanel id="taxes">
		<template #header>
			<UDashboardNavbar title="Tax Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-8">
				<!-- Header Section -->
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Tax Management</h2>
					<p class="text-gray-600 dark:text-gray-400">Configure tax codes and rules for your business operations</p>
				</div>

				<!-- Tax Configuration Section -->
				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.TAX" class="text-2xl text-emerald-500" />
						<div>
							<h3 class="text-xl font-semibold text-gray-900 dark:text-white">Tax Configuration</h3>
							<p class="text-sm text-gray-600 dark:text-gray-400">Set up and manage tax settings</p>
						</div>
					</div>
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<UCard
							v-for="(navigate, index) in tax_navigations"
							:key="index"
							:to="navigate.to"
							class="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
						>
							<div class="flex items-start gap-4">
								<div class="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
									<UIcon :name="navigate.icon" class="text-2xl text-emerald-600 dark:text-emerald-400" />
								</div>
								<div class="flex-1">
									<h4 class="font-semibold text-gray-900 dark:text-white mb-1">{{ navigate.title }}</h4>
									<p class="text-sm text-gray-600 dark:text-gray-400">{{ navigate.description }}</p>
								</div>
								<UIcon name="i-heroicons-arrow-right" class="text-gray-400 dark:text-gray-500" />
							</div>
						</UCard>
					</div>
				</div>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
useHead({ title: 'Wemotoo CRM - Taxes' });

const tax_navigations = [
	{
		title: 'Tax Codes',
		icon: ICONS.TAX,
		to: '/taxes/codes',
		description: 'Manage tax codes and rates for different jurisdictions',
	},
	// {
	// 	title: 'Tax Groups',
	// 	icon: ICONS.TAX,
	// 	to: '/taxes/groups',
	// 	description: 'Organize tax codes into groups',
	// },
	{
		title: 'Tax Rules',
		icon: ICONS.TAX,
		to: '/taxes/rules',
		description: 'Define rules for automatic tax application and calculation',
	},
];
</script>

<style scoped></style>
