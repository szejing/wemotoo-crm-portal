<template>
	<ZPagePanel id="crm-user-detail" :title="pageTitle" back-to="/operation/staff">
		<div v-if="loading || !current_crm_user" class="w-full animate-in fade-in duration-200 space-y-6 max-w-3xl">
			<FormCrmUserUpdateLoading />
		</div>

		<div v-else class="space-y-6 max-w-3xl">
			<!-- User info card: view / edit -->
			<UCard>
				<template #header>
					<div class="flex items-center justify-between">
						<h2 class="flex items-center text-lg font-semibold text-neutral-900 dark:text-neutral-100">
							<UIcon name="i-heroicons-user" class="w-5 h-5 inline-block mr-2" />
							{{ $t('pages.crmUserDetailUserInformation') }}
						</h2>
						<div class="flex items-center gap-2">
							<UButton color="success" :loading="updating" :disabled="!hasChanges" @click="editFormRef?.submit()">
								<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
								{{ $t('common.save') }}
							</UButton>
							<UButton
								size="sm"
								color="error"
								variant="ghost"
								class="flex-1 opacity-50 hover:opacity-100"
								:icon="ICONS.TRASH"
								:disabled="updating"
								@click="deleteUser"
							>
								{{ $t('common.delete') }}
							</UButton>
						</div>
					</div>
				</template>

				<div v-if="current_crm_user" class="space-y-4">
					<FormCrmUserUpdate
						ref="editFormRef"
						:model-value="current_crm_user"
						@update:model-value="
							(v: CrmUserUpdate) => {
								crmUserStore.new_crm_user = v;
								formTouched = true;
							}
						"
						@submit="onEditFormSubmit"
					/>
				</div>
			</UCard>

			<!-- Change password: separate section -->
			<UCard>
				<template #header>
					<h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
						<UIcon name="i-heroicons-key" class="w-5 h-5 inline-block mr-2" />
						{{ $t('pages.crmUserDetailChangePasswordTitle') }}
					</h2>
				</template>

				<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
					{{ $t('pages.crmUserDetailChangePasswordDesc') }}
				</p>
				<FormCrmUserChangePassword ref="formRef" :loading="updating" @submit="submitPassword" />
			</UCard>
		</div>
	</ZPagePanel>
</template>

<script lang="ts" setup>
import { type CrmUserUpdate } from '~/utils/types/crm-user';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';
import { ZModalConfirmation, ZModalLoading } from '#components';

const route = useRoute();
const id = computed(() => String(route.params.id ?? ''));
const crmUserStore = useCRMUserStore();
const overlay = useOverlay();
const loadingModal = overlay.create(ZModalLoading, { props: { key: 'loading' } });
const { updating, loading, current_crm_user } = storeToRefs(crmUserStore);

const { t } = useI18n();
const pageTitle = computed(() => {
	if (!current_crm_user.value) return t('pages.crmUser');
	const u = current_crm_user.value;
	return u.name || u.email_address || t('pages.crmUser');
});

watch(
	() => updating.value,
	(value: boolean) => {
		if (value) {
			loadingModal.open();
		} else {
			loadingModal.close();
		}
	},
);

onBeforeMount(async () => {
	if (!current_crm_user.value) {
		const crmUser = await crmUserStore.getCrmUser(id.value);
		if (crmUser) {
			crmUserStore.current_crm_user = crmUser;
		} else {
			await navigateTo('/operation/staff');
		}
	}
});

const editFormRef = ref<{ submit: () => void } | null>(null);
const formRef = useTemplateRef<{ reset: () => void }>('formRef');

const formTouched = ref(false);
const hasChanges = computed(() => {
	if (!formTouched.value || !current_crm_user.value) return false;
	const original = current_crm_user.value;
	const edited = crmUserStore.new_crm_user;
	return (
		edited.name !== original.name ||
		edited.email_address !== original.email_address ||
		edited.dial_code !== original.dial_code ||
		edited.phone_no !== original.phone_no ||
		edited.role !== original.role
	);
});

useLeavePageGuard(hasChanges, {
	onLeave: () => {
		formTouched.value = false;
		current_crm_user.value = undefined;
	},
});

const onEditFormSubmit = async (payload: { name: string; email_address: string; dial_code: string; phone_no: string; role: CrmUserUpdate['role'] }) => {
	await crmUserStore.updateCrmUser(id.value, {
		name: payload.name || undefined,
		email_address: payload.email_address || undefined,
		dial_code: payload.dial_code || undefined,
		phone_no: payload.phone_no || undefined,
		role: payload.role || undefined,
	});
	const refreshed = await crmUserStore.getCrmUser(id.value);
	if (refreshed) {
		current_crm_user.value = refreshed;
		formTouched.value = false;
	}
};

const submitPassword = async (payload: { old_password: string; new_password: string; confirm_password: string }) => {
	const result = await crmUserStore.updateCrmUserPassword(id.value, {
		old_password: payload.old_password,
		new_password: payload.new_password,
		confirm_password: payload.confirm_password,
	});

	if (result === true) {
		formRef.value?.reset();
	}
};

const deleteUser = async () => {
	const confirmModal = overlay.create(ZModalConfirmation, {
		props: {
			message: t('pages.confirmDeleteCrmUser'),
			action: 'delete',
			onConfirm: async () => {
				await crmUserStore.deleteCrmUser(current_crm_user.value!);
				confirmModal.close();
				navigateTo(`/operation/staff`);
			},
			onCancel: () => {
				confirmModal.close();
			},
		},
	});

	confirmModal.open();
};

onMounted(async () => {
	const user = await crmUserStore.getCrmUser(id.value);
	if (user) {
		current_crm_user.value = user;
	}
});
</script>

<style scoped></style>
