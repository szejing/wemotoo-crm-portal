<template>
	<div class="space-y-4">
		<!-- ***** Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Status</h3>
				<ZSelectMenuOrderStatus v-model:status="newOrder.status" class="mt-2" />
			</template>
		</UCard>

		<!-- ***** Payment Status ***** -->
		<UCard :ui="cardBg">
			<template #header>
				<h3>Payment Status</h3>
				<ZSelectMenuPaymentStatus v-model:payment-status="newOrder.payment_status" />
			</template>
		</UCard>
	</div>
</template>

<script lang="ts" setup>
const cardBg = { background: 'bg-secondary-50', shadow: 'shadow-md' };

const orderStore = useOrderStore();
const { detail: newOrder } = storeToRefs(orderStore);

console.log(newOrder.value);
</script>

<style scoped lang="postcss"></style>
