<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="py-4">
			<ZSectionFilterPaymentMethods />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="page_size" :options="options_page_size" /> </span>
					<!-- <div class="flex gap-4">
						<UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="green">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div> -->
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="payment_method_columns">
					<template #code-data="{ row }">
						<h4 class="font-bold text-neutral-800">{{ row.code }}</h4>
						<p class="text-sm italic text-neutral-400">{{ row.desc }}</p>
					</template>
					<template #detail-data="{ row }">
						<p class="text-sm font-medium">Supported : {{ row.currency_code }}</p>
						<p v-if="row.short_desc" class="text-sm italic text-neutral-400">{{ row.short_desc }}</p>
					</template>
					<template #active-data="{ row }">
						<UToggle v-model="row.is_active" :loading="isUpdating" :disabled="isUpdating" @update:model-value="updateStatus(row.code, row.is_active)" />
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No one here!</span>
							<UButton color="green">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="payment_methods.length > 0" class="section-pagination">
					<UPagination v-model="current_page" :page-count="page_size" :total="total_payment_methods" @update:model-value="updatePage" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { payment_method_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Payment',
		icon: ICONS.LIST,
		to: '/payment',
	},
	{
		label: 'Payment Methods',
		icon: ICONS.PAYMENT_METHODS,
		to: '/payment/methods',
	},
];

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

<style scoped lang="postcss"></style>
