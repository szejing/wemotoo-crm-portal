<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[70%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Customer</h3></template>
			<UForm :schema="UpdateCustomerValidation" :state="state.customer" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputOrderDetailCustomer
					v-model:email-address="state.customer.email_address"
					v-model:phone-no="state.customer.phone_no"
					v-model:shipping-address="state.customer.shipping_address"
					v-model:billing-address="state.customer.billing_address"
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
import type { CustomerModel } from '~/utils/models/customer.model';
import { UpdateCustomerValidation } from '~/utils/schema/Order/Update/CustomerValidation';

type Schema = z.output<typeof UpdateCustomerValidation>;

const orderStore = useOrderStore();
const is_loading = ref(false);
const { detail } = storeToRefs(orderStore);

const props = defineProps({
	customer: {
		type: Object as PropType<CustomerModel>,
		required: true,
	},
});
const emit = defineEmits(['update', 'cancel']);
const state = reactive({
	customer: props.customer,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		if (!detail.value) {
			throw new Error('Order not found');
		}
		is_loading.value = true;

		const { order_no } = detail.value;

		await orderStore.updateCustomer(order_no, JSON.parse(JSON.stringify(event.data)));
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
