<template>
	<UCard
		:ui="{
			base: 'flex flex-col h-full',
			body: {
				base: 'flex-1',
			},
			footer: {
				base: 'items-end mt-auto mb-2',
			},
		}"
	>
		<template #header>
			<div class="w-full">
				<h2>Top Customers</h2>
			</div>
		</template>

		<div class="flex-1">
			<div class="flex items-center justify-between">
				<p class="text-sm text-neutral-400">Customer No.</p>
				<p class="text-sm text-neutral-400">Total Orders</p>
			</div>

			<div v-for="cust in top_purchased_customers" :key="cust.customer_no" class="mt-1">
				<div class="flex items-center justify-between gap-2">
					<p class="text-sm font-medium">{{ cust.customer_no }}</p>
					<p class="text-sm font-medium">{{ cust.total_orders }}</p>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="text-sm text-end">Details</p>
				<UIcon :name="ICONS.CHEVRON_RIGHT" class="w-6 h-6" />
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const summOrderStore = useSummOrderStore();
const { top_purchased_customers } = storeToRefs(summOrderStore);
</script>

<style scoped lang="postcss"></style>
