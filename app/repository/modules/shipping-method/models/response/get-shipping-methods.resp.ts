import type { ShippingMethodOption } from '~/utils/types/order-fulfillment-shipping';

export type GetShippingMethodsResp = {
	methods: ShippingMethodOption[];
};
