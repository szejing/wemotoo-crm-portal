<template>
	<UCard :ui="cardUi">
		<template #header>
			<div class="w-full flex-between items-center">
				<h2>General Info</h2>
				<div class="w-[50%] flex-jend items-center gap-4">
					<UCheckbox v-model="is_active" name="isActive" label="Active" color="green" />

					<!-- <UCheckbox v-model="is_discountable" name="isDiscountable" label="Discountable" color="green" />
					<UCheckbox v-model="is_giftcard" name="isGiftCard" label="Giftcard" color="green" /> -->
				</div>
			</div>
		</template>

		<div class="section-grid-basic-details">
			<UFormGroup v-slot="{ error }" label="Product Code" name="code" required>
				<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" :disabled="disabledCode" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Name" name="name" required>
				<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
			</UFormGroup>

			<UFormGroup label="Subtitle" name="subtitle">
				<UInput v-model="subtitle" />
			</UFormGroup>
		</div>

		<!-- <UFormGroup class="mt-4" label="Description" name="description">
			<UInput v-model="description" />
		</UFormGroup> -->

		<UFormGroup class="mt-4" label="Description" name="description">
			<ZTextEditor v-model:value="description" placeholder="Product Description" />
		</UFormGroup>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	isActive: Boolean,
	isDiscountable: Boolean,
	isGiftcard: Boolean,
	code: String,
	name: String,
	subtitle: String,
	description: String,
	disabledCode: Boolean,
	cardUi: Object,
});

const emit = defineEmits([
	'update:isActive',
	'update:isDiscountable',
	'update:isGiftcard',
	'update:code',
	'update:name',
	'update:subtitle',
	'update:description',
]);

const is_active = computed({
	get() {
		return props.isActive;
	},
	set(value) {
		emit('update:isActive', value);
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
		return props.code;
	},
	set(value) {
		emit('update:code', value);
	},
});

const name = computed({
	get() {
		return props.name;
	},
	set(value) {
		emit('update:name', value);
	},
});

const subtitle = computed({
	get() {
		return props.subtitle;
	},
	set(value) {
		emit('update:subtitle', value);
	},
});

const description = computed({
	get() {
		return props.description;
	},
	set(value) {
		emit('update:description', value);
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
