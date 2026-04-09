<template>
	<div class="w-full">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<div class="lg:col-span-9">
				<UForm
					ref="formRef"
					:schema="voucherSchema"
					:state="formState as Record<string, unknown>"
					class="space-y-6 mb-6"
					@submit="onSubmit"
					@error="onError"
				>
					<UCard id="section-voucher-details" class="shadow-md scroll-mt-4">
						<template #header>
							<div class="flex items-start justify-between">
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<UIcon :name="ICONS.ADDITIONAL" class="text-primary-500 w-6 h-6" />
										<h2 class="text-xl font-semibold">{{ $t('pages.voucherDetails') }}</h2>
										<span class="text-red-500 text-sm">*</span>
									</div>
									<p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{{ $t('components.voucherForm.sectionSubtitle') }}</p>
								</div>
							</div>
						</template>

						<div class="space-y-6 py-2 px-4">
							<div class="w-full flex flex-wrap items-center gap-4 justify-end">
								<UFormField name="status">
									<USwitch v-model="voucherActive" :label="voucherStatusLabel" />
								</UFormField>
							</div>
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<UFormField :label="$t('form.code')" name="code">
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.codeHint') }}</p>
									<UInput v-model="formState.code" disabled />
								</UFormField>

								<UFormField :label="$t('form.name')" name="name" required>
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.nameHint') }}</p>
									<UInput v-model="formState.name" />
								</UFormField>

								<UFormField :label="$t('form.description')" name="description">
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.descriptionHint') }}</p>
									<UInput v-model="formState.description" />
								</UFormField>

								<UFormField :label="$t('form.discountCode')" name="discount_code">
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.discountCodeHint') }}</p>
									<USelect v-model="discountCodeSelect" :items="discountSelectItems" value-attribute="value" :loading="discountOptionsLoading" class="w-full" />
								</UFormField>

								<UFormField :label="$t('form.usageLimit')" name="usage_limit">
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.usageLimitHint') }}</p>
									<UInput v-model.number="usageLimitModel" type="number" min="1" :placeholder="$t('components.discountForm.usageLimitPlaceholder')" />
								</UFormField>

								<div class="grid grid-cols-1 sm:grid-cols-6 gap-4 sm:col-span-2">
									<UFormField class="col-span-1 sm:col-span-3" :label="$t('components.discountForm.validityStartsAt')" name="starts_at">
										<UPopover v-model:open="startsAtPopoverOpen" :content="{ align: 'start' }" :modal="true">
											<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="w-full min-w-0 justify-between group">
												<span class="truncate">{{ startsAtButtonLabel }}</span>
												<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
											</UButton>
											<template #content>
												<div class="p-2 space-y-2">
													<ZDatePicker v-model="startsAtAsDate" :max-date="startsAtMaxDate" @close="startsAtPopoverOpen = false" />
													<div v-if="formState.starts_at" class="flex justify-end border-t border-default pt-2">
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
													<div v-if="formState.ends_at" class="flex justify-end border-t border-default pt-2">
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
import { endOfDay, startOfDay } from 'date-fns';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { Discount } from '~/utils/types/discount';
import type { CreateVoucherReq } from '~/repository/modules/voucher/models/request/create-voucher.req';
import { CreateVoucherValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';
import type { Voucher } from '~/utils/types/voucher';

const { t } = useI18n();

const voucherSchema = computed(() => CreateVoucherValidation(t));
type Schema = z.infer<ReturnType<typeof CreateVoucherValidation>>;

const selectNoneValue = '__none__' as const;

const props = defineProps<{
	voucher: Voucher;
}>();

const voucherStore = useVoucherStore();
const discountStore = useDiscountStore();
const { updating } = storeToRefs(voucherStore);

const discountOptions = ref<Discount[]>([]);
const discountOptionsLoading = ref(false);

const discountSelectItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...discountOptions.value.map((d) => ({
		label: d.description ? `${d.code} — ${d.description}` : d.code,
		value: d.code,
	})),
]);

const formState = reactive({
	code: '',
	name: '',
	description: '' as string | undefined,
	status: 'active',
	discount_code: '',
	starts_at: undefined as string | undefined,
	ends_at: undefined as string | undefined,
	usage_limit: undefined as number | undefined,
});

const discountCodeSelect = computed({
	get: () => (formState.discount_code || selectNoneValue) as string,
	set: (v: string) => {
		formState.discount_code = v === selectNoneValue ? '' : v;
	},
});

watch(
	() => props.voucher,
	(v) => {
		if (!v) return;
		formState.code = v.code;
		formState.name = v.name;
		formState.description = v.description || '';
		formState.status = v.status || 'active';
		formState.discount_code = v.discount_code || '';
		formState.starts_at = v.starts_at || undefined;
		formState.ends_at = v.ends_at || undefined;
		formState.usage_limit = v.usage_limit != null && v.usage_limit > 0 ? v.usage_limit : undefined;
	},
	{ immediate: true },
);

const voucherActive = computed({
	get: () => formState.status === 'active',
	set: (value: boolean) => {
		formState.status = value ? 'active' : 'inactive';
	},
});

const voucherStatusLabel = computed(() =>
	voucherActive.value ? t('components.voucherForm.statusActive') : t('components.voucherForm.statusInactive'),
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

const usageLimitModel = computed({
	get() {
		return formState.usage_limit ?? '';
	},
	set(v: number | string) {
		if (v === '' || v === null || v === undefined) {
			formState.usage_limit = undefined;
			return;
		}
		const n = typeof v === 'number' ? v : Number(v);
		formState.usage_limit = Number.isNaN(n) ? undefined : n;
	},
});

const startsAtPopoverOpen = ref(false);
const endsAtPopoverOpen = ref(false);

const startsAtAsDate = computed({
	get(): Date | null {
		const s = formState.starts_at;
		return s ? new Date(s) : null;
	},
	set(d: Date | null) {
		formState.starts_at = d ? startOfDay(d).toISOString() : undefined;
	},
});

const endsAtAsDate = computed({
	get(): Date | null {
		const e = formState.ends_at;
		return e ? new Date(e) : null;
	},
	set(d: Date | null) {
		formState.ends_at = d ? endOfDay(d).toISOString() : undefined;
	},
});

watch(
	() => [formState.starts_at, formState.ends_at] as const,
	([start, end]) => {
		if (end && !start) {
			formState.starts_at = startOfDay(new Date()).toISOString();
		}
	},
	{ flush: 'sync' },
);

const startsAtMaxDate = computed((): Date | undefined => {
	const e = formState.ends_at;
	return e ? new Date(e) : undefined;
});

const endsAtMinDate = computed((): Date | undefined => {
	const s = formState.starts_at;
	return s ? new Date(s) : undefined;
});

const startsAtButtonLabel = computed(() => {
	const s = formState.starts_at;
	return s ? getFormattedDate(new Date(s), 'dd-MM-yyyy') : t('common.notSet');
});

const endsAtButtonLabel = computed(() => {
	const e = formState.ends_at;
	return e ? getFormattedDate(new Date(e), 'dd-MM-yyyy') : t('common.notSet');
});

const clearStartsAt = () => {
	if (formState.ends_at) {
		formState.ends_at = undefined;
	}
	formState.starts_at = undefined;
	startsAtPopoverOpen.value = false;
};

const clearEndsAt = () => {
	formState.ends_at = undefined;
	endsAtPopoverOpen.value = false;
};

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
	starts_at: 'section-voucher-details',
	ends_at: 'section-voucher-details',
	usage_limit: 'section-voucher-details',
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
		if (result?.code) {
			await navigateTo('/marketing/vouchers');
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
