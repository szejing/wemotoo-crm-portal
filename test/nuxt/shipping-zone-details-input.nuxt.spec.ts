import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZInputShippingZoneDetails from '~/components/Z/Input/ShippingZone/Details.vue';
import type { ShippingZoneFormState } from '~/components/Z/Input/ShippingZone/Details.vue';

describe('ZInputShippingZoneDetails', () => {
	it('renders zone details section', async () => {
		const state = reactive<ShippingZoneFormState>({
			name: '',
			is_active: true,
			country_code: '',
			state: [],
			postcodes_text: '',
			shipping_method_ids: [],
			method_pricing: {},
		});

		const wrapper = await mountSuspended(ZInputShippingZoneDetails, {
			props: {
				state,
				methodOptions: [
					{ label: 'Standard', value: 'sm_1' },
					{ label: 'Express', value: 'sm_2' },
				],
			},
		});

		expect(wrapper.find('#section-shipping-zone-details').exists()).toBe(true);
		expect(wrapper.text()).toContain('Select states');
		expect(wrapper.text()).toContain('How your team will recognize this zone in admin.');
	});
});
