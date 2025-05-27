import { API_PATH } from 'wemotoo-common';

const prefix: string = '/api';

const MerchantRoutes = {
	Images: {
		Upload: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.IMAGES}/upload`,
		UploadMultiple: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.IMAGES}/upload-multiple`,
	},
	Auth: {
		Login: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.AUTH}/login`,
		Refresh: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.AUTH}/refresh`,
		Verify: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.AUTH}/verify`,
		Logout: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.AUTH}/logout`,
	},
	Countries: {
		Single: (iso2: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/${iso2}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/many`,
		Update: (iso2: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.COUNTRIES}/${iso2}`,
	},
	Currencies: {
		Single: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/${code}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CURRENCIES}/${code}`,
	},
	Customers: {
		Single: (cust_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CUSTOMERS}/${cust_no}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CUSTOMERS}/many`,
	},
	Products: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/create`,
		Single: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Delete: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		DeleteVariant: (code: string, variant_code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}/variants/${variant_code}`,
		Restore: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/restore/${code}`,
	},
	ProductTags: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TAGS}/restore/${id}`,
	},
	ProductTypes: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/restore/${id}`,
	},
	ProductCategories: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/create`,
		Single: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Delete: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/${code}`,
		Restore: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_CATEGORIES}/restore/${code}`,
	},
	ProdOptions: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/restore/${id}`,
	},
	ProdVariants: {
		// Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/create`,
		SingleByProdCode: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${code}`,
		// Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/many`,
		// Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		// Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		// Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/restore/${id}`,
	},
	Settings: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SETTINGS}/many`,
		SaveMany: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SETTINGS}/update`,
	},
	CrmUsers: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/create`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/many`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/restore/${id}`,
	},
	Orders: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/many`,
		Single: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}`,
		Update: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/update`,
		UpdateOrderStatus: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/status`,
		UpdateOrderCustomer: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/customer`,
		UpdateOrderItems: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/items`,
		UpdateOrderPayments: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}/payments`,
		Process: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/process`,
	},
	Sales: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/many`,
		Single: (bill_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/${bill_no}`,
		Process: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/process`,
	},
	SummOrders: {
		Dashboard: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/dashboard`,
		Orders: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/orders`,
		Items: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/items`,
		Customers: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/customers`,
	},
	SummSales: {
		Dashboard: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/dashboard`,
		Sales: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/sales`,
		Items: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/items`,
		Customers: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/customers`,
		Payments: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_SALES}/payments`,
	},
	PaymentTypes: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PAYMENT_TYPES}/many`,
	},
	PaymentTypeGroups: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PAYMENT_TYPE_GROUPS}/many`,
	},
	PaymentMethods: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PAYMENT_METHODS}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PAYMENT_METHODS}/${code}`,
	},
};

export default MerchantRoutes;
