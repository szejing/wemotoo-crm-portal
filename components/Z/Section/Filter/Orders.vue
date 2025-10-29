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
			<div class="flex-jbetween-icenter w-full sm:hidden">
				<h4>Order Status</h4>
				<ZSelectMenuOrderStatus v-model:status="filter.status" />
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Order No</h4>
				<UFormField name="query">
					<UInput v-model="filter.query" placeholder="Order No" :icon="ICONS.SEARCH_ROUNDED" />
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
const orderStore = useOrderStore();
const { filter } = storeToRefs(orderStore);

const is_loading = computed(() => orderStore.loading);

const search = async () => {
	await orderStore.getOrders();
};
</script>

<style scoped lang="postcss"></style>
