<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Add Tax Rule</h2>
		</div>
		<div class="wrapper-grid">
			<FormTaxRuleCreation :adding="false" :new-tax-rule="new_tax_rule" />
		</div>
	</div>
</template>

<script lang="ts" setup>
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

<style scoped>
.wrapper-grid {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 1rem;
}

@media (min-width: 640px) {
	.wrapper-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

.wrapper-stepper {
	width: 100%;
}

.side-wrapper {
	display: none;
	grid-column: span 1 / span 1;
}

@media (min-width: 640px) {
	.side-wrapper {
		display: block;
	}
}

h2 {
	color: var(--color-secondary-600);
	font-weight: 400;
}

.section-menu {
	background-color: white;
	box-shadow:
		0 4px 6px -1px rgb(0 0 0 / 0.1),
		0 2px 4px -2px rgb(0 0 0 / 0.1);
	padding: 0.5rem;
	border-radius: 9999px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-secondary-600);
}
</style>
