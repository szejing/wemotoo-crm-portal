<template>
	<UCard>
		<div class="w-full flex flex-col gap-4">
			<div class="gap-2 sm:flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Date</h4>

				<div class="flex-col-start gap-2">
					<ZSelectMenuDateRange
						:start-date="sale_summ.filter.start_date"
						:end-date="sale_summ.filter.end_date"
						placeholder="Date"
						@update:start-date="sale_summ.filter.start_date = $event"
						@update:end-date="sale_summ.filter.end_date = $event"
					/>
				</div>
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Status</h4>
				<ZSelectMenuSaleStatus v-model:status="sale_summ.filter.status" />
			</div>
			<div class="flex-jbetween-icenter w-full sm:w-[60%]">
				<h4>Currency</h4>
				<ZSelectMenuCurrency v-model:currency-code="sale_summ.filter.currency_code" />
			</div>
		</div>

		<template #footer>
			<UButton color="success" :disabled="is_loading" :loading="is_loading" @click="generate">Generate</UButton>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const saleSummStore = useSummSaleStore();
const { sale_summ } = storeToRefs(saleSummStore);

const is_loading = computed(() => saleSummStore.sale_summ.is_loading);

const generate = () => {
	saleSummStore.getSaleSummary();
};
</script>

<style scoped lang="postcss"></style>
