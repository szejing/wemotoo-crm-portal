<template>
	<UDashboardPanel id="settings-store-profile">
		<template #header>
			<UDashboardNavbar :title="$t('nav.storeProfile')" :ui="{ right: 'gap-3' }">
				<template #leading>
					<ZBackButton class="lg:hidden" />
					<UDashboardSidebarCollapse class="hidden lg:flex" />
				</template>

				<template #right>
					<UButton color="neutral" variant="ghost" @click="onCancel">{{ $t('common.cancel') }}</UButton>
					<UButton color="success" :loading="merchantInfoStore.loading" @click="onSave">
						<UIcon :name="ICONS.SAVE" class="w-4 h-4" />
						{{ $t('common.save') }}
					</UButton>
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<div class="p-6 space-y-6">
				<div class="space-y-2">
					<h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('nav.storeProfile') }}</h2>
					<p class="text-gray-600 dark:text-gray-400">{{ $t('pages.storeProfileDesc') }}</p>
				</div>

				<!-- Merchant ID | Account Type | Expired Date | Account Status – card based, tinted backgrounds -->
				<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
					<div
						class="flex min-w-0 flex-col gap-2.5 rounded-xl border border-primary-200/50 bg-primary-50/80 p-4 dark:border-primary-800/50 dark:bg-primary-950/40"
					>
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight">
							{{ $t('pages.storeProfilePage.merchantId') }}
						</span>
						<span class="text-lg font-semibold font-mono text-primary-700 dark:text-primary-300">{{ merchantId }}</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="accountStatusCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight">
							{{ $t('pages.storeProfilePage.accountStatus') }}
						</span>
						<span class="text-lg font-semibold capitalize" :class="accountStatusTextClass">{{ accountStatusLabel }}</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="accountTypeCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight">
							{{ $t('pages.storeProfilePage.accountType') }}
						</span>
						<span class="text-lg font-semibold capitalize" :class="accountTypeTextClass">{{ accountType }}</span>
					</div>
					<div class="flex min-w-0 flex-col gap-2.5 rounded-xl border p-4" :class="expiredDateCardBg">
						<span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 wrap-break-word leading-tight">
							{{ $t('pages.storeProfilePage.expiredDate') }}
						</span>
						<span class="text-lg font-semibold" :class="isExpiringSoon ? 'text-red-700 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'">
							{{ merchantExpiredDate }}
						</span>
					</div>
				</div>

				<UCard>
					<div class="space-y-6">
						<h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('pages.storeProfilePage.merchantInformation') }}</h3>

						<!-- Thumbnail -->
						<UFormField :label="$t('pages.storeProfilePage.thumbnail')">
							<ZDropzone
								class="max-w-full sm:max-w-[200px]"
								:key="thumbnailDropzoneKey"
								:existing-images="thumbnailExistingImages"
								:multiple="false"
								:disabled="merchantInfoStore.loading || merchantInfoStore.updating"
								@files-selected="onThumbnailFilesSelected"
								@delete-image="onThumbnailDelete"
							/>
						</UFormField>

						<!-- Name, Company email, website, contact -->
						<div class="grid gap-4 sm:grid-cols-2">
							<UFormField :label="$t('common.name')">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.NAME)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.NAME, v)"
								/>
							</UFormField>
							<UFormField :label="$t('pages.storeProfilePage.companyEmail')">
								<UInput
									type="email"
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_EMAIL_ADDRESS)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_EMAIL_ADDRESS, v)"
								/>
							</UFormField>
							<UFormField :label="$t('pages.storeProfilePage.companyWebsite')" class="sm:col-span-2">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_WEBSITE)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.INFO, MERCHANT.COMPANY_WEBSITE, v)"
								/>
							</UFormField>
							<UFormField :label="$t('pages.storeProfilePage.contactPerson')">
								<UInput
									:model-value="getMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_PERSON)"
									@update:model-value="(v) => setMerchantValue(GROUP_CODE.CONTACT, MERCHANT.CONTACT_PERSON, v)"
								/>
							</UFormField>
							<UFormField :label="$t('pages.storeProfilePage.contactNo')">
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
							<h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">{{ $t('common.address') }}</h4>
							<div class="grid gap-4 sm:grid-cols-2">
								<UFormField :label="$t('pages.storeProfilePage.addressLine1')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS1)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS1, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.addressLine2')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS2)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS2, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.addressLine3')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS3)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS3, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.city')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_CITY)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_CITY, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.state')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_STATE)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_STATE, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.postalCode')">
									<UInput
										:model-value="getMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_POSTAL_CODE)"
										@update:model-value="(v) => setMerchantValue(GROUP_CODE.ADDRESS, MERCHANT.ADDRESS_POSTAL_CODE, v)"
									/>
								</UFormField>
								<UFormField :label="$t('pages.storeProfilePage.country')">
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
								{{ $t('common.save') }}
							</UButton>
						</div>
					</template>
				</UCard>
			</div>
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { ZModalLeavePageConfirmation, ZModalLoading } from '#components';
import { getFormattedDate, GROUP_CODE, MERCHANT, Package } from 'wemotoo-common';
import { ICONS } from '~/utils/icons';
import { accountTypeLabel } from '~/utils/options/account-type';

