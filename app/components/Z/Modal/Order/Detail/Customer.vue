<template>
	<UModal
		title="Update Customer"
		:ui="{
			content: 'w-full sm:max-w-[60%] md:max-w-[40%] lg:max-w-[30%]',
		}"
	>
		<template #body>
			<UForm :schema="UpdateOrderCustomerValidation" :state="state.customer" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputOrderDetailCustomer
					v-model:name="state.customer.name"
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
		</template>
	</UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types';
import type { z } from 'zod';
import type { CustomerModel } from '~/utils/models/customer.model';
import { UpdateOrderCustomerValidation } from '~/utils/schema/index';

type Schema = z.output<typeof UpdateOrderCustomerValidation>;

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
