<template>
	<UForm ref="formRef" :schema="crmUserSchema" :state="state" class="space-y-6" @submit="onSubmit">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormField name="name" :label="$t('components.crmUserForm.name')">
				<UInput :model-value="state.name" :placeholder="$t('components.crmUserForm.name')" @update:model-value="(v: string) => set('name', v)" />
			</UFormField>
			<UFormField name="email_address" :label="$t('components.crmUserForm.email')" class="sm:col-span-2">
				<UInput
					:model-value="state.email_address"
					type="email"
					:placeholder="$t('components.crmUserForm.email')"
					@update:model-value="(v: string) => set('email_address', v)"
				/>
			</UFormField>
			<UFormField name="dial_code" :label="$t('components.crmUserForm.phone')">
				<ZPhoneInput
					:dial-code="state.dial_code"
					:phone-number="state.phone_number"
					:placeholder="$t('components.crmUserForm.phone')"
					@update:dial-code="(v: string) => set('dial_code', v)"
					@update:phone-number="(v: string) => set('phone_number', v)"
				/>
			</UFormField>
			<UFormField name="role" :label="$t('components.crmUserForm.role')">
				<USelect
					:model-value="state.role"
					:items="roleOptions(t)"
					value-attribute="value"
					:placeholder="$t('components.crmUserForm.role')"
					@update:model-value="(v: UserRoles | undefined) => set('role', v)"
				/>
			</UFormField>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui';
import type { z } from 'zod';
import { UserRoles } from 'wemotoo-common';
import { type CrmUserUpdate } from '~/utils/types/crm-user';
import { CreateCRMUserValidation } from '~/utils/schema';
import { roleOptions } from '~/utils/user-roles-utils';

const { t } = useI18n();
const crmUserSchema = computed(() => CreateCRMUserValidation(t));
type Schema = z.infer<ReturnType<typeof CreateCRMUserValidation>>;

const formRef = ref<{ submit: () => void } | null>(null);

const props = withDefaults(
	defineProps<{
		modelValue?: CrmUserUpdate | null;
	}>(),
	{
		modelValue: () => ({ name: '', email_address: '', dial_code: '', phone_number: '', role: undefined }),
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: CrmUserUpdate];
	submit: [payload: Schema];
}>();

const onSubmit = (event: FormSubmitEvent<Schema>) => {
	emit('submit', event.data);
};

const submit = () => {
	formRef.value?.submit();
};

defineExpose({ submit });

const state = reactive<CrmUserUpdate>({
	name: props.modelValue?.name ?? '',
	email_address: props.modelValue?.email_address ?? '',
	dial_code: props.modelValue?.dial_code ?? '',
	phone_number: props.modelValue?.phone_number ?? '',
	role: props.modelValue?.role ?? undefined,
});

watch(
	() => props.modelValue,
	(v) => {
		if (v) Object.assign(state, v);
	},
	{ immediate: true, deep: true },
);

const set = <K extends keyof CrmUserUpdate>(key: K, value: CrmUserUpdate[K]) => {
	state[key] = value;
	emit('update:modelValue', { ...state });
};
</script>
