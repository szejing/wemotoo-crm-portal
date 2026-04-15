import { UBadge, USwitch } from '#components';
import { DiscountRuleType } from 'wemotoo-common';
import { formatDiscountRuleValue } from '~/utils/discount-rule-display';
import type { TableColumn } from '@nuxt/ui';
import type { Discount } from '~/utils/types/discount';
import { getSortableHeader } from '../sortable';
import { useDiscountStore } from '~/stores/Discount/Discount';

type TranslateFn = (key: string) => string;

const DISC_TYPE_I18N: Record<DiscountRuleType, string> = {
	[DiscountRuleType.PERCENTAGE]: 'components.discountForm.ruleTypeOptionPercentage',
	[DiscountRuleType.FIXED]: 'components.discountForm.ruleTypeOptionFixed',
	[DiscountRuleType.FREE_SHIPPING]: 'components.discountForm.ruleTypeOptionFreeShipping',
};

const DISC_TYPE_BADGE_COLOR: Record<DiscountRuleType, 'info' | 'primary' | 'success'> = {
	[DiscountRuleType.PERCENTAGE]: 'info',
	[DiscountRuleType.FIXED]: 'primary',
	[DiscountRuleType.FREE_SHIPPING]: 'success',
};

export const getDiscountColumns = (t: TranslateFn): TableColumn<Discount>[] => {
	return [
		{
			accessorKey: 'code',
			header: ({ column }) => getSortableHeader(column, t('table.code')),
			cell: ({ row }) => {
				const desc = row.original.description?.trim();
				return h('div', { class: 'flex flex-col gap-1' }, [
					h('h3', { class: 'text-neutral-800 font-bold' }, row.original.code),
					h('h5', { class: 'text-neutral-400' }, desc || '—'),
				]);
			},
		},
		{
			accessorKey: 'disc_type',
			header: t('table.rule'),
			cell: ({ row }) => {
				const rt = row.original.disc_type;
				const labelKey = DISC_TYPE_I18N[rt];
				const color = DISC_TYPE_BADGE_COLOR[rt];
				const children: ReturnType<typeof h>[] = [
					h(UBadge, { variant: 'subtle', color, class: 'capitalize w-fit' }, () => (labelKey ? t(labelKey) : String(rt))),
				];
				if (rt !== DiscountRuleType.FREE_SHIPPING) {
					children.push(
						h(
							'span',
							{ class: 'text-sm font-semibold tabular-nums text-neutral-900 dark:text-neutral-100' },
							formatDiscountRuleValue(rt, row.original.disc_value),
						),
					);
				}
				return h('div', { class: 'flex flex-col gap-1 items-start' }, children);
			},
		},
		{
			accessorKey: 'usage_count',
			header: t('table.usage'),
			cell: ({ row }) => {
				const limit = row.original.usage_limit;
				const count = row.original.usage_count || 0;
				if (limit) {
					return h('span', {}, `${count} / ${limit}`);
				}
				return h('span', {}, `${count}  (∞)`);
			},
		},
		{
			accessorKey: 'is_disabled',
			header: () => h('div', { class: 'text-center' }, t('table.active')),
			cell: ({ row }) => {
				const discountStore = useNuxtApp().$pinia ? useDiscountStore() : null;
				const isActive = !row.original.is_disabled;
				return h(USwitch, {
					'class': 'size-5 mx-auto',
					'modelValue': isActive,
					'onUpdate:modelValue': (value: unknown) => {
						if (discountStore) {
							discountStore.updateStatus(row.original, Boolean(value));
						}
					},
				});
			},
		},
	];
};
