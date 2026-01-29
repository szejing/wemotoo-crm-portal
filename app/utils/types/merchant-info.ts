export type MerchantInfoInput = {
	group_code: string;
	set_code: string;
	set_value: string;
};

export class MerchantInfo {
	group_code: string;
	set_code: string;
	set_value: string;

	constructor(merchantInfo: MerchantInfoInput) {
		this.group_code = merchantInfo.group_code;
		this.set_code = merchantInfo.set_code;
		this.set_value = merchantInfo.set_value;
	}

	getString() {
		return this.set_value;
	}

	getNumber() {
		return Number(this.set_value);
	}

	getBoolean() {
		return this.set_value === 'true';
	}

	getArray() {
		return this.set_value.split(',');
	}

	getJson() {
		return JSON.parse(this.set_value);
	}

	getDate() {
		return new Date(this.set_value);
	}
}
