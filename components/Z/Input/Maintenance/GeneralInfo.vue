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
			<UFormGroup v-slot="{ error }" label="Maintenance Code" name="code" required>
				<UInput v-model="code" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" :disabled="disabledCode" />
			</UFormGroup>

			<UFormGroup v-slot="{ error }" label="Name" name="name" required>
				<UInput v-model="name" :trailing-icon="error ? ICONS.ERROR_OUTLINE : undefined" />
			</UFormGroup>

			<UFormGroup label="Short Description" name="shortDesc">
				<UInput v-model="short_desc" />
			</UFormGroup>
		</div>

		<!-- <UFormGroup class="mt-4" label="Description" name="description">
			<UInput v-model="description" />
		</UFormGroup> -->

		<UFormGroup class="mt-4" label="Long Description" name="longDesc">
			<ZTextEditor v-model:value="long_desc" placeholder="Long Description" />
		</UFormGroup>
	</UCard>
</template>

<script lang="ts" setup>
const props = defineProps({
	isActive: Boolean,
	isDiscountable: Boolean,
	code: String,
	name: String,
	shortDesc: String,
	longDesc: String,
	disabledCode: Boolean,
	cardUi: Object,
});

const emit = defineEmits(['update:isActive', 'update:isDiscountable', 'update:code', 'update:name', 'update:shortDesc', 'update:longDesc']);

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

const short_desc = computed({
	get() {
		return props.shortDesc;
	},
	set(value) {
		emit('update:shortDesc', value);
	},
});

const long_desc = computed({
	get() {
		return props.longDesc;
	},
	set(value) {
		emit('update:longDesc', value);
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
	@apply shadow-xs bg-neutral text-neutral-900 ring-1 ring-inset ring-neutral-50 focus:ring-2 focus:ring-primary-500 rounded-t-md;
}
:deep(.ql-container.ql-snow) {
	@apply shadow-xs bg-neutral text-neutral-900 ring-1 ring-inset ring-neutral-50 focus:ring-2 focus:ring-primary-500 rounded-b-md;
}
</style>
