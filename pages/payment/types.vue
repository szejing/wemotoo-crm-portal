<template>
	<UDashboardPanel id="payment-types">
		<template #header>
			<UDashboardNavbar title="Payment Types" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZSectionFilterPaymentTypeGroups />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :items="options_page_size" /> </span>
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="payment_type_group_columns" />

				<div v-if="payment_type_groups.length > 0" class="section-pagination">
					<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_payment_type_groups" @update:page="updatePage" />
				</div>
			</UCard>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { payment_type_group_columns } from '~/utils/table-columns';

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

<style scoped></style>
