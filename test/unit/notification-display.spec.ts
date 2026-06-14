import { describe, expect, it } from 'vitest';
import { getNotificationDisplayDescription, getNotificationDisplayReferenceId } from '../../app/utils/notification-display';

describe('getNotificationDisplayDescription', () => {
	it('uses the raw notification description before summary lines', () => {
		expect(
			getNotificationDisplayDescription({
				title: 'New order #ORD-001',
				subtitle: 'Payment: paid',
				notification_description: 'New order waiting for admin review.',
				summary_lines: ['Helmet x 1', 'Gloves x 2', 'Payment: paid'],
			}),
		).toBe('New order waiting for admin review.');
	});

	it('uses ref_no when a notification has no order id', () => {
		expect(
			getNotificationDisplayReferenceId({
				title: 'New appointment for john doe',
				ref_no: 'APPT-001',
			}),
		).toBe('APPT-001');
	});
});
