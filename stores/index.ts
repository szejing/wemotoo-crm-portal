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
import { useSummOrderStore } from './SummOrder/SummOrder';
import { useProductTypesStore } from './ProductTypes/ProductTypes';

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
	useSummOrderStore,
	useProductTypesStore,
};
