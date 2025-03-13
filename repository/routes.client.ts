const prefix: string = '/api';
const merchant: string = 'merchant';
const auth: string = 'auth';
const image: string = 'image';
const country: string = 'country';
const currency: string = 'currency';
const category: string = 'category';
const tag: string = 'tag';
const prod: string = 'product';
const prodOption: string = 'product-option';
const maintenance: string = 'maintenance';
const setting: string = 'setting';

const MerchantRoutes = {
	Image: {
		Upload: () => `${prefix}/${merchant}/${image}/upload`,
		UploadMultiple: () => `${prefix}/${merchant}/${image}/upload-multiple`,
	},
	Auth: {
		Login: () => `${prefix}/${merchant}/${auth}/login`,
		Refresh: () => `${prefix}/${merchant}/${auth}/refresh`,
		Verify: () => `${prefix}/${merchant}/${auth}/verify`,
		Logout: () => `${prefix}/${merchant}/${auth}/logout`,
	},
	Country: {
		Single: (id: number) => `${prefix}/${merchant}/${country}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${country}/many`,
		Update: () => `${prefix}/${merchant}/${country}/update`,
	},
	Currency: {
		Single: (id: number) => `${prefix}/${merchant}/${currency}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${currency}/many`,
		Update: () => `${prefix}/${merchant}/${currency}/update`,
	},
	Maintenance: {
		Create: () => `${prefix}/${merchant}/${maintenance}/create`,
		Single: (code: string) => `${prefix}/${merchant}/${maintenance}/single/${code}`,
		Many: () => `${prefix}/${merchant}/${maintenance}/many`,
		Update: () => `${prefix}/${merchant}/${maintenance}/update`,
		Delete: () => `${prefix}/${merchant}/${maintenance}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${maintenance}/revert-delete`,
	},
	Product: {
		Create: () => `${prefix}/${merchant}/${prod}/create`,
		Single: (code: string) => `${prefix}/${merchant}/${prod}/single/${code}`,
		Many: () => `${prefix}/${merchant}/${prod}/many`,
		Update: () => `${prefix}/${merchant}/${prod}/update`,
		Delete: () => `${prefix}/${merchant}/${prod}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prod}/revert-delete`,
	},
	Tag: {
		Create: () => `${prefix}/${merchant}/${tag}/create`,
		Single: (id: number) => `${prefix}/${merchant}/${tag}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${tag}/many`,
		Update: () => `${prefix}/${merchant}/${tag}/update`,
		Delete: () => `${prefix}/${merchant}/${tag}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${tag}/revert-delete`,
	},
	Category: {
		Create: () => `${prefix}/${merchant}/${category}/create`,
		Single: (id: string) => `${prefix}/${merchant}/${category}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${category}/many`,
		Update: () => `${prefix}/${merchant}/${category}/update`,
		Delete: () => `${prefix}/${merchant}/${category}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${category}/revert-delete`,
	},
	ProductOption: {
		Create: () => `${prefix}/${merchant}/${prodOption}/create`,
		Single: (id: number) => `${prefix}/${merchant}/${prodOption}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${prodOption}/many`,
		Update: () => `${prefix}/${merchant}/${prodOption}/update`,
		Delete: () => `${prefix}/${merchant}/${prodOption}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prodOption}/revert-delete`,
	},
	Setting: {
		Many: () => `${prefix}/${merchant}/${setting}/many`,
		Update: () => `${prefix}/${merchant}/${setting}/update`,
	},
};

export default MerchantRoutes;
