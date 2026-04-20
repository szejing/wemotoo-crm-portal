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

vi.mock('../../app/stores/Auth/Auth', () => ({
	useAuthStore: () => ({
		user: { id: 'u1' },
	}),
}));

describe('useShippingZoneStore', () => {
	const apiMock = {
		shippingZone: {
			getMany: vi.fn(),
			getSingle: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			remove: vi.fn(),
		},
	};

	const zoneApiRow = (overrides: Record<string, unknown> = {}) => ({
		id: 'z1',
		code: 'west-my',
		description: 'West Malaysia',
		rule: 0,
		is_active: true,
		country_code: 'MY',
		state: 'Selangor',
		postcode_patterns: [{ kind: 'exact', value: '40000' }],
		method_links: [
			{
				shipping_method_id: 'sm_1',
				fee: 5,
				estimated_days: 2,
				shipping_method: { id: 'sm_1', description: 'Standard' },
			},
		],
		created_at: '2020-01-01T00:00:00.000Z',
		updated_at: '2020-01-01T00:00:00.000Z',
		...overrides,
	});

	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		(globalThis as unknown as { useNuxtApp: () => unknown }).useNuxtApp = () => ({ $api: apiMock }) as unknown;
		(globalThis as unknown as { useCookie: (key: string) => { value: string } }).useCookie = () => ({ value: 'm1' });
	});

	const samplePayload = () => ({
		code: 'west-my',
		description: 'West Malaysia',
		rule: 0,
		is_active: true,
		country_code: 'MY',
		state: 'Selangor',
		postcode_patterns: [{ kind: 'exact' as const, value: '40000' }],
		methods: [{ shipping_method_id: 'sm_1', fee: 5, estimated_days: 2 }],
		shipping_method_ids: ['sm_1'],
	});

	it('creates a zone and lists it', async () => {
		apiMock.shippingZone.create.mockResolvedValue({ shipping_zone: zoneApiRow() });
		apiMock.shippingZone.getMany.mockResolvedValue({ shipping_zones: [zoneApiRow()], total: 1 });

		const store = useShippingZoneStore();
		const row = await store.createShippingZone(samplePayload());
		expect(row?.code).toBe('west-my');
		expect(row?.description).toBe('West Malaysia');
		expect(store.allZones).toHaveLength(1);
		await store.getShippingZones();
		expect(store.getDisplayZones).toHaveLength(1);
		expect(store.total_shipping_zones).toBe(1);
	});

	it('filters by query and paginates', async () => {
		apiMock.shippingZone.create
			.mockResolvedValueOnce({
				shipping_zone: zoneApiRow({
					id: 'za',
					code: 'zone-a',
					description: 'Zone A',
					country_code: 'SG',
				}),
			})
			.mockResolvedValueOnce({
				shipping_zone: zoneApiRow({ id: 'zb', code: 'zone-b', description: 'Zone B' }),
			});
		apiMock.shippingZone.getMany
			.mockResolvedValueOnce({
				shipping_zones: [
					zoneApiRow({
						id: 'za',
						code: 'zone-a',
						description: 'Zone A',
						country_code: 'SG',
					}),
				],
				total: 1,
			})
			.mockResolvedValueOnce({
				shipping_zones: [
					zoneApiRow({ id: 'za', code: 'zone-a', description: 'Zone A', country_code: 'SG' }),
					zoneApiRow({ id: 'zb', code: 'zone-b', description: 'Zone B' }),
				],
				total: 2,
			})
			.mockResolvedValueOnce({
				shipping_zones: [
					zoneApiRow({ id: 'za', code: 'zone-a', description: 'Zone A', country_code: 'SG' }),
					zoneApiRow({ id: 'zb', code: 'zone-b', description: 'Zone B' }),
				],
				total: 2,
			});

		const store = useShippingZoneStore();
		await store.createShippingZone({ ...samplePayload(), code: 'zone-a', description: 'Zone A', country_code: 'SG' });
		await store.createShippingZone({ ...samplePayload(), code: 'zone-b', description: 'Zone B', country_code: 'MY' });
		store.filter.query = 'Zone A';
		store.filter.page_size = 1;
		store.filter.current_page = 1;
		await store.getShippingZones();
		expect(store.total_shipping_zones).toBe(1);
		expect(store.getDisplayZones[0]?.description).toBe('Zone A');
	});

	it('updates a zone', async () => {
		apiMock.shippingZone.create.mockResolvedValue({ shipping_zone: zoneApiRow() });
		apiMock.shippingZone.update.mockResolvedValue({
			shipping_zone: zoneApiRow({ description: 'Renamed' }),
		});
		apiMock.shippingZone.getMany
			.mockResolvedValueOnce({ shipping_zones: [zoneApiRow()], total: 1 })
			.mockResolvedValueOnce({ shipping_zones: [zoneApiRow({ description: 'Renamed' })], total: 1 });

		const store = useShippingZoneStore();
		const created = await store.createShippingZone(samplePayload());
		expect(created).toBeDefined();
		const updated = await store.updateShippingZone(created!.id, { description: 'Renamed' });
		expect(updated?.description).toBe('Renamed');
	});

	it('deletes a zone', async () => {
		apiMock.shippingZone.create.mockResolvedValue({ shipping_zone: zoneApiRow() });
		apiMock.shippingZone.remove.mockResolvedValue({ ok: true });
		apiMock.shippingZone.getMany
			.mockResolvedValueOnce({ shipping_zones: [zoneApiRow()], total: 1 })
			.mockResolvedValueOnce({ shipping_zones: [], total: 0 });

		const store = useShippingZoneStore();
		const created = await store.createShippingZone(samplePayload());
		await store.deleteShippingZone(created!.id);
		expect(store.allZones).toHaveLength(0);
	});
});
