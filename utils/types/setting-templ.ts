import type { InputType } from '../enum/input-type';

export type SettingTempl = {
	group_code: string;
	set_code: string;
	set_seq_no: number;
	set_desc: string;
	input_type: InputType;
	default_val: string;
	data_source: string;
	is_disabled: boolean;
};
