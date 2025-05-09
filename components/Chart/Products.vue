<template>
	<UCard
		:ui="{
			base: 'flex flex-col h-full',
			body: {
				base: 'flex-1',
			},
			footer: {
				base: 'items-end mt-auto  mb-2',
			},
		}"
	>
		<template #header>
			<div class="w-full">
				<h2>Top Products</h2>
			</div>
		</template>

		<div>
			<div class="flex items-center justify-between">
				<p class="text-sm text-neutral-400">Prod Code</p>
				<p class="text-sm text-neutral-400">Total Qty</p>
			</div>

			<div v-for="product in top_purchased_products" :key="product.prod_code" class="mt-1">
				<div class="flex items-center justify-between gap-2">
					<p class="text-sm font-medium">{{ product.prod_code }}</p>
					<p class="text-sm font-medium">{{ product.total_qty }}</p>
				</div>
			</div>
		</div>

		<template #footer>
			<div class="w-full flex justify-end items-center text-secondary-400 gap-2">
				<p class="text-sm text-end">Details</p>
				<UIcon :name="ICONS.LIGHT_CHEVRON_RIGHT" class="w-6 h-6" />
			</div>
		</template>
	</UCard>
</template>

<script lang="ts" setup>
const summOrderStore = useSummOrderStore();
const { top_purchased_products } = storeToRefs(summOrderStore);
</script>

<style scoped lang="postcss"></style>
