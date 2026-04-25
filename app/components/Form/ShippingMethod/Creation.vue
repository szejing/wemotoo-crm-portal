<template>
	<div class="w-full">
		<UForm ref="formRef" :state="formState" class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6" @submit="submitForm">
			<div class="lg:col-span-9 space-y-6">
				<ZInputShippingMethodDetailsSection :state="formState" :currency-code="currencyCode" />
			</div>

			<div class="lg:col-span-3">
				<div class="lg:sticky lg:top-4">
					<FormShippingMethodReviewSummary :summary="reviewSummary" subtitle-key="components.shippingMethodForm.reviewSubtitleCreate" />
				</div>
			</div>
		</UForm>
	</div>
</template>

<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types';

const shippingStore = useShippingMethodStore();
const { t } = useI18n();

type ShippingMethodFormState = {
	description: string;
	priority: number;
	is_active: boolean;
};

const formState = reactive<ShippingMethodFormState>({
	description: '',
	priority: 1,
	is_active: true,
});

const currencyCode = 'MYR';

const reviewSummary = computed(() => ({
	description: formState.description.trim(),
	priorityLabel: String(Number(formState.priority) || 1),
	statusLabel: t(formState.is_active ? 'common.active' : 'common.inactive'),
}));

const formRef = ref<{ submit: () => void } | null>(null);

const submitForm = async (_event: FormSubmitEvent<ShippingMethodFormState>) => {
	const payload = {
		description: formState.description.trim(),
		priority: Number(formState.priority) || 1,
		is_active: formState.is_active,
	};

	const success = await shippingStore.createShippingMethod(payload);

	if (success) {
		navigateTo(`/settings/shipping/methods`);
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
