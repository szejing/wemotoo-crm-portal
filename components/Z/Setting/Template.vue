<template>
	<div v-for="template in templates" :key="template.set_code">
		<div class="flex-jbetween-icenter">
			<h6 class="setting-templs-title">{{ template.set_desc }}</h6>

			<UInput
				v-if="template.input_type === InputTypeEnum.TEXT"
				type="text"
				:model-value="getSettingValue(template)"
				@update:model-value="(value) => updateSettingValue(template, value)"
			/>
			<UInput
				v-if="template.input_type === InputTypeEnum.NUMBER"
				type="number"
				:model-value="getSettingValue(template)"
				@update:model-value="(value) => updateSettingValue(template, value)"
			/>
			<UCheckbox
				v-if="template.input_type === InputTypeEnum.BOOLEAN"
				:model-value="getSettingValue(template)"
				@update:model-value="(value) => updateSettingValue(template, value)"
			/>
			<UTextarea
				v-if="template.input_type === InputTypeEnum.TEXTAREA"
				:model-value="getSettingValue(template)"
				@update:model-value="(value) => updateSettingValue(template, value)"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { SettingTempl } from '~/utils/types/setting-templ';
import { InputType as InputTypeEnum } from 'wemotoo-common';
import { Setting } from '~/utils/types/setting';

const props = defineProps({
	templates: {
		type: Array as PropType<SettingTempl[]>,
		required: true,
	},
});

const { templates } = toRefs(props);

const settingsStore = useSettingStore();
const { settings } = storeToRefs(settingsStore);

const getSettingValue = (template: SettingTempl): string | number | boolean | any => {
	const value = settings.value.find((setting: Setting) => setting.set_code === template.set_code)?.set_value;

	if (template.input_type === InputTypeEnum.BOOLEAN) {
		return value === 'true' || value === '1';
	}

	if (template.input_type === InputTypeEnum.NUMBER) {
		return Number(value);
	}

	return value;
};

const updateSettingValue = (template: SettingTempl, value: string | number | boolean | any) => {
	const settingData = {
		group_code: template.group_code,
		set_code: template.set_code,
		set_value: value,
		value_type: template.input_type,
	};
	const updatedSetting = new Setting(settingData as Setting);
	settingsStore.addToUpdatedSettings(updatedSetting);
};
</script>

<style scoped lang="postcss">
.setting-templs-title {
	@apply text-sm font-medium text-neutral-400 px-4;
}
</style>
