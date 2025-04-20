import { API_PATH } from 'wemotoo-common';

export const Routes = {
	Image: {
		Upload: () => `${API_PATH.MERCHANT}/${API_PATH.IMAGE}/upload`,
		UploadMultiple: () => `${API_PATH.MERCHANT}/${API_PATH.IMAGE}/upload-multiple`,
	},
	Auth: {
		Login: () => `${API_PATH.MERCHANT}/${API_PATH.AUTH}/login`,
		Verify: () => `${API_PATH.MERCHANT}/${API_PATH.AUTH}/verify`,
		Logout: () => `${API_PATH.MERCHANT}/${API_PATH.AUTH}/logout`,
	},
	Countries: {
		Single: (iso2: string) => `${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/${iso2}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/`,
		Update: (iso2: string) => `${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/${iso2}`,
	},
	Currencies: {
		Single: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/${code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/${code}`,
	},
	Products: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD}/`,
		Single: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Remove: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Restore: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/restore/${code}`,
	},
	Tags: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/restore/${id}`,
	},
	ProdVariants: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/restore/${id}`,
	},
	ProdTypes: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/restore/${id}`,
	},
	Categories: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/`,
		Single: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Remove: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Restore: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/restore/${code}`,
	},
	ProdOptions: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/restore/${id}`,
	},
	Settings: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.SETTINGS}/`,
		Save: () => `${API_PATH.MERCHANT}/${API_PATH.SETTINGS}/`,
	},
	CrmUsers: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/restore/${id}`,
	},
	Orders: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}`,
		Single: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}`,
		Update: () => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}`,
		Process: () => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/process`,
	},
	Sales: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.SALES}/many`,
		Single: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.SALES}/${order_no}`,
		Process: () => `${API_PATH.MERCHANT}/${API_PATH.SALES}/process`,
	},
	SummOrders: {
		Dashboard: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/dashboard`,
		Orders: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}`,
		Items: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/items`,
		Customers: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/customers`,
	},
};

// export const Routes = {
// 	external: {
// 		name: '/api/another',
// 		regex: /^\/api\/another$/,
// 	},
// 	core: {
// 		name: '/api',
// 		regex: /^\/api\//,
// 	},
// };
