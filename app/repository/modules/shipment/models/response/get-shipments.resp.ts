import type { OrderShipment } from '~/utils/types/order-fulfillment-shipping';

export type GetShipmentsResp = {
	shipments: OrderShipment[];
};
