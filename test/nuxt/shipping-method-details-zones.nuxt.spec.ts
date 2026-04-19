import { describe, expect, it } from 'vitest';
import { reactive } from 'vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZInputShippingMethodDetailsSection from '~/components/Z/Input/ShippingMethod/DetailsSection.vue';

describe('ZInputShippingMethodDetailsSection', () => {
	it('renders the shipping method details section and field hints', async () => {
		const state = reactive({
			name: '',
			priority: 1,
			is_active: true,
			zone_rows: [],
		});

		const wrapper = await mountSuspended(ZInputShippingMethodDetailsSection, {
			props: { state },
		});

		expect(wrapper.find('#section-shipping-method-details').exists()).toBe(true);
		expect(wrapper.text()).toContain('Priority');
		expect(wrapper.text()).toContain('Label shown in checkout and admin.');
		expect(wrapper.text()).toContain('Lower numbers rank first when several methods apply to an address.');
	});
});
