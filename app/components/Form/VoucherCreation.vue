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
							<UInput v-model="new_voucher.description" />
						</UFormField>
						<UFormField :label="$t('form.discountCode')" name="discount_code">
							<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.discountCodeHint') }}</p>
							<UInput v-model="new_voucher.discount_code" />
						</UFormField>
						<UFormField :label="$t('components.voucherForm.validityPeriod')" name="ends_at">
							<div class="flex flex-wrap items-center gap-2">
								<UPopover v-model:open="validityPopoverOpen" :content="{ align: 'start' }" :modal="true">
									<UButton icon="i-lucide-calendar" color="neutral" variant="outline" class="min-w-56 justify-between group">
										<span class="truncate">{{ validityRangeLabel }}</span>
										<UIcon name="i-lucide-chevron-down" class="shrink-0 size-5 text-dimmed group-data-[state=open]:rotate-180 transition-transform" />
									</UButton>
									<template #content>
										<div class="p-2">
											<ZDateRangePicker v-model="draftValidityRange" />
											<div class="flex flex-wrap justify-end gap-2 pt-2 border-t border-default mt-2">
												<UButton :label="$t('common.cancel')" color="neutral" variant="ghost" @click="validityPopoverOpen = false" />
												<UButton
													v-if="new_voucher.starts_at || new_voucher.ends_at"
													:label="$t('components.filter.clear')"
													color="neutral"
													variant="soft"
													@click="clearValidityRange"
												/>
												<UButton :label="$t('common.apply')" color="primary" @click="applyValidityRange" />
											</div>
										</div>
									</template>
								</UPopover>
							</div>
						</UFormField>
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
import type { DateRange as PickerDateRange } from '~/components/Z/DateRangePicker.vue';
import type { CreateVoucherRequest } from '~/repository/modules/voucher/voucher.type';
import { useVoucherStore } from '~/stores/voucher/voucher';
import { CreateVoucherValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';

const { t } = useI18n();
const voucherSchema = computed(() => CreateVoucherValidation(t));

type Schema = z.infer<ReturnType<typeof CreateVoucherValidation>>;

const voucherStore = useVoucherStore();
const { adding, new_voucher } = storeToRefs(voucherStore);
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

const validityPopoverOpen = ref(false);
const draftValidityRange = ref<PickerDateRange | null>(null);

const pickerRangeFromVoucher = (): PickerDateRange | null => {
	const s = new_voucher.value.starts_at;
	const e = new_voucher.value.ends_at;
	if (!s && !e) return null;
	return {
		start: s ? new Date(s) : null,
		end: e ? new Date(e) : null,
	};
};

watch(validityPopoverOpen, (open) => {
	if (open) {
		draftValidityRange.value = pickerRangeFromVoucher();
	}
});

const validityRangeLabel = computed(() => {
	const s = new_voucher.value.starts_at;
	const e = new_voucher.value.ends_at;
	if (!s) return t('components.filter.selectDateRange');
	const start = new Date(s);
	const endDate = e ? new Date(e) : start;
	if (!e || start.toDateString() === endDate.toDateString()) {
		return getFormattedDate(start, 'dd-MM-yyyy');
	}
	return `${getFormattedDate(start, 'dd-MM-yyyy')} - ${getFormattedDate(endDate, 'dd-MM-yyyy')}`;
});

const applyValidityRange = () => {
	const r = draftValidityRange.value;
	if (r?.start) {
		const start = startOfDay(r.start);
		const end = r.end ? endOfDay(r.end) : endOfDay(r.start);
		new_voucher.value.starts_at = start.toISOString();
		new_voucher.value.ends_at = end.toISOString();
	} else {
		new_voucher.value.starts_at = undefined;
		new_voucher.value.ends_at = undefined;
	}
	validityPopoverOpen.value = false;
};

const clearValidityRange = () => {
	draftValidityRange.value = { start: null, end: null };
	new_voucher.value.starts_at = undefined;
	new_voucher.value.ends_at = undefined;
	validityPopoverOpen.value = false;
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

onMounted(() => {
	voucherStore.resetNewVoucher();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const d = event.data;
		const payload: CreateVoucherRequest = {
			code: d.code.trim(),
			name: d.name.trim(),
			status: d.status,
			description: d.description?.trim() || undefined,
			discount_code: d.discount_code?.trim() || undefined,
			starts_at: d.starts_at,
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
