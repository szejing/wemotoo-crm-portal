<template>
	<div class="space-y-2">
		<div
			class="flex w-full min-h-10 items-start gap-2 rounded-md border border-default bg-default px-2 py-1.5 text-sm shadow-sm transition-colors"
			:class="hasCondition ? 'cursor-pointer hover:bg-elevated/50' : 'cursor-not-allowed opacity-60'"
			role="button"
			:tabindex="hasCondition ? 0 : -1"
			:aria-disabled="!hasCondition"
			@click="openPicker"
			@keydown.enter.prevent="openPicker"
			@keydown.space.prevent="openPicker"
		>
			<div class="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
				<UBadge
					v-for="val in currentSelectedValues"
					:key="val"
					color="primary"
					variant="subtle"
					size="sm"
					class="max-w-full shrink-0 truncate"
				>
					{{ val }}
				</UBadge>
				<span v-if="hasCondition && currentSelectedValues.length === 0" class="px-1 py-0.5 text-muted">
					{{ $t('common.notSet') }}
				</span>
				<span v-if="!hasCondition" class="px-1 py-0.5 text-muted">
					{{ $t('components.discountForm.selectFilterConditionFirst') }}
				</span>
			</div>
			<UButton
				color="neutral"
				variant="ghost"
				size="xs"
				class="shrink-0"
				icon="i-lucide-search"
				:label="$t('components.discountForm.openFilterValuePicker')"
				:disabled="!hasCondition"
				@click.stop="openPicker"
			/>
		</div>

		<div class="flex items-center justify-between gap-3">
			<UBadge color="neutral" variant="subtle" size="sm" class="tabular-nums shrink-0">
				{{ selectedCountLabel }}
			</UBadge>
			<UButton
				v-if="hasCondition && currentSelectedValues.length > 0"
				color="neutral"
				variant="ghost"
				size="xs"
				:label="$t('components.filter.clear')"
				@click="clearSelection"
			/>
		</div>
	</div>

	<UModal
		v-model:open="pickerOpen"
		:title="$t('components.discountForm.filterValuePickerTitle', { entity: entityLabel })"
		:description="$t('components.discountForm.filterValuePickerDescription')"
		:ui="{ content: 'sm:max-w-4xl' }"
	>
		<template #body>
			<div class="space-y-4">
				<div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
					<UInput
						v-model="search"
						class="sm:col-span-2"
						:placeholder="searchPlaceholder"
					>
						<template #leading>
							<UIcon name="i-lucide-search" class="size-4 text-muted" />
						</template>
					</UInput>

					<USelectMenu
						v-model="sortField"
						value-key="value"
						:items="sortFieldItems"
						:search-input="{ placeholder: $t('components.discountForm.sortBy') }"
					/>

					<USelectMenu
						v-model="sortDirection"
						value-key="value"
						:items="sortDirectionItems"
						:search-input="{ placeholder: $t('components.discountForm.sortDirection') }"
					/>
				</div>

				<div class="border border-default rounded-lg overflow-hidden">
					<div class="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-2 border-b border-default bg-muted/30 text-xs font-medium uppercase text-muted">
						<span>{{ $t('common.select') }}</span>
						<span>{{ entityLabel }}</span>
					</div>

					<div v-if="loading" class="p-4 space-y-2">
						<USkeleton v-for="i in 5" :key="i" class="h-9 w-full" />
					</div>

					<div v-else-if="rows.length === 0" class="px-4 py-8 text-center text-sm text-muted">
						{{ $t('components.discountForm.filterValuePickerEmpty') }}
					</div>

					<div v-else class="max-h-80 overflow-y-auto divide-y divide-default">
						<label
							v-for="row in rows"
							:key="row.value"
							class="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-4 py-2 cursor-pointer hover:bg-muted/40"
						>
							<UCheckbox
								:model-value="isDraftSelected(row.value)"
								@update:model-value="toggleSelection(row.value, $event)"
							/>
							<div class="min-w-0">
								<p class="truncate text-sm font-medium text-highlighted">{{ row.value }}</p>
								<p v-if="row.description" class="truncate text-xs text-muted">{{ row.description }}</p>
							</div>
						</label>
					</div>
				</div>

				<div class="flex flex-wrap items-center justify-between gap-3">
					<p class="text-xs text-muted">
						{{ $t('components.discountForm.filterValuePickerTotal', { total }) }}
					</p>
					<div class="flex items-center gap-3">
						<USelectMenu
							v-model="pageSize"
							value-key="value"
							:items="pageSizeItems"
							@update:model-value="page = 1"
						/>
						<UPagination v-model:page="page" :items-per-page="itemsPerPage" :total="total" />
					</div>
				</div>
			</div>
		</template>

		<template #footer>
			<div class="w-full flex items-center justify-between gap-3">
				<p class="text-xs text-muted">
					{{ $t('components.discountForm.filterValuePickerSelected', { count: draftSelectedValues.length }) }}
				</p>
				<div class="flex items-center gap-2">
					<UButton color="neutral" variant="soft" :label="$t('common.cancel')" @click="pickerOpen = false" />
					<UButton color="primary" :label="$t('common.apply')" @click="applySelection" />
				</div>
			</div>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { FilterCondition } from 'wemotoo-common';
