<template>
	<UCard id="section-review" class="shadow-md border-2 border-primary-200 scroll-mt-4">
		<template #header>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-2">
						<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-6 h-6" />
						<h2 class="text-xl font-semibold">{{ $t('components.productUpdate.reviewYourProduct') }}</h2>
					</div>
					<p class="text-sm text-neutral-500 mt-1">{{ $t('components.productUpdate.reviewBeforeCreate') }}</p>
				</div>
			</div>
		</template>

		<div class="space-y-4">
			<div class="bg-primary-50 border border-primary-200 rounded-lg p-4">
				<div class="flex items-start gap-3">
					<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-5 h-5 mt-0.5 shrink-0" />
					<div>
						<h4 class="text-sm font-medium text-primary-900">{{ $t('components.productUpdate.readyToCreate') }}</h4>
						<p class="text-xs text-primary-700 mt-1">{{ $t('components.productUpdate.reviewBeforeSubmit') }}</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-4">
				<!-- Thumbnail & Images -->
				<div v-if="summary.hasThumbnail || (summary.images && summary.images.length > 0)" class="bg-neutral-50 rounded-lg p-4">
					<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
						<UIcon :name="ICONS.IMAGE" class="text-primary-500 w-4 h-4" />
						{{ $t('components.productUpdate.imagesSummaryTitle') }}
					</h4>
					<div class="space-y-3">
						<div v-if="thumbnailUrl" class="space-y-1">
							<p class="text-xs text-neutral-500">{{ $t('components.productUpdate.thumbnailLabel') }}</p>
							<img
								:src="thumbnailUrl"
								:alt="$t('components.productUpdate.thumbnailLabel')"
								class="rounded-lg border border-neutral-200 object-cover w-20 h-20"
							/>
						</div>
						<div v-if="imageUrls.length > 0" class="space-y-1">
							<p class="text-xs text-neutral-500">{{ $t('components.productUpdate.galleryLabel') }} ({{ imageUrls.length }})</p>
							<div class="flex flex-wrap gap-2">
								<img
									v-for="(url, i) in imageUrls"
									:key="i"
									:src="url"
									:alt="`${$t('components.productUpdate.galleryLabel')} ${i + 1}`"
									class="rounded-lg border border-neutral-200 object-cover w-16 h-16"
								/>
							</div>
						</div>
						<p v-if="!thumbnailUrl && imageUrls.length === 0" class="text-sm text-neutral-500">
							{{ $t('common.notSet') }}
						</p>
					</div>
				</div>

				<!-- Basic Info Summary -->
				<div class="bg-neutral-50 rounded-lg p-4">
					<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
						<UIcon :name="ICONS.INFO" class="text-primary-500 w-4 h-4" />
						{{ $t('pages.basicInfo') }}
					</h4>
					<div class="text-sm space-y-1">
						<p class="truncate">
							<span class="text-neutral-500">{{ $t('common.name') }}:</span>
							<span class="font-medium">{{ summary.name || $t('common.notSet') }}</span>
						</p>
						<p class="truncate">
							<span class="text-neutral-500">{{ $t('common.code') }}:</span>
							<span class="font-medium">{{ summary.code || $t('common.auto') }}</span>
						</p>
						<p>
							<UBadge :color="summary.isActive ? 'success' : 'error'" variant="soft" size="xs">
								{{ summary.isActive ? $t('common.active') : $t('common.inactive') }}
							</UBadge>
						</p>
					</div>
				</div>

				<!-- Pricing Summary -->
				<div class="bg-neutral-50 rounded-lg p-4">
					<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
						<UIcon :name="ICONS.CURRENCY" class="text-primary-500 w-4 h-4" />
						{{ $t('components.productUpdate.pricing') }}
					</h4>
					<div class="text-sm space-y-1">
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.priceLabel') }}:</span>
							<span class="font-bold">{{ summary.currencyCode }} {{ (summary.origSellPrice ?? 0).toFixed(2) }}</span>
						</p>
						<p v-if="summary.salePrice != null">
							<span class="text-neutral-500">{{ $t('components.productUpdate.sale') }}:</span>
							<span class="font-bold text-green-600">{{ summary.currencyCode }} {{ summary.salePrice.toFixed(2) }}</span>
						</p>
						<p v-if="summary.costPrice != null">
							<span class="text-neutral-500">{{ $t('components.productUpdate.cost') }}:</span>
							<span class="font-medium">{{ summary.currencyCode }} {{ summary.costPrice.toFixed(2) }}</span>
						</p>
					</div>
				</div>

				<!-- Classification Summary -->
				<div class="bg-neutral-50 rounded-lg p-4">
					<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
						<UIcon :name="ICONS.TAG" class="text-primary-500 w-4 h-4" />
						{{ $t('components.productUpdate.classification') }}
					</h4>
					<div class="text-sm space-y-1">
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.categoriesLabel') }}:</span>
							<span class="font-medium">{{ summary.categoriesCount ?? - }}</span>
						</p>
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.tagsLabel') }}:</span>
							<span class="font-medium">{{ summary.tagsCount ?? - }}</span>
						</p>
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.brandsLabel') }}:</span>
							<span class="font-medium">{{ summary.brandsCount ?? - }}</span>
						</p>
					</div>
				</div>

				<!-- Variants Summary -->
				<div class="bg-neutral-50 rounded-lg p-4">
					<h4 class="text-sm font-semibold text-neutral-700 mb-2 flex items-center gap-2">
						<UIcon :name="ICONS.LAYERS" class="text-primary-500 w-4 h-4" />
						{{ $t('components.productUpdate.variantsSummaryTitle') }}
					</h4>
					<div class="text-sm">
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.total') }}:</span>
							<span class="font-medium">{{ summary.variantsCount ?? - }}</span>
						</p>
						<p>
							<span class="text-neutral-500">{{ $t('components.productUpdate.options') }}:</span>
							<span class="font-medium">{{ summary.optionsCount ?? - }}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
