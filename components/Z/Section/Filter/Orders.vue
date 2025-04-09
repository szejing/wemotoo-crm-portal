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
				<h4>Order Status</h4>
				<ZSelectMenuOrderStatus v-model:status="filter.status" />
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
const orderStore = useOrderStore();
const { filter } = storeToRefs(orderStore);

const is_loading = computed(() => orderStore.loading);

const search = async () => {
	await orderStore.getOrders();
};
</script>

<style scoped lang="postcss"></style>
