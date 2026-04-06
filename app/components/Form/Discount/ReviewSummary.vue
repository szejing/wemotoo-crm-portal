<template>
	<UCard id="section-discount-review" class="shadow-lg border border-primary-200/60 rounded-xl overflow-hidden scroll-mt-4">
		<template #header>
			<div class="flex items-start justify-between">
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<UIcon :name="ICONS.CHECK_ROUNDED" class="text-primary-600 w-10 h-10" />
						<div>
							<h2 class="text-lg font-semibold text-default">{{ $t('components.discountForm.reviewTitle') }}</h2>
							<p class="text-sm text-muted mt-0.5">{{ $t('components.discountForm.reviewSubtitle') }}</p>
						</div>
					</div>
				</div>
			</div>
		</template>

		<div class="space-y-5">
			<section class="rounded-xl bg-elevated/60 p-4 border border-default/10">
				<h4 class="text-xs font-medium uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
					<UIcon :name="ICONS.INFO" class="w-4 h-4 text-primary-500" />
					{{ $t('pages.discountDetails') }}
				</h4>
				<dl class="space-y-2.5 text-sm">
					<div class="flex justify-between gap-2">
						<dt class="text-muted shrink-0">{{ $t('common.name') }}</dt>
						<dd class="font-medium text-default truncate text-right">{{ summary.name || $t('common.notSet') }}</dd>
					</div>
					<div class="flex justify-between gap-2">
						<dt class="text-muted shrink-0">{{ $t('common.code') }}</dt>
						<dd class="font-medium text-default truncate text-right">{{ summary.code || $t('common.notSet') }}</dd>
					</div>
				</dl>
			</section>

			<section v-if="descriptionDisplay" class="rounded-xl bg-elevated/60 p-4 border border-default/10">
				<h4 class="text-xs font-medium uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
					<UIcon :name="ICONS.TAG" class="w-4 h-4 text-primary-500" />
					{{ $t('form.description') }}
				</h4>
				<p class="text-sm text-default whitespace-pre-wrap wrap-break-word">{{ summary.description }}</p>
			</section>

			<section class="rounded-xl bg-elevated/60 p-4 border border-default/10">
				<h4 class="text-xs font-medium uppercase tracking-wider text-muted mb-3 flex items-center gap-2">
					<UIcon :name="ICONS.CALENDAR" class="w-4 h-4 text-primary-500" />
					{{ $t('components.discountForm.validityPeriod') }}
				</h4>
				<p class="text-sm font-medium text-default">{{ summary.validityLabel }}</p>
			</section>
		</div>
	</UCard>
</template>

<script lang="ts" setup>
import { ICONS } from '~/utils/icons';

export interface DiscountReviewSummary {
	name: string;
	code: string;
	description?: string;
	validityLabel: string;
}

const props = defineProps<{
	summary: DiscountReviewSummary;
}>();

const descriptionDisplay = computed(() => !!props.summary.description?.trim());
</script>
