<script setup lang="ts">
import type { OrderActivity } from '~/utils/types/order-fulfillment-shipping';

defineProps<{
	activities?: OrderActivity[];
}>();

const getActionText = (activity: OrderActivity): string => {
	return activity.action ?? activity.desc ?? '-';
};

const getActorText = (activity: OrderActivity): string => {
	return activity.created_by ?? activity.user_id ?? '-';
};

const getMetaText = (activity: OrderActivity, key: string): string | undefined => {
	const value = activity.metadata?.[key];
	if (typeof value !== 'string') {
		return undefined;
	}
	const trimmed = value.trim();
	return trimmed || undefined;
};

const getCourierServiceText = (activity: OrderActivity): string | undefined => {
	return getMetaText(activity, 'courier_service') ?? getMetaText(activity, 'courier_name');
};

const getTrackingNoText = (activity: OrderActivity): string | undefined => {
	return getMetaText(activity, 'tracking_no');
};
</script>

<template>
	<UCard>
		<template #header>
			<h3 class="text-base font-semibold">{{ $t('components.activities.title') }}</h3>
		</template>

		<div v-if="activities?.length" class="space-y-3">
			<div
				v-for="(activity, index) in activities"
				:key="activity.id ?? `${activity.created_at}-${index}`"
				class="rounded-lg border border-default p-3"
			>
				<p class="font-medium text-sm">{{ getActionText(activity) }}</p>
				<div
					v-if="getCourierServiceText(activity) || getTrackingNoText(activity)"
					class="mt-2 grid gap-1 text-xs text-muted"
				>
					<p v-if="getCourierServiceText(activity)">
						<span class="font-medium text-default">{{ $t('components.activities.courierService') }}:</span>
						{{ getCourierServiceText(activity) }}
					</p>
					<p v-if="getTrackingNoText(activity)">
						<span class="font-medium text-default">{{ $t('components.activities.trackingNo') }}:</span>
						{{ getTrackingNoText(activity) }}
					</p>
				</div>
				<p class="text-xs text-muted">{{ $t('components.activities.createdBy') }}: {{ getActorText(activity) }}</p>
				<p class="text-xs text-muted">{{ new Date(activity.created_at).toLocaleString() }}</p>
			</div>
		</div>
		<p v-else class="text-sm text-muted">{{ $t('components.activities.empty') }}</p>
	</UCard>
</template>
