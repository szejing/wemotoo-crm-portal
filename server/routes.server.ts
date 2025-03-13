const merchant: string = 'merchant';
const auth: string = 'auth';
const image: string = 'image';
const categories: string = 'categories';
const tags: string = 'tags';
const prodOption: string = 'product-options';
const currency: string = 'currencies';
const country: string = 'countries';
const prod: string = 'products';
const maintenances: string = 'maintenances';
const setting: string = 'settings';
export const Routes = {
	Image: {
		Upload: () => `${merchant}/${image}/upload`,
		UploadMultiple: () => `${merchant}/${image}/upload-multiple`,
	},
	Auth: {
		Login: () => `${merchant}/${auth}/login`,
		Verify: () => `${merchant}/${auth}/verify`,
		Logout: () => `${merchant}/${auth}/logout`,
	},
	Country: {
		Single: (id: number) => `${merchant}/${country}/${id}`,
		Many: () => `${merchant}/${country}/`,
		Update: () => `${merchant}/${country}/`,
	},
	Currency: {
		Single: (id: number) => `${merchant}/${currency}/${id}`,
		Many: () => `${merchant}/${currency}/`,
		Update: () => `${merchant}/${currency}/`,
	},
	Product: {
		Create: () => `${merchant}/${prod}/`,
		Single: (id: number) => `${merchant}/${prod}/${id}`,
		Many: () => `${merchant}/${prod}/`,
		Update: () => `${merchant}/${prod}/`,
		Remove: () => `${merchant}/${prod}/`,
		RevertRemove: () => `${merchant}/${prod}/`,
	},
	Maintenance: {
		Create: () => `${merchant}/${maintenances}/`,
		Single: (id: number) => `${merchant}/${maintenances}/${id}`,
		Many: () => `${merchant}/${maintenances}/`,
		Update: () => `${merchant}/${maintenances}/`,
		Remove: () => `${merchant}/${maintenances}/`,
		RevertRemove: () => `${merchant}/${maintenances}/`,
	},
	ProductTag: {
		Create: () => `${merchant}/${tags}/`,
		Single: (id: number) => `${merchant}/${tags}/${id}`,
		Many: () => `${merchant}/${tags}/`,
		Update: () => `${merchant}/${tags}/`,
		Remove: () => `${merchant}/${tags}/`,
		RevertRemove: () => `${merchant}/${tags}/`,
	},
	ProdCategory: {
		Create: () => `${merchant}/${categories}/`,
		Single: (id: number) => `${merchant}/${categories}/${id}`,
		Many: () => `${merchant}/${categories}/`,
		Update: () => `${merchant}/${categories}/`,
		Remove: () => `${merchant}/${categories}/`,
		RevertRemove: () => `${merchant}/${categories}/`,
	},
	ProdOption: {
		Create: () => `${merchant}/${prodOption}/`,
		Single: (id: number) => `${merchant}/${prodOption}/${id}`,
		Many: () => `${merchant}/${prodOption}/`,
		Update: () => `${merchant}/${prodOption}/`,
		Remove: () => `${merchant}/${prodOption}/`,
		RevertRemove: () => `${merchant}/${prodOption}/`,
	},
	Setting: {
		Many: () => `${merchant}/${setting}/`,
		Update: () => `${merchant}/${setting}/`,
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
