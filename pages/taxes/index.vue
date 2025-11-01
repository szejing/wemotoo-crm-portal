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
			<ZMenu :navigations="tax_navigations" />
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
const tax_navigations = [
	{
		title: 'Tax Codes',
		icon: ICONS.TAX,
		to: '/taxes/codes',
	},
	// {
	// 	title: 'Tax Groups',
	// 	icon: ICONS.TAX,
	// 	to: '/taxes/groups',
	// },
	{
		title: 'Tax Rules',
		icon: ICONS.TAX,
		to: '/taxes/rules',
	},
];

useHead({ title: 'Wemotoo CRM - Taxes' });
</script>

<style scoped></style>
