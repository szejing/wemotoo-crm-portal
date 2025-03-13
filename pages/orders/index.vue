<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="container">
			<ZSectionFilterOrders />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :items="options_page_size" /> </span>

					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<UButton color="green" @click="navigateTo('/orders/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<UTable :rows="rows" :columns="order_columns">
					<template #actions-data="{ row }">
						<UDropdown :items="options(row)">
							<UButton color="neutral" variant="ghost" :icon="ICONS.HORIZONTAL_ELLIPSIS" />
						</UDropdown>
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Order !</span>

							<UButton color="green" @click="navigateTo('/products/create')">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="orders.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="orders.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useOrderStore } from '~/stores/Order/Order';
import { options_page_size } from '~/utils/options';
import { order_columns } from '~/utils/table-columns';
import type { Order } from '~/utils/types/order';

const links = [
	{
		label: 'Orders',
		icon: ICONS.ORDER,
		to: '/',
	},
	{
		label: 'All Orders',
		icon: ICONS.LIST,
		to: '/products',
	},
];

const options = (order: Order) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: () => console.log('Edit', order.id),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => console.log('Delete', order.id),
		},
	],
];

const page = ref(1);
const orderStore = useOrderStore();

const { orders, pageSize } = storeToRefs(orderStore);

const rows = computed(() => {
	return orders.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});
</script>

<style scoped lang="css"></style>
