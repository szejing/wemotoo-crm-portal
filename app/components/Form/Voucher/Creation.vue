<template>
	<div class="w-full">
		<UForm ref="formRef" :schema="voucherSchema" :state="new_voucher" class="space-y-6 mb-6" @submit="onSubmit" @error="onError">
			<ZInputVoucherDetailsSection
				:state="new_voucherAsFormState"
				:discount-select-items="discountSelectItems"
				:discount-options-loading="discountOptionsLoading"
			/>
			<ZInputVoucherValiditySection :state="new_voucherAsFormState" />
		</UForm>
	</div>
</template>

<script lang="ts" setup>
import { startOfDay } from 'date-fns';
import type { FormErrorEvent, FormSubmitEvent } from '#ui/types';
import { ZModalLoading } from '#components';
import type { z } from 'zod';
import type { Discount } from '~/utils/types/discount';
import type { CreateVoucherReq } from '~/repository/modules/voucher/models/request/create-voucher.req';
import { useDiscountStore } from '~/stores/Discount/Discount';
import { useVoucherStore } from '~/stores/voucher/voucher';
import { CreateVoucherValidation } from '~/utils/schema';
import type { VoucherFormState } from '~/utils/types/form/voucher-creation';

const { t } = useI18n();
const voucherSchema = computed(() => CreateVoucherValidation(t));

type Schema = z.infer<ReturnType<typeof CreateVoucherValidation>>;

const voucherStore = useVoucherStore();
const discountStore = useDiscountStore();
const { adding, new_voucher } = storeToRefs(voucherStore);

const new_voucherAsFormState = computed(() => new_voucher.value as VoucherFormState);

const discountOptions = ref<Discount[]>([]);
const discountOptionsLoading = ref(false);

const selectNoneValue = '__none__' as const;

const discountSelectItems = computed(() => [
	{ label: t('components.discountForm.filterNone'), value: selectNoneValue },
	...discountOptions.value.map((d) => ({
		label: d.description ? `${d.code} — ${d.description}` : d.code,
		value: d.code,
	})),
]);

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

const fieldSectionMap: Record<string, string> = {
	code: 'section-voucher-details',
	name: 'section-voucher-details',
	description: 'section-voucher-details',
	discount_code: 'section-voucher-details',
	status: 'section-voucher-details',
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
		const payload: CreateVoucherReq = {
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
