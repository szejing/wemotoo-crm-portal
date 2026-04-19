<template>
	<div class="w-full">
		<UForm ref="formRef" :schema="schema" :state="formState" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" @submit="submitForm">
			<div class="lg:col-span-9 space-y-6">
				<ZInputShippingZoneDetailsSection :state="formState" :method-options="methodOptions" />
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormShippingZoneReviewSummary :summary="reviewSummary" subtitle-key="components.shippingZoneForm.reviewSubtitleCreate" />
				</div>
			</div>
		</UForm>
	</div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { formatCurrency } from 'wemotoo-common';
import type { z } from 'zod';
import { CreateShippingZoneValidation } from '~/utils/schema';
import type { ShippingZonePostcodePattern, ShippingZoneRecord } from '~/utils/types/order-fulfillment-shipping';
import { serializeStatesForApi } from '~/utils/data/malaysia-states';
import type { ShippingZoneFormState } from '~/components/Z/Input/ShippingZone/DetailsSection.vue';

const emit = defineEmits<{
	saved: [zone: ShippingZoneRecord | undefined];
}>();

const { t } = useI18n();
const schema = computed(() => CreateShippingZoneValidation(t));
type Schema = z.output<ReturnType<typeof CreateShippingZoneValidation>>;

const zoneStore = useShippingZoneStore();
const shippingMethodStore = useShippingMethodStore();

const formRef = ref<{ submit: () => void } | null>(null);

const methodOptions = ref<{ label: string; value: string }[]>([]);

const emptyState = (): ShippingZoneFormState => ({
	name: '',
	is_active: true,
	country_code: 'MY',
	state: [],
	postcodes_text: '',
	shipping_method_ids: [],
	method_pricing: {},
});

const formState = reactive<ShippingZoneFormState>(emptyState());

const currencyCode = 'MYR';

const countPostcodeLines = (text: string) =>
	text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean).length;

const methodsSummaryLabel = (ids: string[], options: { label: string; value: string }[]) => {
	if (!ids.length) {
		return t('common.notSet');
	}
	const labels = ids.map((id) => options.find((o) => o.value === id)?.label).filter((x): x is string => Boolean(x));
	if (!labels.length) {
		return t('common.notSet');
	}
	return labels.join(', ');
};

const reviewSummary = computed(() => {
	const n = countPostcodeLines(formState.postcodes_text ?? '');
	const postcodesSummaryLabel = t('components.shippingZoneForm.reviewPostcodesCount', { count: n });

	const pricingLines =
		formState.shipping_method_ids.length === 0
			? undefined
			: formState.shipping_method_ids.map((id) => {
					const label = methodOptions.value.find((o) => o.value === id)?.label ?? id;
					const row = formState.method_pricing[id];
					const feeStr =
						row != null && !Number.isNaN(row.fee)
							? formatCurrency(Number(row.fee), currencyCode)
							: t('common.notSet');
					const d = row?.estimated_days;
					const daysStr =
						d != null && !Number.isNaN(d) ? t('components.shippingZoneForm.reviewDaysSuffix', { days: d }) : '';
					return `${label}: ${feeStr}${daysStr ? ` ${daysStr}` : ''}`;
				});

	const pricingSummaryLabel =
		!pricingLines?.length ? t('common.notSet') : pricingLines.join(' · ');

	const methodLabelsResolved = formState.shipping_method_ids
		.map((id) => methodOptions.value.find((o) => o.value === id)?.label)
		.filter((x): x is string => Boolean(x));
	const methodLabels = methodLabelsResolved.length ? methodLabelsResolved : undefined;

	return {
		name: formState.name.trim(),
		statusLabel: t(formState.is_active ? 'common.active' : 'common.inactive'),
		countryLabel: formState.country_code.trim().toUpperCase(),
		stateLabel: formState.state.length ? formState.state.join(', ') : '',
		postcodesSummaryLabel,
		pricingSummaryLabel,
		pricingLines,
		methodsLabel: methodsSummaryLabel(formState.shipping_method_ids, methodOptions.value),
		methodLabels,
	};
});

const buildPostcodePatterns = (text: string): ShippingZonePostcodePattern[] => {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((value) => ({ kind: 'exact' as const, value }));
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	const data = event.data;
	const methods = data.shipping_method_ids.map((id) => ({
		shipping_method_id: id,
		fee: data.method_pricing[id]?.fee ?? 0,
		estimated_days:
			data.method_pricing[id]?.estimated_days != null &&
			!Number.isNaN(data.method_pricing[id]!.estimated_days!)
				? data.method_pricing[id]!.estimated_days!
				: null,
	}));
	const payload = {
		name: data.name.trim(),
		is_active: data.is_active,
		country_code: 'MY',
		state: serializeStatesForApi(data.state),
		postcode_patterns: buildPostcodePatterns(data.postcodes_text ?? ''),
		methods,
		shipping_method_ids: [...data.shipping_method_ids],
	};

	const result = await zoneStore.createShippingZone(payload);
	emit('saved', result);
	Object.assign(formState, emptyState());
};

const submit = () => {
	formRef.value?.submit();
};

defineExpose({ submit });

onMounted(async () => {
	try {
		const methods = await shippingMethodStore.fetchAllShippingMethods();
		methodOptions.value = methods.map((m) => ({
			label: m.name,
			value: m.id,
		}));
	} catch {
		methodOptions.value = [];
	}
});
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
