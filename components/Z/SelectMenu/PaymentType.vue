<template>
	<div>
		<UFormGroup name="paymentTypes" class="mt-2">
			<USelectMenu v-model="paymentTypeCode" :options="paymentTypes" size="md" value-attribute="code" option-attribute="code">
				<template #label>
					<span v-if="paymentTypeCode" class="truncate">{{ paymentTypes.find((type: any) => type.code === paymentTypeCode)?.code?.toUpperCase() }}</span>
					<span v-else class="text-gray-400">Select Payment Type</span>
				</template>
			</USelectMenu>
		</UFormGroup>
	</div>
</template>

<script lang="ts" setup>
const paymentTypeStore = usePaymentTypeStore();
const { payment_type_groups } = storeToRefs(paymentTypeStore);

const props = defineProps<{ paymentTypeCode: string | undefined; currencyCode: string | undefined }>();

const emit = defineEmits(['update:paymentTypeCode', 'update:currencyCode']);

const paymentTypeCode = computed({
	get() {
		return props.paymentTypeCode;
	},
	set(code) {
		emit('update:paymentTypeCode', code);
		emit('update:currencyCode', paymentTypes.value.find((type) => type.code === code)?.currency_code);
	},
});

const paymentTypes = computed(() => {
	return payment_type_groups.value.map((group) => group.payment_types).flat();
});
</script>

<style scoped lang="postcss"></style>
