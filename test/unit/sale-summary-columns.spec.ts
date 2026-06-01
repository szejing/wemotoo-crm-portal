import { describe, expect, it, vi } from 'vitest';
import { getSaleSummColumns, SALE_SUMM_COLUMN_LABELS } from '../../app/utils/table-columns/sale-summ/sale-summ';

vi.mock('#components', () => ({
	UBadge: { name: 'UBadge' },
}));

describe('sale summary columns', () => {
	const expectedBillKeys = [
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
		'total_txns',
		'total_qty',
		'total_voided_qty',
	];

	it('uses the SummSaleBill fields as table columns', () => {
		const columns = getSaleSummColumns((key) => key);

		expect(columns.map((column) => column.accessorKey)).toEqual(expectedBillKeys);
	});

	it('exposes matching labels for column visibility', () => {
		expect(Object.keys(SALE_SUMM_COLUMN_LABELS)).toEqual(expectedBillKeys);
	});

	it('renders standard aligned headers for summary values', () => {
		const columns = getSaleSummColumns((key) => key);
		const header = columns.find((column) => column.accessorKey === 'gross_amt')?.header;

		expect(typeof header).toBe('function');
		const vnode = (header as () => { type: unknown; props: Record<string, unknown> })();
		expect(vnode.type).toBe('div');
		expect(vnode.props).toMatchObject({ class: 'text-right tabular-nums' });
	});
});
