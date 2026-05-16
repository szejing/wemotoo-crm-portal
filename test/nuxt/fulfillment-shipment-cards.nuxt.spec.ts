import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import FulfillmentActions from '~/components/Fulfillment/Actions.vue';

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
