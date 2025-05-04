import { useProductTagsStore } from './ProductTags/ProductTags';
import { useProductCategoriesStore } from './ProductCategories/ProductCategories';
import { useProductOptionsStore } from './ProductOptions/ProductOptions';
import { useProductStore } from './Products/Products';
import { useSettingsStore } from './Settings/Settings';
import { useCustomersStore } from './Customers/Customers';
import { useAuthStore } from './Auth/Auth';
import { useAppUiStore } from './AppUi/AppUi';
import { useMerchantInfoStore } from './MerchantInfo/MerchantInfo';
import { useOrderStore } from './Order/Order';
import { useSummSalesStore } from './SummSales/SummSales';
import { useSummOrdersStore } from './SummOrders/SummOrders';
import { useProductTypesStore } from './ProductTypes/ProductTypes';
import { usePaymentTypeStore } from './PaymentType/PaymentType';
import { usePaymentMethodStore } from './PaymentMethod/PaymentMethod';

export {
	useAuthStore,
	useAppUiStore,
	useMerchantInfoStore,
	useCustomersStore,
	useSettingsStore,
	useProductCategoriesStore,
	useProductTagsStore,
	useProductOptionsStore,
	useProductStore,
	useOrderStore,
	useSummSalesStore,
	useSummOrdersStore,
	useProductTypesStore,
	usePaymentTypeStore,
	usePaymentMethodStore,
};
