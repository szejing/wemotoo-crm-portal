<template>
	<div v-for="template in templates" :key="template.set_code">
		<div class="flex-jbetween-icenter">
			<h6 class="setting-templs-title">{{ template.set_desc }}</h6>

			<UInput v-if="template.input_type === InputTypeEnum.TEXT" type="text" :model-value="getSettingValue(template)" />
			<UInput v-if="template.input_type === InputTypeEnum.NUMBER" type="number" :model-value="getSettingValue(template)" />
			<UCheckbox v-if="template.input_type === InputTypeEnum.BOOLEAN" :model-value="getSettingValue(template)" />
			<UTextarea v-if="template.input_type === InputTypeEnum.TEXTAREA" :model-value="getSettingValue(template)" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { SettingTempl } from '~/utils/types/setting-templ';
import { InputType as InputTypeEnum } from '~/utils/enum/input-type';
import type { Setting } from '~/utils/types/setting';

const props = defineProps({
	templates: {
		type: Array as PropType<SettingTempl[]>,
		required: true,
	},
});

const { templates } = toRefs(props);

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const getSettingValue = (template: SettingTempl): string | number | boolean | any => {
	const value = settings.value.find((setting: Setting) => setting.set_code === template.set_code)?.set_value;

	if (template.input_type === InputTypeEnum.BOOLEAN) {
		return value === 'true';
	}

	if (template.input_type === InputTypeEnum.NUMBER) {
		return Number(value);
	}

	return value;
};

console.log(templates.value);
</script>

<style scoped lang="postcss">
.setting-templs-title {
	@apply text-sm font-medium text-neutral-400 px-4;
}
</style>
