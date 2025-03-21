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
		RevertRemove: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.PROD}/${code}`,
	},
	Tags: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
		RevertRemove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.TAGS}/${id}`,
	},
	ProdVariants: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
		RevertRemove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_VARIANTS}/${id}`,
	},
	ProdTypes: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
		RevertRemove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_TYPES}/${id}`,
	},
	Categories: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/`,
		Single: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/`,
		Update: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		Remove: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
		RevertRemove: (code: string) => `${API_PATH.MERCHANT}/${API_PATH.CATEGORIES}/${code}`,
	},
	ProdOptions: {
		Create: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Single: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Many: () => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/`,
		Update: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		Remove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
		RevertRemove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.PROD_OPTIONS}/${id}`,
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
		RevertRemove: (id: number) => `${API_PATH.MERCHANT}/${API_PATH.CRM_USERS}/${id}`,
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