import type { BaseODataReq } from '~/repository/base/base.req';
import { options_page_size } from '~/utils/options';
import { parseFilterValueCsv, stringifyFilterValueCsv } from '~/utils/discount/filter-value-csv';

type PickerRow = {
	value: string;
	description?: string;
};

type SortDirection = 'asc' | 'desc';

const props = defineProps<{
	modelValue?: string;
	filterCondition?: FilterCondition;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const { t } = useI18n();
const { $api } = useNuxtApp();

const pickerOpen = ref(false);
const loading = ref(false);
const rows = ref<PickerRow[]>([]);
const total = ref(0);
const search = ref('');
const page = ref(1);
const pageSize = ref(options_page_size[0] as number);
const sortDirection = ref<SortDirection>('asc');
const sortField = ref('code');
const draftSelectedValues = ref<string[]>([]);

let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;

const hasCondition = computed(() => props.filterCondition != null);
const currentSelectedValues = computed(() => parseFilterValueCsv(props.modelValue));

const entityLabel = computed(() => {
	switch (props.filterCondition) {
		case FilterCondition.PROD_CODE:
			return t('nav.products');
		case FilterCondition.CATG_CODE:
			return t('nav.categories');
		case FilterCondition.TAG_CODE:
			return t('nav.tags');
		case FilterCondition.TYPE:
			return t('common.type');
		default:
			return t('components.discountForm.filterNone');
	}
});

const searchPlaceholder = computed(() => {
	if (!hasCondition.value) {
		return t('components.discountForm.selectFilterConditionFirst');
	}
	return t('components.discountForm.filterValuePickerSearchPlaceholder', { entity: entityLabel.value.toLowerCase() });
});

const selectedCountLabel = computed(() =>
	t('components.discountForm.filterValuePickerSelected', { count: currentSelectedValues.value.length }),
);

const sortFieldItems = computed(() => {
	switch (props.filterCondition) {
		case FilterCondition.PROD_CODE:
			return [
				{ label: t('common.code'), value: 'code' },
				{ label: t('common.name'), value: 'name' },
			];
		case FilterCondition.CATG_CODE:
			return [
				{ label: t('common.code'), value: 'code' },
				{ label: t('common.description'), value: 'description' },
			];
		case FilterCondition.TAG_CODE:
			return [{ label: t('common.name'), value: 'value' }];
		case FilterCondition.TYPE:
			return [{ label: t('common.name'), value: 'value' }];
		default:
			return [{ label: t('common.code'), value: 'code' }];
	}
});

const sortDirectionItems = computed(() => [
	{ label: t('components.discountForm.sortAscending'), value: 'asc' },
	{ label: t('components.discountForm.sortDescending'), value: 'desc' },
]);

const pageSizeItems = computed(() => options_page_size.map((size) => ({ label: String(size), value: size })));

const normalizePageSize = (v: unknown): number => {
	if (typeof v === 'number' && Number.isFinite(v) && v > 0) {
		return v;
	}
	if (v && typeof v === 'object' && 'value' in v) {
		const n = Number((v as { value: unknown }).value);
		if (Number.isFinite(n) && n > 0) {
			return n;
		}
	}
	return options_page_size[0] as number;
};

/** Nuxt UI `UPagination` uses `page` + `update:page`, not default `v-model`. */
const itemsPerPage = computed(() => normalizePageSize(pageSize.value));

const isDraftSelected = (value: string) => {
	return draftSelectedValues.value.includes(value);
};

const toggleSelection = (value: string, checked: boolean | 'indeterminate') => {
	const shouldSelect = checked === true;
	if (shouldSelect) {
		if (!draftSelectedValues.value.includes(value)) {
			draftSelectedValues.value = [...draftSelectedValues.value, value];
		}
		return;
	}
	draftSelectedValues.value = draftSelectedValues.value.filter((item) => item !== value);
};

const resetSortField = () => {
	const firstSortField = sortFieldItems.value[0]?.value;
	if (firstSortField) {
		sortField.value = firstSortField;
	}
};

const buildQuery = (): BaseODataReq => {
	const size = itemsPerPage.value;
	const query: BaseODataReq = {
		$top: size,
		$skip: (page.value - 1) * size,
		$count: true,
		$orderby: `${sortField.value} ${sortDirection.value}`,
	};

	const trimmedSearch = search.value.trim();
	if (trimmedSearch) {
		query.$search = trimmedSearch;
	}

	return query;
};

const fetchRows = async () => {
	if (!props.filterCondition) {
		rows.value = [];
		total.value = 0;
		return;
	}

	loading.value = true;
	try {
		const query = buildQuery();
		switch (props.filterCondition) {
			case FilterCondition.PROD_CODE: {
				const resp = await $api.product.getMany(query);
				const list = resp.data ?? resp.value ?? [];
				rows.value = list
					.map((item) => ({
						value: item.code?.trim() ?? '',
						description: item.name?.trim() || undefined,
					}))
					.filter((item) => item.value.length > 0);
				total.value = resp['@odata.count'] ?? resp.count ?? 0;
				break;
			}
			case FilterCondition.CATG_CODE: {
				const resp = await $api.category.getMany(query);
				const list = resp.data ?? resp.value ?? [];
				rows.value = list
					.map((item) => ({
						value: item.code?.trim() ?? '',
						description: item.description?.trim() || undefined,
					}))
					.filter((item) => item.value.length > 0);
				total.value = resp['@odata.count'] ?? resp.count ?? 0;
				break;
			}
			case FilterCondition.TAG_CODE: {
				const resp = await $api.tag.getMany(query);
				const list = resp.data ?? resp.value ?? [];
				rows.value = list
					.map((item) => ({
						value: item.value?.trim() ?? '',
					}))
					.filter((item) => item.value.length > 0);
				total.value = resp['@odata.count'] ?? resp.count ?? 0;
				break;
			}
			case FilterCondition.TYPE: {
				const resp = await $api.productType.getMany(query);
				const list = resp.data ?? resp.value ?? [];
				rows.value = list
					.map((item) => ({
						value: item.value?.trim() ?? '',
					}))
					.filter((item) => item.value.length > 0);
				total.value = resp['@odata.count'] ?? resp.count ?? 0;
				break;
			}
			default: {
				rows.value = [];
				total.value = 0;
			}
		}
	} finally {
		loading.value = false;
	}
};

const openPicker = () => {
	if (!hasCondition.value) {
		return;
	}

	draftSelectedValues.value = parseFilterValueCsv(props.modelValue);
	page.value = 1;
	pickerOpen.value = true;
};

const applySelection = () => {
	emit('update:modelValue', stringifyFilterValueCsv(draftSelectedValues.value));
	pickerOpen.value = false;
};

const clearSelection = () => {
	emit('update:modelValue', '');
};

watch(
	() => props.filterCondition,
	() => {
		page.value = 1;
		search.value = '';
		draftSelectedValues.value = [];
		resetSortField();
		rows.value = [];
		total.value = 0;
	},
	{ immediate: true },
);

watch([pickerOpen, page, itemsPerPage, sortField, sortDirection], async ([open]) => {
	if (!open) {
		return;
	}
	await fetchRows();
});

watch(search, () => {
	if (!pickerOpen.value) {
		return;
	}
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer);
	}
	searchDebounceTimer = setTimeout(() => {
		page.value = 1;
		void fetchRows();
	}, 300);
});

onBeforeUnmount(() => {
	if (searchDebounceTimer) {
		clearTimeout(searchDebounceTimer);
	}
});
</script>
