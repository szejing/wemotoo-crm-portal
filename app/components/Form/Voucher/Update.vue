<template>
	<div class="w-full">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<div class="lg:col-span-9">
				<UForm ref="formRef" :schema="voucherSchema" :state="formState" class="space-y-6 mb-6" @submit="onSubmit" @error="onError">
					<ZInputVoucherDetailsSection
						:state="formState"
						code-disabled
						show-status-switch
						show-usage-limit
						:discounts="discountOptions"
						:none-label="t('components.discountForm.filterNone')"
						:discount-options-loading="discountOptionsLoading"
					/>
					<ZInputVoucherValiditySection :state="formState" />
				</UForm>
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormVoucherReviewSummary :summary="reviewSummary" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { startOfDay } from 'date-fns';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { Discount } from '~/utils/types/discount';
import type { CreateVoucherReq } from '~/repository/modules/voucher/models/request/create-voucher.req';
import { CreateVoucherValidation } from '~/utils/schema';
import type { Voucher } from '~/utils/types/voucher';
import type { VoucherFormState } from '~/utils/types/form/voucher-creation';
import type { ErrorResponse } from '~/repository/base/error';
import { successNotification, failedNotification } from '~/stores/AppUi/AppUi';

const { t } = useI18n();

const voucherSchema = computed(() => CreateVoucherValidation(t));
type Schema = z.infer<ReturnType<typeof CreateVoucherValidation>>;

const props = defineProps<{
	voucher: Voucher;
}>();

const voucherStore = useVoucherStore();
const discountStore = useDiscountStore();
const { updating } = storeToRefs(voucherStore);

const discountOptions = ref<Discount[]>([]);
const discountOptionsLoading = ref(false);

const formState = reactive<VoucherFormState>({
	code: '',
	name: '',
	description: '',
	status: 'active',
	discount_code: '',
	starts_at: undefined,
	ends_at: undefined,
	usage_limit: undefined,
});

watch(
	() => props.voucher,
	(v) => {
		if (!v) return;
		formState.code = v.code;
		formState.description = v.description || '';
		formState.status = v.is_disabled ? 'inactive' : 'active';
		formState.discount_code = v.discount.code || '';
		formState.starts_at = v.starts_at ? v.starts_at.toISOString() : undefined;
		formState.ends_at = v.ends_at ? v.ends_at.toISOString() : undefined;
		formState.usage_limit = v.usage_limit != null && v.usage_limit > 0 ? v.usage_limit : undefined;
	},
	{ immediate: true },
);

const overlay = useOverlay();
const formRef = ref();

const loadingModal = overlay.create(ZModalLoading, {
	props: { key: 'loading-voucher-update' },
});

watch(updating, (v) => {
	if (v) loadingModal.open();
	else loadingModal.close();
});

const discountLabelForReview = computed(() => {
	const code = formState.discount_code?.trim();
	if (!code) return t('components.discountForm.filterNone');
	const d = discountOptions.value.find((x) => x.code === code);
	return d?.description ? `${code} — ${d.description}` : code;
});

const reviewSummary = computed(() => {
	const s = formState.starts_at;
	const e = formState.ends_at;
	const notSet = t('common.notSet');
	let validityStartsAt = notSet;
	let validityEndsAt = notSet;
	if (s && e) {
		const start = new Date(s);
		const endDate = new Date(e);
		validityStartsAt = getFormattedDate(start, 'dd-MM-yyyy');
		validityEndsAt = start.toDateString() === endDate.toDateString() ? '-' : getFormattedDate(endDate, 'dd-MM-yyyy');
	} else if (s && !e) {
		validityStartsAt = getFormattedDate(new Date(s), 'dd-MM-yyyy');
	} else if (!s && e) {
		validityStartsAt = getFormattedDate(startOfDay(new Date()), 'dd-MM-yyyy');
		validityEndsAt = getFormattedDate(new Date(e), 'dd-MM-yyyy');
	}
	const ul = formState.usage_limit;
	const usageLimitLabel = ul != null && ul > 0 ? String(ul) : t('components.voucherForm.usageLimitNotSet');
	return {
		code: formState.code?.trim() ?? '',
		name: formState.name?.trim() ?? '',
		description: formState.description?.trim() ?? '',
		discountLabel: discountLabelForReview.value,
		validityStartsAt,
		validityEndsAt,
		usageLimitLabel,
	};
});

const fieldSectionMap: Record<string, string> = {
	code: 'section-voucher-details',
	name: 'section-voucher-details',
	description: 'section-voucher-details',
	discount_code: 'section-voucher-details',
	status: 'section-voucher-details',
	usage_limit: 'section-voucher-details',
	starts_at: 'section-voucher-validity',
	ends_at: 'section-voucher-validity',
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	const errorName = firstError?.name;
	if (!errorName) return;

	const fieldName = errorName.split('.')[0] ?? errorName;
	const sectionId = fieldSectionMap[fieldName];

	if (sectionId) {
		document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	nextTick(() => {
		const errorEl = document.getElementById(errorName);
		errorEl?.focus();
	});
};

onMounted(async () => {
	discountOptionsLoading.value = true;
	try {
		discountOptions.value = await discountStore.fetchDiscountsForSelect();
	} finally {
		discountOptionsLoading.value = false;
	}
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const d = event.data;
		const startsAt = d.ends_at && !d.starts_at ? startOfDay(new Date()).toISOString() : d.starts_at;
		const body: Partial<CreateVoucherReq> = {
			name: d.name.trim(),
			status: d.status,
			description: d.description?.trim() || undefined,
			discount_code: d.discount_code?.trim() || undefined,
			starts_at: startsAt,
			ends_at: d.ends_at,
			...(d.usage_limit != null ? { usage_limit: d.usage_limit } : {}),
		};
		const result = await voucherStore.updateVoucher(props.voucher.code, body);
		if (result?.voucher.code) {
			successNotification(`${result.voucher.code} - Voucher updated`);
			await navigateTo('/marketing/vouchers');
		}
	} catch (err: unknown | ErrorResponse) {
		const message = (err as ErrorResponse).message ?? 'Failed to update voucher';
		failedNotification(message);
	}
};

const submit = () => {
	formRef.value?.submit();
};

defineExpose({ submit });
</script>

<style scoped>
html {
	scroll-behavior: smooth;
}

@media (max-width: 640px) {
	.space-y-6 > * + * {
		margin-top: 1.5rem;
	}
}
</style>
