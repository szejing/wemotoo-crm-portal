<template>
	<UCard class="status-management-card">
		<template #header>
			<h3 class="sidebar-title">{{ $t('components.orderDetail.orderStatus') }}</h3>
		</template>

		<div class="status-section">
			<ZSelectMenuOrderStatus v-model:status="status" />
			<UButton
				block
				color="primary"
				:icon="ICONS.SAVE"
				:disabled="status === currentStatus || updating"
				:loading="updating"
				@click="emit('submit')"
			>
				{{ $t('components.orderDetail.updateOrderStatus') }}
			</UButton>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import type { OrderStatus } from 'wemotoo-common';
import { ICONS } from '~/utils/icons';

defineProps<{
	currentStatus?: OrderStatus;
	updating?: boolean;
}>();

const emit = defineEmits<{
	submit: [];
}>();

const status = defineModel<OrderStatus>('status', { required: true });
</script>

<style scoped>
.sidebar-title {
	font-size: 1rem;
	font-weight: 600;
	color: var(--color-gray-800);
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.status-management-card {
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-section {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}
</style>
