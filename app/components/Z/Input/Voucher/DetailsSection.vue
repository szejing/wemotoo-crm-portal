<template>
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
			<div v-if="showStatusSwitch" class="w-full flex flex-wrap items-center gap-4 justify-end">
				<UFormField name="status">
					<USwitch v-model="voucherActive" :label="voucherStatusLabel" />
				</UFormField>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<UFormField :label="$t('form.code')" name="code" :required="!codeDisabled">
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.codeHint') }}</p>
					<UInput v-model="state.code" :disabled="codeDisabled" />
				</UFormField>

				<UFormField :label="$t('form.name')" name="name" required>
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.nameHint') }}</p>
					<UInput v-model="state.name" />
				</UFormField>

				<UFormField :label="$t('form.description')" name="description">
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.descriptionHint') }}</p>
					<UInput v-model="state.description" />
				</UFormField>

				<UFormField :label="$t('form.discountCode')" name="discount_code" required>
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.discountCodeHint') }}</p>
					<USelect v-model="discountCodeSelect" :items="discountSelectItems" value-attribute="value" :loading="discountOptionsLoading" class="w-full" />
				</UFormField>

				<UFormField v-if="showUsageLimit" :label="$t('form.usageLimit')" name="usage_limit">
					<p class="text-xs text-neutral-500 dark:text-neutral-400 my-1">{{ $t('components.voucherForm.usageLimitHint') }}</p>
					<UInput v-model.number="usageLimitModel" type="number" min="1" :placeholder="$t('components.discountForm.usageLimitPlaceholder')" />
				</UFormField>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { VoucherFormState } from '~/utils/types/form/voucher-creation';
import { ICONS } from '~/utils/icons';

const selectNoneValue = '__none__' as const;

const props = withDefaults(
	defineProps<{
		state: VoucherFormState;
		codeDisabled?: boolean;
		showStatusSwitch?: boolean;
		showUsageLimit?: boolean;
		discountSelectItems: { label: string; value: string }[];
		discountOptionsLoading?: boolean;
	}>(),
	{
		codeDisabled: false,
		showStatusSwitch: false,
		showUsageLimit: false,
		discountOptionsLoading: false,
	},
);

const { t } = useI18n();
const state = toRef(props, 'state');

const discountCodeSelect = computed({
	get: () => (state.value.discount_code || selectNoneValue) as string,
	set: (v: string) => {
		state.value.discount_code = v === selectNoneValue ? '' : v;
	},
});

const voucherActive = computed({
	get: () => state.value.status === 'active',
	set: (value: boolean) => {
		state.value.status = value ? 'active' : 'inactive';
	},
});

const voucherStatusLabel = computed(() => (voucherActive.value ? t('components.voucherForm.statusActive') : t('components.voucherForm.statusInactive')));

const usageLimitModel = computed({
	get() {
		return state.value.usage_limit ?? '';
	},
	set(v: number | string) {
		if (v === '' || v === null || v === undefined) {
			state.value.usage_limit = undefined;
			return;
		}
		const n = typeof v === 'number' ? v : Number(v);
		state.value.usage_limit = Number.isNaN(n) ? undefined : n;
	},
});
</script>
