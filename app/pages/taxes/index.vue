<template>
	<UDashboardPanel id="taxes">
		<template #header>
			<UDashboardNavbar title="Tax Management" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton />
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
				<ZMenu title="Tax Configuration" :icon="ICONS.TAX" description="Set up and manage tax settings" color="red" :navigations="tax_navigations" />
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
