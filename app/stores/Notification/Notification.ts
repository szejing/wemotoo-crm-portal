import { defineStore } from 'pinia';
import { failedNotification } from '../AppUi/AppUi';
import type { ErrorResponse } from '~/repository/base/error';
import type { Notification, NotificationCenter } from '~/utils/types/notification';
import type { NotificationType } from 'wemotoo-common';

type NotificationReadState = {
	read_at?: string;
	opened_at?: string;
};

const NOTIFICATION_READ_STATE_KEY = 'wemotoo:crm:notification-read-state';

export const useNotificationStore = defineStore('notificationStore', {
	state: () => ({
		loading: false as boolean,
		total_count: 0 as number,
		generated_at: undefined as string | Date | undefined,
		notifications: [] as Notification[],
		handled_scenarios: [] as NotificationCenter['handled_scenarios'],
		read_state: {} as Record<string, NotificationReadState>,
	}),
	getters: {
		activeNotifications: (state) => state.notifications.filter((notification) => notification.count > 0),
		hasNotifications: (state) => state.total_count > 0,
		unreadCount: (state) =>
			state.notifications.reduce(
				(total, notification) => total + notification.items.filter((item) => !item.read_at).length,
				0,
			),
	},
	actions: {
		async getNotifications(): Promise<void> {
			this.loading = true;
			const { $api } = useNuxtApp();
			try {
				this.loadReadState();
				const data = await $api.notification.getMany();

				this.total_count = data.total_count ?? 0;
				this.generated_at = data.generated_at;
				this.notifications = this.applyReadState(data.notifications ?? []);
				this.handled_scenarios = data.handled_scenarios ?? [];
			} catch (err: unknown | ErrorResponse) {
				const message = (err as ErrorResponse).message ?? 'Failed to load notifications';
				failedNotification(message);
			} finally {
				this.loading = false;
			}
		},
		openNotificationItem(type: NotificationType, itemId: string) {
			const key = this.getItemKey(type, itemId);
			const now = new Date().toISOString();
			const current = this.read_state[key] ?? {};
			const next = {
				read_at: current.read_at ?? now,
				opened_at: now,
			};

			this.read_state[key] = next;
			this.persistReadState();

			this.notifications = this.notifications.map((notification) => {
				if (notification.type !== type) {
					return notification;
				}

				return {
					...notification,
					items: notification.items.map((item) =>
						item.id === itemId
							? {
									...item,
									...next,
								}
							: item,
					),
				};
			});

			return this.notifications
				.find((notification) => notification.type === type)
				?.items.find((item) => item.id === itemId);
		},
		applyReadState(notifications: Notification[]): Notification[] {
			return notifications.map((notification) => ({
				...notification,
				items: notification.items.map((item) => ({
					...item,
					...this.read_state[this.getItemKey(notification.type, item.id)],
					notification_type: notification.type,
					notification_title: notification.title,
					notification_description: notification.description,
					notification_severity: notification.severity,
				})),
			}));
		},
		loadReadState(): void {
			if (!import.meta.client) {
				return;
			}

			try {
				const raw = localStorage.getItem(NOTIFICATION_READ_STATE_KEY);
				this.read_state = raw ? JSON.parse(raw) : {};
			} catch {
				this.read_state = {};
			}
		},
		persistReadState(): void {
			if (!import.meta.client) {
				return;
			}

			localStorage.setItem(NOTIFICATION_READ_STATE_KEY, JSON.stringify(this.read_state));
		},
		getItemKey(type: NotificationType, itemId: string): string {
			return `${type}:${itemId}`;
		},
	},
});
