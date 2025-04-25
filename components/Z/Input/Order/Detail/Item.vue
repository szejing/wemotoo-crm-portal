<template>
	<div class="section-grid-basic-details">
		<UFormGroup v-slot="{ error }" label="Order Line" name="order_line" required>
			<UInput v-model="orderLine" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Order Line" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Status" name="status" required>
			<UInput v-model="status" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Status" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Parent Order Line" name="parent_order_line" required>
			<UInput v-model="parentOrderLine" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Parent Order Line" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Product Code" name="prod_code" required>
			<UInput v-model="prodCode" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Product Code" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Product Name" name="prod_name" required>
			<UInput v-model="prodName" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Product Name" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Product Variant ID" name="prod_variant_id" required>
			<UInput v-model="prodVariantId" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Product Variant ID" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Product Variant Name" name="prod_variant_name" required>
			<UInput v-model="prodVariantName" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Product Variant Name" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Product Variant SKU" name="prod_variant_sku" required>
			<UInput v-model="prodVariantSku" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Product Variant SKU" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Currency Code" name="currency_code" required>
			<UInput v-model="currencyCode" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Currency Code" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Order Quantity" name="order_qty" required>
			<UInput v-model="orderQty" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Order Quantity" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Unit Sell Price" name="unit_sell_price" required>
			<UInput v-model="unitSellPrice" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Unit Sell Price" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Original Sell Price" name="orig_sell_price" required>
			<UInput v-model="origSellPrice" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Original Sell Price" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Gross Amount" name="gross_amt" required>
			<UInput v-model="grossAmt" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Gross Amount" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Discount Amount" name="disc_amt" required>
			<UInput v-model="discAmt" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Discount Amount" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Net Amount" name="net_amt" required>
			<UInput v-model="netAmt" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Net Amount" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Gross Amount Excluding Tax" name="gross_amt_exc" required>
			<UInput v-model="grossAmtExc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Gross Amount Excluding Tax" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Discount Amount Excluding Tax" name="disc_amt_exc" required>
			<UInput v-model="discAmtExc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Discount Amount Excluding Tax" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Net Amount Excluding Tax" name="net_amt_exc" required>
			<UInput v-model="netAmtExc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Net Amount Excluding Tax" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Tax Amount Including Tax" name="tax_amt_inc" required>
			<UInput v-model="taxAmtInc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Tax Amount Including Tax" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Tax Amount Excluding Tax" name="tax_amt_exc" required>
			<UInput v-model="taxAmtExc" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Tax Amount Excluding Tax" />
		</UFormGroup>

		<UFormGroup v-slot="{ error }" label="Adjustment Amount" name="adj_amt" required>
			<UInput v-model="adjAmt" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" placeholder="Adjustment Amount" />
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
import type { OrderItemStatus } from 'wemotoo-common';

const props = defineProps<{
	orderLine: number;
	status: OrderItemStatus;
	parentOrderLine: number;
	prodCode: string;
	prodName: string;
	prodVariantId?: string;
	prodVariantName?: string;
	prodVariantSku?: string;
	currencyCode: string;
	orderQty: number;
	unitSellPrice: number;
	origSellPrice: number;
	grossAmt: number;
	discAmt?: number;
	netAmt: number;
	grossAmtExc: number;
	discAmtExc?: number;
	netAmtExc: number;
	taxAmtInc?: number;
	taxAmtExc?: number;
	adjAmt?: number;
}>();

const emit = defineEmits([
	'update:orderLine',
	'update:status',
	'update:parentOrderLine',
	'update:prodCode',
	'update:prodName',
	'update:prodVariantId',
	'update:prodVariantName',
	'update:prodVariantSku',
	'update:currencyCode',
	'update:orderQty',
	'update:unitSellPrice',
	'update:origSellPrice',
	'update:grossAmt',
	'update:discAmt',
	'update:netAmt',
	'update:grossAmtExc',
	'update:discAmtExc',
	'update:netAmtExc',
	'update:taxAmtInc',
	'update:taxAmtExc',
	'update:adjAmt',
]);

const orderLine = computed({
	get() {
		return props.orderLine;
	},
	set(value) {
		emit('update:orderLine', value);
	},
});

const status = computed({
	get() {
		return props.status;
	},
	set(value) {
		emit('update:status', value);
	},
});

const parentOrderLine = computed({
	get() {
		return props.parentOrderLine;
	},
	set(value) {
		emit('update:parentOrderLine', value);
	},
});

const prodCode = computed({
	get() {
		return props.prodCode;
	},
	set(value) {
		emit('update:prodCode', value);
	},
});

const prodName = computed({
	get() {
		return props.prodName;
	},
	set(value) {
		emit('update:prodName', value);
	},
});

const prodVariantId = computed({
	get() {
		return props.prodVariantId;
	},
	set(value) {
		emit('update:prodVariantId', value);
	},
});

const prodVariantName = computed({
	get() {
		return props.prodVariantName;
	},
	set(value) {
		emit('update:prodVariantName', value);
	},
});

const prodVariantSku = computed({
	get() {
		return props.prodVariantSku;
	},
	set(value) {
		emit('update:prodVariantSku', value);
	},
});

const currencyCode = computed({
	get() {
		return props.currencyCode;
	},
	set(value) {
		emit('update:currencyCode', value);
	},
});

const orderQty = computed({
	get() {
		return props.orderQty;
	},
	set(value) {
		emit('update:orderQty', value);
	},
});

const unitSellPrice = computed({
	get() {
		return props.unitSellPrice;
	},
	set(value) {
		emit('update:unitSellPrice', value);
	},
});

const origSellPrice = computed({
	get() {
		return props.origSellPrice;
	},
	set(value) {
		emit('update:origSellPrice', value);
	},
});

const grossAmt = computed({
	get() {
		return props.grossAmt;
	},
	set(value) {
		emit('update:grossAmt', value);
	},
});

const discAmt = computed({
	get() {
		return props.discAmt;
	},
	set(value) {
		emit('update:discAmt', value);
	},
});

const netAmt = computed({
	get() {
		return props.netAmt;
	},
	set(value) {
		emit('update:netAmt', value);
	},
});

const grossAmtExc = computed({
	get() {
		return props.grossAmtExc;
	},
	set(value) {
		emit('update:grossAmtExc', value);
	},
});

const discAmtExc = computed({
	get() {
		return props.discAmtExc;
	},
	set(value) {
		emit('update:discAmtExc', value);
	},
});

const netAmtExc = computed({
	get() {
		return props.netAmtExc;
	},
	set(value) {
		emit('update:netAmtExc', value);
	},
});

const taxAmtInc = computed({
	get() {
		return props.taxAmtInc;
	},
	set(value) {
		emit('update:taxAmtInc', value);
	},
});

const taxAmtExc = computed({
	get() {
		return props.taxAmtExc;
	},
	set(value) {
		emit('update:taxAmtExc', value);
	},
});

const adjAmt = computed({
	get() {
		return props.adjAmt;
	},
	set(value) {
		emit('update:adjAmt', value);
	},
});
</script>

<style scoped lang="postcss">
.section-grid-basic-details {
	@apply grid grid-cols-1 gap-3;
}
</style>
