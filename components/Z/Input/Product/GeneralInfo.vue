<template>
	<UCard>
		<template #header>
			<div class="w-full flex-between items-center">
				<h2>General Info</h2>
				<div class="w-[50%] flex-jend items-center gap-4">
					<UCheckbox v-model="is_active" name="isActive" label="Active" color="green" />
					<UCheckbox v-model="is_service" name="isService" label="Service" color="green" />

					<!-- <UCheckbox v-model="is_discountable" name="isDiscountable" label="Discountable" color="green" />
					<UCheckbox v-model="is_giftcard" name="isGiftCard" label="Giftcard" color="green" /> -->
				</div>
			</div>
		</template>

		<div class="section-grid-basic-details">
			<UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
				<UInput v-model="code" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Title" name="title" required>
				<UInput v-model="title" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Subtitle" name="subtitle">
				<UInput v-model="subtitle" :trailing-icon="error ? 'i-heroicons-exclamation-triangle-20-solid' : undefined" />
			</UFormGroup>
		</div>

		<UFormGroup class="mt-4" label="Description" name="description">
			<ZTextEditor v-model:value="description" placeholder="Product Description" />
		</UFormGroup>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	isActive: Boolean,
	isService: Boolean,
	isDiscountable: Boolean,
	isGiftcard: Boolean,
	productCode: String,
	productTitle: String,
	productSubtitle: String,
	productDescription: String,
});

const emit = defineEmits([
	'update:isActive',
	'update:isService',
	'update:isDiscountable',
	'update:isGiftcard',
	'update:productCode',
	'update:productTitle',
	'update:productSubtitle',
	'update:productDescription',
]);

const is_active = computed({
	get() {
		return props.isActive;
	},
	set(value) {
		emit('update:isActive', value);
	},
});

const is_service = computed({
	get() {
		return props.isService;
	},
	set(value) {
		emit('update:isService', value);
	},
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const is_discountable = computed({
	get() {
		return props.isDiscountable;
	},
	set(value) {
		emit('update:isDiscountable', value);
	},
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const is_giftcard = computed({
	get() {
		return props.isGiftcard;
	},
	set(value) {
		emit('update:isGiftcard', value);
	},
});

const code = computed({
	get() {
		return props.productCode;
	},
	set(value) {
		emit('update:productCode', value);
	},
});

const title = computed({
	get() {
		return props.productTitle;
	},
	set(value) {
		emit('update:productTitle', value);
	},
});

const subtitle = computed({
	get() {
		return props.productSubtitle;
	},
	set(value) {
		emit('update:productSubtitle', value);
	},
});

const description = computed({
	get() {
		return props.productDescription;
	},
	set(value) {
		emit('update:productDescription', value);
	},
});
</script>

<style scoped lang="css">
.section-grid-basic-details {
	@apply grid grid-cols-2 gap-4;
}
:deep(.ql-editor) {
	min-height: 200px;
}
:deep(.ql-toolbar.ql-snow) {
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-t-md;
}
:deep(.ql-container.ql-snow) {
	@apply shadow-sm bg-white text-gray-900 ring-1 ring-inset ring-gray-50 focus:ring-2 focus:ring-primary-500 rounded-b-md;
}
</style>
