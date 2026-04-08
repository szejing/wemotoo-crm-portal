<template>
	<div class="w-full">
		<UForm ref="formRef" :schema="voucherSchema" :state="new_voucher" class="space-y-6 mb-6" @submit="onSubmit" @error="onError">
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
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<UFormField :label="$t('form.code')" name="code" required>
							<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.codeHint') }}</p>
							<UInput v-model="new_voucher.code" />
						</UFormField>

						<UFormField :label="$t('form.name')" name="name" required>
							<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.nameHint') }}</p>
							<UInput v-model="new_voucher.name" />
						</UFormField>

						<UFormField :label="$t('form.description')" name="description">
							<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.descriptionHint') }}</p>
							<UInput v-model="new_voucher.description" />
						</UFormField>

						<UFormField :label="$t('form.discountCode')" name="discount_code">
							<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.discountCodeHint') }}</p>
							<USelect v-model="discountCodeSelect" :items="discountSelectItems" value-attribute="value" :loading="discountOptionsLoading" class="w-full" />
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
											<div v-if="new_voucher.starts_at" class="flex justify-end border-t border-default pt-2">
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
											<div v-if="new_voucher.ends_at" class="flex justify-end border-t border-default pt-2">
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
</template>

<script lang="ts" setup>
import { endOfDay, startOfDay } from 'date-fns';
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { DiscountResponse } from '~/repository/modules/discount/discount.type';
import type { CreateVoucherRequest } from '~/repository/modules/voucher/voucher.type';
import { useDiscountStore } from '~/stores/discount/discount';
import { useVoucherStore } from '~/stores/voucher/voucher';
import { CreateVoucherValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';

const { t } = useI18n();
const voucherSchema = computed(() => CreateVoucherValidation(t));

type Schema = z.infer<ReturnType<typeof CreateVoucherValidation>>;

/** USelect reserves `''` for clearing; use sentinel for “no linked discount”. */
const selectNoneValue = '__none__' as const;

const voucherStore = useVoucherStore();
const discountStore = useDiscountStore();
const { adding, new_voucher } = storeToRefs(voucherStore);

const discountOptions = ref<DiscountResponse[]>([]);
const discountOptionsLoading = ref(false);

const discountSelectItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...discountOptions.value.map((d) => ({
		label: d.description ? `${d.code} — ${d.description}` : d.code,
		value: d.code,
	})),
]);

const discountCodeSelect = computed({
	get: () => (new_voucher.value.discount_code || selectNoneValue) as string,
	set: (v: string) => {
		new_voucher.value.discount_code = v === selectNoneValue ? '' : v;
	},
});
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

const startsAtPopoverOpen = ref(false);
const endsAtPopoverOpen = ref(false);

const startsAtAsDate = computed({
	get(): Date | null {
		const s = new_voucher.value.starts_at;
		return s ? new Date(s) : null;
	},
	set(d: Date | null) {
		new_voucher.value.starts_at = d ? startOfDay(d).toISOString() : undefined;
	},
});

const endsAtAsDate = computed({
	get(): Date | null {
		const e = new_voucher.value.ends_at;
		return e ? new Date(e) : null;
	},
	set(d: Date | null) {
		new_voucher.value.ends_at = d ? endOfDay(d).toISOString() : undefined;
	},
});

/** If end is set without start, default start to today (same as discount create flow). */
watch(
	() => [new_voucher.value.starts_at, new_voucher.value.ends_at] as const,
	([start, end]) => {
		if (end && !start) {
			new_voucher.value.starts_at = startOfDay(new Date()).toISOString();
		}
	},
	{ flush: 'sync' },
);

const startsAtMaxDate = computed((): Date | undefined => {
	const e = new_voucher.value.ends_at;
	return e ? new Date(e) : undefined;
});

const endsAtMinDate = computed((): Date | undefined => {
	const s = new_voucher.value.starts_at;
	return s ? new Date(s) : undefined;
});

const startsAtButtonLabel = computed(() => {
	const s = new_voucher.value.starts_at;
	return s ? getFormattedDate(new Date(s), 'dd-MM-yyyy') : t('common.notSet');
});

const endsAtButtonLabel = computed(() => {
	const e = new_voucher.value.ends_at;
	return e ? getFormattedDate(new Date(e), 'dd-MM-yyyy') : t('common.notSet');
});

const clearStartsAt = () => {
	if (new_voucher.value.ends_at) {
		new_voucher.value.ends_at = undefined;
	}
	new_voucher.value.starts_at = undefined;
	startsAtPopoverOpen.value = false;
};

const clearEndsAt = () => {
	new_voucher.value.ends_at = undefined;
	endsAtPopoverOpen.value = false;
};

const fieldSectionMap: Record<string, string> = {
	code: 'section-voucher-details',
	name: 'section-voucher-details',
	description: 'section-voucher-details',
	discount_code: 'section-voucher-details',
	status: 'section-voucher-details',
	starts_at: 'section-voucher-details',
	ends_at: 'section-voucher-details',
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
	voucherStore.resetNewVoucher();
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
		const payload: CreateVoucherRequest = {
			code: d.code.trim(),
			name: d.name.trim(),
			status: d.status,
			description: d.description?.trim() || undefined,
			discount_code: d.discount_code?.trim() || undefined,
			starts_at: startsAt,
			ends_at: d.ends_at,
		};
		const created = await voucherStore.createVoucher(payload);
		if (created?.code) {
			router.push('/marketing/vouchers');
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
