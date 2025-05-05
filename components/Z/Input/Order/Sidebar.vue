<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
			</template>

			<ZSelectMenuOrderStatus v-model:status="order.order_status" />

			<template #footer>
				<UButton @click="save">Save</UButton>
			</template>
		</UCard>

		<!-- ***** Payment Status ***** -->
		<!-- <UCard :ui="cardBg">
			<template #header>
				<h3>Payment Status</h3>
				<ZSelectMenuPaymentStatus v-model:payment-status="order.payment_status" class="mt-2" />
			</template>
		</UCard> -->
	</div>
</template>

<script lang="ts" setup>
import type { OrderStatus } from 'wemotoo-common';
import type { Order } from '~/utils/types/order';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const props = defineProps<{
	order: Order;
	updateOrderStatus: (status: OrderStatus) => Promise<void>;
}>();

const order = ref({ ...props.order });

const save = async () => {
	await props.updateOrderStatus(order.value.order_status);
};
</script>

<style scoped lang="postcss"></style>
