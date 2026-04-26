import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import FormOutletReviewSummary from '~/components/Form/Outlet/ReviewSummary.vue';

describe('FormOutletReviewSummary', () => {
	it('renders the outlet review card with summary fields', async () => {
		const wrapper = await mountSuspended(FormOutletReviewSummary, {
			props: {
				summary: {
					code: 'HQ01',
					description: 'Head office',
					phoneLabel: '+60 123456789',
					taxRuleLabel: 'SST-10',
					addressBlock: '1 Jalan Test\nKuala Lumpur, 50000',
					countryLabel: 'MY',
					coordinatesLabel: '3.15, 101.7',
				},
				subtitleKey: 'components.outletForm.reviewSubtitleCreate',
			},
		});

		expect(wrapper.find('#section-outlet-review').exists()).toBe(true);
		expect(wrapper.text()).toContain('HQ01');
		expect(wrapper.text()).toContain('Head office');
		expect(wrapper.text()).toContain('3.15, 101.7');
		expect(wrapper.find('iframe').exists()).toBe(false);
	});

	it('embeds a Google Maps iframe when lat/lng are non-zero', async () => {
		const wrapper = await mountSuspended(FormOutletReviewSummary, {
			props: {
				summary: {
					code: 'HQ01',
					description: 'Head office',
					phoneLabel: '+60 123456789',
					taxRuleLabel: 'SST-10',
					addressBlock: '1 Jalan Test',
					countryLabel: 'MY',
					coordinatesLabel: '3.15, 101.7',
					latitude: 3.15,
					longitude: 101.7,
				},
				subtitleKey: 'components.outletForm.reviewSubtitleCreate',
			},
		});

		const iframe = wrapper.find('iframe');
		expect(iframe.exists()).toBe(true);
		expect(iframe.attributes('src')).toMatch(/maps\.google\.com\/maps/);
		expect(iframe.attributes('src')).toContain(encodeURIComponent('3.15,101.7'));
	});

	it('hides the coordinates block when both lat and lng are 0', async () => {
		const wrapper = await mountSuspended(FormOutletReviewSummary, {
			props: {
				summary: {
					code: 'HQ01',
					description: 'Head office',
					phoneLabel: '',
					taxRuleLabel: '',
					addressBlock: '',
					countryLabel: 'MY',
					coordinatesLabel: '',
					hideCoordinatesAtOrigin: true,
				},
			},
		});

		expect(wrapper.find('[data-testid="outlet-review-coordinates"]').exists()).toBe(false);
	});
});
