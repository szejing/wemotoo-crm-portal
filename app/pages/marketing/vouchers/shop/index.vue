<template>
	<ZPagePanel id="vouchers-shop-listing" :title="$t('nav.shopVouchers')" back-to="/marketing">
		<template #navbar-right>
			<ZCreateButton to="/marketing/vouchers/shop/create" :label="$t('common.create')" />
		</template>
		<template #toolbar>
			<ZSectionFilterVouchers />
		</template>

		<div class="space-y-6">
			<ZTableToolbar
				v-model="filter.page_size"
				:page-size-options="options_page_size"
				:export-enabled="true"
				:exporting="exporting"
				@update:model-value="voucherStore.updatePageSize"
				@export="exportVouchers"
			/>

			<template v-if="initialize">
				<div class="rounded-lg overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-700">
					<div class="grid grid-cols-[1fr_auto] gap-4 p-4">
						<USkeleton class="h-4 w-24" />
						<USkeleton class="h-4 w-16" />
					</div>
					<div v-for="i in 5" :key="i" class="grid grid-cols-[1fr_auto] gap-4 p-4 items-center">
						<USkeleton class="h-4 w-40" />
						<USkeleton class="h-4 w-12" />
					</div>
				</div>
			</template>
			<UTable v-else :data="vouchers" :columns="voucher_columns" :loading="loading" @select="selectVoucher">
				<template #empty>
					<div class="flex flex-col items-center justify-center py-12 gap-3">
						<UIcon :name="ICONS.ADDITIONAL" class="w-12 h-12 text-gray-400" />
						<p class="text-sm text-gray-600 dark:text-gray-400">{{ $t('pages.noVouchersFound') }}</p>
						<p class="text-xs text-gray-500 dark:text-gray-500">{{ $t('pages.tryAdjustingFilters') }}</p>
					</div>
				</template>
			</UTable>

			<div v-if="!initialize && vouchers.length > 0" class="section-pagination">
				<UPagination v-model="filter.current_page" :items-per-page="filter.page_size" :total="total_vouchers" @update:page="updatePage" />
			</div>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { AllocationType } from 'wemotoo-common';
import { getVoucherColumns } from '~/utils/table-columns';
import type { TableRow } from '@nuxt/ui';
import type { Voucher } from '~/utils/types/voucher';
import { options_page_size } from '~/utils/options';
import { ICONS } from '~/utils/icons';
import { useVoucherStore } from '~/stores/voucher/voucher';

const { t } = useI18n();
const voucher_columns = computed(() => getVoucherColumns(t));
useHead({ title: () => t('pages.shopVouchersTitle') });

const voucherStore = useVoucherStore();
const { loading, vouchers, filter, total_vouchers, exporting } = storeToRefs(voucherStore);
const initialize = ref(true);
const router = useRouter();

onMounted(async () => {
	voucherStore.setListingAllocationFilter(AllocationType.BILL);
	initialize.value = true;
	try {
		await voucherStore.getVouchers();
	} finally {
		initialize.value = false;
	}
});

const selectVoucher = async (_e: Event, row: TableRow<Voucher>) => {
	const voucher = row.original;
	if (!voucher) return;
	router.push(`/marketing/vouchers/${voucher.code}`);
};

const updatePage = async (page: number) => {
	await voucherStore.updatePage(page);
};

const exportVouchers = async () => {
	// await voucherStore.exportVouchers();
};
</script>

<style scoped></style>
