<template>
	<div class="w-full">
		<div class="flex flex-col gap-1">
			<p v-if="customer?.customer_no" class="customer-detail-item">
				<span>Cust No :</span>
				<span>{{ customer?.customer_no }}</span>
			</p>
			<p v-if="customer?.user_id" class="customer-detail-item">
				<span>User Id :</span>
				<span>{{ customer?.user_id }}</span>
			</p>
			<p v-if="customer?.email_address" class="customer-detail-item">
				<span>Email Address :</span>
				<span>{{ customer?.email_address }}</span>
			</p>
			<p v-if="customer?.phone_no" class="customer-detail-item">
				<span>Phone No. :</span>
				<span>{{ customer?.phone_no }}</span>
			</p>
			<p v-if="customer?.ref_no1" class="customer-detail-item">
				<span>Ref No 1 :</span>
				<span>{{ customer?.ref_no1 }}</span>
			</p>
			<p v-if="customer?.ref_no2" class="customer-detail-item">
				<span>Ref No 2 :</span>
				<span>{{ customer?.ref_no2 }}</span>
			</p>
		</div>
		<div class="grid sm:grid-cols-2 gap-4 mt-4">
			<div class="flex flex-col gap-4">
				<h3>Shipping Address :</h3>
				<p v-if="customer?.s_address1">{{ customer?.s_address1 }}</p>
				<p v-if="customer?.s_address2">{{ customer?.s_address2 }}</p>
				<p v-if="customer?.s_address3">{{ customer?.s_address3 }}</p>
				<p v-if="customer?.s_city">{{ customer?.s_city }}</p>
				<p v-if="customer?.s_state">{{ customer?.s_state }}</p>
				<p v-if="customer?.s_postal_code">{{ customer?.s_postal_code }}</p>
			</div>

			<div class="flex flex-col gap-4">
				<h3>Billing Address :</h3>
				<p v-if="customer?.b_address1">{{ customer?.b_address1 }}</p>
				<p v-if="customer?.b_address2">{{ customer?.b_address2 }}</p>
				<p v-if="customer?.b_address3">{{ customer?.b_address3 }}</p>
				<p v-if="customer?.b_city">{{ customer?.b_city }}</p>
				<p v-if="customer?.b_state">{{ customer?.b_state }}</p>
				<p v-if="customer?.b_postal_code">{{ customer?.b_postal_code }}</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	customer: Customer;
}>();
</script>

<style scoped lang="postcss">
.customer-detail-item {
	@apply flex flex-col sm:flex-row text-sm;
}

.customer-detail-item span:first-child {
	@apply w-full sm:w-[100px] lg:w-[120px] text-neutral-400;
}

.customer-detail-item span:last-child {
	@apply font-medium text-neutral-800;
}
</style>
