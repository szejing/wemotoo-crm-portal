export type TaxModel = {
	tax_code: string;
	item_line: string;
	tax_line: string;
	tax_desc: string;
	tax_rate: number;
	tax_amt: number;
	taxable_amt: number;
	gross_tax_amt: number;
	disc_tax_amt: number;
};
