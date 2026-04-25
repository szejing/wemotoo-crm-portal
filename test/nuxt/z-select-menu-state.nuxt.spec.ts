import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import ZSelectMenuState from '~/components/Z/SelectMenu/State.vue';
import { MALAYSIA_STATE_OPTIONS } from '~/utils/data/malaysia-states';

describe('ZSelectMenuState', () => {
	it('mounts with Malaysia-only USelectMenu', async () => {
		const wrapper = await mountSuspended(ZSelectMenuState, {
			props: { stateName: '' },
		});
		const menu = wrapper.findComponent({ name: 'USelectMenu' });
		expect(menu.exists()).toBe(true);
		const items = menu.props('items') as { label: string; value: string }[];
		expect(items.length).toBe(MALAYSIA_STATE_OPTIONS.length);
	});

	it('merges a non-list value into options when provided', async () => {
		const wrapper = await mountSuspended(ZSelectMenuState, {
			props: { stateName: 'Custom Legacy' },
		});
		const menu = wrapper.findComponent({ name: 'USelectMenu' });
		const items = menu.props('items') as { label: string; value: string }[];
		expect(items.some((o) => o.value === 'Custom Legacy')).toBe(true);
	});

	it('uses multiple select when multiple is true', async () => {
		const wrapper = await mountSuspended(ZSelectMenuState, {
			props: { multiple: true, stateNames: ['Johor', 'Kedah'] },
		});
		const menu = wrapper.findComponent({ name: 'USelectMenu' });
		expect(menu.props('multiple')).toBe(true);
	});
});
