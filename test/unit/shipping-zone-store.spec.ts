import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useShippingZoneStore } from '../../app/stores/ShippingZone/ShippingZone';

const { successNotification, failedNotification } = vi.hoisted(() => ({
	successNotification: vi.fn(),
	failedNotification: vi.fn(),
}));

vi.mock('../../app/stores/AppUi/AppUi', () => ({
	successNotification,
	failedNotification,
}));

describe('useShippingZoneStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	const samplePayload = () => ({
		name: 'West Malaysia',
		is_active: true,
		country_code: 'MY',
		state: 'Selangor',
		postcode_patterns: [{ kind: 'exact' as const, value: '40000' }],
		fee_override: 5 as number | null,
		estimated_days_override: 2 as number | null,
		shipping_method_ids: ['sm_1'],
	});

	it('creates a zone and lists it', async () => {
		const store = useShippingZoneStore();
		const row = await store.createShippingZone(samplePayload());
		expect(row?.name).toBe('West Malaysia');
		expect(store.allZones).toHaveLength(1);
		await store.getShippingZones();
		expect(store.getDisplayZones).toHaveLength(1);
		expect(store.total_shipping_zones).toBe(1);
	});

	it('filters by query and paginates', async () => {
		const store = useShippingZoneStore();
		await store.createShippingZone({ ...samplePayload(), name: 'Zone A', country_code: 'SG' });
		await store.createShippingZone({ ...samplePayload(), name: 'Zone B', country_code: 'MY' });
		store.filter.query = 'Zone A';
		store.filter.page_size = 1;
		store.filter.current_page = 1;
		await store.getShippingZones();
		expect(store.total_shipping_zones).toBe(1);
		expect(store.getDisplayZones[0]?.name).toBe('Zone A');
	});

	it('updates a zone', async () => {
		const store = useShippingZoneStore();
		const created = await store.createShippingZone(samplePayload());
		expect(created).toBeDefined();
		const updated = await store.updateShippingZone(created!.id, { name: 'Renamed' });
		expect(updated?.name).toBe('Renamed');
	});

	it('deletes a zone', async () => {
		const store = useShippingZoneStore();
		const created = await store.createShippingZone(samplePayload());
		await store.deleteShippingZone(created!.id);
		expect(store.allZones).toHaveLength(0);
	});
});
