import { API_PATH } from 'wemotoo-common';

export const Routes = {
	Images: {
		Upload: () => `${API_PATH.MERCHANT}/${API_PATH.IMAGES}/upload`,
		UploadMultiple: () => `${API_PATH.MERCHANT}/${API_PATH.IMAGES}/upload-multiple`,
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
		Delete: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		DeleteVariant: (code: string, variant_code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}/variants/${variant_code}`,
		Restore: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/restore/${code}`,
	},
	ProdTags: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Delete: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/restore/${id}`,
	},
	ProdVariants: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		SingleByProdCode: (prod_code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${prod_code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Delete: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
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
	ProdCategories: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/`,
		Single: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Delete: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Restore: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/restore/${code}`,
	},
	ProdOptions: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Delete: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
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
		Delete: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Restore: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/restore/${id}`,
	},
	Orders: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}`,
		Single: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}`,
		Update: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}`,
		UpdateOrderStatus: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/status`,
		UpdateOrderCustomer: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/customer`,
		UpdateOrderItems: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/items`,
		UpdateOrderPayments: (order_no: string) => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/payments`,
		Process: () => `${API_PATH.MERCHANT}/${API_PATH.ORDERS}/process`,
	},
	Sales: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.SALES}/many`,
		Single: (bill_no: string) => `${API_PATH.MERCHANT}/${API_PATH.SALES}/${bill_no}`,
		Process: () => `${API_PATH.MERCHANT}/${API_PATH.SALES}/process`,
	},
	SummOrders: {
		Dashboard: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/dashboard`,
		Orders: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}`,
		Items: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/items`,
		Customers: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/customers`,
	},
	SummSales: {
		Dashboard: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/dashboard`,
		Sales: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}`,
		Items: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/items`,
		Payments: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/payments`,
		Customers: () => `${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/customers`,
	},
	PaymentTypes: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PAYMENT_TYPES}/`,
	},
	PaymentTypeGroups: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PAYMENT_TYPE_GROUPS}/`,
	},
	PaymentMethods: {
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PAYMENT_METHODS}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PAYMENT_METHODS}/${code}`,
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
