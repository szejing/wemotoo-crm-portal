import { useProductTagsStore } from './ProductTags/ProductTags';
import { useProductCategoriesStore } from './ProductCategories/ProductCategories';
import { useSettingsStore } from './Settings/Settings';
import { useOptionsStore } from './Options/Options';
import { useCustomersStore } from './Customers/Customers';
import { useAuthStore } from './Auth/Auth';
import { useSidebarStore } from './Sidebar/Sidebar';
import { useMerchantInfoStore } from './MerchantInfo/MerchantInfo';

export {
	useAuthStore,
	useSidebarStore,
	useMerchantInfoStore,
	useCustomersStore,
	useOptionsStore,
	useSettingsStore,
	useProductCategoriesStore,
	useProductTagsStore,
};
