<template>
	<UForm :schema="crmUserSchema" :state="new_crm_user" class="space-y-4" @submit="onSubmit">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormField :label="$t('components.crmUserForm.name')" name="name" required>
				<UInput v-model="new_crm_user.name" :placeholder="$t('components.crmUserForm.name')" @update:model-value="(v: string) => set('name', v)" />
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.email')" class="sm:col-span-2" name="email_address" required>
				<UInput
					v-model="new_crm_user.email_address"
					type="email"
					:placeholder="$t('components.crmUserForm.email')"
					@update:model-value="(v: string) => set('email_address', v)"
				/>
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.phone')" name="dial_code" required>
				<UFormField name="phone_no" required>
					<ZPhoneInput
						:dial-code="new_crm_user.dial_code"
						:phone-no="new_crm_user.phone_no"
						:placeholder="$t('components.crmUserForm.phone')"
						@update:dial-code="(v: string) => set('dial_code', v)"
						@update:phone-no="(v: string) => set('phone_no', v ?? '')"
					/>
				</UFormField>
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.role')">
				<USelect
					:model-value="new_crm_user.role"
					:items="roleOptions(t)"
					value-attribute="value"
					:placeholder="$t('components.crmUserForm.role')"
					@update:model-value="(v: UserRoles) => set('role', v as UserRoles)"
				/>
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.staffDepartment')" name="staff_department_id">
				<USelect
					:model-value="new_crm_user.staff_department_id"
					:items="staffDepartmentOptions"
					value-attribute="value"
					:placeholder="$t('components.crmUserForm.staffDepartment')"
					@update:model-value="(v: number | null) => set('staff_department_id', v)"
				/>
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.status')" name="is_active">
				<USwitch
					v-model="new_crm_user.is_active"
					:label="
						$t('components.crmUserForm.currentStatusLabel', {
							status: new_crm_user.is_active ? $t('components.crmUserForm.statusActive') : $t('components.crmUserForm.statusDisabled'),
						})
					"
					@update:model-value="(v: boolean) => set('is_active', v)"
				/>
			</UFormField>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">
			<UButton color="success" size="lg" type="submit" :loading="adding" class="w-full sm:w-auto">
				<UIcon v-if="!adding" :name="ICONS.CHECK_ROUNDED" class="w-5 h-5" />
				<span>{{ $t('components.crmUserForm.createCrmUser') }}</span>
			</UButton>
		</div>
	</UForm>
</template>

<script lang="ts" setup>
import { CreateCRMUserValidation } from '~/utils/schema';
import type { z } from 'zod';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';
import type { FormSubmitEvent } from '@nuxt/ui';
import { roleOptions } from '~/utils/options/user-roles';
import type { UserRoles } from 'wemotoo-common';
import type { CrmUserCreate } from '~/utils/types/crm-user';
import { useStaffDepartmentStore } from '~/stores/StaffDepartment/StaffDepartment';

const { t } = useI18n();
const crmUserSchema = computed(() => CreateCRMUserValidation(t));
type Schema = z.infer<ReturnType<typeof CreateCRMUserValidation>>;

const crmUserStore = useCRMUserStore();
const staffDepartmentStore = useStaffDepartmentStore();
const { adding, new_crm_user } = storeToRefs(crmUserStore);

const staffDepartmentOptions = computed(() => [{ label: t('common.notSet'), value: null }, ...staffDepartmentStore.options]);

onMounted(async () => {
	crmUserStore.resetNewCrmUser();
	await staffDepartmentStore.getStaffDepartments();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, email_address, dial_code, phone_no: phone_number, role, is_active, staff_department_id } = event.data;

	new_crm_user.value = {
		name,
		email_address,
		dial_code,
		phone_no: phone_number,
		role,
		is_active,
		staff_department_id: staff_department_id ?? null,
	};

	const success = await crmUserStore.createCrmUser();
	if (success) {
		useRouter().back();
	}
};

const set = <K extends keyof CrmUserCreate>(key: K, value: CrmUserCreate[K]) => {
	new_crm_user.value[key] = value;
};
</script>
