<template>
	<UModal
		:ui="{
			width: 'w-full sm:w-[70%]',
		}"
	>
		<UCard>
			<template #header><h3>Update Item</h3></template>
			<UForm :schema="UpdateOrderItemValidation" :state="state.item" class="space-y-4" @submit="onSubmit">
				<!-- *********************** General Info *********************** -->
				<ZInputOrderDetailItem
					v-model:status="state.item.status"
					v-model:prod-code="state.item.prod_code"
					v-model:prod-name="state.item.prod_name"
					v-model:prod-variant-code="state.item.prod_variant_code"
					v-model:prod-variant-name="state.item.prod_variant_name"
					v-model:prod-variant-sku="state.item.prod_variant_sku"
					v-model:currency-code="state.item.currency_code"
					v-model:order-qty="state.item.qty"
					v-model:unit-sell-price="state.item.unit_sell_price"
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
import type { OrderItemModel } from '~/utils/models/item.model';
import { UpdateOrderItemValidation } from '~/utils/schema/index';

type Schema = z.output<typeof UpdateOrderItemValidation>;
const orderStore = useOrderStore();
const is_loading = ref(false);
const { detail } = storeToRefs(orderStore);

const props = defineProps({
	item: {
		type: Object as PropType<OrderItemModel>,
		required: true,
	},
});

const emit = defineEmits(['update', 'cancel']);
const state = reactive({
	item: props.item,
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
	try {
		if (!detail.value) {
			throw new Error('Order not found');
		}
		is_loading.value = true;

		const { order_no } = detail.value;

		await orderStore.updateItems(order_no, JSON.parse(JSON.stringify(event.data)));
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

<style scoped lang="postcss"></style>
