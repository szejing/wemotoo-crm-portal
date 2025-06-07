<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
			</template>

			<div class="flex-jbetween-icenter">
				<ZSelectMenuOrderStatus v-model:status="order.status" />
				<UButton @click="saveOrderStatus">Save</UButton>
			</div>
		</UCard>

		<!-- ***** Payment Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<div class="flex-jbetween-icenter">
					<h3>Payment Info</h3>
					<UButton v-if="order.payments?.length > 0" variant="ghost" @click="addPaymentInfo">Add</UButton>
				</div>
			</template>

			<div v-if="order.payments?.length > 0">
				<table class="w-full">
					<thead>
						<tr class="border-b text-xs text-neutral-400">
							<th class="text-left py-2">Type</th>
							<th class="text-right py-2">Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="payment in order.payments" :key="payment.payment_type_code" class="border-b text-xs">
							<td class="py-2 text-left font-bold">{{ payment.payment_type_code }}</td>
							<td class="py-2 text-right">
								<span class="font-bold"> {{ payment.currency_code }} {{ payment.payment_amt }} </span> <br />
								<span class="text-[10px] text-neutral-400">{{ payment.ref_no1 }} </span>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div v-else>
				<p class="text-center text-neutral-400">Not yet paid</p>
			</div>

			<template #footer>
				<!-- <div class="flex-jbetween-icenter">
					<ZSelectMenuPaymentStatus v-model:payment-status="order.payment_status" />
					<UButton @click="savePaymentStatus">Save</UButton>
				</div> -->
			</template>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { Order } from '~/utils/types/order';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const props = defineProps<{
	order: Order;
	updateOrderStatus: (status: OrderStatus) => Promise<void>;
	updatePaymentStatus: (status: PaymentStatus) => Promise<void>;
	addPaymentInfo: () => void;
}>();

const order = computed(() => props.order);

const saveOrderStatus = async () => {
	await props.updateOrderStatus(order.value.status);
};

// const savePaymentStatus = async () => {
// 	await props.updatePaymentStatus(order.value.payment_status);
// };
</script>

<style scoped lang="postcss"></style>
