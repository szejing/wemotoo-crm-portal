<template>
	<UDashboardPanel id="crm-user-detail">
		<template #header>
			<UDashboardNavbar :title="pageTitle">
				<template #leading>
					<ZBackButton fallbackTo="/crm-users" />
					<!-- <UDashboardSidebarCollapse class="hidden lg:flex" /> -->
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZLoading v-if="loading && !user" />
			<div v-else-if="notFound" class="flex flex-col items-center justify-center py-16 gap-4">
				<UIcon name="i-heroicons-user-circle" class="w-16 h-16 text-gray-400" />
				<p class="text-neutral-600 dark:text-neutral-400">{{ $t('pages.crmUserNotFound') }}</p>
				<UButton color="primary" variant="soft" @click="navigateTo('/crm-users')">{{ $t('pages.backToCrmUsers') }}</UButton>
			</div>
			<div v-else class="space-y-6 max-w-3xl">
				<!-- User info card: view / edit -->
				<UCard>
					<template #header>
						<div class="flex items-center justify-between">
							<h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
								<UIcon name="i-heroicons-user" class="w-5 h-5 inline-block mr-2" />
								{{ $t('pages.crmUserDetailUserInformation') }}
							</h2>
							<UButton v-if="!isEditing" variant="outline" size="sm" :icon="ICONS.PENCIL" :disabled="saving" @click="startEdit">{{ $t('common.edit') }}</UButton>
							<div v-else class="flex gap-2">
								<UButton color="neutral" variant="soft" size="sm" :disabled="saving" @click="cancelEdit">{{ $t('common.cancel') }}</UButton>
								<UButton color="primary" size="sm" :loading="saving" @click="editFormRef?.submit()">{{ $t('common.save') }}</UButton>
							</div>
						</div>
					</template>

					<div v-if="user" class="space-y-4">
						<template v-if="!isEditing">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ $t('table.name') }}</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ user.name || '—' }}</p>
								</div>
								<div class="sm:col-span-2">
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ $t('table.email') }}</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ user.email_address || '—' }}</p>
								</div>
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ $t('table.phone') }}</p>
									<p class="text-neutral-900 dark:text-neutral-100">({{ user.dial_code }}) {{ user.phone_no || '—' }}</p>
								</div>
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">{{ $t('table.role') }}</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ roleLabel(user.role, t) }}</p>
								</div>
							</div>
						</template>
						<template v-else>
							<FormCrmUserUpdate
								ref="editFormRef"
								:model-value="editForm"
								@update:model-value="(v: CrmUserUpdate) => Object.assign(editForm, v)"
								@submit="onEditFormSubmit"
							/>
						</template>
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

					<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{{ $t('pages.crmUserDetailChangePasswordDesc') }}</p>
					<FormChangePassword :loading="changingPassword" @submit="submitPassword" />
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { type CRMUser, type CrmUserUpdate } from '~/utils/types/crm-user';
import { failedNotification, successNotification } from '~/stores/AppUi/AppUi';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';
import { roleLabel } from '~/utils/user-roles-utils';

const route = useRoute();
const id = computed(() => String(route.params.id ?? ''));
const crmUserStore = useCRMUserStore();

// useHead({ title: () => `Wemotoo CRM - CRM User${user.value ? `: ${user.value.name}` : ''}` });

const user = ref<CRMUser | null>(null);
const loading = ref(true);
const notFound = ref(false);
const isEditing = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

const editForm = reactive<CrmUserUpdate>({
	name: '',
	email_address: '',
	dial_code: '',
	phone_number: '',
	role: undefined,
});

const { t } = useI18n();
const pageTitle = computed(() => {
	if (!user.value) return t('pages.crmUser');
	const u = user.value;
	return u.name || u.email_address || t('pages.crmUser');
});

const syncEditFormFromUser = () => {
	if (!user.value) return;
	editForm.name = user.value.name ?? '';
	editForm.email_address = user.value.email_address ?? '';
	editForm.dial_code = user.value.dial_code ?? '';
	editForm.phone_number = user.value.phone_no ?? '';
	editForm.role = user.value.role ?? undefined;
};

const startEdit = () => {
	syncEditFormFromUser();
	isEditing.value = true;
};

const cancelEdit = () => {
	isEditing.value = false;
};

const editFormRef = ref<{ submit: () => void } | null>(null);

const onEditFormSubmit = async (payload: { name: string; email_address: string; dial_code: string; phone_number: string; role: CrmUserUpdate['role'] }) => {
	saving.value = true;
	try {
		await crmUserStore.updateCrmUser(id.value, {
			name: payload.name || undefined,
			email_address: payload.email_address || undefined,
			dial_code: payload.dial_code || undefined,
			phone_number: payload.phone_number || undefined,
			role: payload.role || undefined,
		});
		successNotification(t('pages.crmUserUpdated'));
		isEditing.value = false;
		if (user.value) {
			const resp = await crmUserStore.getCrmUser(id.value);
			if (resp?.user) user.value = resp.user;
		}
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : t('pages.crmUserUpdateFailed');
		failedNotification(msg);
	} finally {
		saving.value = false;
	}
};

const submitPassword = async (payload: { old_password: string; new_password: string; confirm_password: string }) => {
	changingPassword.value = true;
	try {
		await crmUserStore.updateCrmUserPassword(id.value, payload);
		successNotification(t('pages.crmUserPasswordUpdated'));
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : t('pages.crmUserPasswordUpdateFailed');
		failedNotification(msg);
	} finally {
		changingPassword.value = false;
	}
};

onMounted(async () => {
	try {
		const resp = await crmUserStore.getCrmUser(id.value);
		if (resp?.user) {
			user.value = resp.user;
			syncEditFormFromUser();
		} else {
			notFound.value = true;
		}
	} catch {
		notFound.value = true;
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped></style>
