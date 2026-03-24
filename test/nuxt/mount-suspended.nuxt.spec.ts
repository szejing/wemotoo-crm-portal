import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';

const SmokeComponent = defineComponent({
	name: 'VitestNuxtSmoke',
	setup() {
		return () => h('div', { class: 'vitest-nuxt-smoke' }, 'Nuxt test runtime OK');
	},
});

describe('Nuxt runtime (mountSuspended)', () => {
	it('mounts a component inside the Nuxt environment', async () => {
		const wrapper = await mountSuspended(SmokeComponent);
		expect(wrapper.find('.vitest-nuxt-smoke').exists()).toBe(true);
		expect(wrapper.text()).toContain('Nuxt test runtime OK');
	});
});
