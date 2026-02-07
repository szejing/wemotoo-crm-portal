<template>
	<UForm :schema="crmUserSchema" :state="new_crm_user" class="space-y-4" @submit="onSubmit">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormField :label="$t('components.crmUserForm.name')" name="name" required>
				<UInput v-model="new_crm_user.name" :placeholder="$t('components.crmUserForm.name')" />
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.email')" class="sm:col-span-2" name="email_address" required>
				<UInput v-model="new_crm_user.email_address" type="email" :placeholder="$t('components.crmUserForm.email')" />
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.phone')" name="phone_number" required>
				<ZPhoneInput
					v-model:dial-code="new_crm_user.dial_code"
					v-model:phone-number="new_crm_user.phone_no"
					:placeholder="$t('components.crmUserForm.phone')"
				/>
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.role')">
				<USelect :model-value="new_crm_user.role" :items="roleOptions(t)" value-attribute="value" :placeholder="$t('components.crmUserForm.role')" />
			</UFormField>
			<UFormField :label="$t('components.crmUserForm.status')" name="is_active">
				<USwitch
					v-model="new_crm_user.is_active"
					:label="
						$t('components.crmUserForm.currentStatusLabel', {
							status: new_crm_user.is_active ? $t('components.crmUserForm.statusActive') : $t('components.crmUserForm.statusDisabled'),
						})
					"
				/>
			</UFormField>
		</div>

		<!-- Submit Button -->
		<div class="flex justify-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-8">
			<UButton color="success" size="lg" type="submit" :loading="adding" class="w-full sm:w-auto sm:min-w-[200px]">
				<UIcon :name="ICONS.CHECK_ROUNDED" class="w-5 h-5" />
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
import { roleOptions } from '~/utils/user-roles-utils';

const { t } = useI18n();
const crmUserSchema = computed(() => CreateCRMUserValidation(t));
type Schema = z.infer<ReturnType<typeof CreateCRMUserValidation>>;

const crmUserStore = useCRMUserStore();
const { adding, new_crm_user } = storeToRefs(crmUserStore);

onMounted(() => {
	crmUserStore.resetNewCrmUser();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	const { name, email_address, dial_code, phone_no: phone_number, role } = event.data;

	new_crm_user.value = {
		name,
		email_address,
		dial_code,
		phone_no: phone_number,
		role,
		is_active: true,
	};

	const success = await crmUserStore.createCrmUser();
	if (success) {
		useRouter().back();
	}
};
</script>
