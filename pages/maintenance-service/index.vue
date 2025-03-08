<template>
	<div>
		<UBreadcrumb :links="links" />
		<div class="container">
			<ZSectionFilterMaintenanceService />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :options="options_page_size" /> </span>

					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<UButton color="green" @click="navigateTo('/maintenance-service/create')">
							<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
							Create
						</UButton>
					</div>
				</div>
				<UTable :rows="rows" :columns="maintenance_service_columns">
					<template #orig_sell_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.orig_sell_price.toFixed(2) }}</p>
					</template>

					<template #sale_price-data="{ row }">
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">{{ price.currency_code }} {{ price.sale_price.toFixed(2) }}</p>
					</template>

					<template #code-data="{ row }">
						<p class="font-bold">
							{{ row.code }}
						</p>
					</template>

					<template #name-data="{ row }">
						<p class="font-bold">
							{{ row.name }}
						</p>
					</template>

					<template #actions-data="{ row }">
						<ZActionDropdown :items="options(row)" />
					</template>

					<template #empty-state>
						<div class="flex flex-col items-center justify-center py-6 gap-3">
							<span class="italic text-sm">No Maintenance Services !</span>

							<UButton color="green" @click="navigateTo('/maintenance-service/create')">
								<UIcon :name="ICONS.ADD_OUTLINE" class="size-5" />
								Create
							</UButton>
						</div>
					</template>
				</UTable>

				<div v-if="maintenanceServices.length > 0" class="section-pagination">
					<UPagination v-model="page" :page-count="pageSize" :total="maintenanceServices.length" />
				</div>
			</UCard>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useMaintenanceServiceStore } from '~/stores/MaintenanceService/MaintenanceService';
import { options_page_size } from '~/utils/options';
import { maintenance_service_columns } from '~/utils/table-columns';
import type { MaintenanceService } from '~/utils/types/maintenance-service';

const links = [
	{
		label: 'Maintenance Services',
		icon: ICONS.MAINTENANCE_SERVICE,
		to: '/maintenance-service',
	},
	{
		label: 'All Maintenance Services',
		icon: ICONS.LIST,
		to: '/maintenance-service',
	},
];

const options = (maintenanceService: MaintenanceService) => [
	[
		{
			label: 'Edit',
			icon: ICONS.PENCIL,
			click: () => editMaintenanceService(maintenanceService.code!),
		},
	],
	[
		{
			label: 'Delete',
			icon: ICONS.TRASH,
			slot: 'danger',
			click: () => deleteMaintenanceService(maintenanceService.code!),
		},
	],
];

const modal = useModal();
const page = ref(1);
const maintenanceServiceStore = useMaintenanceServiceStore();

const { maintenanceServices, pageSize } = storeToRefs(maintenanceServiceStore);

const rows = computed(() => {
	return maintenanceServices.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteMaintenanceService = async (code: string) => {
	// modal.open(ZModalConfirmation, {
	// 	message: 'Are you sure you want to delete this product ?',
	// 	action: 'delete',
	// 	onConfirm: async () => {
	// 		await productStore.deleteProduct(code);
	// 		modal.close();
	// 	},
	// 	onCancel: () => {
	// 		modal.close();
	// 	},
	// });
};

const editMaintenanceService = async (code: string) => {
	// const product: Product | undefined = products.value.find((prod) => prod.code === code);
	// if (!product) return;
	// modal.open(ZModalProductDetail, {
	// 	product: JSON.parse(JSON.stringify(product)),
	// 	onUpdate: async (prod: Product) => {
	// 		modal.close();
	// 	},
	// 	onCancel: () => {
	// 		modal.close();
	// 	},
	// });
};
</script>

<style scoped lang="css"></style>
