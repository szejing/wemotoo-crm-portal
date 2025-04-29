<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterPaymentTypes />

			<UCard class="mt-4">
				<div class="flex justify-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>
					<div class="flex gap-4">
						<UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton>

						<UButton color="green">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>

				<!-- Table  -->
				<UTable :rows="rows" :columns="payment_type_columns">
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

				<div v-if="paymentTypeGroups.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="paymentTypeGroups.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';
import { payment_type_columns } from '~/utils/table-columns';

const links = [
	{
		label: 'Payment Types',
		icon: ICONS.PAYMENT_METHODS,
		to: '/',
	},
];

const page = ref(1);
const paymentTypeStore = usePaymentTypeStore();
const { paymentTypeGroups, pageSize } = storeToRefs(paymentTypeStore);

const rows = computed(() => {
	return paymentTypeGroups.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="postcss"></style>
