import { API_PATH } from 'wemotoo-common';

const prefix: string = '/api';

const MerchantRoutes = {
	Image: {
		Upload: () => `${prefix}/${API_PATH.IMAGE}/upload`,
		UploadMultiple: () => `${prefix}/${API_PATH.IMAGE}/upload-multiple`,
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
	Products: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/create`,
		Single: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Delete: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
		Restore: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD}/restore/${code}`,
	},
	Tags: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.TAGS}/restore/${id}`,
	},
	ProductTypes: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/restore/${id}`,
	},
	Categories: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/create`,
		Single: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/many`,
		Update: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Delete: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Restore: (code: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/restore/${code}`,
	},
	ProdOptions: {
		Create: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/create`,
		Single: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/many`,
		Update: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Delete: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/restore/${id}`,
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
		Remove: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
		Restore: (id: number) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/restore/${id}`,
	},
	Orders: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/many`,
		Single: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/${order_no}`,
		Update: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/update`,
		Process: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.ORDERS}/process`,
	},
	Sales: {
		Many: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/many`,
		Single: (order_no: string) => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/${order_no}`,
		Process: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SALES}/process`,
	},
	SummOrders: {
		Dashboard: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/dashboard`,
		Orders: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/orders`,
		Items: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/items`,
		Customers: () => `${prefix}/${API_PATH.MERCHANT}/${API_PATH.SUMM_ORDERS}/customers`,
	},
};

export default MerchantRoutes;
