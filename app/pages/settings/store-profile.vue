<template>
	<UDashboardPanel id="settings-store-profile">
		<template #header>
			<UDashboardNavbar title="Store Profile" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<UButton color="neutral" variant="ghost" @click="onCancel"> Cancel </UButton>
					<UButton color="success" :loading="merchantInfoStore.loading" @click="onSave">
						<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
						Save
					</UButton>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-6">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">Store Profile</h2>
					<p class="text-gray-600 dark:text-gray-400">Manage your merchant info, address, and contact details.</p>
				</div>

				<!-- Merchant ID | Account Type | Expired Date | Account Status – card based, tinted backgrounds -->
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<div
						class="flex min-w-0 flex-col gap-2.5 rounded-xl border border-primary-200/50 bg-primary-50/80 p-4 dark:border-primary-800/50 dark:bg-primary-950/40"
					>
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight"> Merchant ID </span>
						<span class="text-lg font-semibold font-mono text-primary-700 dark:text-primary-300">{{ merchantId }}</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="accountTypeCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight"> Account type </span>
						<span class="text-lg font-semibold capitalize" :class="accountTypeTextClass">{{ accountTypeLabel }}</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="expiredDateCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight"> Expired date </span>
						<span class="text-lg font-semibold" :class="isExpiringSoon ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'">
							{{ merchantExpiredDate }}
						</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="accountStatusCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight"> Account status </span>
						<span class="text-lg font-semibold capitalize" :class="accountStatusTextClass">{{ accountStatusLabel }}</span>
					</div>
				</div>

				<UCard>
					<div class="space-y-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Merchant information</h3>

						<!-- Thumbnail -->
						<div class="flex flex-col gap-2">
							<span class="text-sm font-medium text-gray-500 dark:text-gray-400">Thumbnail</span>
							<div
								class="relative inline-flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								@click="triggerThumbnailInput()"
							>
								<img
									v-if="getMerchantValue(GROUP_CODE.INFO, MERCHANT.THUMBNAIL)"
									:src="getMerchantValue(GROUP_CODE.INFO, MERCHANT.THUMBNAIL)"
									alt="Merchant thumbnail"
									class="h-full w-full rounded-lg object-cover"
								/>
								<UIcon v-else :name="ICONS.IMAGE" class="h-10 w-10 text-gray-400" />
								<div class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity hover:opacity-100">
									<UIcon :name="ICONS.PENCIL" class="h-6 w-6 text-white" />
								</div>
								<div v-if="thumbnailUploading" class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
									<UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-white" />
								</div>
							</div>
							<input ref="thumbnailInputEl" type="file" accept="image/*" class="hidden" @change="onThumbnailFileChange" />
						</div>

						<!-- Name, Company email, website, contact -->
						<div class="grid gap-4 sm:grid-cols-2">
							<UFormField label="Name">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.NAME)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.NAME, v)"
								/>
							</UFormField>
							<UFormField label="Company email">
								<UInput
									type="email"
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_EMAIL_ADDRESS)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_EMAIL_ADDRESS, v)"
								/>
							</UFormField>
							<UFormField label="Company website" class="sm:col-span-2">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_WEBSITE)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_WEBSITE, v)"
								/>
							</UFormField>
							<UFormField label="Contact person">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_PERSON)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_PERSON, v)"
								/>
							</UFormField>
							<UFormField label="Contact no">
								<ZPhoneInput
									:dial-code="getMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_DIAL_CODE)"
									:phone-number="getMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_NO)"
									@update:dial-code="(v: string) => setMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_DIAL_CODE, v)"
									@update:phone-number="(v: string) => setMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_NO, v)"
								/>
							</UFormField>
						</div>

						<!-- Address -->
						<div class="space-y-4">
							<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Address</h4>
							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField label="Address line 1">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS1)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS1, v)"
									/>
								</UFormField>
								<UFormField label="Address line 2">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS2)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS2, v)"
									/>
								</UFormField>
								<UFormField label="Address line 3">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS3)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS3, v)"
									/>
								</UFormField>
								<UFormField label="City">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_CITY)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_CITY, v)"
									/>
								</UFormField>
								<UFormField label="State">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_STATE)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_STATE, v)"
									/>
								</UFormField>
								<UFormField label="Postal code">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_POSTAL_CODE)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_POSTAL_CODE, v)"
									/>
								</UFormField>
								<UFormField label="Country">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_COUNTRY)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_COUNTRY, v)"
									/>
								</UFormField>
							</div>
						</div>
					</div>

					<template #footer>
						<div class="flex justify-center">
							<UButton color="success" :loading="merchantInfoStore.loading" @click="onSave">
								<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
								Save
							</UButton>
						</div>
					</template>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalLeavePageConfirmation } from '#components';
import { getFormattedDate, GROUP_CODE, MERCHANT } from 'wemotoo-common';
import { dir } from '~/utils/constants/dir';
import { failedNotification } from '~/stores/AppUi/AppUi';
import { ICONS } from '~/utils/icons';

useHead({ title: 'Wemotoo CRM - Store Profile' });

const overlay = useOverlay();
const merchantInfoStore = useMerchantInfoStore();

const { updatedInfo } = storeToRefs(merchantInfoStore);

const isDirty = computed(() => updatedInfo.value.length > 0);

const thumbnailInputEl = ref<HTMLInputElement | null>(null);
const thumbnailUploading = ref(false);

