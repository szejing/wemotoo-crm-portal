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

					<div class="notifications-table">
						<div class="notifications-table-header" role="row">
							<span>{{ $t('notifications.orderId') }}</span>
							<span>{{ $t('notifications.dateTime') }}</span>
							<span>{{ $t('notifications.description') }}</span>
						</div>

						<UButton
							v-for="row in group.items"
							:key="row.key"
							class="notifications-row"
							:class="{ 'notifications-row--read': row.isRead }"
							color="neutral"
							variant="ghost"
							block
							:aria-label="`${row.orderId} ${row.description}`"
							@click="openNotification(row.type, row.item)"
						>
							<span class="notifications-row__order">{{ row.orderId }}</span>
							<span class="notifications-row__time">{{ row.dateTime }}</span>
							<span class="notifications-row__description">
								<span :class="['notifications-row__dot', { 'notifications-row__dot--read': row.isRead }, `notifications-row__dot--${row.severity}`]" />
								<span>{{ row.descriptionPrefix ?? row.description }}</span>
								<UBadge v-if="row.statusBadge" :color="row.statusBadge.color" variant="subtle" size="sm" class="notifications-row__badge">
									{{ row.statusBadge.label }}
								</UBadge>
								<UBadge v-if="row.referenceBadge" :color="row.referenceBadge.color" variant="subtle" size="sm" class="notifications-row__badge">
									{{ row.referenceBadge.label }}
								</UBadge>
								<UIcon :name="ICONS.CHEVRON_RIGHT" class="notifications-row__icon" />
							</span>
						</UButton>
					</div>
				</section>
			</div>
		</div>
	</ZPagePanel>
</template>

<script setup lang="ts">
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import type { NotificationSeverity, NotificationType } from 'yeppi-common';
import { ICONS } from '~/utils/icons';
import { getOrderStatusColor, getPaymentStatusColor } from '~/utils/options';
import type { NotificationItem } from '~/utils/types/notification';

type NotificationEntry = {
	type: NotificationType;
	severity: NotificationSeverity;
	item: NotificationItem;
};

type BadgeColor = NonNullable<ReturnType<typeof getOrderStatusColor>>;

type NotificationDisplayRow = NotificationEntry & {
	key: string;
	orderId: string;
	dateTime: string;
	description: string;
	descriptionPrefix?: string;
	statusBadge?: {
		label: string;
		color: BadgeColor;
	};
	referenceBadge?: {
		label: string;
		color: BadgeColor;
	};
	isRead: boolean;
};

