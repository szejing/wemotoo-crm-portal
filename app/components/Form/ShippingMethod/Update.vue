<template>
	<div class="w-full">
		<UForm ref="formRef" :state="formState" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" @submit="submitForm">
			<div class="lg:col-span-9 space-y-6">
				<ZInputShippingMethodDetailsAndZones :state="formState" :currency-code="currencyCode" />
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormShippingMethodReviewSummary :summary="reviewSummary" :subtitle-key="reviewSubtitleKey" />
				</div>
			</div>
		</UForm>
	</div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import { formatCurrency } from 'wemotoo-common';
import type { ShippingMethodOption, ShippingZoneRule } from '~/utils/types/order-fulfillment-shipping';

const props = defineProps<{
	mode: 'create' | 'edit';
	methodId?: string;
	initialMethod?: ShippingMethodOption;
}>();

const emit = defineEmits<{
	saved: [method: ShippingMethodOption | undefined];
}>();

const shippingStore = useShippingMethodStore();
const { t } = useI18n();

type ZoneFormRow = {
	country_code: string;
	state: string;
	postcodes_text: string;
	rule_priority: number;
	is_default: boolean;
	fee_override?: number;
	estimated_days_override?: number;
};

type ShippingMethodFormState = {
	name: string;
	fee: number;
	estimated_days?: number;
	priority: number;
	is_active: boolean;
	zone_rows: ZoneFormRow[];
};

const emptyZoneRow = (): ZoneFormRow => ({
	country_code: '',
	state: '',
	postcodes_text: '',
	rule_priority: 0,
	is_default: false,
	fee_override: undefined,
	estimated_days_override: undefined,
});

const formState = reactive<ShippingMethodFormState>({
	name: '',
	fee: 0,
	estimated_days: undefined,
	priority: 1,
	is_active: true,
	zone_rows: [emptyZoneRow()],
});

const currencyCode = computed(() => props.initialMethod?.currency_code ?? 'MYR');

const reviewSubtitleKey = computed(() =>
	props.mode === 'create' ? 'components.shippingMethodForm.reviewSubtitleCreate' : 'components.shippingMethodForm.reviewSubtitleEdit',
);

const reviewSummary = computed(() => {
	const est = formState.estimated_days;
	const estimatedDaysLabel =
		est != null && !Number.isNaN(est) ? String(est) : t('common.notSet');
	const validZoneRows = formState.zone_rows.filter((r) => r.country_code.trim().length === 2);
	const zoneCount = validZoneRows.length;
	const zonesSummary =
		zoneCount > 0
			? t('components.shippingMethodForm.reviewZonesCount', { count: zoneCount })
			: t('components.shippingMethodForm.reviewZonesAll');

	return {
		name: formState.name.trim(),
		feeLabel: formatCurrency(Number(formState.fee) || 0, currencyCode.value),
		estimatedDaysLabel,
		priorityLabel: String(formState.priority ?? 1),
		statusLabel: t(formState.is_active ? 'common.active' : 'common.inactive'),
		zonesSummary,
	};
});

const formRef = ref<{ submit: () => void } | null>(null);

const isEditing = computed(() => props.mode === 'edit' && Boolean(props.methodId));

const normalizeEstimatedDays = (value?: number) => {
	if (value === undefined || Number.isNaN(value)) {
		return undefined;
	}
	return value;
};

const mapLinksToZoneRows = (method: ShippingMethodOption): ZoneFormRow[] => {
	const links = method.method_zones ?? [];
	if (!links.length) {
		return [emptyZoneRow()];
	}
	return links.map((link) => {
		const z = link.shipping_zone;
		const lines =
			z?.postcode_patterns
				?.filter((p) => p.kind === 'exact')
				.map((p) => p.value)
				.join('\n') ?? '';
		return {
			country_code: z?.country_code ?? '',
			state: z?.state ?? '',
			postcodes_text: lines,
			rule_priority: z?.rule_priority ?? 0,
			is_default: z?.is_default ?? false,
			fee_override: link.fee_override ?? undefined,
			estimated_days_override: link.estimated_days_override ?? undefined,
		};
	});
};

const applyFromMethod = (m: ShippingMethodOption) => {
	formState.name = m.name;
	formState.fee = m.fee;
	formState.estimated_days = m.estimated_days;
	formState.priority = m.priority ?? 1;
	formState.is_active = m.is_active;
	const rows = mapLinksToZoneRows(m);
	const hasZones = (m.method_zones?.length ?? 0) > 0;
	formState.zone_rows = hasZones ? rows : [emptyZoneRow()];
};

const resetForCreate = () => {
	formState.name = '';
	formState.fee = 0;
	formState.estimated_days = undefined;
	formState.priority = 1;
	formState.is_active = true;
	formState.zone_rows = [emptyZoneRow()];
};

watch(
	() => props.initialMethod,
	(m) => {
		if (props.mode === 'edit' && m) {
			applyFromMethod(m);
		}
	},
	{ immediate: true },
);

watch(
	() => props.mode,
	(mode) => {
		if (mode === 'create') {
			resetForCreate();
		}
	},
	{ immediate: true },
);

const buildZonesPayload = (): ShippingZoneRule[] | undefined => {
	const rows = formState.zone_rows.filter((r) => r.country_code.trim().length === 2);
	if (!rows.length) {
		return isEditing.value ? [] : undefined;
	}
	return rows.map((row) => {
		const patterns = row.postcodes_text
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean)
			.map((value) => ({ kind: 'exact' as const, value }));
		const hasState = Boolean(row.state?.trim());
		const hasPost = patterns.length > 0;
		return {
			country_code: row.country_code.trim().toUpperCase(),
			state: row.state?.trim() || undefined,
			postcode_patterns: patterns,
			rule_priority: row.rule_priority ?? 0,
			is_default: row.is_default || (!hasState && !hasPost),
			fee_override: row.fee_override != null && !Number.isNaN(row.fee_override) ? row.fee_override : null,
			estimated_days_override: row.estimated_days_override != null && !Number.isNaN(row.estimated_days_override) ? row.estimated_days_override : null,
		};
	});
};

const submitForm = async (_event: FormSubmitEvent<ShippingMethodFormState>) => {
	const zonesPayload = buildZonesPayload();

	const payload = {
		name: formState.name.trim(),
		fee: Number(formState.fee),
		estimated_days: normalizeEstimatedDays(formState.estimated_days),
		priority: Number(formState.priority) || 1,
		is_active: formState.is_active,
		...(zonesPayload !== undefined ? { zones: zonesPayload } : {}),
	};

	let result: ShippingMethodOption | undefined;
	if (isEditing.value && props.methodId) {
		result = await shippingStore.updateShippingMethod(props.methodId, payload);
	} else {
		result = await shippingStore.createShippingMethod(payload);
	}

	emit('saved', result);
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
