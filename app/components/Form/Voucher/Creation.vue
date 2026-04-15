<template>
	<div class="w-full">
		<UForm ref="formRef" :schema="formSchema" :state="uFormState" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" @submit="onSubmit" @error="onError">
			<div class="lg:col-span-9 space-y-6">
				<ZInputVoucherDetailsSection
					:state="voucherSectionState"
					form-field-prefix="voucher"
					:discounts="[]"
					:none-label="t('components.discountForm.filterNone')"
					link-discount-to-voucher-code
				/>

				<ZInputDiscountRuleAndConditionsSection :state="new_discount" form-field-prefix="discount" />
			</div>
			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormVoucherReviewSummary :summary="voucherReviewSummary" />
				</div>
			</div>
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import { startOfDay } from 'date-fns';
import { AllocationType, DiscountRuleType } from 'wemotoo-common';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { CreateVoucherReq } from '~/repository/modules/voucher/models/request/create-voucher.req';
import type { CreateDiscountReq } from '~/repository/modules/discount/models/request/create-discount.req';
import { useDiscountStore } from '~/stores/Discount/Discount';
import { useVoucherStore } from '~/stores/Voucher/Voucher';
import { CreateBundledVoucherFormValidation } from '~/utils/schema';
import { buildDiscountApplySummaryLine } from '~/utils/discount/apply-summary';
import { buildDiscountConditionReviewItems } from '~/utils/discount/discount-condition-review-lines';
import type { VoucherFormState } from '~/utils/types/form/voucher-creation';

const props = withDefaults(
	defineProps<{
		/** Discount allocation (shop=bill, product=item). */
		allocation?: AllocationType;
		/** Route after successful create (shop vs product listing). */
		postCreateListPath: string;
	}>(),
	{},
);

const { t } = useI18n();

type BundledSchema = z.infer<ReturnType<typeof CreateBundledVoucherFormValidation>>;

const formSchema = computed(() => CreateBundledVoucherFormValidation(t));

const voucherStore = useVoucherStore();
const discountStore = useDiscountStore();
const { adding, new_voucher } = storeToRefs(voucherStore);
const { new_discount } = storeToRefs(discountStore);

const bundledFormModel = reactive({
	voucher: new_voucher,
	discount: new_discount,
});

/** UForm state is store-backed; cast for schema-aligned UForm generics. */
const uFormState = computed((): Record<string, unknown> => bundledFormModel as unknown as Record<string, unknown>);

const voucherSectionState = computed(() => toValue(bundledFormModel.voucher) as VoucherFormState);

const router = useRouter();
const overlay = useOverlay();
const formRef = ref();

const loadingModal = overlay.create(ZModalLoading, {
	props: { key: 'loading-voucher' },
});

watch(adding, (v) => {
	if (v) loadingModal.open();
	else loadingModal.close();
});

const voucherFieldSectionMap: Record<string, string> = {
	code: 'section-voucher-details',
	description: 'section-voucher-details',
	discount_code: 'section-voucher-details',
	is_disabled: 'section-voucher-details',
	usage_limit: 'section-voucher-details',
	starts_at: 'section-voucher-validity',
	ends_at: 'section-voucher-validity',
};

const bundledDiscountFieldSectionMap: Record<string, string> = {
	usage_limit: 'section-discount-rule-conditions',
	disc_type: 'section-discount-rule-conditions',
	disc_value: 'section-discount-rule-conditions',
	allocation: 'section-discount-rule-conditions',
};

const humanizeEnum = (value: string) =>
	value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');

