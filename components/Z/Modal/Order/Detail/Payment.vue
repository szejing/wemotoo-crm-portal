<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[70%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Payment Info</h3></template>
			<UForm :schema="UpdateOrderPaymentValidation" :state="state.payment" class="space-y-4">
				<!-- *********************** General Info *********************** -->
				<ZInputOrderDetailPayment
					v-model:payment-date-time="state.payment.payment_date_time"
					v-model:payment-type-code="state.payment.payment_type_code"
					v-model:ref-no1="state.payment.ref_no1"
					v-model:ref-no2="state.payment.ref_no2"
					v-model:payment-amount="state.payment.payment_amt"
					v-model:currency-code="state.payment.currency_code"
					v-model:external-intg-type="state.payment.external_intg_type"
				/>
				<!-- *********************** General Info *********************** -->

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="is_loading" :disabled="is_loading" @click="onSubmit">Update</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { PaymentModel } from '~/utils/models/index';
import { UpdateOrderPaymentValidation } from '~/utils/schema/index';

type Schema = z.output<typeof UpdateOrderPaymentValidation>;

const orderStore = useOrderStore();
const is_loading = ref(false);
const { detail } = storeToRefs(orderStore);

const props = defineProps({
	payment: {
		type: Object as PropType<PaymentModel> | undefined,
		required: false,
	},
});

const emit = defineEmits(['update', 'cancel']);
const state = reactive({
	payment: props.payment || {
		payment_date_time: new Date(),
		payment_type_code: undefined,
		ref_no1: undefined,
		ref_no2: undefined,
		payment_amt: detail.value?.net_amt,
		currency_code: detail.value?.currency_code,
		external_intg_type: undefined,
		metadata: undefined,
	},
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	console.log('onSubmit', event.data);
	try {
		if (!detail.value) {
			throw new Error('Order not found');
		}
		is_loading.value = true;

		const { order_no } = detail.value;

		await orderStore.updatePayments(order_no, JSON.parse(JSON.stringify(event.data)));
		emit('update', true);
	} catch {
		emit('update', false);
	} finally {
		is_loading.value = false;
	}
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped></style>
