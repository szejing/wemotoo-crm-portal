<template>
	<UDashboardPanel id="crm-user-detail">
		<template #header>
			<UDashboardNavbar :title="pageTitle">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>
				<template #right>
					<UButton variant="ghost" color="neutral" :icon="ICONS.ARROW_LEFT" @click="navigateTo('/crm-users')"> Back to list </UButton>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<ZLoading v-if="loading && !user" />
			<div v-else-if="notFound" class="flex flex-col items-center justify-center py-16 gap-4">
				<UIcon name="i-heroicons-user-circle" class="w-16 h-16 text-gray-400" />
				<p class="text-neutral-600 dark:text-neutral-400">CRM user not found.</p>
				<UButton color="primary" variant="soft" @click="navigateTo('/crm-users')">Back to CRM Users</UButton>
			</div>
			<div v-else class="space-y-6 max-w-3xl">
				<!-- User info card: view / edit -->
				<UCard>
					<template #header>
						<div class="flex items-center justify-between">
							<h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
								<UIcon name="i-heroicons-user" class="w-5 h-5 inline-block mr-2" />
								User information
							</h2>
							<UButton v-if="!isEditing" variant="outline" size="sm" :icon="ICONS.PENCIL" :disabled="saving" @click="startEdit"> Edit </UButton>
							<div v-else class="flex gap-2">
								<UButton color="neutral" variant="soft" size="sm" :disabled="saving" @click="cancelEdit"> Cancel </UButton>
								<UButton color="primary" size="sm" :loading="saving" @click="saveUser"> Save </UButton>
							</div>
						</div>
					</template>

					<div v-if="user" class="space-y-4">
						<template v-if="!isEditing">
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Name</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ user.name || '—' }}</p>
								</div>
								<div class="sm:col-span-2">
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Email</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ user.email_address || '—' }}</p>
								</div>
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Phone</p>
									<p class="text-neutral-900 dark:text-neutral-100">({{ user.dial_code }}) {{ user.phone_no || '—' }}</p>
								</div>
								<div>
									<p class="text-xs font-medium text-neutral-500 dark:text-neutral-400">Role</p>
									<p class="text-neutral-900 dark:text-neutral-100">{{ roleLabel(user.role) }}</p>
								</div>
							</div>
						</template>
						<template v-else>
							<FormCrmUserForm :model-value="editForm" @update:model-value="(v: CrmUserFormValue) => Object.assign(editForm, v)" />
						</template>
					</div>
				</UCard>

				<!-- Change password: separate section -->
				<UCard>
					<template #header>
						<h2 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
							<UIcon name="i-heroicons-key" class="w-5 h-5 inline-block mr-2" />
							Change password
						</h2>
					</template>

					<p class="text-sm text-neutral-600 dark:text-neutral-400 mb-4">Use this form only when this user is you. You must enter the current password.</p>
					<FormChangePassword :loading="changingPassword" @submit="submitPassword" />
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { KEY } from 'wemotoo-common';
import { UserRoles } from 'wemotoo-common';
import type { CRMUser, CrmUserFormValue } from '~/utils/types/crm-user';
import { failedNotification, successNotification } from '~/stores/AppUi/AppUi';
import { useCRMUserStore } from '~/stores/CRMUser/CRMUser';

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

const editForm = reactive<CrmUserFormValue>({
	name: '',
	email_address: '',
	dial_code: '',
	phone_number: '',
	role: undefined,
});

const roleLabels: Record<string, string> = {
	[UserRoles.SUPER_ADMIN]: 'Super Admin',
	[UserRoles.SUPER_STAFF]: 'Super Staff',
	[UserRoles.MERCHANT_ADMIN]: 'Merchant Admin',
	[UserRoles.MERCHANT_STAFF]: 'Merchant Staff',
};

function roleLabel(role: UserRoles): string {
	return roleLabels[role] ?? String(role);
}

const pageTitle = computed(() => {
	if (!user.value) return 'CRM User';
	const u = user.value;
	return u.name || u.email_address || 'CRM User';
});

function syncEditFormFromUser() {
	if (!user.value) return;
	editForm.name = user.value.name ?? '';
	editForm.email_address = user.value.email_address ?? '';
	editForm.dial_code = user.value.dial_code ?? '';
	editForm.phone_number = user.value.phone_no ?? '';
	editForm.role = user.value.role ?? undefined;
}

function startEdit() {
	syncEditFormFromUser();
	isEditing.value = true;
}

function cancelEdit() {
	isEditing.value = false;
}

function buildRequestContext(): { user: { id: string; email_address: string }; merchant_id: string } | null {
	const authStore = useAuthStore();
	const merchantId = useCookie(KEY.X_MERCHANT_ID).value;
	const u = authStore.user as { id?: string; email_address?: string } | null;
	if (!u?.id || !u?.email_address || !merchantId) return null;
	return {
		user: { id: u.id, email_address: u.email_address },
		merchant_id: merchantId,
	};
}

async function saveUser() {
	try {
		await crmUserStore.updateCrmUser(id.value, {
			name: editForm.name || undefined,
			email_address: editForm.email_address || undefined,
			dial_code: editForm.dial_code || undefined,
			phone_number: editForm.phone_number || undefined,
			role: editForm.role || undefined,
		});
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : 'Update failed';
		failedNotification(msg);
	} finally {
		saving.value = false;
	}
}

async function submitPassword(payload: { old_password: string; new_password: string; confirm_password: string }) {
	changingPassword.value = true;
	try {
		await crmUserStore.updateCrmUserPassword(id.value, payload);
		successNotification('Password updated.');
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : 'Password update failed';
		failedNotification(msg);
	} finally {
		changingPassword.value = false;
	}
}

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
