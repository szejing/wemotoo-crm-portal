<template>
	<div v-for="template in templates" :key="template.set_code">
		<h6 class="setting-templs-title">{{ template.set_desc }}</h6>
	</div>
</template>

<script lang="ts" setup>
import type { SettingTempl } from '~/utils/types/setting-templ';

const props = defineProps({
	templates: {
		type: Array as PropType<SettingTempl[]>,
		required: true,
	},
});

const { templates } = toRefs(props);

console.log(templates.value);
</script>

<style scoped lang="postcss">
.setting-templs-title {
	@apply text-sm font-medium text-neutral-400 px-4;
}
</style>
