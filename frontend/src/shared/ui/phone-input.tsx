import { useVirtualizer } from '@tanstack/react-virtual';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import {
	type ComponentProps,
	type ComponentRef,
	type ForwardRefExoticComponent,
	forwardRef,
	memo,
	useCallback,
	useMemo,
	useState,
} from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from '@/shared/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/shared/ui/command';
import { Input } from '@/shared/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { cn } from '@/shared/lib/utils';

type PhoneInputProps = Omit<ComponentProps<'input'>, 'onChange' | 'value' | 'ref'> &
	Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
		onChange?: (value: RPNInput.Value) => void;
	};

const PhoneInput: ForwardRefExoticComponent<PhoneInputProps> = forwardRef<
	ComponentRef<typeof RPNInput.default>,
	PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
	return (
		<RPNInput.default
			ref={ref}
			className={cn('flex', className)}
			flagComponent={FlagComponent}
			countrySelectComponent={CountrySelect}
			inputComponent={InputComponent}
			smartCaret={false}
			value={value || undefined}
			onChange={(value) => onChange?.(value || ('' as RPNInput.Value))}
			{...props}
		/>
	);
});
PhoneInput.displayName = 'PhoneInput';

const InputComponent = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
	({ className, ...props }, ref) => (
		<Input className={cn('rounded-e-lg rounded-s-none', className)} {...props} ref={ref} />
	),
);
InputComponent.displayName = 'InputComponent';

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
	disabled?: boolean;
	value: RPNInput.Country;
	options: CountryEntry[];
	onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
	disabled,
	value: selectedCountry,
	options: countryList,
	onChange,
}: CountrySelectProps) => {
	const [searchValue, setSearchValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(null);

	const filteredCountries = useMemo(() => {
		const valid = countryList.filter((c): c is { label: string; value: RPNInput.Country } =>
			Boolean(c.value),
		);
		if (!searchValue) return valid;
		const lower = searchValue.toLowerCase();
		return valid.filter(
			({ value, label }) =>
				label.toLowerCase().includes(lower) || value.toLowerCase().includes(lower),
		);
	}, [countryList, searchValue]);

	const virtualizer = useVirtualizer({
		count: filteredCountries.length,
		getScrollElement: () => scrollElement,
		estimateSize: () => 36,
		overscan: 5,
	});

	const handleChange = useCallback(
		(country: RPNInput.Country) => onChange(country),
		[onChange],
	);

	const handleSelectComplete = useCallback(() => setIsOpen(false), []);

	return (
		<Popover
			open={isOpen}
			modal
			onOpenChange={(open) => {
				setIsOpen(open);
				open && setSearchValue('');
			}}
		>
			<PopoverTrigger
				render={
					<Button
						type="button"
						variant="outline"
						className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
						disabled={disabled}
					>
						<FlagComponent country={selectedCountry} countryName={selectedCountry} />
						<ChevronsUpDown
							className={cn('-mr-2 size-4 opacity-50', disabled ? 'hidden' : 'opacity-100')}
						/>
					</Button>
				}
			/>
			<PopoverContent className="w-75 p-0">
				<Command shouldFilter={false} className="pr-0">
					<CommandInput
						value={searchValue}
						onValueChange={(value) => {
							setSearchValue(value);
							if (scrollElement) scrollElement.scrollTop = 0;
						}}
						placeholder="Search country..."
					/>
					<CommandList className="max-h-none overflow-visible">
						{filteredCountries.length === 0 ? (
							<CommandEmpty>No country found.</CommandEmpty>
						) : (
							<CommandGroup className="p-0">
								<ScrollArea className="h-72" viewportRef={setScrollElement}>
									<div
										style={{
											height: `${virtualizer.getTotalSize()}px`,
											position: 'relative',
										}}
									>
										{virtualizer.getVirtualItems().map((virtualItem) => {
											const item = filteredCountries[virtualItem.index];
											return (
												<div
													key={virtualItem.key}
													data-index={virtualItem.index}
													ref={virtualizer.measureElement}
													style={{
														position: 'absolute',
														top: 0,
														left: 0,
														width: '100%',
														transform: `translateY(${virtualItem.start}px)`,
													}}
												>
													<CountrySelectOption
														country={item.value}
														countryName={item.label}
														selectedCountry={selectedCountry}
														onChange={handleChange}
														onSelectComplete={handleSelectComplete}
													/>
												</div>
											);
										})}
									</div>
								</ScrollArea>
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
	selectedCountry: RPNInput.Country;
	onChange: (country: RPNInput.Country) => void;
	onSelectComplete: () => void;
}

const CountrySelectOption = memo(({
	country,
	countryName,
	selectedCountry,
	onChange,
	onSelectComplete,
}: CountrySelectOptionProps) => {
	const handleSelect = () => {
		onChange(country);
		onSelectComplete();
	};

	return (
		<CommandItem className="gap-2" onSelect={handleSelect}>
			<FlagComponent country={country} countryName={countryName} />
			<span className="flex-1 text-sm">{countryName}</span>
			<span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
			<CheckIcon
				className={`ml-auto size-4 ${country === selectedCountry ? 'opacity-100' : 'opacity-0'}`}
			/>
		</CommandItem>
	);
});
CountrySelectOption.displayName = 'CountrySelectOption';

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
	const Flag = flags[country];

	return (
		<span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
			{Flag && <Flag title={countryName} />}
		</span>
	);
};

export { PhoneInput };
