/**
 * Composable for customizable dashboard stats.
 * Persists user's stat selection to localStorage.
 */
import { useStorage } from '@vueuse/core';

export type DashboardStatKey =
	| 'appointment_orders'
	| 'item_orders'
	| 'pending_payments'
	| 'pending_actions'
	| 'revenue'
	| 'new_customers';

export const DASHBOARD_STATS_STORAGE_KEY = 'wemotoo-dashboard-stats-config';

const MAX_SELECTED = 4;

const DEFAULT_SELECTED: DashboardStatKey[] = [
	'appointment_orders',
	'item_orders',
	'pending_payments',
	'pending_actions',
].slice(0, MAX_SELECTED);

export const ALL_DASHBOARD_STAT_KEYS: DashboardStatKey[] = [
	'appointment_orders',
	'item_orders',
	'pending_payments',
	'pending_actions',
	'revenue',
	'new_customers',
];

function parseStored(value: string | null): DashboardStatKey[] {
	if (!value) return DEFAULT_SELECTED;
	try {
		const parsed = JSON.parse(value) as unknown;
		if (Array.isArray(parsed) && parsed.every((k) => ALL_DASHBOARD_STAT_KEYS.includes(k))) {
			return parsed.slice(0, MAX_SELECTED);
		}
	} catch {
		// ignore
	}
	return DEFAULT_SELECTED;
}

export function useDashboardStatsConfig() {
	const raw = useStorage<string>(DASHBOARD_STATS_STORAGE_KEY, JSON.stringify(DEFAULT_SELECTED));

	const selectedKeys = computed({
		get: () => parseStored(raw.value),
		set: (v) => {
			const valid = Array.isArray(v) && v.length > 0 ? v.slice(0, MAX_SELECTED) : DEFAULT_SELECTED;
			raw.value = JSON.stringify(valid);
		},
	});

	function toggleStat(key: DashboardStatKey) {
		const current = [...selectedKeys.value];
		const idx = current.indexOf(key);
		if (idx >= 0) {
			if (current.length <= 1) return;
			current.splice(idx, 1);
		} else {
			if (current.length >= MAX_SELECTED) return;
			current.push(key);
		}
		selectedKeys.value = current;
	}

	function isSelected(key: DashboardStatKey) {
		return selectedKeys.value.includes(key);
	}

	function resetToDefault() {
		selectedKeys.value = [...DEFAULT_SELECTED];
	}

	return {
		selectedKeys,
		toggleStat,
		isSelected,
		resetToDefault,
		ALL_DASHBOARD_STAT_KEYS,
	};
}
