<template>
	<ZPagePanel id="notifications" :title="$t('notifications.title')">
		<div class="notifications-page">
			<div class="notifications-toolbar">
				<div>
					<p class="notifications-kicker">{{ $t('notifications.actionCenter') }}</p>
					<h1>{{ $t('notifications.allTitle') }}</h1>
				</div>
				<UButton color="neutral" variant="soft" :icon="ICONS.REFRESH" :loading="notificationStore.loading" @click="loadNotifications">
					{{ $t('common.refresh') }}
				</UButton>
			</div>

			<ZLoading v-if="notificationStore.loading && notificationStore.all_notifications.length === 0" />

			<ZNotificationEmptyState v-else-if="dateGroups.length === 0" />

			<div v-else class="notifications-inbox">
				<section v-for="group in dateGroups" :key="group.key" class="notifications-date-group">
					<div class="notifications-date-header">
						<h2>{{ group.label }}</h2>
						<span>{{ group.items.length }}</span>
					</div>

					<ZNotificationItemRow
						v-for="entry in group.items"
						:key="entry.item.id"
						:item="entry.item"
						:severity="entry.severity"
						layout="inbox"
						@select="openNotification(entry.type, entry.item)"
					/>
				</section>
			</div>
		</div>
	</ZPagePanel>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import type { NotificationSeverity, NotificationType } from 'wemotoo-common';
import { ICONS } from '~/utils/icons';
import type { NotificationItem } from '~/utils/types/notification';

type NotificationEntry = {
	type: NotificationType;
	severity: NotificationSeverity;
	item: NotificationItem;
};

const { t } = useI18n();
const notificationStore = useNotificationStore();

const loadNotifications = async () => {
	await notificationStore.getNotifications({ includeRead: true });
};

const flatNotifications = computed<NotificationEntry[]>(() =>
	notificationStore.all_notifications
		.flatMap((notification) =>
			notification.items.map((item) => ({
				type: notification.type,
				severity: notification.severity,
				item,
			})),
		)
		.sort((a, b) => getItemTime(b.item) - getItemTime(a.item)),
);

const dateGroups = computed(() => {
	const groups = new Map<string, NotificationEntry[]>();

	for (const entry of flatNotifications.value) {
		const date = new Date(entry.item.created_at ?? entry.item.updated_at ?? Date.now());
		const key = format(date, 'yyyy-MM-dd');
		groups.set(key, [...(groups.get(key) ?? []), entry]);
	}

	return Array.from(groups.entries()).map(([key, items]) => ({
		key,
		label: formatDateGroupLabel(key),
		items,
	}));
});

const openNotification = async (type: NotificationType, item: NotificationItem) => {
	const updated = item.read_at ? item : await notificationStore.openNotificationItem(type, item);

	if (!updated) {
		return;
	}

	await navigateTo(updated.action?.url ?? item.action?.url ?? '/notifications');
};

const getItemTime = (item: NotificationItem) =>
	new Date(item.created_at ?? item.updated_at ?? item.scheduled_at ?? 0).getTime();

const formatDateGroupLabel = (key: string) => {
	const date = parseISO(`${key}T00:00:00`);

	if (isToday(date)) {
		return t('notifications.today');
	}

	if (isYesterday(date)) {
		return t('notifications.yesterday');
	}

	return format(date, 'dd MMM yyyy');
};

useHead({ title: () => t('notifications.allTitle') });

onMounted(loadNotifications);
</script>

<style scoped>
.notifications-page {
	max-width: 56rem;
	margin: 0 auto;
	padding-bottom: 2rem;
}

.notifications-toolbar {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1.25rem;
}

.notifications-kicker {
	font-size: 0.75rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--color-neutral-500);
}

.notifications-toolbar h1 {
	font-size: 1.35rem;
	font-weight: 750;
	color: var(--color-neutral-950);
}

.notifications-inbox {
	display: flex;
	flex-direction: column;
	gap: 1.25rem;
}

.notifications-date-group {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}

.notifications-date-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.25rem 0.25rem;
	color: var(--color-neutral-500);
}

.notifications-date-header h2 {
	font-size: 0.82rem;
	font-weight: 700;
	color: var(--color-neutral-700);
}

.notifications-date-header span {
	font-size: 0.75rem;
}

.notifications-date-group :deep(.z-notification-item-row--inbox) {
	width: 100%;
}

@media (max-width: 640px) {
	.notifications-toolbar {
		align-items: stretch;
		flex-direction: column;
	}
}
</style>
