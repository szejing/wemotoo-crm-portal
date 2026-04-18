type TranslateFn = (key: string) => string;

/** USelect sentinel: never use empty string for “clear” (reserved by USelect). */
export const SHIPPING_ZONE_STATUS_FILTER_ALL = 'all' as const;

export function getShippingZoneStatusFilterItems(t: TranslateFn) {
	return [
		{ label: t('options.all'), value: SHIPPING_ZONE_STATUS_FILTER_ALL },
		{ label: t('common.active'), value: 'active' },
		{ label: t('common.inactive'), value: 'inactive' },
	];
}
