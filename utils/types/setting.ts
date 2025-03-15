export class Setting {
	group_code: string;
	set_code: string;
	set_value: string;
	value_type: string;

	constructor(setting: Setting) {
		this.group_code = setting.group_code;
		this.set_code = setting.set_code;
		this.set_value = setting.set_value;
		this.value_type = setting.value_type;
	}

	getString() {
		return this.set_value;
	}

	getNumber() {
		return Number(this.set_value);
	}

	getBoolean() {
		// Add a null check to prevent errors
		if (this.set_value === undefined || this.set_value === null) {
			return false; // or whatever default value makes sense
		}
		return this.set_value === 'true' || this.set_value === '1';
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
