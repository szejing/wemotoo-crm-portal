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
		<div class="grid sm:grid-cols-2 gap-4 mt-6">
			<div class="flex flex-col gap-4">
				<h3>Shipping Address :</h3>
				<div class="text-neutral-400">
					<p v-if="customer?.shipping_address?.address1">{{ customer?.shipping_address?.address1 }}</p>
					<p v-if="customer?.shipping_address?.address2">{{ customer?.shipping_address?.address2 }}</p>
					<p v-if="customer?.shipping_address?.address3">{{ customer?.shipping_address?.address3 }}</p>
					<p
						v-if="
							customer?.shipping_address?.city ||
							customer?.shipping_address?.state ||
							customer?.shipping_address?.postal_code ||
							customer?.shipping_address?.country_code
						"
					>
						{{
							[
								customer?.shipping_address?.city,
								customer?.shipping_address?.state,
								customer?.shipping_address?.postal_code,
								customer?.shipping_address?.country_code,
							]
								.filter(Boolean)
								.join(', ')
						}}
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-4">
				<h3>Billing Address :</h3>
				<div class="text-neutral-400">
					<p v-if="customer?.billing_address?.address1">{{ customer?.billing_address?.address1 }}</p>
					<p v-if="customer?.billing_address?.address2">{{ customer?.billing_address?.address2 }}</p>
					<p v-if="customer?.billing_address?.address3">{{ customer?.billing_address?.address3 }}</p>
					<p
						v-if="
							customer?.billing_address?.city ||
							customer?.billing_address?.state ||
							customer?.billing_address?.postal_code ||
							customer?.billing_address?.country_code
						"
					>
						{{
							[
								customer?.billing_address?.city,
								customer?.billing_address?.state,
								customer?.billing_address?.postal_code,
								customer?.billing_address?.country_code,
							]
								.filter(Boolean)
								.join(', ')
						}}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { CustomerModel } from '~/utils/models/customer.model';

defineProps<{
	customer: CustomerModel;
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
