import { describe, expect, it, vi } from 'vitest';
import { getSummItemColumnLabels, getSummItemColumns } from '../../app/utils/table-columns/analytics/summ-item';

vi.mock('#components', () => ({
	UBadge: { name: 'UBadge' },
}));

describe('analytics summ item columns', () => {
	const sharedItemKeys = [
		'prod_name',
		'prod_variant_code',
		'item_status',
		'total_qty',
		'gross_amt',
		'disc_amt',
		'net_amt',
		'gross_amt_exc',
		'disc_amt_exc',
		'net_amt_exc',
		'tax_amt_inc',
		'tax_amt_exc',
		'adj_amt',
	];

	it('uses total_orders for order item analytics', () => {
		const columns = getSummItemColumns((key) => key, 'total_orders');

		expect(columns.map((column) => column.accessorKey)).toEqual(['prod_name', 'prod_variant_code', 'item_status', 'total_orders', ...sharedItemKeys.slice(3)]);
		expect(Object.keys(getSummItemColumnLabels('total_orders'))).toEqual(['prod_name', 'prod_variant_code', 'item_status', 'total_orders', ...sharedItemKeys.slice(3)]);
	});

	it('uses total_txns for sales item analytics', () => {
		const columns = getSummItemColumns((key) => key, 'total_txns');

		expect(columns.map((column) => column.accessorKey)).toEqual(['prod_name', 'prod_variant_code', 'item_status', 'total_txns', ...sharedItemKeys.slice(3)]);
		expect(Object.keys(getSummItemColumnLabels('total_txns'))).toEqual(['prod_name', 'prod_variant_code', 'item_status', 'total_txns', ...sharedItemKeys.slice(3)]);
	});
});
