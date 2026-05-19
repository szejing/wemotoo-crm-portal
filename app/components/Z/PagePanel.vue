<template>
	<UDashboardPanel :id="id" :grow="grow">
		<template #header>
			<UDashboardNavbar :title="title" :ui="{ right: 'gap-3' }">
				<template v-if="$slots.leading" #leading>
					<slot name="leading" />
				</template>
				<template #right>
					<div class="page-panel-actions">
						<slot v-if="$slots['navbar-right']" name="navbar-right" />

						<UPopover :content="{ align: 'end' }">
							<button class="notification-btn" type="button" :aria-label="$t('notifications.open')" @click="refreshNotifications">
								<UIcon :name="ICONS.BELL" class="size-5" />
								<span v-if="notificationStore.unreadCount > 0" class="notification-count">
									{{ notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount }}
								</span>
							</button>

							<template #content>
								<div class="notification-panel">
									<div class="notification-header">
										<div>
											<p class="notification-kicker">{{ $t('notifications.actionCenter') }}</p>
											<h3>{{ $t('notifications.title') }}</h3>
										</div>
										<UButton
											color="neutral"
											variant="ghost"
											size="xs"
											:icon="ICONS.REFRESH"
											:loading="notificationStore.loading"
											@click="refreshNotifications"
										/>
									</div>

									<div v-if="notificationStore.activeNotifications.length === 0" class="notification-empty">
										<UIcon :name="ICONS.CHECK_OUTLINE_ROUNDED" class="size-8" />
										<p>{{ $t('notifications.empty') }}</p>
									</div>

									<div v-else class="notification-list">
										<div v-for="notification in notificationStore.activeNotifications" :key="notification.type" class="notification-card">
											<div class="notification-card-header">
												<span :class="['severity-dot', `severity-${notification.severity}`]" />
												<div>
													<p class="notification-title">{{ notification.title }}</p>
													<p class="notification-desc">{{ notification.description }}</p>
												</div>
												<span class="notification-pill">{{ notification.count }}</span>
											</div>

											<div v-if="notification.items.length > 0" class="notification-items">
												<button
													v-for="item in notification.items"
													:key="item.id"
													class="notification-item"
													:class="{ 'is-read': item.read_at }"
													type="button"
													@click="openNotification(notification.type, item.id)"
												>
													<span>
														<strong>{{ item.title }}</strong>
														<small>{{ formatItemMeta(item) }}</small>
														<small v-if="item.read_at" class="read-meta"> {{ $t('notifications.readAt') }}: {{ formatDateTime(item.read_at) }} </small>
													</span>
													<UIcon :name="ICONS.CHEVRON_RIGHT" class="size-4" />
												</button>
											</div>
										</div>
									</div>
								</div>
							</template>
						</UPopover>
					</div>
				</template>
			</UDashboardNavbar>
			<UDashboardToolbar v-if="$slots.toolbar || backTo">
				<template #left>
					<div class="py-2 space-y-2">
						<ZBackButton v-if="backTo" :fallback-to="backTo" labeled />
						<slot name="toolbar" />
					</div>
				</template>
			</UDashboardToolbar>
		</template>
		<template #body>
			<slot />
			<NotificationDetailModal v-model:open="detailOpen" :item="selectedNotificationItem" />
		</template>
		<template v-if="$slots.footer" #footer>
			<slot name="footer" />
		</template>
	</UDashboardPanel>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import type { NotificationType } from 'wemotoo-common';
import type { NotificationItem } from '~/utils/types/notification';

withDefaults(
	defineProps<{
		id: string;
		title: string;
		/** When provided, ZBackButton is shown in the toolbar (avoids conflict with navbar burger on mobile). */
		backTo?: string;
		/** When true, the panel grows to fill available space. */
		grow?: boolean;
	}>(),
	{ grow: false },
);

const notificationStore = useNotificationStore();
const detailOpen = ref(false);
const selectedNotificationItem = ref<NotificationItem | null>(null);

const refreshNotifications = async () => {
	await notificationStore.getNotifications();
};

