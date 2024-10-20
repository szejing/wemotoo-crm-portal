<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterOrders />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<UButton>
							<UIcon name="i-ri-file-excel-2-line" class="size-5" />
							Export
						</UButton>

						<UButton color="green" @click="navigateTo('/orders/create')">
							<UIcon name="i-ic-round-add-circle-outline" class="size-5" />
							Create Order
						</UButton>
					</div>
				</div>
				<!-- <UTable :rows="rows" :columns="customer_columns">
					<template #actions-data="{ row }">
						<UDropdown :items="options(row)">
							<UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
						</UDropdown>
					</template>
				</UTable>

				<div class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="customers.length" />
				</div> -->
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { options_page_size } from '~/utils/options';

const links = [
	{
		label: 'Orders',
		icon: 'i-material-symbols-light-order-approve-outline-rounded',
		to: '/',
	},
	{
		label: 'All Orders',
		icon: 'i-material-symbols-light-lists-rounded',
		to: '/products',
	},
];

const pageSize = ref(15);
</script>

<style scoped lang="css"></style>
