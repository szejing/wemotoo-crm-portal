const merchant: string = 'merchant';
const auth: string = 'auth';
const prodCatg: string = 'product-category';
const prodTag: string = 'product-tag';
const prodOption: string = 'product-option';
const prod: string = 'product';

export const Routes = {
	Auth: {
		Login: () => `${merchant}/${auth}/login`,
		Logout: () => `${merchant}/${auth}/logout`,
	},
	Product: {
		Create: () => `${merchant}/${prod}/`,
		Single: (id: number) => `${merchant}/${prod}/${id}`,
		Many: () => `${merchant}/${prod}/`,
		Update: () => `${merchant}/${prod}/`,
		Remove: () => `${merchant}/${prod}/`,
		RevertRemove: () => `${merchant}/${prod}/`,
	},
	ProductTag: {
		Create: () => `${merchant}/${prodTag}/`,
		Single: (id: number) => `${merchant}/${prodTag}/${id}`,
		Many: () => `${merchant}/${prodTag}/`,
		Update: () => `${merchant}/${prodTag}/`,
		Remove: () => `${merchant}/${prodTag}/`,
		RevertRemove: () => `${merchant}/${prodTag}/`,
	},
	ProdCategory: {
		Create: () => `${merchant}/${prodCatg}/`,
		Single: (id: number) => `${merchant}/${prodCatg}/${id}`,
		Many: () => `${merchant}/${prodCatg}/`,
		Update: () => `${merchant}/${prodCatg}/`,
		Remove: () => `${merchant}/${prodCatg}/`,
		RevertRemove: () => `${merchant}/${prodCatg}/`,
	},
	ProdOption: {
		Create: () => `${merchant}/${prodOption}/`,
		Single: (id: number) => `${merchant}/${prodOption}/${id}`,
		Many: () => `${merchant}/${prodOption}/`,
		Update: () => `${merchant}/${prodOption}/`,
		Remove: () => `${merchant}/${prodOption}/`,
		RevertRemove: () => `${merchant}/${prodOption}/`,
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