const openNotification = async (type: NotificationType, itemId: string) => {
	const item = await notificationStore.openNotificationItem(type, itemId);

	if (!item) {
		return;
	}

	selectedNotificationItem.value = item;
	detailOpen.value = true;
};

const formatDateTime = (date?: string | Date) => {
	if (!date) {
		return '-';
	}

	return format(new Date(date), 'dd MMM, h:mm a');
};

const formatItemMeta = (item: NotificationItem) => {
	const date = item.scheduled_at ?? item.updated_at ?? item.created_at;
	const parts = [item.status, item.ref_no].filter(Boolean);

	if (date) {
		parts.push(formatDateTime(date));
	}

	return parts.join(' · ');
};

onMounted(() => {
	notificationStore.getNotifications();
});
</script>

<style scoped>
.page-panel-actions {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}

.notification-btn {
	position: relative;
	background-color: var(--color-secondary-50);
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 9999px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: var(--color-neutral-900);
	cursor: pointer;
	transition: all 0.2s;
}

.notification-btn:hover {
	background-color: var(--color-secondary-100);
}

.notification-count {
	position: absolute;
	top: -0.35rem;
	right: -0.35rem;
	min-width: 1.25rem;
	height: 1.25rem;
	padding: 0 0.25rem;
	border-radius: 9999px;
	background: var(--color-error-500, #ef4444);
	color: white;
	font-size: 0.7rem;
	font-weight: 700;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 0 2px white;
}

.notification-panel {
	width: min(24rem, calc(100vw - 2rem));
	max-height: 32rem;
	overflow-y: auto;
	padding: 1rem;
}

.notification-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 1rem;
	margin-bottom: 1rem;
}

.notification-kicker {
	font-size: 0.7rem;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--color-neutral-500);
}

.notification-header h3 {
	font-size: 1rem;
	font-weight: 700;
	color: var(--color-neutral-950);
}

.notification-empty {
	display: grid;
	place-items: center;
	gap: 0.75rem;
	min-height: 10rem;
	color: var(--color-neutral-500);
	text-align: center;
}

.notification-list,
.notification-card,
.notification-items {
	display: flex;
	flex-direction: column;
}

.notification-list {
	gap: 0.75rem;
}

.notification-card {
	border: 1px solid var(--color-neutral-200);
	border-radius: 1rem;
	padding: 0.75rem;
	background: linear-gradient(135deg, #ffffff, #f8fafc);
	gap: 0.75rem;
}

.notification-card-header {
	display: grid;
	grid-template-columns: auto 1fr auto;
	gap: 0.625rem;
	align-items: flex-start;
}

.severity-dot {
	width: 0.625rem;
	height: 0.625rem;
	border-radius: 9999px;
	margin-top: 0.35rem;
}

.severity-info {
	background: var(--color-info-500, #0ea5e9);
}

.severity-warning {
	background: var(--color-warning-500, #f59e0b);
}

.severity-critical {
	background: var(--color-error-500, #ef4444);
}

.notification-title {
	font-weight: 700;
	color: var(--color-neutral-950);
}

.notification-desc {
	font-size: 0.78rem;
	line-height: 1.25;
	color: var(--color-neutral-500);
}

.notification-pill {
	min-width: 1.75rem;
	height: 1.5rem;
	border-radius: 9999px;
	background: var(--color-neutral-950);
	color: white;
	font-size: 0.75rem;
	font-weight: 700;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0 0.45rem;
}

.notification-items {
	gap: 0.25rem;
}

.notification-item {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.75rem;
	border-radius: 0.75rem;
	padding: 0.5rem;
	text-align: left;
	color: var(--color-neutral-800);
	transition: background 0.2s;
}

.notification-item:hover {
	background: var(--color-neutral-100);
}

.notification-item.is-read {
	opacity: 0.72;
}

.notification-item strong,
.notification-item small {
	display: block;
}

.notification-item strong {
	font-size: 0.85rem;
	font-weight: 700;
}

.notification-item small {
	font-size: 0.72rem;
	color: var(--color-neutral-500);
}

.notification-item .read-meta {
	color: var(--color-success-600, #16a34a);
}
</style>
