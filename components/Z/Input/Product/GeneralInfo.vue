<template>
	<UCard :ui="cardUi">
		<template #header>
			<div class="w-full flex-between items-center">
				<div v-if="!hideHeader">
					<h2 class="text-xl font-semibold">Basic Info</h2>
					<p class="text-sm text-gray-500 mt-1">Product basic information</p>
				</div>
				<UTabs v-if="productTypes.length > 0" v-model="product_type" :items="items" :default-index="0" :ui="ui_tabs">
					<template #default="{ item }">
						<span>{{ item.label.toUpperCase() }}</span>
					</template>
				</UTabs>
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

			<UFormGroup label="Short Description" name="shortDesc">
				<UInput v-model="short_desc" />
			</UFormGroup>
		</div>

		<!-- <UFormGroup class="mt-4" label="Description" name="description">
			<UInput v-model="description" />
		</UFormGroup> -->

		<UFormGroup v-if="!hideLongDesc" class="mt-4" label="Long Description" name="longDesc">
			<ZTextEditor v-model:value="long_desc" placeholder="Product Description" />
		</UFormGroup>
	</UCard>
</template>

<script lang="ts" setup>
import { GROUP_CODE, PRODUCT } from 'wemotoo-common';

const ui_tabs = {
	list: {
		base: 'relative',
		background: 'bg-primary-500',
		tab: {
			active: 'text-primary-600',
			inactive: 'text-primary-400',
			font: 'font-bold',
		},
	},
};

const settingsStore = useSettingStore();
const productTypeStore = useProductTypeStore();
const { productTypes } = storeToRefs(productTypeStore);

const hideLongDesc = computed(() => {
	return settingsStore.getSetting(GROUP_CODE.PRODUCT, PRODUCT.HIDE_LONG_DESC)?.getBoolean() ?? true;
});

const items = computed(() => {
	if (productTypes.value.length > 0) {
		const list = [];
		for (const type of productTypes.value) {
			list.push({ label: type.value, slot: type.value });
		}
		return list;
	}

	return [];
});

const props = defineProps({
	isActive: Boolean,
	isDiscountable: Boolean,
	isGiftcard: Boolean,
	code: String,
	name: String,
	shortDesc: String,
	longDesc: String,
	disabledCode: Boolean,
	type: Number,
	cardUi: Object,
	hideHeader: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits([
	'update:isActive',
	'update:isDiscountable',
	'update:isGiftcard',
	'update:code',
	'update:name',
	'update:shortDesc',
	'update:longDesc',
	'update:type',
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
		emit('update:code', value?.toUpperCase());
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

// -1 because the type is 0-indexed
// +1 because the type is 1-indexed
const product_type = computed({
	get() {
		return (props.type ?? 0) - 1;
	},
	set(value) {
		emit('update:type', value + 1);
	},
});
</script>

<style scoped lang="postcss">
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
