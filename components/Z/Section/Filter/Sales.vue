<template>
	<UCard>
		<div class="w-full flex flex-col gap-4">
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Date</h4>

				<div class="flex-col-start">
					<ZSelectMenuDateRange
						:start-date="filter.start_date"
						:end-date="filter.end_date"
						placeholder="Date"
						@update:start-date="filter.start_date = $event"
						@update:end-date="filter.end_date = $event"
					/>
				</div>
			</div>

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Status</h4>
				<ZSelectMenuSaleStatus v-model:status="filter.status" />
			</div>

			<!-- <div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>PaymentStatus</h4>
				<ZSelectMenuPaymentStatus v-model:payment-status="filter.payment_status" />
			</div> -->

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Bill No</h4>
				<UFormField name="query">
					<UInput v-model="filter.query" placeholder="Bill No" :icon="ICONS.SEARCH_ROUNDED" />
				</UFormField>
			</div>

			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Currency</h4>
				<ZSelectMenuCurrency v-model:currency-code="filter.currency_code" />
			</div>
		</div>
		<template #footer>
			<UButton color="success" :disabled="is_loading" :loading="is_loading" @click="search">Search</UButton>
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
