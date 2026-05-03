import { ProductType } from 'wemotoo-common';

export type MerchantProductTypeLike = { id: number; value: string };

/**
 * Maps canonical product kind to the merchant's product_types FK id when values align (e.g. "item").
 */
export function merchantTypeIdForKind(
	kind: ProductType | undefined,
	prodTypes: MerchantProductTypeLike[],
): number | undefined {
	if (kind == null) return undefined;
	return prodTypes.find((pt) => pt.value === kind)?.id;
}
