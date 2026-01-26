import type { SettingTempl } from './setting-templ';

export type SettingSegment = {
	segment_code: string;
	parent_segment_code: string;
	seq_no: number;
	segment_desc: string;
	segment_children: SettingSegment[];
	setting_templs: SettingTempl[];
};
