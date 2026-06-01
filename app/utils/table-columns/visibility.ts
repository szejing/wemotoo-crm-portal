import type { TableColumn } from '@nuxt/ui';

export type ColumnOption = {
	key: string;
	label: string;
};

export type TranslateFn = (key: string) => string;

export function columnOptionsFromLabelMap(t: TranslateFn, labelMap: Record<string, string>): ColumnOption[] {
	return Object.entries(labelMap).map(([key, i18nKey]) => ({
		key,
		label: t(i18nKey),
	}));
}

export function getColumnKey(column: TableColumn<unknown>): string | undefined {
	if ('id' in column && typeof column.id === 'string') {
		return column.id;
	}

	if ('accessorKey' in column && typeof column.accessorKey === 'string') {
		return column.accessorKey;
	}

	return undefined;
}

export function filterVisibleColumns<T>(
	columns: TableColumn<T>[],
	selectedKeys: string[],
	pinnedKeys: string[] = [],
): TableColumn<T>[] {
	const visibleKeys = new Set(selectedKeys);
	const pinned = new Set(pinnedKeys);

	return columns.filter((column) => {
		const key = getColumnKey(column as TableColumn<unknown>);
		if (!key) {
			return true;
		}

		if (pinned.has(key)) {
			return true;
		}

		return visibleKeys.has(key);
	});
}

export function getDefaultSelectedColumnKeys(columnOptions: ColumnOption[], defaultHiddenKeys: string[] = []): string[] {
	const hidden = new Set(defaultHiddenKeys);
	return columnOptions.map((option) => option.key).filter((key) => !hidden.has(key));
}
