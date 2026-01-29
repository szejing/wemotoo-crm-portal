<template>
	<UDashboardPanel id="settings-store-profile">
		<template #header>
			<UDashboardNavbar title="Store Profile" :ui="{ right: 'gap-3' }">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<template v-if="isEditing">
						<UButton color="neutral" variant="ghost" @click="isEditing = false"> Cancel </UButton>
						<UButton
							color="success"
							@click="
								settingsStore.updateSettings();
								isEditing = false;
							"
						>
							<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
							Save
						</UButton>
					</template>
					<UButton v-else color="primary" @click="isEditing = true">
						<UIcon :name="ICONS.PENCIL" class="w-4 h-4" />
						Edit
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

						<!-- Thumbnail (editable only when isEditing) -->
						<div class="flex flex-col gap-2">
							<span class="text-sm font-medium text-gray-500 dark:text-gray-400">Thumbnail</span>
							<div
								class="relative inline-flex h-24 w-24 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
								:class="{ 'cursor-pointer': isEditing }"
								@click="isEditing && triggerThumbnailInput()"
							>
								<img
									v-if="getMerchantValue(MERCHANT.THUMBNAIL)"
									:src="getMerchantValue(MERCHANT.THUMBNAIL)"
									alt="Merchant thumbnail"
									class="h-full w-full rounded-lg object-cover"
								/>
								<UIcon v-else :name="ICONS.IMAGE" class="h-10 w-10 text-gray-400" />
								<div
									v-if="isEditing"
									class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity hover:opacity-100"
								>
									<UIcon :name="ICONS.PENCIL" class="h-6 w-6 text-white" />
								</div>
								<div v-if="thumbnailUploading" class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
									<UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-white" />
								</div>
							</div>
							<input ref="thumbnailInputEl" type="file" accept="image/*" class="hidden" @change="onThumbnailFileChange" />
						</div>

						<!-- Name, Company email, website, contact (disabled when !isEditing) -->
						<div class="grid gap-4 sm:grid-cols-2">
							<UFormField label="Name">
								<UInput :model-value="getMerchantValue(MERCHANT.NAME)" :disabled="!isEditing" @update:model-value="(v) => setMerchantValue(MERCHANT.NAME, v)" />
							</UFormField>
							<UFormField label="Company email">
								<UInput
									type="email"
									:model-value="getMerchantValue(MERCHANT.COMPANY_EMAIL_ADDRESS)"
									:disabled="!isEditing"
									@update:model-value="(v) => setMerchantValue(MERCHANT.COMPANY_EMAIL_ADDRESS, v)"
								/>
							</UFormField>
							<UFormField label="Company website" class="sm:col-span-2">
								<UInput
									:model-value="getMerchantValue(MERCHANT.COMPANY_WEBSITE)"
									:disabled="!isEditing"
									@update:model-value="(v) => setMerchantValue(MERCHANT.COMPANY_WEBSITE, v)"
								/>
							</UFormField>
							<UFormField label="Contact person">
								<UInput
									:model-value="getMerchantValue(MERCHANT.CONTACT_PERSON)"
									:disabled="!isEditing"
									@update:model-value="(v) => setMerchantValue(MERCHANT.CONTACT_PERSON, v)"
								/>
							</UFormField>
							<UFormField label="Contact no">
								<UInput
									:model-value="getMerchantValue(MERCHANT.CONTACT_NO)"
									:disabled="!isEditing"
									@update:model-value="(v) => setMerchantValue(MERCHANT.CONTACT_NO, v)"
								/>
							</UFormField>
						</div>

						<!-- Address (disabled when !isEditing) -->
						<div class="space-y-4">
							<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Address</h4>
							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField label="Address line 1">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS1)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS1, v)"
									/>
								</UFormField>
								<UFormField label="Address line 2">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS2)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS2, v)"
									/>
								</UFormField>
								<UFormField label="Address line 3">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS3)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS3, v)"
									/>
								</UFormField>
								<UFormField label="City">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS_CITY)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS_CITY, v)"
									/>
								</UFormField>
								<UFormField label="State">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS_STATE)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS_STATE, v)"
									/>
								</UFormField>
								<UFormField label="Postal code">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS_POSTAL_CODE)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS_POSTAL_CODE, v)"
									/>
								</UFormField>
								<UFormField label="Country">
									<UInput
										:model-value="getMerchantValue(MERCHANT.ADDRESS_COUNTRY)"
										:disabled="!isEditing"
										@update:model-value="(v) => setMerchantValue(MERCHANT.ADDRESS_COUNTRY, v)"
									/>
								</UFormField>
							</div>
						</div>
					</div>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { getFormattedDate, GROUP_CODE, MERCHANT } from 'wemotoo-common';
import { Setting } from '~/utils/types/setting';
import { dir } from '~/utils/constants/dir';
import { failedNotification } from '~/stores/AppUi/AppUi';
import { ICONS } from '~/utils/icons';

useHead({ title: 'Wemotoo CRM - Store Profile' });

const settingsStore = useSettingStore();
const merchantInfoStore = useMerchantInfoStore();

const { updatedSettings } = storeToRefs(settingsStore);

const isEditing = ref(false);
const thumbnailInputEl = ref<HTMLInputElement | null>(null);
const thumbnailUploading = ref(false);

const getMerchantValue = (setCode: string): string => {
	const updated = updatedSettings.value.find((s) => s.group_code === GROUP_CODE.INFO && s.set_code === setCode);
	if (updated) return updated.set_value ?? '';
	return merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, setCode)?.getString() ?? '';
};

const setMerchantValue = (setCode: string, value: string) => {
	settingsStore.addToUpdatedSettings(
		new Setting({
			group_code: GROUP_CODE.INFO,
			set_code: setCode,
			set_value: value ?? '',
			value_type: '',
		} as Setting),
	);
};

const triggerThumbnailInput = () => {
	thumbnailInputEl.value?.click();
};

const onThumbnailFileChange = async (event: Event) => {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	if (!file) return;
	thumbnailUploading.value = true;
	const { $api } = useNuxtApp();
	try {
		const { image } = await $api.image.upload(file, dir.merchant);
		if (image?.url) {
			setMerchantValue(MERCHANT.THUMBNAIL, image.url);
		}
	} catch (err: any) {
		failedNotification(err?.message ?? 'Thumbnail upload failed');
	} finally {
		thumbnailUploading.value = false;
		target.value = '';
	}
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

onMounted(async () => {
	await settingsStore.getSettings();
});
</script>

<style scoped></style>