const { t } = useI18n();
useHead({ title: () => `${t('common.appName')} - ${t('nav.storeProfile')}` });

const overlay = useOverlay();
const merchantInfoStore = useMerchantInfoStore();
const loadingModal = overlay.create(ZModalLoading, { props: { key: 'loading' } });

const { updatedInfo, updating, merchant } = storeToRefs(merchantInfoStore);

const isDirty = computed(() => updatedInfo.value.length > 0);

const thumbnailDropzoneKey = ref(0);

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

const thumbnailExistingImages = computed(() => {
	const url = merchant.value.find((m) => m.group_code === GROUP_CODE.INFO && m.set_code === MERCHANT.THUMBNAIL)?.getString();
	console.log(url);
	return url ? [url] : [];
});

const onThumbnailFilesSelected = async (selectedFiles: File[]) => {
	const file = selectedFiles[0];
	if (!file) return;

	await merchantInfoStore.updateMerchantThumbnail(file);
	thumbnailDropzoneKey.value += 1;
};

const onThumbnailDelete = () => {
	setMerchantValue(GROUP_CODE.INFO, MERCHANT.THUMBNAIL, '');
};

const merchantId = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.ID)?.getString() ?? '—');
const accountTypeRaw = computed(() => merchantInfoStore.getMerchantInfo(GROUP_CODE.INFO, MERCHANT.PACKAGE)?.getString()?.toLowerCase() ?? '');
const accountType = computed<string>(() => accountTypeLabel(accountTypeRaw.value as Package, t) ?? '—');

const accountTypeBadgeColor = computed(() => {
	const v = accountTypeRaw.value;
	if (v === Package.SELLER) return 'neutral';
	if (v === Package.ORGANIZER) return 'primary';
	if (v === Package.VIP) return 'success';
	return 'neutral';
});
const accountTypeCardBg = computed(() => {
	const c = accountTypeBadgeColor.value;
	if (c === 'primary') return 'border-primary-200/50 bg-primary-50/80 dark:border-primary-800/50 dark:bg-primary-950/40';
	if (c === 'success') return 'border-green-200/50 bg-green-50/80 dark:border-green-800/50 dark:bg-green-950/40';
	return 'border-gray-200/60 bg-gray-50/80 dark:border-gray-700/50 dark:bg-gray-800/60';
});
const accountTypeTextClass = computed(() => {
	const c = accountTypeBadgeColor.value;
	if (c === 'primary') return 'text-primary-700 dark:text-primary-300';
	if (c === 'success') return 'text-green-700 dark:text-green-300';
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
