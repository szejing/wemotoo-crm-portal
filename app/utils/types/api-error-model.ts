export class ApiErrorModel {
	response_code: number | undefined;
	message: string | undefined;
	args: string[] = [];

	constructor(response_code?: number, message?: string, args?: string[]) {
		this.response_code = response_code;
		this.message = message;
		this.args = args ?? [];
	}
}
