const prefix: string = '/api';
const merchant: string = '/merchant';
const auth: string = 'auth';
const country: string = 'country';
const currency: string = 'currency';
const prodCatg: string = 'product-category';
const prodTag: string = 'product-tag';
const prod: string = 'product';
const prodOption: string = 'product-option';

const MerchantRoutes = {
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
	Product: {
		Create: () => `${prefix}/${merchant}/${prod}/create`,
		Single: (code: string) => `${prefix}/${merchant}/${prod}/single/${code}`,
		Many: () => `${prefix}/${merchant}/${prod}/many`,
		Update: () => `${prefix}/${merchant}/${prod}/update`,
		Delete: () => `${prefix}/${merchant}/${prod}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prod}/revert-delete`,
	},
	ProductTag: {
		Create: () => `${prefix}/${merchant}/${prodTag}/create`,
		Single: (id: number) => `${prefix}/${merchant}/${prodTag}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${prodTag}/many`,
		Update: () => `${prefix}/${merchant}/${prodTag}/update`,
		Delete: () => `${prefix}/${merchant}/${prodTag}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prodTag}/revert-delete`,
	},
	ProdCategory: {
		Create: () => `${prefix}/${merchant}/${prodCatg}/create`,
		Single: (id: string) => `${prefix}/${merchant}/${prodCatg}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${prodCatg}/many`,
		Update: () => `${prefix}/${merchant}/${prodCatg}/update`,
		Delete: () => `${prefix}/${merchant}/${prodCatg}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prodCatg}/revert-delete`,
	},
	ProductOption: {
		Create: () => `${prefix}/${merchant}/${prodOption}/create`,
		Single: (id: number) => `${prefix}/${merchant}/${prodOption}/single/${id}`,
		Many: () => `${prefix}/${merchant}/${prodOption}/many`,
		Update: () => `${prefix}/${merchant}/${prodOption}/update`,
		Delete: () => `${prefix}/${merchant}/${prodOption}/delete`,
		RevertDelete: () => `${prefix}/${merchant}/${prodOption}/revert-delete`,
	},
};

export default MerchantRoutes;
