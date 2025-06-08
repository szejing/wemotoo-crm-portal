<template>
	<UCard>
		<div class="w-full flex flex-col gap-4">
			<div class="gap-2 sm:flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Date</h4>

				<ZSelectMenuDateFilterType v-model:filter-type="filter.filter_type" />

				<div class="flex-col-start gap-2">
					<ZSelectMenuDate :date="filter.start_date" placeholder="Start Date" @update:date="filter.start_date = $event" />
					<ZSelectMenuDate
						v-if="filter.filter_type === 'between'"
						:date="filter.end_date"
						placeholder="End Date"
						:min-date="filter.start_date"
						@update:date="filter.end_date = $event"
					/>
				</div>
			</div>

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Status</h4>
				<ZSelectMenuSaleStatus v-model:status="filter.status" />
			</div>

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>PaymentStatus</h4>
				<ZSelectMenuPaymentStatus v-model:payment-status="filter.payment_status" />
			</div>

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Currency</h4>
				<ZSelectMenuCurrency v-model:currency-code="filter.currency_code" />
			</div>
		</div>
		<template #footer>
			<UButton color="green" :disabled="is_loading" :loading="is_loading" @click="search">Search</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const saleStore = useSaleStore();
const { filter } = storeToRefs(saleStore);

const is_loading = computed(() => saleStore.loading);

const search = async () => {
	await saleStore.getBills();
};
</script>

<style scoped lang="postcss"></style>
