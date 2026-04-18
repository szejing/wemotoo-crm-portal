import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZInputShippingMethodDetailsAndZones from '~/components/Z/Input/ShippingMethod/DetailsAndZones.vue';

describe('ZInputShippingMethodDetailsAndZones', () => {
	it('renders details and zones sections', async () => {
		const state = reactive({
			name: '',
			fee: 0,
			estimated_days: undefined as number | undefined,
			priority: 1,
			is_active: true,
			zone_rows: [
				{
					country_code: '',
					state: '',
					postcodes_text: '',
					rule_priority: 0,
					is_default: false,
					fee_override: undefined,
					estimated_days_override: undefined,
				},
			],
		});

		const wrapper = await mountSuspended(ZInputShippingMethodDetailsAndZones, {
			props: { state },
		});

		expect(wrapper.find('#section-shipping-method-details').exists()).toBe(true);
		expect(wrapper.find('#section-shipping-zones').exists()).toBe(true);
		expect(wrapper.text()).toContain('RM');
	});
});
