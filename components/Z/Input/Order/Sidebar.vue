<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
			</template>

			<ZSelectMenuOrderStatus v-model:status="order.order_status" />

			<template #footer>
				<UButton @click="saveOrderStatus">Save</UButton>
			</template>
		</UCard>

		<!-- ***** Payment Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<div class="flex-jbetween-icenter">
					<h3>Payment</h3>
					<UButton variant="ghost" @click="addPaymentInfo">Add Info</UButton>
				</div>
			</template>

			<div>
				<div class="flex-jbetween-icenter">
					<p>Status</p>
					<ZSelectMenuPaymentStatus v-model:payment-status="order.payment_status" />
				</div>
			</div>

			<template #footer>
				<UButton @click="savePaymentStatus">Save</UButton>
			</template>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import type { OrderStatus } from 'wemotoo-common';
import type { Order } from '~/utils/types/order';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const props = defineProps<{
	order: Order;
	updateOrderStatus: (status: OrderStatus) => Promise<void>;
	updatePaymentStatus: (status: PaymentStatus) => Promise<void>;
	addPaymentInfo: () => void;
}>();

const order = ref({ ...props.order });

const saveOrderStatus = async () => {
	await props.updateOrderStatus(order.value.order_status);
};

const savePaymentStatus = async () => {
	await props.updatePaymentStatus(order.value.payment_status);
};
</script>

<style scoped lang="postcss"></style>
