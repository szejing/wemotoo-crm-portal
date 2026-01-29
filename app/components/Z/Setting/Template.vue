<template>
	<div v-for="template in templates" :key="template.set_code" class="py-3">
		<div class="flex justify-between items-center">
			<h6 class="setting-templs-title">{{ template.set_desc }}</h6>

			<div class="min-w-[50%] text-end">
				<UInput
					v-if="template.input_type === InputTypeEnum.TEXT"
					type="text"
					:model-value="getSettingValue(template)"
					:disabled="template.is_disabled"
					:placeholder="template.default_val"
					@update:model-value="(value) => updateSettingValue(template, value)"
				/>
				<UInput
					v-if="template.input_type === InputTypeEnum.NUMBER"
					type="number"
					:model-value="getSettingValue(template)"
					:disabled="template.is_disabled"
					:placeholder="template.default_val"
					@update:model-value="(value) => updateSettingValue(template, value)"
				/>
				<UCheckbox
					v-if="template.input_type === InputTypeEnum.BOOLEAN"
					:model-value="getSettingValue(template)"
					:disabled="template.is_disabled"
					@update:model-value="(value: boolean | 'indeterminate') => updateSettingValue(template, value)"
				/>
				<UTextarea
					v-if="template.input_type === InputTypeEnum.TEXTAREA"
					:model-value="getSettingValue(template)"
					:disabled="template.is_disabled"
					:placeholder="template.default_val"
					:rows="4"
					@update:model-value="(value) => updateSettingValue(template, value)"
				/>
				<UInput
					v-if="template.input_type === InputTypeEnum.MASKEDTEXTBOX"
					type="text"
					:model-value="getSettingValue(template)"
					:disabled="template.is_disabled"
					:placeholder="template.default_val"
					@update:model-value="(value) => updateSettingValue(template, value)"
				/>
				<div v-if="template.input_type === InputTypeEnum.GETFILENAME" class="space-y-1">
					<UInput type="file" :disabled="template.is_disabled" @change="handleFileChange(template, $event)" />
					<p v-if="getSettingValue(template)" class="text-xs text-gray-500">Current: {{ getSettingValue(template) }}</p>
				</div>
			</div>
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
	const updatedSetting = new Setting(settingData as unknown as Setting);
	settingsStore.addToUpdatedSettings(updatedSetting);
};

const handleFileChange = (template: SettingTempl, event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (file) {
		updateSettingValue(template, file.name);
	}
};
</script>

<style scoped>
.setting-templs-title {
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
	color: var(--color-neutral-400);
	padding-left: 1rem;
	padding-right: 1rem;
}
</style>
