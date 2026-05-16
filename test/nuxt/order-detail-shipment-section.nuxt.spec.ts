import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZSectionOrderDetailShipment from '~/components/Z/Section/Order/Detail/Shipment.vue';
import type { OrderHistory } from '~/utils/types/order-history';
import type { OrderShipment } from '~/utils/types/order-fulfillment-shipping';

const currency = {
	code: 'MYR',
	name: 'Malaysian ringgit',
	symbol: 'RM',
	is_active: true,
};

function shipmentFixture(override: Partial<OrderShipment>): OrderShipment {
	return {
		id: 'sh-1',
		order_no: 'O1',
		inv_no: 'INV1',
		shipping_fee: 15,
		status: 'shipped',
		courier_name: 'CourierX',
		tracking_no: 'TRACK-789',
		...override,
	} as OrderShipment;
}

describe('ZSectionOrderDetailShipment', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it('shows empty shipment state with disabled create button when read-only', async () => {
		const order = {
			order_no: 'O1',
			inv_no: 'INV1',
			currency,
			shipping_method: { id: 1, description: 'Standard' },
			shipment: undefined,
		} as unknown as OrderHistory;

		const wrapper = await mountSuspended(ZSectionOrderDetailShipment, {
			props: { order, isReadOnly: true },
		});

		expect(wrapper.find('[data-testid="shipment-empty"]').exists()).toBe(true);
		const btn = wrapper.find('[data-testid="shipment-create"]');
		expect(btn.exists()).toBe(true);
		const disabledAttr = btn.attributes().disabled ?? btn.attributes('disabled');
		const hasDomDisabled =
			disabledAttr !== undefined ||
			btn.element.hasAttribute('disabled') ||
			btn.attributes('aria-disabled') === 'true';
		expect(hasDomDisabled).toBe(true);
	});

	it('renders tracking copy affordance only when tracking number exists', async () => {
		const order = {
			order_no: 'O1',
			inv_no: 'INV1',
			currency,
			shipping_method: { id: 1, description: 'Standard' },
			shipment: shipmentFixture({ tracking_no: 'ABC-999' }),
		} as unknown as OrderHistory;

		const wrapper = await mountSuspended(ZSectionOrderDetailShipment, {
			props: { order },
		});

		expect(wrapper.find('[data-testid="shipment-copy-tracking"]').exists()).toBe(true);
	});

	it('omits tracking copy affordance without a tracking number', async () => {
		const order = {
			order_no: 'O1',
			inv_no: 'INV1',
			currency,
			shipping_method: { id: 1, description: 'Standard' },
			shipment: shipmentFixture({ tracking_no: '' }),
		} as unknown as OrderHistory;

		const wrapper = await mountSuspended(ZSectionOrderDetailShipment, {
			props: { order },
		});

		expect(wrapper.find('[data-testid="shipment-copy-tracking"]').exists()).toBe(false);
	});

	it('copies tracking number to clipboard via toast-ready flow', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });
		try {
			const order = {
				order_no: 'O1',
				inv_no: 'INV1',
				currency,
				shipping_method: { id: 1, description: 'Standard' },
				shipment: shipmentFixture({ tracking_no: 'COPYME' }),
			} as unknown as OrderHistory;

			const wrapper = await mountSuspended(ZSectionOrderDetailShipment, {
				props: { order },
			});

			await wrapper.get('[data-testid="shipment-copy-tracking"]').trigger('click');

			await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('COPYME'));
		} finally {
			vi.unstubAllGlobals();
		}
	});
});
