import { Package } from 'wemotoo-common';

type TranslateFn = (key: string) => string;

const accountTypeLabels: Record<string, string> = {
	[Package.SELLER]: 'Seller',
	[Package.ORGANIZER]: 'Organizer',
	[Package.VIP]: 'VIP',
};

export const accountTypeLabel = (accountType: Package, t: TranslateFn): string => {
	return t(accountTypeLabels[accountType] || String(accountType));
};
