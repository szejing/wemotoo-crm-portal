<template>
	<div class="w-full">
		<UForm ref="formRef" :schema="schema" :state="formState" class="space-y-6 mb-6" @submit="submitForm">
			<ZInputShippingZoneDetails :state="formState" :method-options="methodOptions" />
		</UForm>
	</div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import { CreateShippingZoneValidation } from '~/utils/schema';
import type { ShippingZonePostcodePattern, ShippingZoneRecord } from '~/utils/types/order-fulfillment-shipping';
import type { ShippingZoneFormState } from '~/components/Z/Input/ShippingZone/Details.vue';

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
	country_code: '',
	state: '',
	postcodes_text: '',
	fee_override: undefined,
	estimated_days_override: undefined,
	shipping_method_ids: [],
});

const formState = reactive<ShippingZoneFormState>(emptyState());

const buildPostcodePatterns = (text: string): ShippingZonePostcodePattern[] => {
	return text
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((value) => ({ kind: 'exact' as const, value }));
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	const data = event.data;
	const payload = {
		name: data.name.trim(),
		is_active: data.is_active,
		country_code: data.country_code,
		state: data.state?.trim() || undefined,
		postcode_patterns: buildPostcodePatterns(data.postcodes_text ?? ''),
		fee_override:
			data.fee_override != null && !Number.isNaN(data.fee_override) ? data.fee_override : null,
		estimated_days_override:
			data.estimated_days_override != null && !Number.isNaN(data.estimated_days_override)
				? data.estimated_days_override
				: null,
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