onBeforeRouteLeave((to, from, next) => {
	if (!isDirty.value) {
		next();
		return;
	}
	next(false);
	const leaveModal = overlay.create(ZModalLeavePageConfirmation, {
		props: {
			onStay: () => leaveModal.close(),
			onLeave: () => {
				merchantInfoStore.clearUpdatedInfo();
				leaveModal.close();
				navigateTo(to.fullPath);
			},
		},
	});
	leaveModal.open();
});

const onCancel = () => {
	merchantInfoStore.clearUpdatedInfo();
};

const onSave = async () => {
	await merchantInfoStore.updateMerchantInfo();
};

const getMerchantValue = (groupCode: string, setCode: string): string => {
	const updated = updatedInfo.value.find((s) => s.group_code === groupCode && s.set_code === setCode);
	if (updated) return updated.set_value ?? '';
	return merchantInfoStore.getMerchantInfo(groupCode, setCode)?.getString() ?? '';
};

const setMerchantValue = (groupCode: string, setCode: string, value: string) => {
	merchantInfoStore.addToUpdatedInfo({
		group_code: groupCode,
		set_code: setCode,
		set_value: value ?? '',
	});
};

const triggerThumbnailInput = () => {
	thumbnailInputEl.value?.click();
};

const onThumbnailFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];

	if (!file) return;

	thumbnailUploading.value = true;
	await merchantInfoStore.updateMerchantThumbnail(file);
	thumbnailUploading.value = false;
	target.value = '';
};

const merchantId = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.ID)?.getString() ?? '—');
const accountTypeRaw = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.PACKAGE)?.getString()?.toLowerCase() ?? '');
const accountTypeLabel = computed(() => {
	const v = accountTypeRaw.value;
	if (!v) return '—';
	return v.charAt(0).toUpperCase() + v.slice(1);
});
const accountTypeBadgeColor = computed(() => {
	const v = accountTypeRaw.value;
	if (v === 'free') return 'neutral';
	if (v === 'silver') return 'primary';
	if (v === 'gold') return 'warning';
	return 'neutral';
});
const accountTypeCardBg = computed(() => {
	const c = accountTypeBadgeColor.value;
	if (c === 'primary') return 'border-primary-200/50 bg-primary-50/80 dark:border-primary-800/50 dark:bg-primary-950/40';
	if (c === 'warning') return 'border-amber-200/50 bg-amber-50/80 dark:border-amber-800/50 dark:bg-amber-950/40';
	return 'border-gray-200/60 bg-gray-50/80 dark:border-gray-700/50 dark:bg-gray-800/60';
});
const accountTypeTextClass = computed(() => {
	const c = accountTypeBadgeColor.value;
	if (c === 'primary') return 'text-primary-700 dark:text-primary-300';
	if (c === 'warning') return 'text-amber-700 dark:text-amber-300';
	return 'text-gray-700 dark:text-gray-300';
});

const merchantExpiredDateRaw = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.EXPIRED_DATE)?.getString() ?? '');
const merchantExpiredDate = computed(() => {
	const date = merchantExpiredDateRaw.value;
	return date ? getFormattedDate(new Date(date), 'MMM dd, yyyy') : '—';
});
const isExpiringSoon = computed(() => {
	const dateStr = merchantExpiredDateRaw.value;
	if (!dateStr) return false;
	const expired = new Date(dateStr);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	expired.setHours(0, 0, 0, 0);
	const msPerDay = 24 * 60 * 60 * 1000;
	const daysUntil = Math.round((expired.getTime() - today.getTime()) / msPerDay);
	return daysUntil <= 30;
});
const expiredDateCardBg = computed(() =>
	isExpiringSoon.value
		? 'border-red-200/50 bg-red-50/80 dark:border-red-800/50 dark:bg-red-950/40'
		: 'border-gray-200/60 bg-gray-50/80 dark:border-gray-700/50 dark:bg-gray-800/60',
);

const accountStatusRaw = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.ACCOUNT_STATUS)?.getString()?.toLowerCase() ?? '');
const accountStatusLabel = computed(() => {
	const v = accountStatusRaw.value;
	if (!v) return '—';
	return v.charAt(0).toUpperCase() + v.slice(1);
});
const accountStatusBadgeColor = computed(() => {
	const v = accountStatusRaw.value;
	if (v === 'new') return 'info';
	if (v === 'active') return 'success';
	if (v === 'inactive') return 'neutral';
	if (v === 'expired') return 'error';
	return 'neutral';
});
const accountStatusCardBg = computed(() => {
	const c = accountStatusBadgeColor.value;
	if (c === 'info') return 'border-blue-200/50 bg-blue-50/80 dark:border-blue-800/50 dark:bg-blue-950/40';
	if (c === 'success') return 'border-green-200/50 bg-green-50/80 dark:border-green-800/50 dark:bg-green-950/40';
	if (c === 'error') return 'border-red-200/50 bg-red-50/80 dark:border-red-800/50 dark:bg-red-950/40';
	return 'border-gray-200/60 bg-gray-50/80 dark:border-gray-700/50 dark:bg-gray-800/60';
});
const accountStatusTextClass = computed(() => {
	const c = accountStatusBadgeColor.value;
	if (c === 'info') return 'text-blue-700 dark:text-blue-300';
	if (c === 'success') return 'text-green-700 dark:text-green-300';
	if (c === 'error') return 'text-red-700 dark:text-red-300';
	return 'text-gray-700 dark:text-gray-300';
});
</script>

<style scoped></style>
