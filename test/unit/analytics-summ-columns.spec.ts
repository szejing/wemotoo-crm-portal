import { describe, expect, it, vi } from 'vitest';
import { getSummColumnLabels, getSummColumns } from '../../app/utils/table-columns/analytics/summ';

vi.mock('#components', () => ({
	UBadge: { name: 'UBadge' },
}));

describe('analytics summ columns', () => {
	const sharedBillKeys = [
		'biz_date',
		'currency_code',
		'status',
		'gross_amt',
		'net_amt',
		'disc_amt',
		'gross_amt_exc',
		'net_amt_exc',
		'tax_amt_inc',
		'tax_amt_exc',
		'void_amt',
		'adj_amt',
		'total_qty',
		'total_voided_qty',
	];

	it('uses total_orders for order analytics summary', () => {
		const columns = getSummColumns((key) => key, 'total_orders');

		expect(columns.map((column) => column.accessorKey)).toEqual([...sharedBillKeys.slice(0, 12), 'total_orders', ...sharedBillKeys.slice(12)]);
		expect(Object.keys(getSummColumnLabels('total_orders'))).toEqual([...sharedBillKeys.slice(0, 12), 'total_orders', ...sharedBillKeys.slice(12)]);
	});

	it('uses total_txns for sales analytics summary', () => {
		const columns = getSummColumns((key) => key, 'total_txns');

		expect(columns.map((column) => column.accessorKey)).toEqual([...sharedBillKeys.slice(0, 12), 'total_txns', ...sharedBillKeys.slice(12)]);
		expect(Object.keys(getSummColumnLabels('total_txns'))).toEqual([...sharedBillKeys.slice(0, 12), 'total_txns', ...sharedBillKeys.slice(12)]);
	});

	it('renders standard aligned headers for summary values', () => {
		const columns = getSummColumns((key) => key, 'total_orders');
		const header = columns.find((column) => column.accessorKey === 'gross_amt')?.header;

		expect(typeof header).toBe('function');
		const vnode = (header as () => { type: unknown; props: Record<string, unknown> })();
		expect(vnode.type).toBe('div');
		expect(vnode.props).toMatchObject({ class: 'text-right tabular-nums' });
	});
});
