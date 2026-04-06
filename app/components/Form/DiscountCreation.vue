<template>
	<div class="w-full">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
			<!-- Form + sticky review -->
			<div class="lg:col-span-9">
				<UForm ref="formRef" :schema="discountSchema" :state="new_discount" class="space-y-6 mb-6" @submit="onSubmit" @error="onError">
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
							<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<UFormField :label="$t('form.code')" name="code" required>
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.codeHint') }}</p>
									<UInput v-model="new_discount.code" />
								</UFormField>
								<UFormField :label="$t('form.name')" name="name" required>
									<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.discountForm.nameHint') }}</p>
									<UInput v-model="new_discount.name" />
								</UFormField>
								<UFormField :label="$t('form.description')" name="description">
									<UInput v-model="new_discount.description" />
								</UFormField>
								<UFormField :label="$t('components.discountForm.validityPeriod')" name="ends_at">
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
															v-if="new_discount.starts_at || new_discount.ends_at"
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

			<!-- Right: review summary (sticky) -->
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
import { getFormattedDate } from 'wemotoo-common';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { DateRange as PickerDateRange } from '~/components/Z/DateRangePicker.vue';
import type { CreateDiscountRequest } from '~/repository/modules/discount/discount.type';
import { CreateDiscountValidation } from '~/utils/schema';
import { ICONS } from '~/utils/icons';

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

const validityPopoverOpen = ref(false);
const draftValidityRange = ref<PickerDateRange | null>(null);

const pickerRangeFromDiscount = (): PickerDateRange | null => {
	const s = new_discount.value.starts_at;
	const e = new_discount.value.ends_at;
	if (!s && !e) return null;
	return {
		start: s ? new Date(s) : null,
		end: e ? new Date(e) : null,
	};
};

watch(validityPopoverOpen, (open) => {
	if (open) {
		draftValidityRange.value = pickerRangeFromDiscount();
	}
});

const validityRangeLabel = computed(() => {
	const s = new_discount.value.starts_at;
	const e = new_discount.value.ends_at;
	if (!s) return t('components.filter.selectDateRange');
	const start = new Date(s);
	const endDate = e ? new Date(e) : start;
	if (!e || start.toDateString() === endDate.toDateString()) {
		return getFormattedDate(start, 'dd-MM-yyyy');
	}
	return `${getFormattedDate(start, 'dd-MM-yyyy')} - ${getFormattedDate(endDate, 'dd-MM-yyyy')}`;
});

const reviewSummary = computed(() => ({
	name: new_discount.value.name ?? '',
	code: new_discount.value.code ?? '',
	description: new_discount.value.description ?? '',
	validityLabel: validityRangeLabel.value,
}));

const applyValidityRange = () => {
	const r = draftValidityRange.value;
	if (r?.start) {
		const start = startOfDay(r.start);
		const end = r.end ? endOfDay(r.end) : endOfDay(r.start);
		new_discount.value.starts_at = start.toISOString();
		new_discount.value.ends_at = end.toISOString();
	} else {
		new_discount.value.starts_at = undefined;
		new_discount.value.ends_at = undefined;
	}
	validityPopoverOpen.value = false;
};

const clearValidityRange = () => {
	draftValidityRange.value = { start: null, end: null };
	new_discount.value.starts_at = undefined;
	new_discount.value.ends_at = undefined;
	validityPopoverOpen.value = false;
};

const fieldSectionMap: Record<string, string> = {
	code: 'section-discount-details',
	name: 'section-discount-details',
	description: 'section-discount-details',
	status: 'section-discount-details',
	starts_at: 'section-discount-details',
	ends_at: 'section-discount-details',
	usage_limit: 'section-discount-details',
	rule: 'section-discount-details',
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
	discountStore.resetNewDiscount();
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		const created = await discountStore.createDiscount(event.data as CreateDiscountRequest);
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
