import type { TableColumn } from '@nuxt/ui';
import type { ColumnOption } from '~/utils/table-columns/visibility';
import { filterVisibleColumns, getDefaultSelectedColumnKeys } from '~/utils/table-columns/visibility';

type UseTableColumnVisibilityOptions = {
	defaultHiddenKeys?: string[];
	pinnedKeys?: string[];
};

export function useTableColumnVisibility<T>(
	columns: ComputedRef<TableColumn<T>[]>,
	columnOptions: ComputedRef<ColumnOption[]>,
	options: UseTableColumnVisibilityOptions = {},
) {
	const { defaultHiddenKeys = [], pinnedKeys = [] } = options;
	const selectedColumnKeys = ref<string[]>([]);

	watch(
		columnOptions,
		(optionsValue) => {
			if (selectedColumnKeys.value.length === 0 && optionsValue.length > 0) {
				selectedColumnKeys.value = getDefaultSelectedColumnKeys(optionsValue, defaultHiddenKeys);
			}
		},
		{ immediate: true },
	);

	const visibleColumns = computed(() => filterVisibleColumns(columns.value, selectedColumnKeys.value, pinnedKeys));

	return {
		selectedColumnKeys,
		visibleColumns,
	};
}
