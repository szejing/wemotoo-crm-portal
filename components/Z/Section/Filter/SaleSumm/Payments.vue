<template>
	<UCard>
		<div class="w-full flex flex-col gap-4">
			<div class="gap-2 sm:flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Date</h4>

				<div class="flex-col-start gap-2">
					<ZSelectMenuDateRange
						:start-date="sale_summ_payments.filter.start_date"
						:end-date="sale_summ_payments.filter.end_date"
						placeholder="Date"
						@update:start-date="sale_summ_payments.filter.start_date = $event"
						@update:end-date="sale_summ_payments.filter.end_date = $event"
					/>
				</div>
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Status</h4>
				<ZSelectMenuSaleStatus v-model:status="sale_summ_payments.filter.status" />
			</div>
			<!-- <div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Payment Status</h4>
				<ZSelectMenuPaymentStatus v-model:status="sale_summ_payments.filter.payment_status" />
			</div> -->
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Currency</h4>
				<ZSelectMenuCurrency v-model:currency-code="sale_summ_payments.filter.currency_code" />
			</div>
		</div>

		<template #footer>
			<UButton color="success" :disabled="is_loading" :loading="is_loading" @click="generate">Generate</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const saleSummStore = useSummSaleStore();
const { sale_summ_payments } = storeToRefs(saleSummStore);

const is_loading = computed(() => sale_summ_payments.value.is_loading);

const generate = () => {
	saleSummStore.getSalePaymentSummary();
};
</script>

<style scoped></style>
