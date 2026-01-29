<template>
	<div class="section-grid-basic-details">
		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<UFormField v-slot="{ error }" label="Customer Name" name="customer_name" required>
				<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Customer Name" />
			</UFormField>

			<UFormField v-slot="{ error }" label="Email Address" name="email_address" required>
				<UInput v-model="email_address" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Email Address" />
			</UFormField>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<!-- todo: add country code -->
			<!-- <ZSelectMenuCountry v-model:country-code="dial_code" /> -->

			<UFormField v-slot="{ error }" label="Phone Number" name="phone_no" required>
				<UInput v-model="phone_no" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Phone Number" />
			</UFormField>
		</div>

		<div v-if="shipping_address || billing_address" class="grid grid-cols-1 sm:grid-cols-2 sm:gap-12 sm:mt-4">
			<div v-if="shipping_address" class="mt-8 sm:mt-0 border-t pt-4 sm:border-none sm:pt-0">
				<h3>Shipping Address</h3>
				<ZInputAddress
					v-if="shipping_address"
					v-model:address1="shipping_address.address1"
					v-model:address2="shipping_address.address2"
					v-model:address3="shipping_address.address3"
					v-model:city="shipping_address.city"
					v-model:postal-code="shipping_address.postal_code"
					v-model:state-name="shipping_address.state"
					v-model:country-code="shipping_address.country_code"
					class="mt-4"
				/>
			</div>

			<div v-if="billing_address" class="mt-8 sm:mt-0 border-t pt-4 sm:border-none sm:pt-0">
				<div class="flex-between">
					<h3>Billing Address</h3>
					<UCheckbox
						v-model="same_as_shipping_address"
						:ui="{ label: 'text-xs font-normal text-neutral-500' }"
						label="Same as Shipping Address"
						@change="onChangeSameAsShippingAddress"
					/>
				</div>
				<ZInputAddress
					v-if="billing_address"
					v-model:address1="billing_address.address1"
					v-model:address2="billing_address.address2"
					v-model:address3="billing_address.address3"
					v-model:city="billing_address.city"
					v-model:postal-code="billing_address.postal_code"
					v-model:state-name="billing_address.state"
					v-model:country-code="billing_address.country_code"
					class="mt-4"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { AddressModel } from '~/utils/models/customer.model';

const same_as_shipping_address = ref(false);
const props = defineProps({
	name: String,
	emailAddress: String,
	phoneNo: String,
	shippingAddress: Object as PropType<AddressModel>,
	billingAddress: Object as PropType<AddressModel>,
});

const emit = defineEmits(['update:name', 'update:emailAddress', 'update:phoneNo', 'update:shippingAddress', 'update:billingAddress']);

const name = computed({
	get() {
		return props.name;
	},
	set(value) {
		emit('update:name', value);
	},
});

const email_address = computed({
	get() {
		return props.emailAddress;
	},
	set(value) {
		emit('update:emailAddress', value);
	},
});

const phone_no = computed({
	get() {
		return props.phoneNo;
	},
	set(value) {
		emit('update:phoneNo', value);
	},
});

const shipping_address = computed({
	get() {
		return props.shippingAddress;
	},
	set(value) {
		emit('update:shippingAddress', value);
	},
});

const billing_address = computed({
	get() {
		return props.billingAddress;
	},
	set(value) {
		emit('update:billingAddress', value);
	},
});

const onChangeSameAsShippingAddress = () => {
	if (same_as_shipping_address.value) {
		billing_address.value = JSON.parse(JSON.stringify(shipping_address.value));
	}
};
</script>

<style scoped>
.section-grid-basic-details {
	display: grid;
	grid-template-columns: repeat(1, minmax(0, 1fr));
	gap: 0.75rem;
}
</style>
