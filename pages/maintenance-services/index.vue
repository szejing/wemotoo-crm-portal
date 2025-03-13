<template>
	<div>
		<UBreadcrumb :items="links" />
		<div class="container">
			<ZSectionFilterMaintenanceService />
			<UCard class="mt-4">
				<div class="flex-between">
					<span class="section-page-size"> Show :<USelect v-model="pageSize" :items="options_page_size" /> </span>

					<div class="flex gap-4">
						<!-- <UButton>
							<UIcon :name="ICONS.EXCEL" class="size-5" />
							Export
						</UButton> -->

						<UButton color="green" @click="navigateTo('/maintenance-services/create')">
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
						<p v-for="price in row.price_types" :key="price.currency" class="font-bold">
							<span v-if="price.sale_price != undefined && price.sale_price > 0">{{ price.currency_code }} {{ price.sale_price.toFixed(2) }}</span>
							<span v-else> - </span>
						</p>
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
import { ZModalConfirmation, ZModalMaintenanceServiceDetail } from '#components';
import { useMaintenanceServiceStore } from '~/stores';
import { options_page_size } from '~/utils/options';
import { maintenance_service_columns } from '~/utils/table-columns';
import type { CategoryInput } from '~/utils/types/category';
import type { MaintenanceService } from '~/utils/types/maintenance-service';
import type { PriceInput } from '~/utils/types/price';
import type { TagInput } from '~/utils/types/tag';

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

const overlay = useOverlay();
const page = ref(1);
const maintenanceServiceStore = useMaintenanceServiceStore();

const { maintenanceServices, pageSize } = storeToRefs(maintenanceServiceStore);

const rows = computed(() => {
	return maintenanceServices.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value);
});

const deleteMaintenanceService = async (code: string) => {
	const modal = overlay.create(ZModalConfirmation, {
		props: {
			message: 'Are you sure you want to delete this maintenance service ?',
			action: 'delete',
			onConfirm: async () => {
				await maintenanceServiceStore.deleteMaintenanceService(code);
				modal.close();
			},
			onCancel: () => {
				modal.close();
			},
		},
	});
};

const editMaintenanceService = async (code: string) => {
	const maintenanceService: MaintenanceService | undefined = maintenanceServices.value.find((maint: MaintenanceService) => maint.code === code);
	if (!maintenanceService) return;
	const modal = overlay.create(ZModalMaintenanceServiceDetail, {
		props: {
			maintenanceService: JSON.parse(JSON.stringify(maintenanceService)),
			onUpdate: async (maintenanceService: MaintenanceService) => {
				const { code, name, short_desc, long_desc, is_active, price_types, categories, tags, status, galleries, thumbnail } = maintenanceService;

				// price_types
				const _price_types: PriceInput[] = [];
				price_types?.forEach((price) => {
					_price_types.push({
						id: price.id,
						orig_sell_price: price.orig_sell_price,
						cost_price: price.cost_price,
						sale_price: price.sale_price,
						currency_code: price.currency_code,
					});
				});

				// product categories
				const _categories: CategoryInput[] = [];
				categories?.forEach((category) => {
					_categories.push({
						code: category.code!,
					});
				});

				// produc
				const _tags: TagInput[] = [];
				tags?.forEach((tag) => {
					_tags.push({
						id: tag.id!,
					});
				});

				await maintenanceServiceStore.updateMaintenanceService(maintenanceService.code!, {
					code,
					name,
					short_desc: short_desc ?? undefined,
					long_desc: long_desc ?? undefined,
					is_active,
					is_discountable: true,
					price_types: _price_types,
					categories: _categories,
					tags: _tags,
					status: status,
					galleries: galleries ?? undefined,
					thumbnail: thumbnail ?? undefined,
				});
				modal.close();
			},
		},
	});
};
</script>

<style scoped lang="css"></style>
