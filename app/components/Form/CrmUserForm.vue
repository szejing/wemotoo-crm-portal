<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<UFormField :label="$t('components.crmUserForm.name')">
			<UInput :model-value="state.name" :placeholder="$t('components.crmUserForm.name')" @update:model-value="(v: string) => set('name', v)" />
		</UFormField>
		<UFormField :label="$t('components.crmUserForm.email')" class="sm:col-span-2">
			<UInput
				:model-value="state.email_address"
				type="email"
				:placeholder="$t('components.crmUserForm.email')"
				@update:model-value="(v: string) => set('email_address', v)"
			/>
		</UFormField>
		<UFormField :label="$t('components.crmUserForm.phone')">
			<ZPhoneInput
				:dial-code="state.dial_code"
				:phone-number="state.phone_number"
				:placeholder="$t('components.crmUserForm.phone')"
				@update:dial-code="(v: string) => set('dial_code', v)"
				@update:phone-number="(v: string) => set('phone_number', v)"
			/>
		</UFormField>
		<UFormField :label="$t('components.crmUserForm.role')">
			<USelect
				:model-value="state.role"
				:items="roleOptions"
				value-attribute="value"
				:placeholder="$t('components.crmUserForm.role')"
				@update:model-value="(v: UserRoles | undefined) => set('role', v)"
			/>
		</UFormField>
	</div>
</template>

<script lang="ts" setup>
import { UserRoles } from 'wemotoo-common';
import type { CrmUserFormValue } from '~/utils/types/crm-user';

const { t } = useI18n();

const props = withDefaults(
	defineProps<{
		modelValue?: CrmUserFormValue | null;
	}>(),
	{
		modelValue: () => ({ name: '', email_address: '', dial_code: '', phone_number: '', role: undefined }),
	},
);

const emit = defineEmits<{
	'update:modelValue': [value: CrmUserFormValue];
}>();

const roleOptions = computed(() => [
	{ value: UserRoles.SUPER_ADMIN, label: t('components.crmUserForm.roleSuperAdmin') },
	{ value: UserRoles.SUPER_STAFF, label: t('components.crmUserForm.roleSuperStaff') },
	{ value: UserRoles.MERCHANT_ADMIN, label: t('components.crmUserForm.roleMerchantAdmin') },
	{ value: UserRoles.MERCHANT_STAFF, label: t('components.crmUserForm.roleMerchantStaff') },
]);

const state = reactive<CrmUserFormValue>({
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

function set<K extends keyof CrmUserFormValue>(key: K, value: CrmUserFormValue[K]) {
	state[key] = value;
	emit('update:modelValue', { ...state });
}
</script>
