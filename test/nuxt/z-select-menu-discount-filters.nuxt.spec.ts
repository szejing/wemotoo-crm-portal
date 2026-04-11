import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZSelectMenuDiscountFilterCondition from '~/components/Z/SelectMenu/DiscountFilterCondition.vue';
import ZSelectMenuDiscountFilterOperator from '~/components/Z/SelectMenu/DiscountFilterOperator.vue';

describe('ZSelectMenu discount condition filters', () => {
	it('mounts operator menu', async () => {
		const wrapper = await mountSuspended(ZSelectMenuDiscountFilterOperator, {
			props: { modelValue: undefined },
		});
		expect(wrapper.findComponent({ name: 'USelectMenu' }).exists()).toBe(true);
	});

	it('mounts condition menu', async () => {
		const wrapper = await mountSuspended(ZSelectMenuDiscountFilterCondition, {
			props: { modelValue: undefined },
		});
		expect(wrapper.findComponent({ name: 'USelectMenu' }).exists()).toBe(true);
	});
});
