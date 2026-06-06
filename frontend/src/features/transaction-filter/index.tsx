import { ru } from 'date-fns/locale';
import { SlidersHorizontal } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

type TypeOption = { value: string; label: string };

type Props = {
	dateRange: DateRange | undefined;
	onDateRangeChange: (range: DateRange | undefined) => void;
	typeOptions?: TypeOption[];
	typeFilter?: string;
	onTypeFilterChange?: (value: string) => void;
	isFiltered: boolean;
	onReset: () => void;
};

export function TransactionFilter({
	dateRange,
	onDateRangeChange,
	typeOptions,
	typeFilter,
	onTypeFilterChange,
	isFiltered,
	onReset,
}: Props) {
	return (
		<Popover>
			<PopoverTrigger className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}>
				<SlidersHorizontal className="size-4" />
				{isFiltered && <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" />}
			</PopoverTrigger>
			<PopoverContent align="end" className="w-auto p-0">
				<div className="p-3 flex flex-col gap-3">
					<p className="text-sm font-medium">Фильтры</p>

					<div className="flex flex-col gap-1.5">
						<p className="text-xs text-muted-foreground">Период</p>
						<Calendar
							mode="range"
							locale={ru}
							captionLayout="dropdown"
							selected={dateRange}
							onSelect={onDateRangeChange}
						/>
					</div>

					{typeOptions && typeOptions.length > 0 && onTypeFilterChange && (
						<div className="flex flex-col gap-1.5">
							<p className="text-xs text-muted-foreground">Тип операции</p>
							<div className="flex gap-1">
								{typeOptions.map((opt) => (
									<Button
										key={opt.value}
										size="sm"
										variant={typeFilter === opt.value ? 'default' : 'outline'}
										onClick={() => onTypeFilterChange(opt.value)}
									>
										{opt.label}
									</Button>
								))}
							</div>
						</div>
					)}

					{isFiltered && (
						<Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
							Сбросить фильтры
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