export interface ProductReviewSummary {
	name: string;
	code?: string;
	isActive: boolean;
	currencyCode: string;
	origSellPrice?: number;
	salePrice?: number;
	costPrice?: number;
	categoriesCount?: number;
	tagsCount?: number;
	brandsCount?: number;
	variantsCount?: number;
	optionsCount?: number;
	hasThumbnail: boolean;
	imagesCount?: number;
	/** Thumbnail file or image for preview. */
	thumbnail?: File | { url: string };
	/** Gallery images for preview. */
	images?: (File | { url: string })[];
}

const props = defineProps<{
	summary: ProductReviewSummary;
}>();

function isImageLike(item: File | { url: string }): item is { url: string } {
	return !!item && typeof item === 'object' && 'url' in item && typeof (item as { url: string }).url === 'string';
}

function getUrl(item: File | { url: string }): string {
	return isImageLike(item) ? item.url : URL.createObjectURL(item);
}

const thumbnailUrl = ref<string | null>(null);
const imageUrls = ref<string[]>([]);
const objectUrlsToRevoke = ref<string[]>([]);

watch(
	() => [props.summary.thumbnail, props.summary.images],
	() => {
		objectUrlsToRevoke.value.forEach((u) => URL.revokeObjectURL(u));
		objectUrlsToRevoke.value = [];

		const t = props.summary.thumbnail;
		thumbnailUrl.value = t ? getUrl(t) : null;
		if (t && !isImageLike(t) && thumbnailUrl.value) objectUrlsToRevoke.value.push(thumbnailUrl.value);

		const list = props.summary.images ?? [];
		imageUrls.value = list.map((item) => getUrl(item));
		list.forEach((item, i) => {
			if (!isImageLike(item) && imageUrls.value[i]) objectUrlsToRevoke.value.push(imageUrls.value[i]);
		});
	},
	{ immediate: true, deep: true },
);

onUnmounted(() => {
	objectUrlsToRevoke.value.forEach((u) => URL.revokeObjectURL(u));
	objectUrlsToRevoke.value = [];
});

const ICONS = {
	CHECK_ROUNDED: 'i-heroicons-check-circle-20-solid',
	INFO: 'i-heroicons-information-circle',
	TAG: 'i-heroicons-tag',
	CURRENCY: 'i-heroicons-currency-dollar',
	LAYERS: 'i-heroicons-squares-2x2',
	IMAGE: 'i-heroicons-photo',
};
</script>
