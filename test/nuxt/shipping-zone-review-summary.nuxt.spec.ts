import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import FormShippingZoneReviewSummary from '~/components/Form/ShippingZone/ReviewSummary.vue';

describe('FormShippingZoneReviewSummary', () => {
	it('renders the shipping zone review card', async () => {
		const wrapper = await mountSuspended(FormShippingZoneReviewSummary, {
			props: {
				summary: {
					code: 'west',
					description: 'West',
					rule: 0,
					statusLabel: 'Active',
					countryLabel: 'MY',
					stateLabel: 'Selangor',
					postcodesSummaryLabel: '2 postcode line(s)',
					pricingSummaryLabel: 'Standard: RM 5.00 (3 days)',
					methodsLabel: 'Standard',
				},
				subtitleKey: 'components.shippingZoneForm.reviewSubtitleCreate',
			},
		});

		expect(wrapper.find('#section-shipping-zone-review').exists()).toBe(true);
		expect(wrapper.text()).toContain('West');
		expect(wrapper.text()).toContain('Selangor');
	});

	it('renders pricing and methods as separate lines when arrays are provided', async () => {
		const wrapper = await mountSuspended(FormShippingZoneReviewSummary, {
			props: {
				summary: {
					code: 'zone-a',
					description: 'Zone A',
					rule: 1,
					statusLabel: 'Active',
					countryLabel: 'MY',
					stateLabel: 'KL',
					postcodesSummaryLabel: '1 postcode line(s)',
					pricingSummaryLabel: 'A: RM 1 · B: RM 2',
					methodsLabel: 'A, B',
					pricingLines: ['Pickup: RM 10.00', 'Standard: RM 5.00'],
					methodLabels: ['Pickup', 'Standard'],
				},
				subtitleKey: 'components.shippingZoneForm.reviewSubtitleCreate',
			},
		});

		expect(wrapper.text()).toContain('Pickup: RM 10.00');
		expect(wrapper.text()).toContain('Standard: RM 5.00');
		expect(wrapper.text()).toMatch(/Pickup/);
		expect(wrapper.text()).toMatch(/Standard/);
	});
});
