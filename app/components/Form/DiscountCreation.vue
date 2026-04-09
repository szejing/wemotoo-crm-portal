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
					<UCard id="section-discount-details" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.TAG" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">{{ $t('pages.discountDetails') }}</h2>
										<span class="text-red-500 text-sm">*</span>
									</div>
									<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ $t('components.discountForm.sectionSubtitle') }}</p>
								</div>
							</div>
						</template>

						<div class="space-y-6 py-2 px-4">
							<div class="w-full flex flex-wrap items-center gap-4 justify-end">
								<UFormField name="is_disabled">
									<USwitch v-model="discountActive" :label="discountStatusLabel" />
								</UFormField>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<UFormField :label="$t('form.code')" name="code">
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.codeHint') }}</p>
									<UInput v-model="new_discount.code" :placeholder="$t('components.discountForm.codePlaceholder')" />
								</UFormField>
								<UFormField :label="$t('form.description')" name="description" required>
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.descriptionHint') }}</p>
									<UInput v-model="new_discount.description" />
								</UFormField>

								<div class="grid grid-cols-1 sm:grid-cols-6 gap-4">
									<UFormField class="col-span-1 sm:col-span-3" :label="$t('components.discountForm.validityStartsAt')" name="starts_at">
										<UPopover v-model:open="startsAtPopoverOpen" :content="{ align: 'start' }" :modal="true">
											<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="w-full min-w-0 justify-between group">
												<span class="truncate">{{ startsAtButtonLabel }}</span>
												<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
											</UButton>
											<template #content>
												<div class="p-2 space-y-2">
													<ZDatePicker v-model="startsAtAsDate" :max-date="startsAtMaxDate" @close="startsAtPopoverOpen = false" />
													<div v-if="new_discount.starts_at" class="flex justify-end border-t border-default pt-2">
														<UButton :label="$t('components.filter.clear')" color="neutral" variant="soft" size="sm" @click="clearStartsAt" />
													</div>
												</div>
											</template>
										</UPopover>
									</UFormField>

									<UFormField class="col-span-1 sm:col-span-3" :label="$t('components.discountForm.validityEndsAt')" name="ends_at">
										<UPopover v-model:open="endsAtPopoverOpen" :content="{ align: 'start' }" :modal="true">
											<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="w-full min-w-0 justify-between group">
												<span class="truncate">{{ endsAtButtonLabel }}</span>
												<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
											</UButton>
											<template #content>
												<div class="p-2 space-y-2">
													<ZDatePicker v-model="endsAtAsDate" :min-date="endsAtMinDate" @close="endsAtPopoverOpen = false" />
													<div v-if="new_discount.ends_at" class="flex justify-end border-t border-default pt-2">
														<UButton :label="$t('components.filter.clear')" color="neutral" variant="soft" size="sm" @click="clearEndsAt" />
													</div>
												</div>
											</template>
										</UPopover>
									</UFormField>
								</div>
							</div>
						</div>
					</UCard>

					<UCard id="section-discount-rule" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-center gap-2">
								<UIcon :name="ICONS.INFO" class="text-primary-500 w-6 h-6" />
								<h2 class="text-xl font-semibold">{{ $t('components.discountForm.ruleSection') }}</h2>
								<span class="text-red-500 text-sm">*</span>
							</div>
						</template>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 px-4">
							<UFormField :label="$t('components.discountForm.ruleType')" name="rule_type" required>
								<USelect
									:model-value="new_discount.rule_type"
									:items="ruleTypeItems"
									value-attribute="value"
									class="w-full"
									@update:model-value="onRuleTypeSelect"
								/>
							</UFormField>
							<UFormField
								v-if="new_discount.rule_type !== DiscountRuleType.FREE_SHIPPING"
								:label="$t('components.discountForm.ruleValue')"
								name="rule_value"
								required
							>
								<UInput
									v-model.number="new_discount.rule_value"
									type="number"
									min="0"
									:max="new_discount.rule_type === DiscountRuleType.PERCENTAGE ? 100 : undefined"
									step="0.01"
								>
									<template #trailing>
										<span class="text-muted text-sm pe-2 tabular-nums">{{ ruleValueSuffix }}</span>
									</template>
								</UInput>
								<p v-if="new_discount.rule_type === DiscountRuleType.PERCENTAGE" class="text-xs text-muted mt-1">
									{{ $t('components.discountForm.ruleValuePercentHint') }}
								</p>
							</UFormField>
						</div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 px-4">
							<UFormField :label="$t('components.discountForm.usageLimit')" name="usage_limit">
								<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.usageLimitHint') }}</p>
								<UInput v-model.number="usageLimitModel" type="number" min="1" :placeholder="$t('components.discountForm.usageLimitPlaceholder')" />
							</UFormField>
							<UFormField :label="$t('components.discountForm.allocation')" name="allocation">
								<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.allocationHint') }}</p>
								<USelect v-model="new_discount.allocation" :items="allocationItems" value-attribute="value" class="w-full max-w-md" />
							</UFormField>
						</div>
					</UCard>

					<UCard id="section-discount-conditions" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex flex-wrap items-center justify-between gap-3">
								<div class="flex items-center gap-2">
									<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-6 h-6" />
									<h2 class="text-xl font-semibold">{{ $t('components.discountForm.conditionsSection') }}</h2>
								</div>
								<UButton color="primary" variant="soft" size="sm" icon="i-lucide-plus" @click="addCondition">
									{{ $t('components.discountForm.addCondition') }}
								</UButton>
							</div>
							<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1 px-0">{{ $t('components.discountForm.conditionsHelp') }}</p>
						</template>

						<div v-if="!new_discount.conditions?.length" class="py-6 px-4 text-sm text-muted">
							{{ $t('components.discountForm.noConditions') }}
						</div>

						<div v-else class="space-y-6 py-2 px-4">
							<div v-for="(cond, index) in new_discount.conditions" :key="index" class="rounded-lg border border-default p-4 space-y-4">
								<div class="flex items-center justify-between gap-2">
									<span class="text-sm font-medium text-highlighted">{{ $t('components.discountForm.conditionRow', { n: index + 1 }) }}</span>
									<UButton color="error" variant="ghost" size="xs" icon="i-lucide-trash-2" :label="$t('common.delete')" @click="removeCondition(index)" />
								</div>
								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<UFormField :label="$t('components.discountForm.conditionOperator')" :name="`conditions.${index}.operator`" required>
										<USelect
											:model-value="cond.operator"
											:items="conditionOperatorItems"
											value-attribute="value"
											class="w-full"
											@update:model-value="(v: DiscountConditionOperator) => (cond.operator = v)"
										/>
									</UFormField>
									<UFormField :label="$t('components.discountForm.conditionType')" :name="`conditions.${index}.type`" required>
										<USelect
											:model-value="cond.type"
											:items="conditionTypeItems"
											value-attribute="value"
											class="w-full"
											@update:model-value="(v: DiscountConditionType) => (cond.type = v)"
										/>
									</UFormField>
									<UFormField :label="$t('components.discountForm.minAmount')" :name="`conditions.${index}.min_amount`">
										<UInput v-model.number="cond.min_amount" type="number" min="0" step="0.01" />
									</UFormField>
									<UFormField :label="$t('components.discountForm.maxAmount')" :name="`conditions.${index}.max_amount`">
										<UInput v-model.number="cond.max_amount" type="number" min="0" step="0.01" />
									</UFormField>
								</div>
								<div class="border-t border-default pt-4 space-y-4">
									<p class="text-xs font-medium uppercase tracking-wide text-muted">{{ $t('components.discountForm.filterOptional') }}</p>
									<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
										<UFormField :label="$t('components.discountForm.filterOperator')" :name="`conditions.${index}.filter_operator`">
											<USelect
												:model-value="cond.filter_operator ?? selectNoneValue"
												:items="filterOperatorItems"
												value-attribute="value"
												class="w-full"
												@update:model-value="(v) => (cond.filter_operator = v === selectNoneValue ? undefined : (v as FilterOperator))"
											/>
										</UFormField>
										<UFormField :label="$t('components.discountForm.filterCondition')" :name="`conditions.${index}.filter_condition`">
											<USelect
												:model-value="cond.filter_condition ?? selectNoneValue"
												:items="filterConditionItems"
												value-attribute="value"
												class="w-full"
												@update:model-value="(v) => (cond.filter_condition = v === selectNoneValue ? undefined : (v as FilterCondition))"
											/>
										</UFormField>
										<UFormField :label="$t('components.discountForm.filterValue')" :name="`conditions.${index}.filter_value`">
											<UInput v-model="cond.filter_value" />
										</UFormField>
									</div>
								</div>
							</div>
						</div>
					</UCard>
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
import { endOfDay, startOfDay } from 'date-fns';
import { AllocationType, DiscountConditionOperator, DiscountConditionType, DiscountRuleType, FilterCondition, FilterOperator } from 'wemotoo-common';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { CreateDiscountConditionReq, CreateDiscountReq } from '~/repository/modules/discount/models/request/create-discount.req';
import { CreateDiscountValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';

const { t } = useI18n();

/** USelect reserves `''` for clearing; optional rows use this sentinel instead. */
const selectNoneValue = '__none__' as const;

/** Hardcoded until merchant currency is wired into this form. */
const ruleValueCurrencyCode = 'RM';

const discountSchema = computed(() => CreateDiscountValidation(t));

type Schema = z.infer<ReturnType<typeof CreateDiscountValidation>>;

const discountStore = useDiscountStore();
const { adding, new_discount } = storeToRefs(discountStore);

/** Switch is ON when the discount is active (`!is_disabled`). */
const discountActive = computed({
	get: () => !new_discount.value.is_disabled,
	set: (value: boolean) => {
		new_discount.value.is_disabled = !value;
	},
});

const discountStatusLabel = computed(() => (discountActive.value ? t('components.discountForm.statusActive') : t('components.discountForm.statusDisabled')));

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

const humanizeEnum = (value: string) => {
	return value
		.split('_')
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(' ');
};

const ruleTypeLabel = (rt: DiscountRuleType) =>
	t(
		{
			[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
			[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
			[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
		}[rt],
	);

const ruleTypeItems = computed(() => Object.values(DiscountRuleType).map((v) => ({ label: ruleTypeLabel(v), value: v })));

const ruleValueSuffix = computed(() => {
	const rt = new_discount.value.rule_type;
	if (rt === DiscountRuleType.FIXED) return ruleValueCurrencyCode;
	if (rt === DiscountRuleType.PERCENTAGE) return '%';
	return '';
});

const onRuleTypeSelect = (v: DiscountRuleType) => {
	const prev = new_discount.value.rule_type;
	new_discount.value.rule_type = v;
	if (v === DiscountRuleType.FREE_SHIPPING) {
		new_discount.value.rule_value = 0;
	} else if (prev === DiscountRuleType.FREE_SHIPPING) {
		const rv = new_discount.value.rule_value ?? 0;
		if (v === DiscountRuleType.PERCENTAGE && (rv <= 0 || rv > 100)) {
			new_discount.value.rule_value = 10;
		} else if (v === DiscountRuleType.FIXED && rv <= 0) {
			new_discount.value.rule_value = 1;
		}
	}
};

const allocationItems = computed(() => Object.values(AllocationType).map((v) => ({ label: humanizeEnum(v), value: v })));

const conditionOperatorItems = computed(() => Object.values(DiscountConditionOperator).map((v) => ({ label: humanizeEnum(v), value: v })));

const conditionTypeItems = computed(() => Object.values(DiscountConditionType).map((v) => ({ label: humanizeEnum(v), value: v })));

const filterOperatorItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...Object.values(FilterOperator).map((v) => ({ label: humanizeEnum(v), value: v })),
]);

const filterConditionItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...Object.values(FilterCondition).map((v) => ({ label: humanizeEnum(v), value: v })),
]);

