<template>
	<div class="w-full">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<p v-if="customer?.customer_no" class="customer-detail-item">
				<span>{{ $t('components.orderDetail.customerNo') }}</span>
				<span>{{ customer?.customer_no }}</span>
			</p>
			<p v-if="customer?.name" class="customer-detail-item">
				<span>{{ $t('common.name') }}</span>
				<span>{{ customer?.name }}</span>
			</p>
			<p v-if="customer?.email_address" class="customer-detail-item">
				<span>{{ $t('components.orderDetail.emailAddress') }}</span>
				<span>{{ customer?.email_address }}</span>
			</p>
			<p v-if="customer?.phone_no" class="customer-detail-item">
				<span>{{ $t('components.orderDetail.phoneNo') }}</span>
				<span>{{ customer?.phone_no }}</span>
			</p>
			<p v-if="customer?.ref_no1" class="customer-detail-item">
				<span>{{ $t('components.orderDetail.refNo1') }}</span>
				<span>{{ customer?.ref_no1 }}</span>
			</p>
			<p v-if="customer?.ref_no2" class="customer-detail-item">
				<span>{{ $t('components.orderDetail.refNo2') }}</span>
				<span>{{ customer?.ref_no2 }}</span>
			</p>
		</div>
		<div v-if="hasAddressValue(customer?.shipping_address) || hasAddressValue(customer?.billing_address)" class="grid sm:grid-cols-2 gap-4 mt-6">
			<div v-if="hasAddressValue(customer?.shipping_address)" class="flex flex-col gap-4">
				<h3>{{ $t('components.orderDetail.shippingAddress') }}</h3>
				<div class="text-neutral-400">
					<p v-if="customer?.shipping_address?.address1">{{ customer?.shipping_address?.address1 }}</p>
					<p v-if="customer?.shipping_address?.address2">{{ customer?.shipping_address?.address2 }}</p>
					<p v-if="customer?.shipping_address?.address3">{{ customer?.shipping_address?.address3 }}</p>
					<p v-if="joinAddress(customer?.shipping_address)">{{ joinAddress(customer?.shipping_address) }}</p>
				</div>
			</div>

			<div v-if="hasAddressValue(customer?.billing_address)" class="flex flex-col gap-4">
				<h3>{{ $t('components.orderDetail.billingAddress') }}</h3>
				<div class="text-neutral-400">
					<p v-if="customer?.billing_address?.address1">{{ customer?.billing_address?.address1 }}</p>
					<p v-if="customer?.billing_address?.address2">{{ customer?.billing_address?.address2 }}</p>
					<p v-if="customer?.billing_address?.address3">{{ customer?.billing_address?.address3 }}</p>
					<p v-if="joinAddress(customer?.billing_address)">{{ joinAddress(customer?.billing_address) }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { AddressModel, CustomerModel } from '~/utils/models/customer.model';

defineProps<{
	customer: CustomerModel | undefined;
}>();

const hasAddressValue = (address: AddressModel | undefined) => {
	if (!address) return false;
	return !!(address.address1 || address.address2 || address.address3 || address.city || address.state || address.postal_code || address.country_code);
};

const joinAddress = (address: AddressModel | undefined) => {
	return [address?.city, address?.state, address?.postal_code, address?.country_code].filter(Boolean).join(', ');
};
</script>

<style scoped>
.customer-detail-item {
	display: flex;
	flex-direction: column;
	font-size: 0.875rem;
	line-height: 1.25rem;
}

.customer-detail-item span:first-child {
	color: var(--color-neutral-400);
	font-weight: 300;
	margin-bottom: 0.25rem;
}

.customer-detail-item span:last-child {
	font-weight: 700;
	color: var(--color-neutral-800);
}
</style>