const { t } = useI18n();
const notificationStore = useNotificationStore();
const { formatDateTime, getSummaryLines } = useNotificationItemDisplay();

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
	const groups = new Map<string, NotificationDisplayRow[]>();

	for (const entry of flatNotifications.value) {
		const date = getItemDate(entry.item);
		const key = format(date, 'yyyy-MM-dd');
		const rows = createDisplayRows(entry);
		groups.set(key, [...(groups.get(key) ?? []), ...rows]);
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

const getItemTime = (item: NotificationItem) => new Date(item.created_at ?? item.updated_at ?? item.scheduled_at ?? 0).getTime();

const getItemDate = (item: NotificationItem) => new Date(item.created_at ?? item.updated_at ?? item.scheduled_at ?? Date.now());

const createDisplayRows = (entry: NotificationEntry): NotificationDisplayRow[] => {
	const lines = getActionLines(entry.item);

	return lines.map((line, index) => {
		const statusChange = parseStatusChange(line);
		const normalizedDescription = normalizeDescription(line);

		return {
			...entry,
			key: `${entry.item.id}-${index}-${line}`,
			orderId: getOrderId(entry.item),
			dateTime: formatDateTime(entry.item.created_at ?? entry.item.updated_at ?? entry.item.scheduled_at),
			description: normalizedDescription,
			descriptionPrefix: statusChange ? t('notifications.orderStatusChangedTo') : undefined,
			statusBadge: statusChange,
			referenceBadge: isAppointmentCreated(line, entry.item) ? createReferenceBadge(entry.item.ref_no) : undefined,
			isRead: !!entry.item.read_at,
		};
	});
};

const getActionLines = (item: NotificationItem) => {
	const lines = getSummaryLines(item).filter((line) => !/^(Status|Payment):/i.test(line.trim()));

	return lines.length ? lines : [item.subtitle ?? item.notification_description ?? item.title];
};

const getOrderId = (item: NotificationItem) => {
	const titleOrderId = item.title.match(/#([A-Z0-9-]+)/i)?.[1];

	return item.order_no ?? titleOrderId ?? '-';
};

const parseStatusChange = (description: string) => {
	const match = description.match(/(?:changed from|Status:)\s+[\w-]+\s+(?:to|->)\s+([\w-]+)/i);
	const status = match?.[1]?.replace(/\.$/, '');

	if (!status) {
		return undefined;
	}

	return {
		label: formatStatusLabel(status),
		color: getOrderStatusColor(status) ?? getPaymentStatusColor(status) ?? 'neutral',
	};
};

const normalizeDescription = (description: string) => {
	const trimmed = description.trim();

	if (/appointment created/i.test(trimmed)) {
		return t('notifications.appointmentCreated');
	}

	if (/new order waiting for admin review/i.test(trimmed)) {
		return t('notifications.newOrderWaitingAdminReview');
	}

	return trimmed.replace(/\.$/, '');
};

const isAppointmentCreated = (description: string, item: NotificationItem) => /appointment created/i.test(description) && !!item.ref_no;

const createReferenceBadge = (refNo?: string) =>
	refNo
		? {
				label: refNo,
				color: 'neutral' as BadgeColor,
			}
		: undefined;

const formatStatusLabel = (status: string) => {
	const statusLabelKeys: Record<string, string> = {
		completed: 'options.completed',
		paid: 'options.paid',
		pending_payment: 'options.pendingPayment',
		pending: 'options.pending',
		processing: 'options.processing',
		cancelled: 'options.cancelled',
		refunded: 'options.refunded',
		requires_action: 'options.requiresAction',
	};
	const labelKey = statusLabelKeys[status];

	return labelKey ? t(labelKey) : status.replace(/_/g, ' ');
};

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
	width: 100%;
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
	gap: 1.5rem;
}

.notifications-date-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
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

.notifications-table {
	width: 100%;
	overflow: hidden;
	border: 1px solid var(--color-neutral-200);
	border-radius: 0.5rem;
	background: white;
}

.notifications-table-header,
.notifications-row {
	display: grid !important;
	grid-template-columns: minmax(12rem, 1.2fr) minmax(10rem, 0.8fr) minmax(0, 3fr);
	align-items: center;
	gap: 1rem;
	width: 100%;
}

.notifications-table-header {
	padding: 0.65rem 1rem;
	border-bottom: 1px solid var(--color-neutral-200);
	background: var(--color-neutral-50);
	font-size: 0.72rem;
	font-weight: 700;
	color: var(--color-neutral-500);
	text-transform: uppercase;
}

.notifications-row {
	height: auto;
	min-height: 3.25rem;
	padding: 0.75rem 1rem;
	border-radius: 0;
	text-align: left;
	white-space: normal;
	cursor: pointer !important;
}

.notifications-row + .notifications-row {
	border-top: 1px solid var(--color-neutral-100);
}

.notifications-row:not(.notifications-row--read) {
	background: var(--color-main-50);
}

.notifications-row:not(.notifications-row--read):hover {
	background: var(--color-main-100);
}

.notifications-row--read {
	color: var(--color-neutral-500);
	background: white;
}

.notifications-row--read:hover {
	background: var(--color-neutral-50);
}

.notifications-row__order {
	min-width: 0;
	overflow: hidden;
	font-size: 0.86rem;
	font-weight: 700;
	color: var(--color-neutral-900);
	text-overflow: ellipsis;
}

.notifications-row__time {
	font-size: 0.8rem;
	color: var(--color-neutral-500);
}

.notifications-row__description {
	display: flex;
	min-width: 0;
	align-items: center;
	gap: 0.5rem;
	font-size: 0.86rem;
	color: var(--color-neutral-700);
}

.notifications-row__dot {
	width: 0.55rem;
	height: 0.55rem;
	flex: 0 0 0.55rem;
	border-radius: 9999px;
}

.notifications-row__dot--read {
	background: var(--color-neutral-300);
}

.notifications-row__dot--info {
	background: var(--color-info-500, #0ea5e9);
}

.notifications-row__dot--warning {
	background: var(--color-warning-500, #f59e0b);
}

.notifications-row__dot--critical {
	background: var(--color-error-500, #ef4444);
}

.notifications-row__badge {
	text-transform: capitalize;
}

.notifications-row__icon {
	width: 1rem;
	height: 1rem;
	margin-left: auto;
	color: var(--color-neutral-400);
}

.notifications-row--read .notifications-row__order,
.notifications-row--read .notifications-row__description,
.notifications-row--read .notifications-row__time,
.notifications-row--read .notifications-row__icon {
	color: var(--color-neutral-400);
}

@media (max-width: 640px) {
	.notifications-toolbar {
		align-items: stretch;
		flex-direction: column;
	}

	.notifications-table-header {
		display: none !important;
	}

	.notifications-row {
		grid-template-columns: 1fr;
		gap: 0.35rem;
		padding: 0.85rem;
	}

	.notifications-row__description {
		align-items: flex-start;
	}

	.notifications-row__dot {
		margin-top: 0.35rem;
	}
}
</style>
