<template>
	<div class="w-full">
		<UForm ref="formRef" :state="formState" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" @submit="submitForm">
			<div class="lg:col-span-9 space-y-6">
				<ZInputShippingMethodDetailsSection :state="formState" :currency-code="currencyCode" />
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
import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

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

type ShippingMethodFormState = {
	name: string;
	priority: number;
	is_active: boolean;
	zone_rows: unknown[];
};

const formState = reactive<ShippingMethodFormState>({
	name: '',
	priority: 1,
	is_active: true,
	zone_rows: [],
});

const currencyCode = computed(() => props.initialMethod?.currency_code ?? 'MYR');

const reviewSubtitleKey = computed(() =>
	props.mode === 'create' ? 'components.shippingMethodForm.reviewSubtitleCreate' : 'components.shippingMethodForm.reviewSubtitleEdit',
);

const reviewSummary = computed(() => ({
	name: formState.name.trim(),
	priorityLabel: String(Number(formState.priority) || 1),
	statusLabel: t(formState.is_active ? 'common.active' : 'common.inactive'),
}));

const formRef = ref<{ submit: () => void } | null>(null);

const isEditing = computed(() => props.mode === 'edit' && Boolean(props.methodId));

const applyFromMethod = (m: ShippingMethodOption) => {
	formState.name = m.name;
	formState.priority = m.priority ?? 1;
	formState.is_active = m.is_active;
};

const resetForCreate = () => {
	formState.name = '';
	formState.priority = 1;
	formState.is_active = true;
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

const submitForm = async (_event: FormSubmitEvent<ShippingMethodFormState>) => {
	const payload = {
		name: formState.name.trim(),
		priority: Number(formState.priority) || 1,
		is_active: formState.is_active,
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
