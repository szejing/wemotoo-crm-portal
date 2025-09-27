<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="flex-jbetween-icenter">
			<h2 class="my-6">Update Tax Rule</h2>
		</div>
		<div class="wrapper-grid">
			<UCard>
				<template #header>
					<div class="flex-between">
						<h2>Tax Rule</h2>
						<UButton color="danger" variant="ghost" @click="deleteTaxRule">Delete</UButton>
					</div>
				</template>
				<FormTaxRuleUpdate
					v-if="current_tax_rule"
					:current-tax-rule="current_tax_rule"
					@select-detail="selectDetail"
					@delete-detail="deleteDetail"
					@update="onUpdate"
				/>
				<div v-else><ZLoading /></div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZModalConfirmation, ZModalTaxRuleDetail } from '#components';
import type { TaxRule } from '~/utils/types/tax-rule';
import type { TaxRuleDetail } from '~/utils/types/tax-rule-detail';

const taxRuleStore = useTaxRuleStore();

const current_tax_rule = ref<TaxRule | undefined>(undefined);

onMounted(async () => {
	const { code } = useRoute().params;
	const tax_rule = await taxRuleStore.getTaxRuleByCode(code as string);

	if (tax_rule) {
		current_tax_rule.value = tax_rule;
	} else {
		navigateTo('/taxes/rules');
	}
});

useHead({ title: 'Wemotoo CRM - Tax Rule #' + current_tax_rule.value?.code });

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
];

const modal = useModal();

const deleteTaxRule = async () => {
	modal.open(ZModalConfirmation, {
		message: 'Are you sure you want to delete this tax rule?',
		action: 'delete',
		onConfirm: async () => {
			await taxRuleStore.deleteTaxRule(current_tax_rule.value!.code);
			modal.close();
			navigateTo('/taxes/rules');
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const selectDetail = (detail: TaxRuleDetail | undefined) => {
	modal.open(ZModalTaxRuleDetail, {
		detail,
		onUpdate: async (detail: TaxRuleDetail) => {
			current_tax_rule.value!.details.push(detail);
			// await taxRuleStore.updateTaxRuleDetail(detail.tax_code);
			modal.close();
		},
		onDelete: async (detail: TaxRuleDetail) => {
			await deleteDetail(detail);
			modal.close();
			// await taxRuleStore.deleteTaxRuleDetail(detail.tax_code);
		},
		onCancel: () => {
			modal.close();
		},
	});
};

const deleteDetail = async (detail: TaxRuleDetail) => {
	// current_tax_rule.value.details.splice(index, 1);
};

const onUpdate = async (updated_tax_rule: TaxRule) => {
	await taxRuleStore.updateTaxRule(updated_tax_rule.code, updated_tax_rule);
	navigateTo('/taxes/rules');
};
</script>

<style scoped lang="postcss">
.wrapper-grid {
	@apply grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4;
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
