<template>
	<div class="w-full">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<div class="lg:col-span-9">
				<UForm
					ref="formRef"
					:schema="discountSchema"
					:state="new_discount as Record<string, unknown>"
					class="space-y-6 mb-6"
					@submit="onSubmit"
					@error="onError"
				>
					<ZInputDiscountDetailsSection :state="new_discount" />
					<ZInputDiscountRuleSection :state="new_discount" />
					<ZInputDiscountConditionsSection :state="new_discount" />
				</UForm>
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormDiscountReviewSummary :summary="reviewSummary" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { startOfDay } from 'date-fns';
import { DiscountRuleType } from 'wemotoo-common';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { CreateDiscountReq } from '~/repository/modules/discount/models/request/create-discount.req';
import { CreateDiscountValidation } from '~/utils/schema';

const { t } = useI18n();

const discountSchema = computed(() => CreateDiscountValidation(t));

type Schema = z.infer<ReturnType<typeof CreateDiscountValidation>>;

const discountStore = useDiscountStore();
const { adding, new_discount } = storeToRefs(discountStore);

const router = useRouter();
const overlay = useOverlay();
const formRef = ref();

const loadingModal = overlay.create(ZModalLoading, {
	props: { key: 'loading-discount' },
});

watch(adding, (v) => {
	if (v) loadingModal.open();
	else loadingModal.close();
});

const ruleTypeLabel = (rt: DiscountRuleType) =>
	t(
		{
			[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
			[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
			[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
		}[rt],
	);

/** Hardcoded until merchant currency is wired into this form (review summary). */
const ruleValueCurrencyCode = 'RM';

const ruleSummaryLabel = computed(() => {
	const rt = new_discount.value.rule_type ?? DiscountRuleType.PERCENTAGE;
	const rv = new_discount.value.rule_value;
	const typeName = ruleTypeLabel(rt);
	if (rt === DiscountRuleType.PERCENTAGE) {
		return `${typeName}: ${rv}%`;
	}
	if (rt === DiscountRuleType.FREE_SHIPPING) {
		return typeName;
	}
	return `${typeName}: ${ruleValueCurrencyCode} ${rv}`;
});

const reviewSummary = computed(() => {
	const s = new_discount.value.starts_at;
	const e = new_discount.value.ends_at;
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
	return {
		code: new_discount.value.code?.trim() ?? '',
		description: new_discount.value.description ?? '',
		validityStartsAt,
		validityEndsAt,
		ruleSummary: ruleSummaryLabel.value,
		conditionsCount: new_discount.value.conditions?.length ?? 0,
	};
});

const fieldSectionMap: Record<string, string> = {
	code: 'section-discount-details',
	description: 'section-discount-details',
	is_disabled: 'section-discount-details',
	starts_at: 'section-discount-details',
	ends_at: 'section-discount-details',
	usage_limit: 'section-discount-rule',
	rule_type: 'section-discount-rule',
	rule_value: 'section-discount-rule',
	allocation: 'section-discount-rule',
};

const onError = (event: FormErrorEvent) => {
	const firstError = event.errors[0];
	const errorName = firstError?.name;
	if (!errorName) return;

	const fieldName = errorName.split('.')[0] ?? errorName;
	const sectionId = fieldSectionMap[fieldName] ?? (fieldName === 'conditions' ? 'section-discount-conditions' : undefined);

	if (sectionId) {
		document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	nextTick(() => {
		const errorEl = document.getElementById(errorName);
		errorEl?.focus();
	});
};

onMounted(() => {
	discountStore.resetNewDiscount();
});

const buildCreatePayload = (data: Schema): CreateDiscountReq => {
	const conditions = (data.conditions ?? []).map((c) => ({
		operator: c.operator,
		type: c.type,
		...(c.min_amount != null ? { min_amount: c.min_amount } : {}),
		...(c.max_amount != null ? { max_amount: c.max_amount } : {}),
		...(c.filter_operator != null ? { filter_operator: c.filter_operator } : {}),
		...(c.filter_condition != null ? { filter_condition: c.filter_condition } : {}),
		...(c.filter_value?.trim() ? { filter_value: c.filter_value.trim() } : {}),
	}));

	const startsAt = data.ends_at && !data.starts_at ? startOfDay(new Date()).toISOString() : data.starts_at;

	return {
		...(data.code ? { code: data.code } : {}),
		description: data.description.trim(),
		is_disabled: data.is_disabled,
		starts_at: startsAt,
		ends_at: data.ends_at,
		usage_limit: data.usage_limit,
		rule_type: data.rule_type,
		rule_value: data.rule_value,
		...(data.allocation != null ? { allocation: data.allocation } : {}),
		...(conditions.length > 0 ? { conditions } : {}),
	};
};

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const payload = buildCreatePayload(event.data);
		const created = await discountStore.createDiscount(payload);
		if (created?.code) {
			router.push('/marketing/discounts');
		}
	} catch {
		// store handles error toast
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
