<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Tax Rule</h2>
		</div>
		<div class="wrapper-grid">
			<UCard>
				<template #header>
					<h2>New Tax Rule</h2>
				</template>
				<FormTaxRuleCreation />
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
const taxRuleStore = useTaxRuleStore();
onMounted(() => {
	taxRuleStore.resetNewTaxRule();
});

const links = [
	{
		label: 'Taxes',
		icon: ICONS.TAX,
		to: '/taxes',
	},
	{
		label: 'Tax Rules',
		to: '/taxes/rules',
	},
	{
		label: 'New Tax Rule',
		to: '/taxes/rules/create',
	},
];
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-2 gap-4;
}

.wrapper-stepper {
	@apply w-full;
}

.side-wrapper {
	@apply hidden sm:block col-span-1;
}

h2 {
	@apply text-secondary-600 font-normal;
}

.section-menu {
	@apply bg-white shadow-md p-2 rounded-full text-center flex justify-center items-center text-secondary-600;
}
</style>
