/*
 * Prefix /api for api server
 */
const prefix: string = '/api';
const auth: string = 'auth';
const prodCatg: string = 'product-category';
const prodTag: string = 'product-tag';

/*
 * Prefix /api/another for another server
 * */

const Routes = {
	Auth: {
		Login: () => `${prefix}/${auth}/merchant-user/login`,
		Refresh: () => `${prefix}/${auth}/merchant-user/refresh`,
		Logout: () => `${prefix}/${auth}/merchant-user/logout`,
	},
	ProductTag: {
		Create: () => `${prefix}/${prodTag}/create`,
		Single: (id: string) => `${prefix}/${prodTag}/single/${id}`,
		Many: () => `${prefix}/${prodTag}/many`,
		Update: () => `${prefix}/${prodTag}/update`,
		Delete: () => `${prefix}/${prodTag}/delete`,
		RevertDelete: () => `${prefix}/${prodTag}/revert-delete`,
	},
	ProdCategory: {
		Create: () => `${prefix}/${prodCatg}/create`,
		Single: (id: string) => `${prefix}/${prodCatg}/single/${id}`,
		Many: () => `${prefix}/${prodCatg}/many`,
		Update: () => `${prefix}/${prodCatg}/update`,
		Delete: () => `${prefix}/${prodCatg}/delete`,
		RevertDelete: () => `${prefix}/${prodCatg}/revert-delete`,
	},
};

export default Routes;
