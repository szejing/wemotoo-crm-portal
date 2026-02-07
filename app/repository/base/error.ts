export type ErrorResponse = {
	code: number;
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
	method: string;
	metadata?: Record<string, unknown>;
};
