<template>
	<UDashboardPanel id="payment-methods">
		<template #header>
			<UDashboardNavbar title="Payment Methods" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZSectionFilterPaymentMethods />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :items="options_page_size" /> </span>
					<!-- <div class="flex gap-4">
						<UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="success">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div> -->
				</div>

				<!-- Table  -->
				<UTable :data="rows" :columns="payment_method_columns" />

				<div v-if="payment_methods.length > 0" class="section-pagination">
					<UPagination :default-page="current_page" :items-per-page="page_size" :total="total_payment_methods" @update:page="updatePage" />
				</div>
			</UCard>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { payment_method_columns } from '~/utils/table-columns';

useHead({ title: 'Wemotoo CRM - Payment Methods' });

const isUpdating = ref(false);
const paymentMethodStore = usePaymentMethodStore();
const { payment_methods, page_size, current_page, total_payment_methods } = storeToRefs(paymentMethodStore);

const rows = computed(() => {
	return payment_methods.value.slice((current_page.value - 1) * page_size.value, current_page.value * page_size.value);
});

const updateStatus = async (code: string, is_active: boolean) => {
	try {
		isUpdating.value = true;
		await paymentMethodStore.updateStatus({ code, is_active });
	} catch (error) {
		console.error(error);
	} finally {
		isUpdating.value = false;
	}
};

const updatePage = async (page: number) => {
	await paymentMethodStore.updatePage(page);
};
</script>

<style scoped></style>
