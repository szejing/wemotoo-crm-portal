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
					<UButton color="primary" variant="solid" :loading="updating" type="submit">Update</UButton>
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

const updating = ref(false);
type Schema = z.output<typeof UpdateCustomerValidation>;

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
	console.log(event.data);
	// const { value } = event.data;

	// if (value === '' || value === undefined) {
	// 	return;
	// }

	// emit('update', state.tag);
};

const onCancel = () => {
	emit('cancel');
};
</script>

<style scoped lang="postcss"></style>
