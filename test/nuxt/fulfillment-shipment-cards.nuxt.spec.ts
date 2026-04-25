import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import FulfillmentActions from '~/components/Fulfillment/FulfillmentActions.vue';
import ShipmentCard from '~/components/Shipment/ShipmentCard.vue';

describe('FulfillmentActions', () => {
	it('only enables valid action for current status', async () => {
		const wrapper = await mountSuspended(FulfillmentActions, {
			props: {
				status: 'processing',
				isReadOnly: false,
				loading: false,
			},
		});

		const buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(3);
		expect(buttons[0]?.attributes('disabled')).toBeDefined();
		expect(buttons[1]?.attributes('disabled')).toBeUndefined();
		expect(buttons[2]?.attributes('disabled')).toBeDefined();
	});

	it('disables all actions in read-only mode', async () => {
		const wrapper = await mountSuspended(FulfillmentActions, {
			props: {
				status: 'packed',
				isReadOnly: true,
				loading: false,
			},
		});

		const buttons = wrapper.findAll('button');
		expect(buttons.every((button) => button.attributes('disabled') !== undefined)).toBe(
			true,
		);
	});
});

describe('ShipmentCard', () => {
	it('disables create action in read-only mode when no shipment exists', async () => {
		const wrapper = await mountSuspended(ShipmentCard, {
			props: {
				shipment: undefined,
				isReadOnly: true,
				loading: false,
			},
		});

		const button = wrapper.find('button');
		expect(button.exists()).toBe(true);
		expect(button.attributes('disabled')).toBeDefined();
	});
});
