<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterPaymentTypeGroups />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :options="options_page_size" /> </span>
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="payment_type_group_columns">
					<template #index-data="{ index }"> {{ index + 1 }}. </template>
				</UTable>

				<div v-if="payment_type_groups.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="page_size" :total="total_payment_type_groups" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { payment_type_group_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Payment',
		icon: ICONS.LIST,
		to: '/payment',
	},
	{
		label: 'Payment Types',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/types',
	},
];

useHead({ title: 'Wemotoo CRM - Payment Types' });

const paymentTypeStore = usePaymentTypeStore();
const { payment_type_groups, page_size, current_page, total_payment_type_groups } = storeToRefs(paymentTypeStore);

const rows = computed(() => {
	return payment_type_groups.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const updatePage = async (page: number) => {
	await paymentTypeStore.updatePage(page);
};
</script>

<style scoped lang="postcss"></style>
