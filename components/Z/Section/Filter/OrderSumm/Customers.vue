<template>
	<UCard>
		<div class="w-full flex flex-col gap-4">
			<div class="gap-2 sm:flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Date</h4>

				<ZSelectMenuDateFilterType v-model:filter-type="order_summ_customer.filter.filter_type" />

				<div class="flex-col-start gap-2">
					<ZSelectMenuDate
						:date="order_summ_customer.filter.start_date"
						placeholder="Start Date"
						@update:date="order_summ_customer.filter.start_date = $event"
					/>
					<ZSelectMenuDate
						v-if="order_summ_customer.filter.filter_type === 'between'"
						:date="order_summ_customer.filter.end_date"
						placeholder="End Date"
						:min-date="order_summ_customer.filter.start_date"
						@update:date="order_summ_customer.filter.end_date = $event"
					/>
				</div>
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Order Status</h4>
				<ZSelectMenuOrderStatus v-model:status="order_summ_customer.filter.status" />
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Currency</h4>
				<ZSelectMenuCurrency v-model:currency-code="order_summ_customer.filter.currency_code" />
			</div>
		</div>

		<template #footer>
			<UButton color="green" :disabled="is_loading" :loading="is_loading" @click="generate">Generate</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const orderSummStore = useSummOrderStore();
const { order_summ_customer } = storeToRefs(orderSummStore);

const is_loading = computed(() => orderSummStore.order_summ_customer.is_loading);

const generate = () => {
	orderSummStore.getOrderCustomerSummary();
};
</script>

<style scoped lang="postcss"></style>
