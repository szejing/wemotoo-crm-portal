// Temporary workaround for Docker build issues with wemotoo-common
// This re-exports the KEY constants needed by the application

export const KEY = {
	X_API: 'x-api-key',
	X_MERCHANT_ID: 'x-merchant-id',
	ACCESS_TOKEN: 'access-token',
	REFRESH_TOKEN: 'refresh-token',
};

// You can add other exports from wemotoo-common here as needed
