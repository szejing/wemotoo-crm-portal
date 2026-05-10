<script setup lang="ts">
import type { FulfillmentLifecycleStatusValue } from '~/utils/types/order-fulfillment-shipping';

const props = defineProps<{
	status?: FulfillmentLifecycleStatusValue;
	isReadOnly?: boolean;
	loading?: boolean;
}>();

const emit = defineEmits<{
	(e: 'action', action: 'processing' | 'packed' | 'fulfilled'): void;
}>();

const canStartProcessing = computed(() => props.status === 'pending');
const canMarkPacked = computed(() => props.status === 'processing');
const canMarkFulfilled = computed(() => props.status === 'packed');

const isDisabled = computed(() => props.isReadOnly || props.loading);

const onAction = (action: 'processing' | 'packed' | 'fulfilled') => {
	if (isDisabled.value) {
		return;
	}

	emit('action', action);
};
</script>

<template>
	<div class="flex flex-wrap gap-2">
		<UButton
			size="sm"
			color="info"
			:disabled="!canStartProcessing || isDisabled"
			:loading="loading && canStartProcessing"
			@click="onAction('processing')"
		>
			{{ $t('components.fulfillment.startProcessing') }}
		</UButton>
		<UButton
			size="sm"
			color="primary"
			:disabled="!canMarkPacked || isDisabled"
			:loading="loading && canMarkPacked"
			@click="onAction('packed')"
		>
			{{ $t('components.fulfillment.markAsPacked') }}
		</UButton>
		<UButton
			size="sm"
			color="success"
			:disabled="!canMarkFulfilled || isDisabled"
			:loading="loading && canMarkFulfilled"
			@click="onAction('fulfilled')"
		>
			{{ $t('components.fulfillment.markAsFulfilled') }}
		</UButton>
	</div>
</template>
