<template>
	<div class="section-grid-basic-details">
		<div class="flex-jbetween-icenter w-full">
			<div class="flex-icenter gap-4">
				<div>
					<h2 class="font-bold">#{{ prodCode }}</h2>
					<p class="font-light">{{ prodName }}</p>
				</div>
				<div class="ml-4">
					<UBadge v-if="status == OrderItemStatus.VOIDED" size="md" color="primary">
						VOIDED
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.REFUNDED)" />
						</template>
					</UBadge>
					<UBadge v-else-if="status == OrderItemStatus.REFUNDED" size="md" color="error">
						REFUNDED
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.ACTIVE)" />
						</template>
					</UBadge>
					<UBadge else-if="status == OrderItemStatus.ACTIVE" size="md" color="success">
						ACTIVE
						<template #trailing>
							<UIcon color="white" class="w-4 h-4 cursor-pointer" :name="ICONS.CHEVRON_RIGHT" @click="updateStatus(OrderItemStatus.VOIDED)" />
						</template>
					</UBadge>
				</div>
			</div>

			<ZQuantity v-model:quantity="orderQty" />
		</div>

		<hr class="my-2" />

		<div v-if="appointment">
			<h2 class="text-main">Appointment</h2>
			<h4 class="text-neutral-700">#{{ appointment!.code }}</h4>

			<div class="grid grid-cols-2 gap-4 mt-2">
				<div class="flex-jbetween-icenter">
					<h4 class="text-neutral-400">Date</h4>
					<ZSelectMenuDateTime
						v-model:date-time="appointmentDate"
						placeholder="Appointment Date"
						:min-date="new Date()"
						:max-date="new Date(new Date().setMonth(new Date().getMonth() + 2))"
					/>
				</div>

				<div class="flex-jbetween-icenter">
					<h4 class="text-neutral-400">Status</h4>
					<ZSelectMenuAppointmentStatus v-model:status="appointmentStatus" />
				</div>
			</div>
		</div>

		<hr v-if="appointment" class="my-2" />

		<div>
			<h2 class="text-main">Pricing</h2>

			<div class="grid grid-cols-2 gap-4 mt-2">
				<UFormField label="Currency" name="currency" disabled>
					<ZSelectMenuCurrency :currency-code="currencyCode" class="mt-2" />
				</UFormField>

				<UFormField v-slot="{ error }" label="Unit Sell Price" name="unit_sell_price" disabled>
					<UInput
						:model-value="unitSellPrice.toFixed(2)"
						:trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined"
						placeholder="Unit Sell Price"
						class="mt-2"
						disabled
					/>
				</UFormField>
			</div>
		</div>

		<!-- <div v-if="prodVariants.length > 0">
			<h2 class="text-main">Variants</h2>

			<ul>
				<div v-for="variant in prodVariants" :key="variant!.variant_code">
					<UButton
						:color="selectedVariantCode == variant!.variant_code ? 'main' : 'gray'"
						:variant="selectedVariantCode == variant!.variant_code ? 'solid' : 'outline'"
						size="sm"
						@click="updateVariant(variant)"
					>
						{{ variant!.variant_code }}
					</UButton>
				</div>
			</ul>
		</div> -->

		<div class="mt-4 text-end">
			<h3 class="text-main">Total Price : {{ currencyCode }} {{ netTotal.toFixed(2) }}</h3>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ZSelectMenuDateTime } from '#components';
import { OrderItemStatus } from 'wemotoo-common';
import type { AppointmentModel } from '~/utils/models';
import type { ProductVariant } from '~/utils/types/product-variant';

const { $api } = useNuxtApp();
const isLoading = ref(false);
const prodVariants = ref<ProductVariant[]>([]);
const selectedVariantCode = ref<ProductVariant>();

const props = defineProps<{
	status: OrderItemStatus;
	prodCode: string;
	prodName: string;
	prodVariantCode?: string;
	prodVariantName?: string;
	prodVariantSku?: string;
	currencyCode: string;
	orderQty: number;
	unitSellPrice: number;
	appointment?: AppointmentModel;
}>();

onMounted(async () => {
	selectedVariantCode.value = props.prodVariantCode;

	if (props.prodVariantCode) {
		isLoading.value = true;

		try {
			const { variants } = await $api.productVariant.getVariantsByProdCode(props.prodCode);

			prodVariants.value = variants;
		} catch (error) {
			console.error(error);
		} finally {
			isLoading.value = false;
		}
	}
});

const emit = defineEmits(['update:status', 'update:orderQty', 'update:appointment']);

const status = computed({
	get() {
		return props.status;
	},
	set(value) {
		emit('update:status', value);
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

const appointmentStatus = computed({
	get() {
		return props.appointment?.status;
	},
	set(value) {
		emit('update:appointment', { ...props.appointment, status: value } as AppointmentModel);
	},
});

const appointmentDate = computed({
	get() {
		return props.appointment?.date_time;
	},
	set(value) {
		emit('update:appointment', { ...props.appointment, date_time: value } as AppointmentModel);
	},
});

const updateStatus = (newStatus: OrderItemStatus) => {
	status.value = newStatus;
};

// const updateVariant = (variant: ProductVariant) => {
// 	selectedVariantCode.value = variant.variant_code;

// 	emit('update:prodVariantCode', variant.variant_code);
// 	emit('update:prodVariantName', variant.name);
// 	emit('update:prodVariantSku', variant.sku);

// 	unitSellPrice.value = variant!.price_types![0].sale_price ?? 0;
// };

const netTotal = computed(() => {
	return props.unitSellPrice * orderQty.value;
});
</script>

<style scoped>
.section-grid-basic-details {
	display: grid;
	gap: 1rem;
}

ul {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	margin-top: 0.5rem;
}
</style>
