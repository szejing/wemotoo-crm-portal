<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterPaymentTypes />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>
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

				<div v-if="paymentMethods.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="paymentMethods.length" />
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
		label: 'Payment Methods',
		icon: ICONS.PAYMENT_METHODS,
		to: '/',
	},
];

const isUpdating = ref(false);
const page = ref(1);
const paymentMethodStore = usePaymentMethodStore();
const { paymentMethods, pageSize } = storeToRefs(paymentMethodStore);

const rows = computed(() => {
	return paymentMethods.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const updateStatus = async (code: string, status: boolean) => {
	try {
		isUpdating.value = true;
		await paymentMethodStore.updateStatus(code, status);
	} catch (error) {
		console.error(error);
	} finally {
		isUpdating.value = false;
	}
};
</script>

<style scoped lang="postcss"></style>