const emptyCondition = (): CreateDiscountConditionReq => {
	return {
		operator: DiscountConditionOperator.IN,
		type: DiscountConditionType.PRODUCTS,
		min_amount: undefined,
		max_amount: undefined,
		filter_operator: undefined,
		filter_condition: undefined,
		filter_value: '',
	};
};

const addCondition = () => {
	const list = new_discount.value.conditions ?? [];
	new_discount.value.conditions = [...list, emptyCondition()];
};

const removeCondition = (index: number) => {
	const list = [...(new_discount.value.conditions ?? [])];
	list.splice(index, 1);
	new_discount.value.conditions = list;
};

const usageLimitModel = computed({
	get() {
		return new_discount.value.usage_limit ?? '';
	},
	set(v: number | string) {
		if (v === '' || v === null || v === undefined) {
			new_discount.value.usage_limit = undefined;
			return;
		}
		const n = typeof v === 'number' ? v : Number(v);
		new_discount.value.usage_limit = Number.isNaN(n) ? undefined : n;
	},
});

const startsAtPopoverOpen = ref(false);
const endsAtPopoverOpen = ref(false);

const startsAtAsDate = computed({
	get(): Date | null {
		const s = new_discount.value.starts_at;
		return s ? new Date(s) : null;
	},
	set(d: Date | null) {
		new_discount.value.starts_at = d ? startOfDay(d).toISOString() : undefined;
	},
});

