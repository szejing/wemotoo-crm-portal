import { useTagsStore } from './Tags/Tags';
import { useCategoriesStore } from './Categories/Categories';
import { useProductOptionsStore } from './ProductOptions/ProductOptions';
import { useProductStore } from './Products/Products';
import { useSettingsStore } from './Settings/Settings';
import { useCustomersStore } from './Customers/Customers';
import { useAuthStore } from './Auth/Auth';
import { useAppUiStore } from './AppUi/AppUi';
import { useMerchantInfoStore } from './MerchantInfo/MerchantInfo';
import { useOrderStore } from './Order/Order';

export {
	useAuthStore,
	useAppUiStore,
	useMerchantInfoStore,
	useCustomersStore,
	useSettingsStore,
	useCategoriesStore,
	useTagsStore,
	useProductOptionsStore,
	useProductStore,
	useOrderStore,
};
