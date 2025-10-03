<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
			</template>

			<div class="flex-jbetween-icenter">
				<ZSelectMenuOrderStatus v-model:status="new_status" />
				<UButton @click="saveOrderStatus">Save</UButton>
			</div>
		</UCard>

		<!-- ***** Payment Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<div class="flex-jbetween-icenter">
					<h3>Payment Info</h3>
					<UButton v-if="order.payments?.length == 0" variant="ghost" @click="addPaymentInfo">Add</UButton>
				</div>
			</template>

			<div v-if="order.payments?.length > 0">
				<UTable
					:rows="order.payments"
					:columns="paymentColumns"
					:ui="{
						thead: 'border-b text-xs text-neutral-400',
						tbody: 'text-xs',
						tr: { base: 'cursor-pointer hover:bg-gray-50' },
					}"
					@select="viewPaymentInfo"
				>
					<template #amount-data="{ row }">
						<div class="text-right">
							<span class="font-bold">{{ row.currency_code }} {{ row.payment_amt?.toFixed(2) }} </span><br />
							<span class="text-[10px] text-neutral-400">{{ row.ref_no1 }}</span>
						</div>
					</template>
				</UTable>
			</div>

			<div v-else>
				<p class="text-center text-neutral-400">Not yet paid</p>
			</div>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
import type { OrderStatus, PaymentStatus } from 'wemotoo-common';
import type { PaymentModel } from '~/utils/models';
import type { Order } from '~/utils/types/order';

const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const props = defineProps<{
	order: Order;
	updateOrderStatus: (status: OrderStatus) => Promise<void>;
	updatePaymentStatus: (status: PaymentStatus) => Promise<void>;
	viewPaymentInfo: (payment: PaymentModel) => void;
	addPaymentInfo: () => void;
}>();

const order = computed(() => props.order);

const new_status = ref<OrderStatus>(order.value.status);

const paymentColumns = [
	{
		key: 'payment_type_code',
		label: 'Type',
		class: 'text-left py-2 font-bold',
	},
	{
		key: 'amount',
		label: 'Amount',
		class: 'text-right py-2',
	},
];

const saveOrderStatus = async () => {
	await props.updateOrderStatus(new_status.value);
};

const addPaymentInfo = () => {
	props.addPaymentInfo();
};

const viewPaymentInfo = (payment: PaymentModel) => {
	props.viewPaymentInfo(payment);
};
</script>

<style scoped lang="postcss"></style>