const resolveErrorSectionId = (errorName: string): string | undefined => {
	if (errorName.startsWith('voucher.')) {
		const field = errorName.slice('voucher.'.length).split('.')[0] ?? '';
		return voucherFieldSectionMap[field];
	}
	if (errorName.startsWith('discount.')) {
		if (errorName.includes('.conditions')) {
			return 'section-discount-rule-conditions';
		}
		const field = errorName.slice('discount.'.length).split('.')[0] ?? '';
		return bundledDiscountFieldSectionMap[field];
	}
	return undefined;
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	const errorName = firstError?.name;
	if (!errorName) return;

	const sectionId = resolveErrorSectionId(errorName);

	if (sectionId) {
		document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	nextTick(() => {
		const errorEl = document.getElementById(errorName);
		errorEl?.focus();
	});
};

const ruleTypeLabel = (rt: DiscountRuleType) =>
	t(
		{
			[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
			[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
			[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
		}[rt],
	);

const ruleValueCurrencyCode = 'RM';

const applyAllocation = () => {
	if (props.allocation == null) {
		return;
	}
	new_discount.value.allocation = props.allocation;
};

const ruleSummaryLabel = computed(() => {
	const rt = new_discount.value.disc_type ?? DiscountRuleType.PERCENTAGE;
	const rv = new_discount.value.disc_value;
	const typeName = ruleTypeLabel(rt);
	if (rt === DiscountRuleType.PERCENTAGE) {
		return `${typeName}: ${rv}%`;
	}
	if (rt === DiscountRuleType.FREE_SHIPPING) {
		return typeName;
	}
	return `${typeName}: ${ruleValueCurrencyCode} ${rv}`;
});

const allocationReviewLabel = computed(() => {
	const a = new_discount.value.allocation;
	if (a == null) return t('common.notSet');
	return humanizeEnum(a);
});

const discountUsageLimitReviewLabel = computed(() => {
	const ul = new_discount.value.usage_limit;
	if (ul != null && ul > 0) return String(ul);
	return t('components.voucherForm.usageLimitNotSet');
});

const voucherReviewSummary = computed(() => {
	const v = new_voucher.value;
	const s = v.starts_at;
	const e = v.ends_at;
	let validityStartsAt: string | undefined;
	let validityEndsAt: string | undefined;
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

	const ul = new_discount.value.usage_limit;
	const usageLimitLabel = ul != null && ul > 0 ? String(ul) : t('components.voucherForm.usageLimitNotSet');

	const codeTrim = v.code?.trim() ?? '';

	const base = {
		code: codeTrim,
		description: v.description?.trim() ?? '',
		...(validityStartsAt != null ? { validityStartsAt } : {}),
		...(validityEndsAt != null ? { validityEndsAt } : {}),
		usageLimitLabel,
	};

	return {
		...base,
		discountDetails: {
			ruleSummary: ruleSummaryLabel.value,
			conditionsCount: new_discount.value.conditions?.length ?? 0,
			allocationLabel: allocationReviewLabel.value,
			discountUsageLimitLabel: discountUsageLimitReviewLabel.value,
			discountApplySummary: buildDiscountApplySummaryLine(t, {
				ruleType: new_discount.value.disc_type,
				ruleValue: new_discount.value.disc_value,
				allocation: new_discount.value.allocation,
				currencyCode: ruleValueCurrencyCode,
			}),
			conditionReviewItems: buildDiscountConditionReviewItems(new_discount.value.conditions, t, ruleValueCurrencyCode),
		},
	};
});

/** Copy voucher identity onto bundled discount state; discount validity dates stay unset. */
const syncBundledDiscountFromVoucher = () => {
	const c = new_voucher.value.code?.trim() ?? '';
	const desc = new_voucher.value.description?.trim() || c;
	new_discount.value.code = c;
	new_discount.value.description = desc;
	new_discount.value.starts_at = undefined;
	new_discount.value.ends_at = undefined;
	new_discount.value.is_disabled = new_voucher.value.is_disabled ?? false;
	new_voucher.value.discount_code = c;
};

watch([() => new_voucher.value.code, () => new_voucher.value.description, () => new_voucher.value.is_disabled], () => {
	syncBundledDiscountFromVoucher();
});

watch(
	() => props.allocation,
	() => {
		applyAllocation();
	},
);

onMounted(async () => {
	voucherStore.resetNewVoucher();
	discountStore.resetNewDiscount();
	syncBundledDiscountFromVoucher();
	applyAllocation();
});

const buildBundledCreateDiscountPayload = (data: BundledSchema['discount']): CreateDiscountReq => {
	const conditions = (data.conditions ?? []).map((c) => ({
		...(c.min_amount != null ? { min_amount: c.min_amount } : {}),
		...(c.max_amount != null ? { max_amount: c.max_amount } : {}),
		...(c.filter_operator != null ? { filter_operator: c.filter_operator } : {}),
		...(c.filter_condition != null ? { filter_condition: c.filter_condition } : {}),
		...(c.filter_value?.trim() ? { filter_value: c.filter_value.trim() } : {}),
	}));

	const codeTrim = new_voucher.value.code?.trim() ?? '';
	const description = new_voucher.value.description?.trim() || codeTrim;

	return {
		code: codeTrim,
		description,
		is_disabled: new_voucher.value.is_disabled ?? false,
		usage_limit: data.usage_limit,
		disc_type: data.disc_type,
		disc_value: data.disc_value,
		...(data.allocation != null ? { allocation: data.allocation } : {}),
		...(conditions.length > 0 ? { conditions } : {}),
	};
};

const onSubmit = async (event: FormSubmitEvent<BundledSchema>) => {
	try {
		const { voucher: d, discount: disc } = event.data;
		const startsAt = d.ends_at && !d.starts_at ? startOfDay(new Date()).toISOString() : d.starts_at;
		const codeTrim = d.code.trim();

		const pendingDiscount = buildBundledCreateDiscountPayload(disc);
		const { code: _omit, ...discountBody } = pendingDiscount;

		const payload: CreateVoucherReq = {
			code: codeTrim,
			description: d.description?.trim(),
			is_disabled: d.is_disabled,
			discount_code: codeTrim,
			starts_at: startsAt,
			ends_at: d.ends_at,
			...(disc.usage_limit != null ? { usage_limit: disc.usage_limit } : {}),
			discount: discountBody,
		};

		const created = await voucherStore.createVoucher(payload);
		if (created?.voucher.code) {
			router.push(props.postCreateListPath);
		}
	} catch {
		// store handles error toast
	}
};

const submit = () => {
	syncBundledDiscountFromVoucher();
	applyAllocation();
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