const endsAtAsDate = computed({
	get(): Date | null {
		const e = new_discount.value.ends_at;
		return e ? new Date(e) : null;
	},
	set(d: Date | null) {
		new_discount.value.ends_at = d ? endOfDay(d).toISOString() : undefined;
	},
});

/** Bounded end date implies validity from start of today unless a start is already set. */
watch(
	() => [new_discount.value.starts_at, new_discount.value.ends_at] as const,
	([start, end]) => {
		if (end && !start) {
			new_discount.value.starts_at = startOfDay(new Date()).toISOString();
		}
	},
	{ flush: 'sync' },
);

const startsAtMaxDate = computed((): Date | undefined => {
	const e = new_discount.value.ends_at;
	return e ? new Date(e) : undefined;
});

const endsAtMinDate = computed((): Date | undefined => {
	const s = new_discount.value.starts_at;
	return s ? new Date(s) : undefined;
});

const startsAtButtonLabel = computed(() => {
	const s = new_discount.value.starts_at;
	return s ? getFormattedDate(new Date(s), 'dd-MM-yyyy') : t('common.notSet');
});

const endsAtButtonLabel = computed(() => {
	const e = new_discount.value.ends_at;
	return e ? getFormattedDate(new Date(e), 'dd-MM-yyyy') : t('common.notSet');
});

const clearStartsAt = () => {
	if (new_discount.value.ends_at) {
		new_discount.value.ends_at = undefined;
	}
	new_discount.value.starts_at = undefined;
	startsAtPopoverOpen.value = false;
};

const clearEndsAt = () => {
	new_discount.value.ends_at = undefined;
	endsAtPopoverOpen.value = false;
};

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
