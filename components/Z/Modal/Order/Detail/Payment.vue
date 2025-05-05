<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[70%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Payment Info</h3></template>
			<UForm :schema="UpdateOrderPaymentValidation" :state="state.payment" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputOrderDetailPayment
					v-model:payment-type-code="state.payment.payment_type_code"
					v-model:ref-no1="state.payment.ref_no1"
					v-model:ref-no2="state.payment.ref_no2"
					v-model:payment-amount="state.payment.payment_amount"
					v-model:currency-code="state.payment.currency_code"
					v-model:external-intg-type="state.payment.external_intg_type"
				/>
				<!-- *********************** General Info *********************** -->

				<div class="flex-jend gap-4">
					<UButton color="neutral" variant="ghost" @click="onCancel">Cancel</UButton>
					<UButton color="primary" variant="solid" :loading="is_loading" :disabled="is_loading" type="submit">Update</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { OrderPaymentModel } from '~/utils/models/index';
import { UpdateOrderPaymentValidation } from '~/utils/schema/index';

type Schema = z.output<typeof UpdateOrderPaymentValidation>;

const orderStore = useOrderStore();
const is_loading = ref(false);
const { detail } = storeToRefs(orderStore);

const props = defineProps({
	payment: {
		type: Object as PropType<OrderPaymentModel> | undefined,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);
const state = reactive({
	payment: props.payment || {
		payment_type_code: '',
		payment_type_desc: '',
		ref_no1: '',
		ref_no2: '',
		payment_amount: detail.value?.net_amt.toFixed(2),
		currency_code: detail.value?.currency_code,
		external_intg_type: 0,
		metadata: {},
	},
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		if (!detail.value) {
			throw new Error('Order not found');
		}
		is_loading.value = true;

		const { order_no } = detail.value;

		console.log(order_no);
		console.log(event.data);
		// await orderStore.updateCustomer(order_no, JSON.parse(JSON.stringify(event.data)));
		emit('update');
	} catch {
		return navigateTo('/orders');
	} finally {
		is_loading.value = false;
	}
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
